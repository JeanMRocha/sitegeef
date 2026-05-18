"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems } from "@/lib/site-data";
import { UserMenu } from "@/components/user-menu";

type SiteHeaderActionsProps = {
  userEmail: string | null;
  nomeCompleto: string | null;
  avatarUrl: string | null;
  hasAdminAccess: boolean;
};

export function SiteHeaderActions({
  userEmail,
  nomeCompleto,
  avatarUrl,
  hasAdminAccess,
}: SiteHeaderActionsProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }

    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  const institutionalLinks = navItems.filter((item) => item.group === "institucional");

  return (
    <div className="site-header-right">
      <div ref={moreRef} className="site-nav-more">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="site-nav-more-btn"
          aria-label="Mais opções institucionais"
          aria-expanded={moreOpen}
        >
          Institucional <span className="site-nav-more-arrow">▼</span>
        </button>

        {moreOpen && (
          <div className="site-nav-more-dropdown">
            <nav className="site-nav-institucional">
              {institutionalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="site-nav-dropdown-item"
                  onClick={() => setMoreOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <UserMenu
        userEmail={userEmail}
        nomeCompleto={nomeCompleto}
        avatarUrl={avatarUrl}
        hasAdminAccess={hasAdminAccess}
      />
    </div>
  );
}
