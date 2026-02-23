import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";

type PokemonListItem = {
  name: string;
  url: string;
  image: string;
};

export const Home = () => {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const fetchPokemons = async () => {
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`,
    );
    const data = await response.json();

    const promises = data.results.map(
      async (pokemon: { name: string; url: string }) => {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        return {
          name: pokemon.name,
          url: pokemon.url,
          image: detailData.sprites.front_default,
          types: detailData.types,
        };
      },
    );

    const pokemonsWithImages = await Promise.all(promises);

    setPokemons((prev) => {
      const existingNames = new Set(prev.map((p) => p.name));
      const newPokemons = pokemonsWithImages.filter(
        (p) => !existingNames.has(p.name),
      );
      return [...prev, ...newPokemons];
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + 10);
  };

  return (
    <div
      className={`h-full px-4 py-8 transition-colors duration-300
        ${theme === "dark" ? "bg-[#231010] text-white" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Explorar
        </h2>
        <p
          className={`text-lg mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}
        >
          Descubra e aprenda sobre todos os Pokémons.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {pokemons.map((pokemon) => (
            <Link
              to={`/pokemon/${pokemon.name}`}
              key={pokemon.name}
              className={`rounded-2xl shadow-lg p-4 flex flex-col items-center border transition group
                ${
                  theme === "dark"
                    ? "bg-[#2c1818] border-red-900/20 hover:border-red-500"
                    : "bg-white border-gray-200 hover:border-red-400"
                }
              `}
            >
              <div className="w-35 h-35 rounded-xl flex items-center justify-center mb-4">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-32 h-32 object-contain drop-shadow-lg"
                />
              </div>
              <span
                className={`capitalize font-bold text-xl mb-2 group-hover:text-red-400 transition ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {pokemon.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="px-8 py-3 rounded-full bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:text-gray-200 cursor-pointer"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Carregar Mais"}
          </button>
        </div>
      </div>
    </div>
  );
};
