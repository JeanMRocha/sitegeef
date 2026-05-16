"use client";

import Link from "next/link";
import { useState } from "react";

type QuickNavItem = {
  icon: string;
  label: string;
  href: string;
  color: string;
};

const items: QuickNavItem[] = [
  {
    icon: "🏠",
    label: "Home",
    href: "/",
    color: "#3b82f6",
  },
  {
    icon: "📊",
    label: "Dashboard",
    href: "/admin",
    color: "#8a005a",
  },
  {
    icon: "👥",
    label: "Minha Área",
    href: "/minha-area",
    color: "#63c984",
  },
  {
    icon: "💬",
    label: "Contato",
    href: "/contato",
    color: "#f59e0b",
  },
];

export function QuickNavSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        className="quick-nav-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Menu de navegação rápida"
        title="Navegação rápida"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`quick-nav-sidebar ${open ? "open" : ""}`}>
        <div className="quick-nav-content">
          <h3 className="quick-nav-title">Navegação</h3>

          <nav className="quick-nav-items">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="quick-nav-item"
                style={{
                  "--item-color": item.color,
                } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                <span className="quick-nav-icon">{item.icon}</span>
                <span className="quick-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Background Overlay */}
        {open && (
          <div
            className="quick-nav-overlay"
            onClick={() => setOpen(false)}
          />
        )}
      </aside>
    </>
  );
}
