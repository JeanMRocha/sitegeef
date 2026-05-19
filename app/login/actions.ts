"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppOrigin } from "@/lib/security";
import { invalidateUserAreaCache } from "@/lib/areas/invalidate-user-area";
import { recordLgpdEvents } from "@/lib/lgpd/persistence";
import { LGPD_VERSIONS } from "@/lib/lgpd/constants";

async function getRequestHeadersOrigin() {
  const requestHeaders = await headers();
  return getAppOrigin(requestHeaders);
}

export async function signInWithEmail(email: string, password: string, nextUrl = "/minha-area") {
  const supabase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  nomeCompleto: string,
  consentimentos?: {
    termosUso: boolean;
    politicaPrivacidade: boolean;
    marketingEmail?: boolean;
    marketingWhatsApp?: boolean;
  }
) {
  const supabase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = nomeCompleto.trim().slice(0, 120);

  if (!consentimentos?.termosUso || !consentimentos?.politicaPrivacidade) {
    return { error: "É necessário aceitar os Termos de Uso e a Política de Privacidade." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: normalizedName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: usersError } = await supabase
      .from("usuarios_sistema")
      .insert({
        id: data.user.id,
        perfil: "publico",
        pode_escalas: false,
        pode_biblioteca: false,
        pode_livraria: false,
        pode_financeiro: false,
        pode_pessoas: false,
        pode_publicar: false,
        pode_mediunidade: false,
        pode_atendimento: false,
        pode_apse: false,
      });

    if (usersError) {
      console.error("Erro ao criar usuarios_sistema:", usersError);
    }

    if (consentimentos?.termosUso || consentimentos?.politicaPrivacidade || consentimentos?.marketingEmail || consentimentos?.marketingWhatsApp) {
      await recordLgpdEvents(
        [
          consentimentos?.termosUso
            ? {
                categoria: "termos_uso",
                acao: "aceitar_termos",
                status: "aceito",
                versao: LGPD_VERSIONS.terms,
                origem: "auth/signup",
                canal: "web",
                userId: data.user.id,
                escopo: { signup: true },
              }
            : null,
          consentimentos?.politicaPrivacidade
            ? {
                categoria: "privacidade",
                acao: "ciencia_privacidade",
                status: "ciencia",
                versao: LGPD_VERSIONS.privacy,
                origem: "auth/signup",
                canal: "web",
                userId: data.user.id,
                escopo: { signup: true },
              }
            : null,
          consentimentos?.marketingEmail
            ? {
                categoria: "marketing",
                acao: "opt_in_email",
                status: "aceito",
                versao: LGPD_VERSIONS.privacy,
                origem: "auth/signup",
                canal: "web",
                userId: data.user.id,
                escopo: { channel: "email" },
              }
            : null,
          consentimentos?.marketingWhatsApp
            ? {
                categoria: "whatsapp",
                acao: "opt_in_whatsapp",
                status: "aceito",
                versao: LGPD_VERSIONS.privacy,
                origem: "auth/signup",
                canal: "web",
                userId: data.user.id,
                escopo: { channel: "whatsapp" },
              }
            : null,
        ].filter(Boolean) as Parameters<typeof recordLgpdEvents>[0]
      );
    }
  }

  return { success: true };
}

export async function signInWithGoogle(nextUrl = "/perfil") {
  const supabase = await createClient();
  const appOrigin = await getRequestHeadersOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appOrigin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/minha-area", "layout");
    revalidatePath("/perfil", "layout");
    redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/");
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const nomeCompleto = formData.get("nome_completo") as string;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: nomeCompleto,
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Also update profiles table if it exists
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      nome_completo: nomeCompleto,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Erro ao atualizar profiles:", profileError);
    // Don't throw - this is not critical if profiles table doesn't exist yet
  }

  revalidatePath("/perfil");
  revalidatePath("/", "layout");
  invalidateUserAreaCache();
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("avatar") as File;

  if (!file) {
    throw new Error("Nenhum arquivo selecionado");
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const fileName = `${user.id}/avatar-${Date.now()}`;

  const { error: uploadError, data: uploadData } = await supabase.storage
    .from("avatares")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", {
      message: uploadError.message,
      status: (uploadError as any).status,
      statusCode: (uploadError as any).statusCode,
    });
    throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("avatares")
    .getPublicUrl(fileName);

  // Update user metadata with avatar URL
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      avatar_url: data.publicUrl,
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Also update profiles table if it exists
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_url: data.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Erro ao atualizar profiles:", profileError);
    // Don't throw - this is not critical if profiles table doesn't exist
  }

  revalidatePath("/perfil");
  revalidatePath("/", "layout");
  invalidateUserAreaCache();
}
