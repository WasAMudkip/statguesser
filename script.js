const MAX_POKEMON_ID = 10000;
const COMPARE_STATS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

const statNameSpan = document.getElementById('current-stat-name');
const nextButton = document.getElementById('next-button');
const feedbackText = document.getElementById('feedback-text');
const card1 = document.getElementById('poka-card-1');
const card2 = document.getElementById('poka-card-2');

let currentPokemon1 = null;
let currentPokemon2 = null;
let currentStatToCompare = '';
let hasGuessed = false;

async function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    return await response.json();
}

async function startNewRound() {
    hasGuessed = false;
    feedbackText.innerHTML = '';
    nextButton.style.display = 'none';
    card1.classList.remove('disabled', 'winner', 'loser');
    card2.classList.remove('disabled', 'winner', 'loser');
    document.getElementById('poka-stat-1').style.display = 'none';
    document.getElementById('poka-stat-2').style.display = 'none';
    
    currentPokemon1 = await fetchRandomPokemon();
    currentPokemon2 = await fetchRandomPokemon();
    currentStatToCompare = COMPARE_STATS[Math.floor(Math.random() * COMPARE_STATS.length)];

    updateUI(currentPokemon1, '1');
    updateUI(currentPokemon2, '2');
    statNameSpan.innerText = currentStatToCompare.replace('-', ' ');
}

function updateUI(data, id) {
    document.getElementById(`poka-name-${id}`).innerText = data.name;
    document.getElementById(`poka-img-${id}`).src = data.sprites.other['official-artwork'].front_default;
}

function handleGuess(guessP1) {
    if (hasGuessed) return;
    hasGuessed = true;

    const val1 = currentPokemon1.stats.find(s => s.stat.name === currentStatToCompare).base_stat;
    const val2 = currentPokemon2.stats.find(s => s.stat.name === currentStatToCompare).base_stat;

    document.getElementById('poka-stat-1').innerText = val1;
    document.getElementById('poka-stat-2').innerText = val2;
    document.getElementById('poka-stat-1').style.display = 'block';
    document.getElementById('poka-stat-2').style.display = 'block';

    const p1Won = val1 >= val2;
    card1.classList.add(p1Won ? 'winner' : 'loser');
    card2.classList.add(p1Won ? 'loser' : 'winner');

    const userCorrect = (guessP1 && p1Won) || (!guessP1 && !p1Won);
    feedbackText.innerHTML = userCorrect ? '<span class="correct">Correct!</span>' : '<span class="incorrect">Incorrect!</span>';
    nextButton.style.display = 'block';
}

card1.addEventListener('click', () => handleGuess(true));
card2.addEventListener('click', () => handleGuess(false));
nextButton.addEventListener('click', startNewRound);

startNewRound();
