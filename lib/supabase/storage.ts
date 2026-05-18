import { createServiceRoleClient } from './service-role';

const LOGO_BUCKET = 'instituicao-assets';
const LOGO_PATH = 'logo/logo.png';

export async function uploadLogo(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const supabase = createServiceRoleClient();

    // Remove arquivo anterior se existir
    const { error: deleteError } = await supabase.storage
      .from(LOGO_BUCKET)
      .remove([LOGO_PATH]);

    // Log do erro de delete (pode não existir)
    if (deleteError && deleteError.name !== 'NotFoundError') {
      console.warn('Erro ao deletar logo anterior:', deleteError);
    }

    // Faz upload do novo arquivo
    const { data, error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(LOGO_PATH, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Gera URL pública
    const { data: urlData } = supabase.storage
      .from(LOGO_BUCKET)
      .getPublicUrl(LOGO_PATH);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao fazer upload';
    return { success: false, error: message };
  }
}

export function getLogoUrl(storagePath?: string): string {
  if (!storagePath) {
    return '';
  }

  const supabase = createServiceRoleClient();
  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}
