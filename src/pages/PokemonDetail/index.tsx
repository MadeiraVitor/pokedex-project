import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Ability = {
  name: string;
  description: string;
};

export const PokemonDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setPokemon(data);

      const abilitiesPromises = data.abilities.map(async (ab: any) => {
        const abilitieResponse = await fetch(ab.ability.url);
        const abilitieData = await abilitieResponse.json();
        const flavor = abilitieData.flavor_text_entries.find(
          (entry: any) =>
            entry.language.name === "pt" || entry.language.name === "en",
        );
        return {
          name: ab.ability.name,
          description: flavor ? flavor.flavor_text : "Sem descrição",
        };
      });

      const abilitiesData = await Promise.all(abilitiesPromises);
      setAbilities(abilitiesData);
      setLoading(false);
    };

    fetchPokemon();
  }, [name]);

  if (loading || !pokemon) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-4">
      <button
        className="mb-4 px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition cursor-pointer"
        onClick={() => window.history.back()}
      >
        ← Voltar para Home
      </button>
      <h2 className="text-2xl font-bold capitalize mb-4">{pokemon.name}</h2>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="w-32 h-32 mb-4"
      />

      <div className="mb-4">
        <strong>Tipos:</strong>
        <ul className="flex gap-2">
          {pokemon.types.map((t: any) => (
            <li
              key={t.type.name}
              className="capitalize bg-gray-200 dark:bg-gray-700 px-2 rounded"
            >
              {t.type.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <strong>Movimentos:</strong>
        <ul className="flex flex-wrap gap-2">
          {pokemon.moves.slice(0, 10).map((m: any) => (
            <li
              key={m.move.name}
              className="capitalize bg-blue-100 dark:bg-blue-700 px-2 rounded"
            >
              {m.move.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Habilidades:</strong>
        <ul>
          {abilities.map((ab) => (
            <li key={ab.name} className="mb-2">
              <span className="capitalize font-medium">{ab.name}</span>:{" "}
              <span>{ab.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
