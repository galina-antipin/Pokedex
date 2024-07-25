let allPokemons = [];
let currentStart = 1;
let currentEnd = 20;
let currentIndex = 0;
let currentPokemonIndex = 0;

async function fetchData(start, end) {
    for (let i = start; i <= end; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let responseAsJson = await response.json();
        allPokemons.push(responseAsJson);
    }
    renderPokemonData();
}

function renderPokemonData(pokemons = allPokemons) {
    let pokemonContent = document.getElementById('content');
    pokemonContent.innerHTML = '';

    for (let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];
        let imageUrl = pokemon.sprites['other']['official-artwork'].front_default;

        let typesHtml = pokemon.types.map(type => type.type.name).join(' ');
        let typeClass = pokemon.types[0].type.name;
        pokemonContent.innerHTML += addPokemonHtml(pokemon, imageUrl, typesHtml, typeClass, i);
    }
}

function addPokemonHtml(pokemon, imageUrl, typesHtml, typeClass, i) {
    return `
        <div class="pokemon-card ${typeClass}" onclick="openPokemonDetails(${i})">
            <h2>${pokemon.name}</h2>
            <img src="${imageUrl}">
            <div class="types-container">${typesHtml}</div>
        </div>
    `;
}

function loadMore() {
    currentStart = currentEnd + 1;
    currentEnd += 20;
    fetchData(currentStart, currentEnd);
}

function filterAndShowNames(filterWord) {
    let value = document.getElementById('searchBox').value;
    if (value.length < 3) {
        return;
    }
    let filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(filterWord.toLowerCase()));
    renderPokemonData(filteredPokemons);
}

fetchData(currentStart, currentEnd);

function openPokemonDetails(i, pokemons = allPokemons) {
    currentPokemonIndex = i; // Setze den aktuellen Pokémon-Index
    document.getElementById('overlay').classList.remove('d-none');
    let pokemonDetails = document.getElementById('overlay');
    let pokemon = pokemons[i];
    let imageUrl = pokemon.sprites['other']['official-artwork'].front_default;
    let typesHtml = pokemon.types.map(typeInfo => `<span>${typeInfo.type.name}</span>`).join(''); 
    pokemonDetails.innerHTML = addPokemonDetailsHtml(i, pokemons = allPokemons,pokemonDetails,pokemon,imageUrl,typesHtml);
}

function addPokemonDetailsHtml(i, pokemons = allPokemons,pokemonDetails,pokemon,imageUrl,typesHtml){
    return   `<div class="overlay-container" >
        <h2>${pokemon.name}</h2>
        <img onclick="closePokemonDetails()" src="${imageUrl}">
        <div class="types-container">${typesHtml}</div>
        <img onclick="swipeLeft()" class="left-right-logo" src="./img/left.svg" alt="left">
        <img onclick="swipeRight()" class="left-right-logo" src="./img/right.svg" alt="right">
    </div>`;
}

function swipeLeft() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        openPokemonDetails(currentPokemonIndex);
    }
}

function swipeRight() {
    if (currentPokemonIndex < allPokemons.length - 1) {
        currentPokemonIndex++;
        openPokemonDetails(currentPokemonIndex);
    }
}

function closePokemonDetails(){
    document.getElementById('overlay').classList.add('d-none');
}
