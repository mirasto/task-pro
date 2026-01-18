"use client";

import '@/lib/i18n'; // Import to init
import { ReactNode } from 'react';

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
