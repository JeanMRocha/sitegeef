import { createServiceRoleClient } from './service-role';
import { unstable_cache } from 'next/cache';

const LOGO_BUCKET = 'instituicao-assets';
const LOGO_PATH = 'logo/logo.png';

// Cache de 24 horas para URL da logo (reduz chamadas ao Supabase)
const LOGO_CACHE_TIME = 86400;

export async function uploadLogo(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadStorageAsset(file, LOGO_PATH);
}

export async function uploadStorageAsset(
  file: File,
  storagePath: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const supabase = createServiceRoleClient();

    // Remove arquivo anterior se existir
    const { error: deleteError } = await supabase.storage
      .from(LOGO_BUCKET)
      .remove([storagePath]);

    // Log do erro de delete (pode não existir)
    if (deleteError && deleteError.name !== 'NotFoundError') {
      console.warn('Erro ao deletar logo anterior:', deleteError);
    }

    // Faz upload do novo arquivo
    const { data: _data, error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Gera URL pública
    const { data: urlData } = supabase.storage
      .from(LOGO_BUCKET)
      .getPublicUrl(storagePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao fazer upload';
    return { success: false, error: message };
  }
}

async function _getLogoUrl(storagePath?: string): Promise<string> {
  if (!storagePath) {
    return '';
  }

  const supabase = createServiceRoleClient();
  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export const getLogoUrl = unstable_cache(_getLogoUrl, ['logo-url'], {
  revalidate: LOGO_CACHE_TIME,
  tags: ['logo'],
});
