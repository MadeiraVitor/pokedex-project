import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";

type Ability = {
  name: string;
  description: string;
};

const typeColors: Record<string, string> = {
  grass: "bg-green-800 text-white",
  poison: "bg-purple-800 text-white",
  fire: "bg-orange-700 text-white",
  water: "bg-blue-800 text-white",
  electric: "bg-yellow-400 text-gray-900",
  fairy: "bg-pink-400 text-gray-900",
  ghost: "bg-indigo-900 text-white",
  psychic: "bg-purple-400 text-gray-900",
  dragon: "bg-blue-900 text-white",
  flying: "bg-blue-400 text-gray-900",
  normal: "bg-gray-400 text-gray-900",
};

export const PokemonDetail = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<any>(null);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setPokemon(data);

      const abilitiesPromises = data.abilities.map(async (abilitie: any) => {
        const abilitieResponse = await fetch(abilitie.ability.url);
        const abilitieData = await abilitieResponse.json();
        const flavor = abilitieData.flavor_text_entries.find(
          (entry: any) =>
            entry.language.name === "pt" || entry.language.name === "en",
        );
        return {
          name: abilitie.ability.name,
          description: flavor ? flavor.flavor_text : "Sem descrição",
        };
      });

      const abilitiesData = await Promise.all(abilitiesPromises);
      setAbilities(abilitiesData);
      setLoading(false);
    };

    fetchPokemon();
  }, [name]);

  if (loading || !pokemon)
    return (
      <div className={`p-8 text-center text-lg font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Carregando...
      </div>
    );

  return (
    <div
      className={`min-h-screen px-4 py-10 transition-colors duration-300 ${theme === "dark" ? "bg-[#231010] text-white" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-6xl mx-auto">
        <button
          className={`cursor-pointer mb-10 flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow transition-all
            ${theme === "dark" ? "bg-[#2c1818] hover:bg-red-900/40 text-white" : "bg-gray-100 hover:bg-red-100 text-gray-900"}`}
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">←</span> <span>Voltar para Home</span>
        </button>

        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start md:justify-center">
          {/* Imagem */}
          <div className="flex flex-col items-center">
            <div className={`w-80 h-80 rounded-3xl flex items-center justify-center shadow-lg mb-6
              ${theme === "dark" ? "bg-[#2c1818]" : "bg-gray-100"}`}
            >
              <img
                src={
                  pokemon.sprites.other?.["official-artwork"]?.front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="w-70 h-70 object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Detalhes */}
          <div className="flex-1 flex flex-col gap-8 w-full">
            <div>
              <h2 className={`text-5xl font-extrabold capitalize mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{pokemon.name}</h2>
              <div className="flex gap-3 mb-6 flex-wrap">
                {pokemon.types.map((t: any) => (
                  <span
                    key={t.type.name}
                    className={`capitalize px-5 py-2 rounded-full font-semibold text-base shadow-sm ${typeColors[t.type.name] || (theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900")}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Habilidades */}
            <div className={`rounded-2xl p-6 shadow-lg mb-4 ${theme === "dark" ? "bg-[#2c1818]" : "bg-gray-100"}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-xl font-bold">Habilidades</span>
              </div>
              <ul className="flex flex-col gap-4">
                {abilities.map((abilitie) => (
                  <li key={abilitie.name} className={`${theme === "dark" ? "bg-[#231010]" : "bg-white"} rounded-lg px-4 py-2`}>
                    <span
                      className="uppercase font-bold text-red-400"
                    >
                      {abilitie.name}
                    </span>
                    <div className={`text-base mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {abilitie.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Movimentos */}
            <div className={`rounded-2xl p-6 shadow-lg ${theme === "dark" ? "bg-[#2c1818]" : "bg-gray-100"}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚔️</span>
                <span className="text-xl font-bold">Lista de Movimentos</span>
              </div>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pokemon.moves.slice(0, 10).map((move: any) => (
                  <li
                    key={move.move.name}
                    className={`capitalize rounded-lg px-4 py-2 font-semibold text-center shadow
                      ${theme === "dark" ? "bg-[#231010] text-white" : "bg-white text-gray-900"}`}
                  >
                    {move.move.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
