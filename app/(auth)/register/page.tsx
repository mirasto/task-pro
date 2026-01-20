"use client";

import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getAuthErrorMessage } from "@/lib/authErrors";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckSquare, Sparkles, UserPlus, X, ArrowLeft } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { user, loading: authLoading } = useAppSelector((s) => s.auth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  // Redirect if already logged in, but not if we are currently submitting (handled by onSubmit)
  useEffect(() => {
    if (user && !loading && !authLoading) {
      router.replace("/dashboard");
    }
  }, [user, loading, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
            <CheckSquare className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Task Pro
          </h1>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-sm relative">
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              {t("register")}
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.register_subtitle")}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                type="email"
                placeholder="name@example.com"
                label="Email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                type="password"
                placeholder="••••••••"
                label="Password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                type="password"
                placeholder="••••••••"
                label="Confirm Password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Button type="submit" variant="gradient" className="w-full" isLoading={loading}>
                {t("register")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t("auth.already_have_account")}{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t("login")}
              </Link>
            </p>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Link href="/guest" className="w-full">
              <Button variant="outline" className="w-full group">
                <Sparkles className="mr-2 h-4 w-4 text-primary group-hover:animate-pulse" />
                {t("guest")}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("auth.go_back")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
