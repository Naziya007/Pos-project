// src/components/LanguageSwitcher.jsx
import React from "react";
import { useI18n } from  "../../i18n/usei18n";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" }
];

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useI18n();
  return (
    <select
      value={lang}
      onChange={(e) => changeLanguage(e.target.value)}
      className="p-2 border rounded bg-white text-black"
    >
      {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  );
}
