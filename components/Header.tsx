"use client";

import { useAppSelector } from "@/store/hooks";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { User } from "lucide-react";

export function Header() {
  const { user } = useAppSelector((state) => state.auth);

  const displayName = user?.email || "Guest";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {user?.isAnonymous ? "Guest Session" : "Authenticated"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
