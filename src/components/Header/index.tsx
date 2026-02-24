import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { themeConfig } from "../../contexts/theme";

export const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className={`flex items-center justify-between px-8 py-4 transition-colors duration-300 border-b border-red-900/20
        ${theme === "dark" ? "bg-[#231010] text-white" : "bg-white text-gray-900"}`}
    >
      <div className="flex items-center gap-4">
        <img
          src="/pokedex-icon.png"
          alt="Pokedex ícone"
          className="w-12 h-12"
        />

        <h1 className="text-3xl font-bold tracking-wide">Pokedex</h1>
      </div>

      <button
        className="cursor-pointer p-2"
        onClick={toggleTheme}
        aria-label="Alternar tema"
      >
        <img
          className="w-8 h-8"
          src={`${themeConfig[theme].icon}`}
          alt="alternar tema"
        />
      </button>
    </header>
  );
};
