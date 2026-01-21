"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, LogOut, Menu, X, BarChart3, User } from "lucide-react";
import { clsx } from "clsx";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/tasks", label: t("nav.tasks"), icon: CheckSquare },
    { href: "/analytics", label: t("nav.analytics") || "Analytics", icon: BarChart3 },
    { href: "/profile", label: t("nav.profile") || "Profile", icon: User },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 shadow-xl dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      Task Pro
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  <nav className="space-y-2">
                    {links.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={clsx(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="absolute bottom-6 left-6 right-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("nav.logout")}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
