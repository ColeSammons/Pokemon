import { useState } from 'react';
import './App.css'
import { Pokedex } from 'pokeapi-js-wrapper';
import { useEffect } from 'react';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [next, setNext] = useState('');
  const [prev, setPrev] = useState('');
  const P = new Pokedex;

  const fetchData = async (url) => {
    if (!url) return;
    const data = await fetch(url);
    const fetched = await data.json();
    if (fetched.next) {
      setNext(fetched.next);
    } else {
      setNext('');
    }
    if (fetched.previous) {
      setPrev(fetched.previous)
    } else {
      setPrev('')
    }
    setPokemon(fetched?.results);
  }

  const fetchPokemon = async () => {
    if (selectedPokemon) {
      const data = await P.getPokemonByName(selectedPokemon);
      setPokemonDetails(data);
      console.log(data);
    }
  }

  useEffect(() => {
    fetchData('https://pokeapi.co/api/v2/pokemon');
  }, [])

  useEffect(() => {
    fetchPokemon()
  }, [selectedPokemon]);

  return (
    <>
      <div className='flex'>
        <div>
          <div className='container'>
            {pokemon ? pokemon.map((poke) => {
              return (<div className={`pokemon-container ${selectedPokemon === poke?.name && 'selected'}`} key={poke?.name} onClick={() => setSelectedPokemon(poke?.name)}>{poke?.name.charAt(0).toUpperCase() + poke?.name.slice(1)}</div>)
            }) : 'LOADING...'}
          </div>
          <button onClick={() => fetchData(prev)}>Previous</button>
          <button onClick={() => fetchData(next)}>Next</button>
        </div>
        <div className='details'>
            <div>{pokemonDetails?.name.charAt(0).toUpperCase() + pokemonDetails?.name.slice(1)}</div>
            <img src={pokemonDetails?.sprites?.front_default} alt="pokemon" />
            <div>HP: {pokemonDetails.stats[0].base_stat}</div>
            <div>Attack: {pokemonDetails.stats[1].base_stat}</div>
            <div>Defense: {pokemonDetails.stats[2].base_stat}</div>
            <div>Special-Attack: {pokemonDetails.stats[3].base_stat}</div>
            <div>Special-Defense: {pokemonDetails.stats[4].base_stat}</div>
            <div>Speed: {pokemonDetails.stats[5].base_stat}</div>

        </div>

      </div>
    </>
  )
}

export default App
