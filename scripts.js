"use-strict";

//DOM elements
const overlay = document.querySelector('.overlay');
const container = document.querySelector('.container');
const gameSquares = Array.from(document.querySelectorAll('.gamesquare'));
const playButton = document.querySelector('.play-button');

let mode;
let answerA, answerB, answerC;
let progress = -1;
let win = false;

overlay.style.height = "100%";
overlay.innerHTML = `<div class="mode-selection">
<h1 class="answer-words">Choose which operation:</h1>
<div class="operation-buttons"><p class="mode-select">Addition</p>
<p class="mode-select">Multiplication</p>
</div>
</div>`

function openScreen() {
    const buttonsArray = Array.from(document.querySelectorAll('.mode-select'));
    
    buttonsArray.forEach((item) => {
        item.addEventListener('click', (e) => {
            mode = e.target.innerText;
            overlay.innerHTML = `<div></div>`;
            overlay.style.height = "0";
            setTimeout(() => {
                overlay.innerHTML = ''
            }, 250);
    
            container.addEventListener('click', (e) => {
                console.log(e.target);
                overlay.style.height = "100%";
                if(mode === "Addition"){
                    mathProblem(mode, 20);
                }else if(mode === "Multiplication"){
                    mathProblem(mode, 9);
                }
            })
    
        })
    })
};
openScreen();

function resetBoard() {
    overlay.style.backgroundColor = "aqua"
    progress = -1;
    gameSquares.forEach((item) => {
        item.style.backgroundColor = "purple";
    })
    overlay.style.height = "100%";
    overlay.innerHTML = `<div class="mode-selection">
    <h1 class="congrats">CONGRATULATIONS!  YOU WON!</h1></br>
    <h1 class="answer-words">Play Again?</h1>
    <div class="operation-buttons"><p class="mode-select">Addition</p>
    <p class="mode-select">Multiplication</p>
    </div>
    </div>`

    openScreen();
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

function mathProblem(mode, range){
    let modeSign;
    mode === "Addition" ? modeSign = "+" : modeSign = "x";
    let answerArray = ["a) ", "b) ", "c) "];
    let numberArray = [];

    let answerIndex = Math.floor(Math.random() * 3);

    let number1 = Math.ceil(Math.random() * range);
    let number2 = Math.ceil(Math.random() * range);
    let answer;

    if(mode === "Addition"){
        answer = number1+number2;
    }else if(mode === "Multiplication") {
        answer = number1*number2;
    }

    function determineAnswer(string) {
        let randomAnswer = mode === "Multipliaction" ? number1*Math.ceil(Math.random() * range) : number1+Math.ceil(Math.random() * range) ;

        for(let i = 0; i < numberArray.length; i++){
            if(randomAnswer === numberArray[i] || randomAnswer === answer){
                randomAnswer +=1;
            }
        }
        
        if(answerArray[answerIndex] === string){
            
            if(string === "a) " && !numberArray.includes(answer)){
                answerA = answer;
            }else if(string === "b) " && !numberArray.includes(answer)){
                answerB = answer;
            }else if(string === "c) " && !numberArray.includes(answer)){
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
                ${number1} ${modeSign} ${number2} = 
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

                setTimeout(() => {answerOverlay.style.height = "100%"}, 0);
                answerOverlay.style.backgroundColor = "lightgreen";
                overlay.style.backgroundColor = "lightgreen";
                answerOverlay.addEventListener('click', (e) => {
                    overlay.style.height = "0";
                    overlay.innerHTML = "";
                    setTimeout(() => overlay.style.backgroundColor = "aqua", 250);
                    if(checkForWin()){
                        resetBoard();
                    }
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

                setTimeout(() => {answerOverlay.style.height = "100%"}, 0);
                answerOverlay.style.backgroundColor = "red";
                overlay.style.backgroundColor = "red";
                answerOverlay.addEventListener('click', (e) => {
                    overlay.style.height = "0";
                    overlay.innerHTML = "";
                    setTimeout(() => overlay.style.backgroundColor = "aqua", 250);
                    if(checkForWin()){
                        resetBoard();
                    }
                })

                e.target.style.visibility = "hidden";
            }
        })
    })

}
