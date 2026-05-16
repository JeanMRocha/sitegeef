"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getAppOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") || requestHeaders.get("x-forwarded-host");

  if (origin?.startsWith("http://") || origin?.startsWith("https://")) {
    return origin;
  }

  if (origin) {
    const proto = requestHeaders.get("x-forwarded-proto") || "https";
    return `${proto}://${origin}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3500";
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/perfil");
}

export async function signUpWithEmail(email: string, password: string, nomeCompleto: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nomeCompleto,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const appOrigin = await getAppOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appOrigin}/auth/callback`,
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
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const nomeCompleto = formData.get("nome_completo") as string;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      nome_completo: nomeCompleto,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/perfil");
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

  const { error: uploadError } = await supabase.storage
    .from("avatares")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from("avatares")
    .getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_url: data.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/perfil");
}
