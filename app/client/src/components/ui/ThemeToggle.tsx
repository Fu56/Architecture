import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";


interface ThemeToggleProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const ThemeToggle = ({ isScrolled, isHomePage }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 border ${
        isScrolled || !isHomePage
          ? "text-[#5A270F] dark:text-[#EEB38C] border-[#EEB38C]/30 dark:border-white/5 hover:bg-[#DF8142]/10"
          : "text-white border-white/20 hover:bg-white/10 dark:bg-card/10"
      }`}
      aria-label="Toggle Theme"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`h-5 w-5 absolute inset-0 transition-all duration-500 transform ${
            theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <Moon
          className={`h-5 w-5 absolute inset-0 transition-all duration-500 transform ${
            theme === "light" ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
