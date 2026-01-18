"use client";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useAuthListener();
  const { user, loading } = useAppSelector((s) => s.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/", "/login", "/register", "/guest"];
    const isPublic = publicPaths.some((p) => pathname === p);
    const isProtected = ["/dashboard", "/tasks", "/board"].some((p) => pathname.startsWith(p));

    if (!user && isProtected) {
      router.replace("/login");
    }

    if (user && isPublic) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
