import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { themeConfig } from "../../contexts/theme";

export const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className={`flex items-center justify-between px-6 py-4 shadow-md transition-colors duration-300 
        ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-900"}`}
    >
      <h1 className="text-3xl font-bold tracking-wide">Pokedex</h1>

      <button
        className="cursor-pointer bg-transparent border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded-full p-1"
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
