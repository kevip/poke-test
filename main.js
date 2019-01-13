const POKEMON_BASE_API = 'http://pokeapi.salestock.net/api/v2';
const LOADER_URL = 'https://gifimage.net/wp-content/uploads/2018/11/pixel-loading-gif-2.gif';

let currentScore = 0,
	pokemonList = [];
	pokemonImage = document.querySelector("#pokemonImage"),
	alertPokemonImage = document.querySelector("#alertPokemonImage"),
	retryButton = document.querySelector("#retry"),
	currentScoreSpan = document.querySelector("#currentScore"),
	highestScoreSpan = document.querySelector("#highestScore"),
	correctAnswer = document.querySelector("#correctAnswer"),
	wrongAnswer = document.querySelector("#wrongAnswer");

sessionStorage.setItem('highestScore', currentScore);
currentScoreSpan.innerHTML = currentScore;
highestScoreSpan.innerHTML = currentScore;

retryButton.addEventListener('click', retry);

/**
* This function triggers when user choose an alternative 
*/
function choose(evt) {
	let option = evt.target;
	if(this.dataset.rightAnswer === 'true'){
		currentScoreSpan.innerHTML = ++currentScore;
		compareHighestScore(currentScore);
		getPokemons();
	} else {
		let correctAnswer = pokemonList.find(pokemon => pokemon.rightAnswer);
		displayAnswersInAlert(correctAnswer.name, option.value);
		toggleContainers();
	}
}

/**
* Compare the current score against the highest score stored in the sessionStorage
*/
function compareHighestScore(currentScore) {
	const highestScore = sessionStorage.getItem('highestScore');
	if (highestScore < currentScore) {
		sessionStorage.setItem('highestScore', currentScore);
		highestScoreSpan.innerHTML = currentScore;
	}
}

function getPokemons() {
	const offset = Math.floor(Math.random() * 49) + 1;
	pokemonImage.src = LOADER_URL;
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
/**
* Toggle the containers display
*/
function retry() {
	resetScore();
	currentScoreSpan.innerHTML = 0;
	toggleContainers();
	getPokemons();
}

let resetScore = function() {
	currentScore = 0;
}

let toggleContainers = function() {
	let alert = document.querySelector('.alert'),
		pokedex = document.querySelector('.pokedex');
	alert.classList.toggle('hide');
	pokedex.classList.toggle('hide');
}
let displayAnswersInAlert = function (correctAnswer, wrongAnswer) {
	console.log(correctAnswer, wrongAnswer);
	this.correctAnswer.innerHTML = correctAnswer;
	this.wrongAnswer.innerHTML = wrongAnswer;
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
			let optionButtons = document.querySelectorAll('.btn.option-btn');
			optionButtons.forEach(btn => btn.disabled = false);
			pokemonImage.src = alertPokemonImage.src = pokemon.sprites.front_default;

		})
}

let fillOptions = function (pokemons) {
	pokemonList = [];

	for(let i=0; i<4; i++) {
		const randomPokemonIndex = Math.floor(Math.random() * pokemons.length);
		const pokemon = Object.assign(pokemons[randomPokemonIndex], { rightAnswer: i==0 });
		pokemons.splice(randomPokemonIndex, 1);
		pokemonList.push(pokemon);// setting the first item of the list as the answer
	}
	getPokemon(pokemonList[0].url);
	
	pokemonList = pokemonList.sort(option => Math.random() - 0.5);

	createAlternatives(pokemonList);
}

let createAlternatives = function(pokemons) {
	let options = document.querySelector('.options');
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	pokemons.forEach(pokemon => {
		let option = document.createElement('li'),
			button = document.createElement('input');
		option.className = 'option';
		button.className = 'btn option-btn';
		button.disabled = true;
		button.type = 'button';
		button.value = pokemon.name;
		button.dataset.rightAnswer = pokemon.rightAnswer;
		button.addEventListener('click', choose);
		option.appendChild(button);
		options.appendChild(option);
	});
}
getPokemons();
