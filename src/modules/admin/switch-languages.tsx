"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { createPortal } from "react-dom";

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
];

export default function SwitchLanguages() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  // Close dropdown when clicking outside
  const params = useParams();

  const switchLanguage = (langCode: string) => {
    router.replace({ pathname, query: params }, { locale: langCode });
    setIsOpen(false);
  };

  return (
    <div>
      {/* Trigger Button */}
      <div className="relative z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex relative z-50 items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Switch language"
        >
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium uppercase">
            {currentLanguage.code}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`
                w-full px-4 py-2 text-sm text-center hover:bg-gray-50 transition-colors
                ${
                  currentLocale === language.code
                    ? "text-orange-500 font-medium bg-orange-50"
                    : "text-gray-700"
                }
              `}
              >
                {language.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            onClick={() => setIsOpen(false)}
            className="inset-0 z-20 w-full h-full absolute"
          ></div>,
          document.body
        )}
    </div>
  );
}
