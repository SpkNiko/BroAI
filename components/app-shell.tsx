import Link from "next/link";

import {
  BookOpen,
  Code2,
  FolderKanban,
  Image as ImageIcon,
  MessageCircle,
  Settings,
} from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { MODE_META } from "@/lib/config";

import type { ReactNode } from "react";

export function AppShell({
  children,
  user,
  title,
}: {
  children: ReactNode;

  user: {
    name: string | null;
    email: string;
    pfpUrl: string | null;
  };

  title: string;
}) {
  const initials = (
    user.name ?? user.email
  )
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link
          className="brand"
          href="/app"
        >
          <div className="brand-mark">
            B
          </div>

          <span>BroAI</span>
        </Link>

        <nav className="nav">
          <Link
            className="nav-link"
            href="/app/programmer"
          >
            <Code2 size={18} />
            <span>
              {MODE_META.PROGRAMMER.label}
            </span>
          </Link>

          <Link
            className="nav-link"
            href="/app/chat"
          >
            <MessageCircle
              size={18}
            />
            <span>
              {MODE_META.CHAT.label}
            </span>
          </Link>

          <Link
            className="nav-link"
            href="/app/learn"
          >
            <BookOpen size={18} />
            <span>
              {MODE_META.LEARN.label}
            </span>
          </Link>

          <Link
            className="nav-link"
            href="/app/images"
          >
            <ImageIcon size={18} />
            <span>
              Obrazy
            </span>
          </Link>

          <Link
            className="nav-link"
            href="/app/projects"
          >
            <FolderKanban
              size={18}
            />
            <span>
              Projekty
            </span>
          </Link>

          <Link
            className="nav-link"
            href="/app/settings"
          >
            <Settings size={18} />
            <span>
              Ustawienia
            </span>
          </Link>
        </nav>

        <div className="sidebar-spacer" />

        <div className="user-mini">
          {user.pfpUrl ? (
            <img
              className="avatar"
              src={user.pfpUrl}
              alt="PFP"
            />
          ) : (
            <div className="avatar">
              {initials}
            </div>
          )}

          <div
            className="user-copy"
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                whiteSpace:
                  "nowrap",
                overflow:
                  "hidden",
                textOverflow:
                  "ellipsis",
              }}
            >
              {user.name ??
                "Użytkownik"}
            </div>

            <div
              className="small muted"
              style={{
                whiteSpace:
                  "nowrap",
                overflow:
                  "hidden",
                textOverflow:
                  "ellipsis",
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        <LogoutButton />
      </aside>

      <section className="main">
        <header className="topbar">
          <div className="topbar-title">
            {title}
          </div>

          <div className="small muted">
            BroAI · v0.1
          </div>
        </header>

        {children}
      </section>
    </div>
  );
}
