"use client";

import { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { getAuthErrorMessage } from "@/lib/authErrors";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function GuestPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const loginGuest = async () => {
    try {
      const cred = await signInAnonymously(auth);
      await setDoc(doc(db, "guests", cred.user.uid), {
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loginGuest();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Authentication Error</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
              Try Again
            </Button>
            <Button onClick={() => router.push('/login')} variant="ghost" className="mt-2">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Entering Guest Mode...
        </p>
      </div>
    </div>
  );
}
