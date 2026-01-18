"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "uk" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {i18n.language === "en" ? "UA" : "EN"}
    </Button>
  );
}
