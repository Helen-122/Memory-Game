const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false; // CARD NON RETOURNEE
let lockBoard = false; // BOARD NON VERROUILLE
let firstCard, secondCard;
let interval;
let timeUp = false // PARTIE EN COURS
let count_Interval; // SERVIRA A STOCKER L'ITERATION DU TIMER TOUTES LES SECS --> setInterval()
let count_down;
let gameOver; // SET TIME OUT GAMEOVER AU BOUT DE 60 SECS
let moves = 0; // AJOUT COUPS JOUES
let i = 0; // COMPTEUR QUI PERMETTRA D'INCREMENTER LE NOMBRE DE FOIS OU LES CARDS RESTENT RETOURNEES
let resetButton = document.createElement('button'); // STOCK LA CREATION DE L'ELEMENT BOUTON
let bouton = document.querySelector(".bouton"); // DIV PARENT DU FUTUR BOUTON

// CE QUE JE VEUX FAIRE :

// Un compte à rebours d'une minute qui demare au click de la première carte.

// Si le joueur trouve toutes les paires en moins 1 minute message:
//Bravo tu a trouvé toutes les paires en "x" coups +  apparition reset button

// Si non : game over + apparition reset button




//fonction qui demarre le compte à rebours à  1 minute

function startGame() {
  timeUp = false;
  launch_count_down();

  setTimeout(() => timeUp = true, 60000); // après que le temps indiqué est terminé --> l'action démarre
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
  let total_delay = 60 * 1000; // toutes les minutes
  // 2- Compte à rebours
  let count_down_delay = 1000 * 1; // affichage toutes les 1 secondes,
  let count_down = 0;

  count_down_div.textContent = timer((total_delay - count_down) / 1000);
  // setInterval pour que la fx se reitere 60 fois pour 60 sec
  count_Interval = window.setInterval(function () {
    //iterration de +1 sur le count_down donc transform A REVOIR !!!
    count_down += count_down_delay;
    //count_down += 1000;
    count_down_div.textContent = timer((total_delay - count_down) / 1000);
    if (count_down >= total_delay) { count_down = 0; }
    console.log(count_down);
  }, count_down_delay);

  // 3- FIN DU COMPTE A REBOURS DANS winGame() 
  gameOver = setTimeout(function () {

    clearInterval(count_Interval); // ARRET DU TIMER

    count_down_div.textContent = 'GAME OVER';//affiche game over à la fin des 60 secondes

    lockBoard = true; //LOCK LE BOARD QUAND LE TEMPS EST OVER

    bouton.prepend(resetButton);
    resetButton.classList.add("btn", "btn-outline-light", "text-dark");
    resetButton.textContent = "Rejouer";

    clearTimeout(gameOver); // STOPPE L'EXECUTION DU SET TIME OUT GAMEOVER

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

  moves++;
  console.log('moves :' + moves);
}

function disableCards() {
  i++; // INCREMENTATION A CHAQUE PAIR TROUVEE
  console.log('i' + i);
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  winGame(); // CHECK SI 8 PAIRS SONT TROUVEES OU NON
  resetBoard();
}

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
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
})();

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
};

function winGame() { //A APPELER DANS LA FONCTION OU LES CARDS MATCHENT --> disabledCards();
  let count_down_div = document.getElementById("count_down_div");

  if (i > 7) {
    clearInterval(count_Interval); // ARRET DU TIMER

    count_down_div.textContent = 'Bravo! Tu as trouvé toutes les paires en  ' + moves + ' coups!';

    clearTimeout(gameOver);// EMPECHE LE SET TIME OUT GAMEOVER DE S'EXECUTER

    bouton.prepend(resetButton);
    resetButton.classList.add("btn", "btn-outline-light", "text-dark");
    resetButton.textContent = "Rejouer";
  }
}

function resetGame() {
  cards.forEach(card => card.classList.remove('flip')); // FLIP DE TOUTES LES CARDS

  shuffle(); // NOUVEAU RANDOM CARDS 

  i = 0; // COMPTEUR PAIRS TROUVEES REMIS A ZERO --> disabledCards()

  moves = 0; // COUPS REMIS A ZERO

  count_down_div.textContent = '00:00'; // REAFFICHE LE TIMER A ZERO

  bouton.removeChild(resetButton); // SUPPRIME L'ENFANT DE playAgainButton_div

  cards.forEach(card => card.addEventListener('click', startGame));
  cards.forEach(card => card.addEventListener('click', flipCard));

  lockBoard = false;
}

//Au click sur une carte, on demare le jeu
cards.forEach(card => card.addEventListener('click', startGame));
cards.forEach(card => card.addEventListener('click', flipCard));
//Au click du bouton "Rejouer", on redémarre une partie
resetButton.addEventListener('click', resetGame);