'use client';

import { useState } from 'react';
import { LogoUpload } from './logo-upload';

interface LogoUploadFormProps {
  currentLogo: string;
}

export function LogoUploadForm({ currentLogo }: LogoUploadFormProps) {
  const [logoUrl, setLogoUrl] = useState(currentLogo);

  const handleLogoChange = (url: string) => {
    setLogoUrl(url);
    // Encontrar o input hidden e atualizar seu valor
    const input = document.querySelector('input[name="logo_url"]') as HTMLInputElement;
    if (input) {
      input.value = url;
    }
  };

  return <LogoUpload currentLogo={logoUrl} onLogoChange={handleLogoChange} />;
}
