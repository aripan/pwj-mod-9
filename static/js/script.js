//! Game 1

let scores = {
  winner: 0,
  losser: 0,
  tied: 0,
};

let humanChoice, botChoice;

function rpsGame(yourChoice) {
  humanChoice = yourChoice.id;

  botChoice = numberToChoice(randToRpsInt());

  results = decideWinner(humanChoice, botChoice); //[0, 1] human lost | bot won

  message = finalMessage(results); //('message': 'You won!', 'color':"green")

  rpsFrontEnd(humanChoice, botChoice, message);
}

function randToRpsInt() {
  return Math.floor(Math.random() * 3);
}

function numberToChoice(number) {
  return ["rock", "paper", "scissor"][number];
}

function decideWinner(yourChoice, computerChoice) {
  let rpsDatabase = {
    rock: { scissor: 1, rock: 0.5, paper: 0 },
    paper: { scissor: 0, rock: 1, paper: 0.5 },
    scissor: { scissor: 0.5, rock: 0, paper: 1 },
  };

  let yourScore = rpsDatabase[yourChoice][computerChoice];
  let computerScore = rpsDatabase[computerChoice][yourChoice];

  return [yourScore, computerScore];
}

function finalMessage([yourScore]) {
  if (yourScore === 0) {
    scores["losser"]++;
    return { message: "You Lost!", color: "red" };
  } else if (yourScore === 0.5) {
    scores["tied"]++;
    return { message: "You tied!", color: "yellow" };
  } else {
    scores["winner"]++;
    return { message: "You won", color: "green" };
  }
}

function rpsFrontEnd(humanImageChoice, botImageChoice, finalMessage) {
  let imagesDatabase = {
    rock: document.getElementById("rock").src,
    paper: document.getElementById("paper").src,
    scissor: document.getElementById("scissor").src,
  };

  //? Let remove all the images
  document.getElementById("rock").remove();
  document.getElementById("paper").remove();
  document.getElementById("scissor").remove();

  let humanDiv = document.createElement("span");
  let messageDiv = document.createElement("span");
  let botDiv = document.createElement("span");

  humanDiv.innerHTML = `<img src=${imagesDatabase[humanImageChoice]} style= "width:150; height:150; margin:1rem; box-shadow: 0 10px 50px rgba(37, 50, 233, 1);">`;
  messageDiv.innerHTML = `<h1 style= "color: ${finalMessage["color"]}; display: inline-block; font-size: 4rem; width:400; height:auto;"> ${finalMessage["message"]}</h1>`;
  botDiv.innerHTML = ` <img src=${imagesDatabase[botImageChoice]} style= "width:150; height:150; margin:1rem; box-shadow: 0 10px 50px rgba(243, 38, 24, 1);">`;

  document.getElementById("flex-box-rps-div").appendChild(humanDiv);
  document.getElementById("flex-box-rps-div").appendChild(messageDiv);
  document.getElementById("flex-box-rps-div").appendChild(botDiv);

  document.querySelector("#winner").textContent = scores["winner"];
  document.querySelector("#losser").textContent = scores["losser"];
  document.querySelector("#tied").textContent = scores["tied"];
}

document.querySelector("#play-again").addEventListener("click", tryAgain);

function tryAgain() {
  document.getElementById("flex-box-rps-div").textContent = "";

  let rock = document.createElement("img");
  rock.src =
    "https://www.hoekhavelte.nl/wp-content/uploads/2017/05/Beach-Pebbles-Zwart-50-70-Droog.jpg";
  rock.setAttribute("id", "rock");
  rock.setAttribute("onclick", "rpsGame(this)");
  rock.style.height = "150";
  rock.style.width = "150";

  let paper = document.createElement("img");
  paper.src =
    "http://www.paperduke.com/wp-content/uploads/2017/06/Free-Printable-Notebook-Paper-e1497490624975.jpg";
  paper.setAttribute("id", "paper");
  paper.setAttribute("onclick", "rpsGame(this)");
  paper.style.height = "150";
  paper.style.width = "150";

  let scissor = document.createElement("img");
  scissor.src =
    "https://clipartion.com/wp-content/uploads/2015/10/scissors-clipart-school-pinterest.jpg";
  scissor.setAttribute("id", "scissor");
  scissor.setAttribute("onclick", "rpsGame(this)");
  scissor.style.height = "150";
  scissor.style.width = "150";

  document.querySelector("#flex-box-rps-div").appendChild(rock);
  document.querySelector("#flex-box-rps-div").appendChild(paper);
  document.querySelector("#flex-box-rps-div").appendChild(scissor);
}

//! Game 2

let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },

  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

const hitSound = new Audio("static/sounds/swish.m4a");
const winSound = new Audio("static/sounds/cash.mp3");
const lossSound = new Audio("static/sounds/aww.mp3");

document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);

document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", dealerLogic);

document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `static/images/${card}.png`;
    cardImage.style.height = "7em";
    cardImage.style.width = "7em";
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStand"] = false;
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }

    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;
    document.querySelector("#your-blackjack-result").style.color = "#fff";
    document.querySelector("#dealer-blackjack-result").style.color = "#fff";

    document.querySelector("#blackjack-result").textContent = "Let's play";
    document.querySelector("#blackjack-result").style.color = "black";

    blackjackGame["turnsOver"] = true;
  }
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    //? If adding 11 keeps me below 21, add 11. Otherwise, add 1
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackjackGame["isStand"] = true;

  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }
  blackjackGame["turnsOver"] = true;
  showResults(computeWinner());
}

//? compute winner and return who just won
//? update the wins, draws, and losses
function computeWinner() {
  let winner;

  if (YOU["score"] <= 21) {
    //? condition: higher score than DEALER or when the DEALER busts but YOU not
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["draws"]++;
    }

    //? condition: when YOU busts, but DEALER doesn't
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]++;
    winner = DEALER;

    //? condition: when YOU and DEALER bust!
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]++;
  }

  return winner;
}

function showResults(winner) {
  let message, messageColor;

  if (blackjackGame["turnsOver"] === true) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "You won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You lost!";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "You drew!";
      messageColor = "black";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}
