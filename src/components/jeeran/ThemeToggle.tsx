import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, currentTheme, type Theme } from "@/lib/theme";

/** Night-mode switch — dark wine theme for evening browsing. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => { setTheme(currentTheme()); }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
      title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
      className={`p-2 hover:text-primary transition tap ${className}`}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
