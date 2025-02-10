import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { Moon, SunDim } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeSwitch() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7"
      onClick={handleThemeChange}
    >
      {theme === "light" ? <SunDim /> : <Moon />}
    </Button>
  );
}
