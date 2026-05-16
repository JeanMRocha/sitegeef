"use client";

import { useEffect } from "react";
import { ensureUserSystemRecord } from "@/app/minha-area/actions";

export function EnsureUserSystem() {
  useEffect(() => {
    ensureUserSystemRecord().catch(console.error);
  }, []);

  return null;
}
