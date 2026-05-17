"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/lib/site-data";
import { UserMenu } from "@/components/user-menu";

type SiteHeaderProps = {
  userEmail: string | null;
  nomeCompleto: string | null;
  avatarUrl: string | null;
  hasAdminAccess: boolean;
};

export function SiteHeader({ userEmail, nomeCompleto, avatarUrl, hasAdminAccess }: SiteHeaderProps) {
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

  // Filter navItems
  const primaryLinks = navItems.filter((item) => !item.group && !item.icon);
  const institutionalLinks = navItems.filter((item) => item.group === "institucional");

  return (
    <header className="site-header">
      {/* Brand Logo */}
      <Link href="/" className="site-header-brand" aria-label={site.name}>
        <span className="site-header-brand-logo">
          <Image
            src="/brand/logo-oficial-transparent.png"
            alt=""
            width={360}
            height={156}
            decoding="async"
            priority
          />
        </span>
      </Link>

      {/* Primary Navigation (desktop) */}
      <nav className="site-nav-primary" aria-label="Navegação principal">
        {primaryLinks.map((item) => (
          <Link key={item.href} href={item.href} className="site-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* More Menu & User Menu (right side) */}
      <div className="site-header-right">
        {/* "Mais" Dropdown */}
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
              {/* Institutional group stays in overflow because it is less used */}
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

        {/* User Menu */}
        <UserMenu
          userEmail={userEmail}
          nomeCompleto={nomeCompleto}
          avatarUrl={avatarUrl}
          hasAdminAccess={hasAdminAccess}
        />
      </div>
    </header>
  );
}
