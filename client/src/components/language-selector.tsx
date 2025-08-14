import { Button } from "@/components/ui/button";
import { SupportedLanguage } from "@shared/schema";

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

const languages = [
  { id: "javascript" as const, label: "JavaScript", icon: "🟨" },
  { id: "python" as const, label: "Python", icon: "🐍" },
  { id: "solidity" as const, label: "Solidity", icon: "💎" },
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Pilih Bahasa Pemrograman
      </label>
      <div className="flex flex-wrap gap-3">
        {languages.map((language) => (
          <Button
            key={language.id}
            variant={selectedLanguage === language.id ? "default" : "outline"}
            onClick={() => onLanguageChange(language.id)}
            className={`font-medium ${
              selectedLanguage === language.id
                ? "bg-primary text-primary-foreground border-primary"
                : "text-foreground hover:border-primary hover:text-primary"
            }`}
            data-testid={`button-language-${language.id}`}
          >
            <span className="mr-2">{language.icon}</span>
            {language.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
