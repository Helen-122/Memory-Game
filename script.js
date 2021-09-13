
const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
//let timeLeft = 30;
let interval;
let timeUp = false


// CE QUE JE VEUX FAIRE :

//Un compte à rebours de 30 secondes qui demare au click de la première carte.

// Si le joueur trouve toutes les paires en moins 1 minute message:
//Bravo tu a trouvé toutes les paires en "x" coups +  apparition reset button

// Si non : game over + apparition reset button


//fonction qui demarre le compte à rebours à  1 minute
function startGame() {
  timeUp = false;
  launch_count_down();
  setTimeout(() => timeUp = true, 60000)
}


//fonction du compte à rebours et game over quand il est fini

function timer(secondes) {
  let temps = new Date();// objet new date est un standard et se calque sur le navigateur
  temps.setTime(secondes * 1000);
  return temps.getMinutes().toString().padStart(2, '0') + ":" + temps.getSeconds().toString().padStart(2, '0');
}
function launch_count_down() { //apelle la function timer
  //creation de la variable qui appelle la count_down_div
  let count_down_div = document.getElementById("count_down_div");
  // 1- le délai
  let total_delay = 60 * 1000; // toutes les 30 SECONDES
  // 2- Compte à rebours
  let count_down_delay = 1000 * 1; // affichage toutes les 1 secondes,
  let count_down = 0;
  count_down_div.textContent = timer((total_delay - count_down) / 1000);
  // setInterval pour que la fx se reitere 30 fois pour 30 sec
  let count_Interval = window.setInterval(function () {
    //iterration de +1 sur le count_down donc transform A REVOIR !!!
    count_down += count_down_delay;
    //count_down += 1000;
    count_down_div.textContent = timer((total_delay - count_down) / 1000);
    if (count_down >= total_delay) { count_down = 0; }
  }, count_down_delay);

  // 3- A LA FIN du compte à rebours
  setTimeout(function () {
    // on STOPPE
    clearInterval(count_Interval);
    count_down_div.textContent = 'GAME OVER';//affiche game over à la fin du jeu
  }, total_delay);
}




// ---------------------------THE GAME------------------------------------------


//A chaque carte cliquée, cette fonction va demarer, (c'est donc aussi une sorte de fct 'start')
//La variable "this" représente la carte sur laquelle on a cliqué. 
//(appel de cette fonction dans le foreach tout en bas)
function flipCard() {
  cards.forEach(card => card.removeEventListener('click', startGame));
  
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

// fonction qui compare les cartes, si elles sont pareilles
//on appelle la fonction disableCards qui les laisse visible et les empeche d'etre recliquées
//si elles sont differenets, elles se retournent encore avec la fonction unflipCards

// Ceci est une ternaire: elle est composée de trois blocs. Le premier bloc est la condition à évaluer. 
//Le deuxième bloc est exécuté si la condition retourne vrai, sinon on execute le 3eme bloc.
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}


function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

// Rajouter ici une fonction au cas ou toutes les cartes sont retournées, pour dire: 
//gagné en x temps et x coups???

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);

}
//function pour recommencer une partie
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// fonction pour remelanger les cartes
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

//Au click sur une carte, on demare le jeu
cards.forEach(card => card.addEventListener('click', startGame));
cards.forEach(card => card.addEventListener('click', flipCard));



