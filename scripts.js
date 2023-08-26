"use-strict";

//DOM elements
const overlay = document.querySelector('.overlay');
const container = document.querySelector('.container');
const gameSquares = Array.from(document.querySelectorAll('.gamesquare'));
const playButton = document.querySelector('.play-button');

let answerA, answerB, answerC;
let progress = -1;
let win = false;


container.addEventListener('click', (e) => {
    console.log(e.target);
    overlay.style.height = "100%";
    mathProblem();
})


// overlay.addEventListener('click', (e) => {
//     console.log(e.target);
//     overlay.innerHTML = "";
//     overlay.style.height = "0";
// })
function resetBoard() {
    progress = -1;
    gameSquares.forEach((item) => {
        item.style.backgroundColor = "purple";
    })
}
function checkForWin() {
    let correct;
    for(let i = 0; i < gameSquares.length; i++) {
        if(gameSquares[i].style.backgroundColor === 'lightgreen'){
            correct = true;
        }else{
            correct = false;
            break;
        }
    }
    console.log("Is there a win? ", correct)
    return correct;
}

function mathProblem(){
    let answerArray = ["a) ", "b) ", "c) "];
    let numberArray = [];

    let answerIndex = Math.floor(Math.random() * 3);

    let number1 = Math.ceil(Math.random() * 7);
    let number2 = Math.ceil(Math.random() * 7);
    let answer = number1*number2;

    function determineAnswer(string) {
        let randomAnswer = number1*Math.ceil(Math.random() * 7);
        if(!numberArray.includes(randomAnswer)){
            randomAnswer = randomAnswer;
        }else{
            randomAnswer += 1;
        }

        if(answerArray[answerIndex] === string){

            if(string === "a) "){
                answerA = answer;
            }else if(string === "b) "){
                answerB = answer;
            }else if(string === "c) "){
                answerC = answer;
            }
            numberArray.push(answer);
            return answer;
            
        }else{

            if(string === "a) "){
                answerA = randomAnswer;
            }else if(string === "b) "){
                answerB = randomAnswer;
            }else if(string === "c) "){
                answerC = randomAnswer;
            }
            numberArray.push(randomAnswer);
            return randomAnswer;

        }
    };
    determineAnswer("a) ");
    determineAnswer("b) ");
    determineAnswer("c) ");

    overlay.innerHTML = "";
    overlay.innerHTML = `
        <div class="problem">
            <h1 id="problem-words">
                ${number1} x ${number2} = 
            </h1>
        </div>
        <div class="answers">
            <div class="answer-div"><h1 class="answer-words">${answerA}</h1></div>
            <div class="answer-div"><h1 class="answer-words">${answerB}</h1></div>
            <div class="answer-div"><h1 class="answer-words">${answerC}</h1></div>
        </div>
    `
    const answerDom = Array.from(document.querySelectorAll(".answer-div"));
    answerDom.forEach((item) => {
        item.addEventListener("click", (e) => {
            console.log(parseInt(e.target.innerText) === answer);
            if(parseInt(e.target.innerText) === answer){
                progress++;
                gameSquares[progress].style.backgroundColor = "lightgreen";
                overlay.innerHTML += `<div class="answer-overlay">
                <h1 class="answer-words">Correct!</h1>
                </div>`

                const answerOverlay = document.querySelector('.answer-overlay');

                answerOverlay.style.backgroundColor = "lightgreen";
                setTimeout(() => {answerOverlay.style.height = "100%"}, 0);
                answerOverlay.addEventListener('click', (e) => {
                    overlay.style.height = "0";
                    overlay.innerHTML = "";
                })
            }else{
                if(progress > 0){
                    gameSquares[progress].style.backgroundColor = "purple";
                    progress--;
                }else if(progress < 0){
                    progress = -1;
                }
                overlay.innerHTML += `<div class="answer-overlay">
                <h1 class="answer-words">Wrong!</h1>
                </div>`
                const answerOverlay = document.querySelector('.answer-overlay');

                answerOverlay.style.backgroundColor = "red";
                setTimeout(() => {answerOverlay.style.height = "100%"}, 0);
                answerOverlay.addEventListener('click', (e) => {
                    overlay.style.height = "0";
                    overlay.innerHTML = "";
                })

                e.target.style.visibility = "hidden";
            }
            console.log(progress);
            if(checkForWin()){
                resetBoard();
            };
        })
    })

}
