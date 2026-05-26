import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    root.classList.remove("light", "dark");
    root.classList.add(isDark ? "dark" : "light");
    setResolvedTheme(isDark ? "dark" : "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme, resolvedTheme };
}
