function addPokemonHtml(pokemon, imageUrl, typesHtml, typeClass, i) { 
    return `
        <div class="pokemon-card ${typeClass}" onclick="openPokemonDetails(${i})">
            <div class="name-section"><h2 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h2>
            <span class="pokemon-number">#${i + 1}</span> </div>
            <img src="${imageUrl}" alt="Pokemon">
            <div class="types-container">${typesHtml}</div>
        </div>
    `;
}

function addPokemonDetailsHtml(pokemon, imageUrl, typesHtml) {
    let typeClass = pokemon.types[0].type.name;
    return `
        <div class="overlay-container" onclick="event.stopPropagation();">
            <div class="card-above ${typeClass}">
                <h3>${capitalizeFirstLetter(pokemon.name)}</h3> 
                <img src="${imageUrl}" alt="Pokemon" onclick="closePokemonDetails()">
            </div>
            <div class="card-bottom">
                <div class="pokemon-stats">
                    <div class="stat">
                        <span>HP: <span>${pokemon.stats[0].base_stat}</span></span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[0].base_stat / 255 * 100}%;"></div>
                        </div>
                    </div>
                    <div class="stat">
                        <span>Attack: <span>${pokemon.stats[1].base_stat}</span></span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[1].base_stat / 255 * 100}%;"></div>
                        </div>
                    </div>
                    <div class="stat">
                        <span>Defense: <span>${pokemon.stats[2].base_stat}</span></span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[2].base_stat / 255 * 100}%;"></div>
                        </div>
                    </div>
                    <div class="stat">
                        <span>Speed: <span>${pokemon.stats[5].base_stat}</span></span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${pokemon.stats[5].base_stat / 255 * 100}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="left-right-logo-container">
                    <img onclick="swipeLeft(); event.stopPropagation();" class="left-right-logo" id="left-button" src="./img/left.svg" alt="left">
                    <img onclick="swipeRight(); event.stopPropagation();" class="left-right-logo" src="./img/right.svg" alt="right">
                </div> 
            </div>
        </div>`;
}