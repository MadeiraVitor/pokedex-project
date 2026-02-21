import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type PokemonListItem = {
  name: string;
  url: string;
  image: string;
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
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {pokemons.map((pokemon) => (
          <Link
            to={`/pokemon/${pokemon.name}`}
            key={pokemon.name}
            className="bg-white dark:bg-gray-800 rounded shadow p-2 flex flex-col items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-20 h-20 mb-2"
            />
            <span className="capitalize font-medium">{pokemon.name}</span>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      </div>
    </div>
  );
};
