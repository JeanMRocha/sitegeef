-- Add YouTube and MP3 media URLs to musicas table
ALTER TABLE musicas
  ADD COLUMN IF NOT EXISTS youtube_url text,
  ADD COLUMN IF NOT EXISTS audio_url text;

-- Add comment for documentation
COMMENT ON COLUMN musicas.youtube_url IS 'URL do vídeo no YouTube para reprodução embutida';
COMMENT ON COLUMN musicas.audio_url IS 'URL do arquivo MP3 (Supabase Storage ou link externo) para reprodução e download';
