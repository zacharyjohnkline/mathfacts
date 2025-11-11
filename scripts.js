"use strict";

// DOM elements
const overlay = document.querySelector('.overlay');
const container = document.querySelector('.container');
const gameSquares = Array.from(document.querySelectorAll('.gamesquare'));

let mode;
let answerA, answerB, answerC;
let progress = -1;

// --------------------
// Overlay helpers
// --------------------
function showOverlay(html, bg = "aqua") {
  overlay.style.backgroundColor = bg;
  overlay.innerHTML = html;
  overlay.style.height = "100%"; // use your existing CSS transition
}

function hideOverlay() {
  overlay.style.height = "0";
  setTimeout(() => {
    overlay.innerHTML = "";
    overlay.style.backgroundColor = "aqua";
  }, 250);
}

// --------------------
// Mode selection
// --------------------
function openScreen(win = false) {
  progress = -1;
  gameSquares.forEach(item => {
    item.style.backgroundColor = "purple";
  });

  const heading = win
    ? `<h1 class="congrats">CONGRATULATIONS!  YOU WON!</h1><br>`
    : "";

  const html = `
    <div class="mode-selection">
      ${heading}
      <h1 class="answer-words">Choose which operation:</h1>
      <div class="operation-buttons">
        <p class="mode-select">Addition</p>
        <p class="mode-select">Multiplication</p>
      </div>
    </div>
  `;

  showOverlay(html);

  const buttonsArray = Array.from(document.querySelectorAll('.mode-select'));

  buttonsArray.forEach(item => {
    item.addEventListener(
      'click',
      (e) => {
        mode = e.target.innerText;

        // ✅ DO NOT hide + then clear with a delayed timeout.
        // Instead, just move straight into the first problem
        // and let mathProblem overwrite the overlay contents.
        const range = mode === "Addition" ? 20 : 9;
        mathProblem(mode, range);
      },
      { once: true }
    );
  });
}

openScreen();

// --------------------
// Win check / reset
// --------------------
function checkForWin() {
  for (let i = 0; i < gameSquares.length; i++) {
    if (gameSquares[i].style.backgroundColor !== 'lightgreen') {
      return false;
    }
  }
  return true;
}

function resetBoard() {
  openScreen(true);
}

// --------------------
// Smarter answers
// --------------------
function buildTrickyAnswers(mode, number1, number2, range) {
  const correct = mode === "Addition"
    ? number1 + number2
    : number1 * number2;

  const wrongs = [];

  if (mode === "Addition") {
    // Start with nice close neighbors around the correct answer
    const deltas = [-2, +2, -4, +4, -1, +1, -3, +3];

    for (let d of deltas) {
      const candidate = correct + d;
      if (
        candidate >= 0 &&
        candidate !== correct &&
        !wrongs.includes(candidate)
      ) {
        wrongs.push(candidate);
      }
      if (wrongs.length === 2) break;
    }

    // Fallback if we somehow still don't have 2 unique wrong answers
    let step = 5;
    while (wrongs.length < 2) {
      const candidate = correct + step;
      if (candidate !== correct && !wrongs.includes(candidate)) {
        wrongs.push(candidate);
      }
      step += 5;
    }

  } else {
    // Multiplication: use nearby factors (n-1, n+1, n-2, n+2, etc.)
    const factorOffsets = [-1, +1, -2, +2, -3, +3];
    for (let off of factorOffsets) {
      const f = number1 + off;
      if (f >= 1 && f <= range) {
        const candidate = f * number2;
        if (candidate !== correct && !wrongs.includes(candidate)) {
          wrongs.push(candidate);
        }
      }
      if (wrongs.length === 2) break;
    }

    // Fallback if still not 2 unique wrongs (edge cases)
    let extraFactor = 1;
    while (wrongs.length < 2) {
      const candidate = extraFactor * number2;
      if (candidate !== correct && !wrongs.includes(candidate)) {
        wrongs.push(candidate);
      }
      extraFactor++;
      if (extraFactor > range + 5) break; // hard stop safety
    }
  }

  // We now have: correct, wrongs[0], wrongs[1]
  const answers = [correct, wrongs[0], wrongs[1]];
  answers.sort(() => Math.random() - 0.5);

  // map into your existing globals
  answerA = answers[0];
  answerB = answers[1];
  answerC = answers[2];

  return correct;
}


// --------------------
// Core game: mathProblem
// --------------------
function mathProblem(mode, range) {
  const modeSign = mode === "Addition" ? "+" : "x";

  const number1 = Math.ceil(Math.random() * range);
  const number2 = Math.ceil(Math.random() * range);

  const answer = buildTrickyAnswers(mode, number1, number2, range);

  overlay.innerHTML = `
    <div class="problem">
      <h1 id="problem-words">
        ${number1} ${modeSign} ${number2} =
      </h1>
    </div>
    <div class="answers">
      <div class="answer-div"><h1 class="answer-words">${answerA}</h1></div>
      <div class="answer-div"><h1 class="answer-words">${answerB}</h1></div>
      <div class="answer-div"><h1 class="answer-words">${answerC}</h1></div>
    </div>
  `;
  overlay.style.height = "100%"; // show the question using your CSS transition

  const answerDom = Array.from(document.querySelectorAll(".answer-div"));

  answerDom.forEach(item => {
    item.addEventListener(
      "click",
      (e) => {
        const chosen = parseInt(e.target.innerText, 10);

        if (chosen === answer) {
          // correct
          if (progress < gameSquares.length - 1) {
            progress++;
            gameSquares[progress].style.backgroundColor = "lightgreen";
          }

          overlay.innerHTML += `
            <div class="answer-overlay">
              <h1 class="answer-words">Correct!</h1>
            </div>
          `;

          const answerOverlay = document.querySelector('.answer-overlay');

          setTimeout(() => { answerOverlay.style.height = "100%"; }, 0);
          answerOverlay.style.backgroundColor = "lightgreen";
          overlay.style.backgroundColor = "lightgreen";

          answerOverlay.addEventListener(
            'click',
            () => {
              // slide up the overlay
              overlay.style.height = "0";
              overlay.innerHTML = "";
              setTimeout(() => overlay.style.backgroundColor = "aqua", 250);

              if (checkForWin()) {
                resetBoard();
              } else {
                const nextRange = mode === "Addition" ? 20 : 9;
                mathProblem(mode, nextRange);
              }
            },
            { once: true }
          );

        } else {
          // wrong
          if (progress > 0) {
            gameSquares[progress].style.backgroundColor = "purple";
            progress--;
          } else if (progress < 0) {
            progress = -1;
          }

          overlay.innerHTML += `
            <div class="answer-overlay">
              <h1 class="answer-words">Wrong!</h1>
            </div>
          `;

          const answerOverlay = document.querySelector('.answer-overlay');

          setTimeout(() => { answerOverlay.style.height = "100%"; }, 0);
          answerOverlay.style.backgroundColor = "red";
          overlay.style.backgroundColor = "red";

          answerOverlay.addEventListener(
            'click',
            () => {
              overlay.style.height = "0";
              overlay.innerHTML = "";
              setTimeout(() => overlay.style.backgroundColor = "aqua", 250);

              if (checkForWin()) {
                resetBoard();
              } else {
                const nextRange = mode === "Addition" ? 20 : 9;
                mathProblem(mode, nextRange);
              }
            },
            { once: true }
          );

          e.target.style.visibility = "hidden";
        }
      },
      { once: true }
    );
  });
}
