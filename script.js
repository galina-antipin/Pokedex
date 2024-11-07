let allPokemons = [];
let currentStart = 1;
let currentEnd = 20;
let currentPokemonIndex = 0;
let filteredPokemons = [];

/**
 * Displays the loadingScreen
 */
function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('d-none');
}

/**
 * Fetchs Pokémon Data when the window onload
 */
window.onload = () => {
    fetchData(currentStart, currentEnd);
};

/**
 * Hides the loadingScreen
 */
function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('d-none');
}

/**
 * Fetches Pokémon data from the PokéAPI for a specified range of IDs
 * @param {number} currentStart The starting Pokémon ID (inclusive) to fetch data for.
 * @param {number} currentEnd The ending Pokémon ID (inclusive) to fetch data for.
 */
async function fetchData(currentStart, currentEnd) {
    await showLoadingScreen();
    for (let i = currentStart; i <= currentEnd; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let responseAsJson = await response.json();
        allPokemons.push(responseAsJson);
    }
    hideLoadingScreen();
    renderPokemonData();
}

/**
 * Renders the Pokémons
 * @param {Array} pokemons An array of Pokémons to render.
 *                                         
 */
function renderPokemonData(pokemons = allPokemons) {
    let pokemonContent = document.getElementById('content');
    pokemonContent.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];
        let imageUrl = pokemon.sprites['other']['official-artwork'].front_default;
        let typesHtml = pokemon.types.map(type => `<img src="./img/${type.type.name}.svg" alt="${type.type.name} type" class="pokemon-type-icon">`).join(' ');
        let typeClass = pokemon.types[0].type.name;
        pokemonContent.innerHTML += addPokemonHtml(pokemon, imageUrl, typesHtml, typeClass, i);
    }
}

/**
 * Loads more Pokémons
 */
function loadMore() {
    currentStart = currentEnd + 1;
    currentEnd += 20;
    fetchData(currentStart, currentEnd);
    document.getElementById('noPokemonsMessage').classList.add('d-none');
}

/**
 * Filters the Pokémon and displays the filtered results. 
 * @param {string} filterWord The word used to filter Pokémon names and shows or hides a message if no Pokémon match the search criteria.
 * @returns
 */
function filterAndShowPokemons(filterWord) {
    let value = document.getElementById('searchBox').value;
    if (value.length < 3) {
        filteredPokemons = [];
        renderPokemonData(allPokemons);
        document.getElementById('noPokemonsMessage').classList.add('d-none');
        return;
    }
    filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(value.toLowerCase()));
    if (filteredPokemons.length === 0) {
        document.getElementById('noPokemonsMessage').classList.remove('d-none'); 
    } else {
        document.getElementById('noPokemonsMessage').classList.add('d-none');
    }
    renderPokemonData(filteredPokemons.slice(0, 10));
}

fetchData(currentStart, currentEnd);

/**
 * Opens the details for a picked Pokémon
 * @param {number} i The index of the Pokémon to display details
 */
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

/**
 * Opens the details of filtered Pokemons
 */
function openPokemonDetailsOfFilteredPokemons() {
    document.getElementById('overlay').classList.remove('d-none');
    document.getElementById('body').classList.add('stop-scroll');
    let pokemon = filteredPokemons[currentPokemonIndex];
    renderPokemonDetails(pokemon);
}

/**
 * Renders details of Pokémon on an overlay
 * @param {Object} pokemon The object of Pokemon details
 */
function renderPokemonDetails(pokemon) {
    let pokemonDetails = document.getElementById('overlay');
    let imageUrl = pokemon.sprites['other']['official-artwork'].front_default;
    let typesHtml = pokemon.types.map(typeInfo => `<span>${typeInfo.type.name}</span>`).join('');
    pokemonDetails.innerHTML = addPokemonDetailsHtml(pokemon, imageUrl, typesHtml);
    if (currentPokemonIndex === 0) {
        document.getElementById('left-button').classList.add('opacity-none');
    } else {
        document.getElementById('left-button').classList.remove('opacity-none');
    }
}

/**
 * Capitalizes the first letter of the given string and converts to lowercase
 * @param {string} string  The input string to be formatted.
 * @returns {string} Returns the formatted string with the first letter capitalized  and the rest in lowercase
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Navigates the slide to left, to shows the previous Pokémon
 */
function swipeLeft() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        openPokemonDetails(currentPokemonIndex);
    }
    if (currentPokemonIndex === 0) {
        document.getElementById('left-button').classList.add('d-none');
    } else {
        document.getElementById('left-button').classList.remove('d-none');
    }
}

/**
 * Navigates the slide to right, to shows the next Pokémon
 */
function swipeRight() {
    if (currentPokemonIndex < allPokemons.length - 1) {
        currentPokemonIndex++;
        openPokemonDetails(currentPokemonIndex);
    } else {
        loadMore();
    }
    if (currentPokemonIndex === 0) {
        document.getElementById('left-button').classList.add('d-none');
    } else {
        document.getElementById('left-button').classList.remove('d-none');
    }
}

/**
 * Closes the Pokemon card
 */
function closePokemonDetails() {
    document.getElementById('overlay').classList.add('d-none');
    document.getElementById('body').classList.remove('stop-scroll');
    const overlay = document.getElementById('overlay');
    overlay.removeEventListener('click', closePokemonDetails);
}