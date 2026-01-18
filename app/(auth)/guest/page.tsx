"use client";

import { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GuestPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loginGuest = async () => {
      try {
        const cred = await signInAnonymously(auth);
        await setDoc(doc(db, "guests", cred.user.uid), {
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
        router.replace("/dashboard");
      } catch (err: any) {
        setError(err.message);
      }
    };
    loginGuest();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 text-red-600">
        Error: {error}
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
