import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { themeConfig } from "../../contexts/theme";

export const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header>
      <h1>Pokedex</h1>

      <button className="cursor-pointer" onClick={toggleTheme}>
        <img
          className="w-8 h-8"
          src={`${themeConfig[theme].icon}`}
          alt="alternar tema"
        />
      </button>
    </header>
  );
};
