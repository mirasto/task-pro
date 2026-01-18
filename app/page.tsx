"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowRight, Layout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Layout className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Task Pro</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            {user ? (
              <Link href="/board">
                <Button>{t("landing.dashboard")}</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">{t("login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("landing.get_started")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center animate-fade-in">

              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {t("landing.title_prefix")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  {t("landing.title_highlight")}
                </span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("landing.subtitle")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={user ? "/board" : "/register"}>
                  <Button size="lg" className="h-12 px-8 text-lg rounded-full group">
                    {user ? t("landing.dashboard") : t("landing.get_started")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 left-0 right-0 h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </section>
      </main>
    </div>
  );
}