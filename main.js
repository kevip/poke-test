const POKEMON_BASE_API = 'http://pokeapi.salestock.net/api/v2';

function getPokemons() {
	let offset = Math.floor(Math.random() * 49) + 1;

	fetch(`${POKEMON_BASE_API}/pokemon?offset=${offset}`)
		.then(function(response) {
			if (!response.ok) {
				throw new Error('HTTP error, status = ' + response.status);
			}
			return response.clone().json();
		})
		.then(function(myJson) {
			let pokemons = myJson.hasOwnProperty('results') ? myJson.results : [];
			fillOptions(pokemons);

		});
}
let getPokemon = function (url) {
	fetch(url)
		.then(function(response) {
			if (!response.ok) {
				throw new Error('HTTP error, status = ' + response.status);
			}
			return response.clone().json();	
		})
		.then(function(pokemon) {
			//fill image
			document.querySelector('#pokemonImage').src = pokemon.sprites.front_default;
		})
}
let fillOptions = function (pokemons) {
	let options = document.querySelector('.options'),
		/*randomPokemonKey = Math.floor(Math.random() * pokemons.length) + 1,*/
		optionsList = [];

	for(let i=0; i<4; i++) {
		let randomPokemonIndex = Math.floor(Math.random() * pokemons.length) + 1;
		optionsList.push(pokemons[randomPokemonIndex]);
	}
	getPokemon(optionsList[0].url);// setting the first item of the list as the answer
	
	optionsList = optionsList.sort(option => Math.random() - 0.5);
	optionsList.forEach(pokemon => {
		let option = document.createElement('li');
		let button = document.createElement('input');
		option.className = 'option';
		button.className = 'btn option-btn';
		button.type = 'button';
		button.value = pokemon.name;
		option.appendChild(button);
		options.appendChild(option);
	});
}
getPokemons();