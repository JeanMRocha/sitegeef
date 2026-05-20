"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getInstitutionalNavItems, getMultilingualCopy, type Locale } from "@/lib/multilingual/client";
import { UserMenu } from "@/components/user-menu";

type SiteHeaderActionsProps = {
  locale: Locale;
  userEmail: string | null;
  nomeCompleto: string | null;
  avatarUrl: string | null;
  hasAdminAccess: boolean;
};

export function SiteHeaderActions({
  locale,
  userEmail,
  nomeCompleto,
  avatarUrl,
  hasAdminAccess,
}: SiteHeaderActionsProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const copy = getMultilingualCopy(locale);

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

  const institutionalLinks = getInstitutionalNavItems(locale);

  return (
    <div className="site-header-right">
      <Link href="/contato" className="site-nav-contact-btn">
        {copy.header.contact}
      </Link>

      <div ref={moreRef} className="site-nav-more">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="site-nav-more-btn"
          aria-label={copy.header.more}
          aria-expanded={moreOpen}
        >
          {copy.header.institutional} <span className="site-nav-more-arrow">▼</span>
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
        locale={locale}
        userEmail={userEmail}
        nomeCompleto={nomeCompleto}
        avatarUrl={avatarUrl}
        hasAdminAccess={hasAdminAccess}
      />
    </div>
  );
}
