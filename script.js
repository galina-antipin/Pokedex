let allPokemons = [];
let currentStart = 1;
let currentEnd = 20;

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

fetchData(currentStart, currentEnd);

function filterAndShowNames(filterWord) {
    let value = document.getElementById('searchBox').value;
    if (value.length < 3){
        return;
    }
    let filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(filterWord.toLowerCase()));
    renderPokemonData(filteredPokemons);
}