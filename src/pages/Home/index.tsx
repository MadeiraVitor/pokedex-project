import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type PokemonListItem = {
  name: string;
  url: string;
  image: string;
  types?: Array<{ type: { name: string } }>;
};


export const Home = () => {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + 10);
  };

  return (
    <div className="min-h-screen bg-[#231010] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-2">Explorar</h2>
        <p className="text-lg text-gray-300 mb-8">
          Descubra e aprenda sobre todos os Pokémon.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {pokemons.map((pokemon) => (
            <Link
              to={`/pokemon/${pokemon.name}`}
              key={pokemon.name}
              className="bg-[#2c1818] rounded-2xl shadow-lg p-4 flex flex-col items-center border border-red-900/20 hover:border-red-500 transition group"
            >
              <div className="w-36 h-36 rounded-xl flex items-center justify-center mb-4">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-32 h-32 object-contain drop-shadow-lg"
                />
              </div>
              <span className="capitalize font-bold text-xl mb-2 group-hover:text-red-400 transition">
                {pokemon.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="px-8 py-3 rounded-full bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:text-gray-200"
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
