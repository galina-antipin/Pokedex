let allPokemons = [];
let currentStart = 1;
let currentEnd = 20;
let currentPokemonIndex = 0;
let filteredPokemons = [];

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('d-none');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('d-none');
}

async function fetchData(start, end) {
    showLoadingScreen();
    for (let i = start; i <= end; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let responseAsJson = await response.json();
        allPokemons.push(responseAsJson);
    }
    hideLoadingScreen();
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
            <h2 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h2>
            <img src="${imageUrl}" alt="Pokemon">
            <div class="types-container">${typesHtml}</div>
        </div>
    `;
}

function loadMore() {
    currentStart = currentEnd + 1;
    currentEnd += 20;
    fetchData(currentStart, currentEnd);
}

function filterAndShowPokemons(filterWord) {
    let value = document.getElementById('searchBox').value;
    if (value.length < 3) {
        filteredPokemons = [];
        renderPokemonData(allPokemons);
        return;
    }
    filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(value.toLowerCase()));
    renderPokemonData(filteredPokemons.slice(0, 10));   
}

fetchData(currentStart, currentEnd);

function openPokemonDetails(i) {
    if (filteredPokemons.length > 0 && i < filteredPokemons.length) {
        currentPokemonIndex = i;
        openPokemonDetailsOfFilteredPokemons();
    } else {
        currentPokemonIndex = i;
        document.getElementById('overlay').classList.remove('d-none');
        document.getElementById('body').classList.add('stop-scroll');
        let pokemon = allPokemons[i];
        renderPokemonDetails(pokemon);
        const overlay = document.getElementById('overlay');
        overlay.addEventListener('click', closePokemonDetails);
    }
}

function openPokemonDetailsOfFilteredPokemons() {
    document.getElementById('overlay').classList.remove('d-none');
    document.getElementById('body').classList.add('stop-scroll');
    let pokemon = filteredPokemons[currentPokemonIndex];
    renderPokemonDetails(pokemon);
}

function renderPokemonDetails(pokemon) {
    let pokemonDetails = document.getElementById('overlay');
    let imageUrl = pokemon.sprites['other']['official-artwork'].front_default;
    let typesHtml = pokemon.types.map(typeInfo => `<span>${typeInfo.type.name}</span>`).join('');
    pokemonDetails.innerHTML = addPokemonDetailsHtml(pokemon, imageUrl, typesHtml);
}

function addPokemonDetailsHtml(pokemon, imageUrl, typesHtml) {
    let typeClass = pokemon.types[0].type.name;
    return `
        <div class="overlay-container" onclick="event.stopPropagation();">
            <div class="card-above ${typeClass}">
                <h3>${capitalizeFirstLetter(pokemon.name)}</h3> 
                <img src="${imageUrl}" alt="Pokemon" onclick="closePokemonDetails()">
            </div>
            <div class="pokemon-details">  
                <div> HP: <span>${pokemon.stats[0].base_stat}</span></div>
                <div> Attack: <span>${pokemon.stats[1].base_stat}</span></div>
                <div> Defense: <span>${pokemon.stats[2].base_stat}</span></div>
                <div> Speed: <span>${pokemon.stats[5].base_stat}</span></div>
            </div>
            <div class="left-right-logo-container">
                <img onclick="swipeLeft(); event.stopPropagation();" class="left-right-logo" src="./img/left.svg" alt="left">
                <img onclick="swipeRight(); event.stopPropagation();" class="left-right-logo" src="./img/right.svg" alt="right">
            </div>
        </div>`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function swipeLeft() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        openPokemonDetails(currentPokemonIndex);
    }
}

function swipeRight() {
    if (currentPokemonIndex < allPokemons.length) {
        currentPokemonIndex++;
        openPokemonDetails(currentPokemonIndex);
    }
}

function closePokemonDetails() {
    document.getElementById('overlay').classList.add('d-none');
    document.getElementById('body').classList.remove('stop-scroll');
    const overlay = document.getElementById('overlay');
    overlay.removeEventListener('click', closePokemonDetails);
}