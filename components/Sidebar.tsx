"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Kanban, LogOut, BarChart3, User } from "lucide-react";
import { clsx } from "clsx";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/tasks", label: t("nav.tasks"), icon: CheckSquare },
    { href: "/board", label: t("nav.board"), icon: Kanban },
    { href: "/analytics", label: t("nav.analytics") || "Analytics", icon: BarChart3 },
    { href: "/profile", label: t("nav.profile") || "Profile", icon: User },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    router.replace("/");
  };

  if (!mounted) {
    return null;
  }

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
          <CheckSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Task Pro
        </h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={clsx("h-5 w-5", isActive && "text-primary")} />
              {link.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/50 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}
