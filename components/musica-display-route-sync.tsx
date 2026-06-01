"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MusicaDisplayRouteSync() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const isDisplayRoute = pathname.startsWith("/musicas/exibir");

    if (isDisplayRoute) {
      root.classList.add("musica-display-route");
      body.classList.add("musica-display-route");
    } else {
      root.classList.remove("musica-display-route");
      body.classList.remove("musica-display-route");
    }

    return () => {
      root.classList.remove("musica-display-route");
      body.classList.remove("musica-display-route");
    };
  }, [pathname]);

  return null;
}
