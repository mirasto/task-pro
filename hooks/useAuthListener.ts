"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading, setError } from "@/store/slices/authSlice";

export function useAuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // Serialize the user object
          const serializedUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
          };
          dispatch(setUser(serializedUser));
        } else {
          dispatch(setUser(null));
        }
        dispatch(setLoading(false));
      },
      (error) => {
        console.error("Auth Error:", error);
        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);
}
