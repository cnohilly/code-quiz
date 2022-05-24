var pageContentEl = document.querySelector("#page-content");
var timeEl = document.querySelector('#time');

var timer = 0; 

// Creating the questions for the quiz
var jsQuestions = [];
var addNewQuestion = function(jsQuestion,answersArr,answerNum){
   jsQuestions.push({
       question: jsQuestion,
       answers: answersArr,
       answerId: answerNum
   });
}
addNewQuestion("Commonly used data types DO NOT include:",["strings","booleans","alerts","nubmers"],3);
addNewQuestion("The conidion in an if / else statement is enclosed with _____.",["quotes","curly brackets","paranthesis","square brackets"],3);


var removeHeader = function(){
    console.log("In here");
    console.log(document.querySelector('header'));
    document.querySelector('header').style.display = "none";// ("display","none");
};

var createStartQuizScreen = function(){
    pageContentEl.innerHTML = '';
    var headerEl = document.createElement('h2');
    headerEl.setAttribute('id','question-heading');
    headerEl.textContent = "Coding Quiz Game";
    pageContentEl.appendChild(headerEl);

    var divEl = document.createElement('div');
    divEl.setAttribute('id','test-begin');
    var pEl = document.createElement('p');
    pEl.textContent = "Try to answer the following code-related questions within the time limit.";
    divEl.appendChild(pEl);
    pEl = document.createElement('p');
    pEl.textContent = "Keep in mind that incorrect answers will penalize your score/time by ten seconds!";
    divEl.appendChild(pEl);

    var btnEl = document.createElement('button');
    btnEl.setAttribute('id','start-button')
    btnEl.textContent = "Start Quiz";
    divEl.appendChild(btnEl);
    pageContentEl.appendChild(divEl);
    document.querySelector('#start-button').addEventListener("click",startQuiz);
}

var startQuiz = function(){
    startTimer();
    console.log("Start");
}

var wrongAnswer = function(){
    timer = timer - 10;
    if (timer <= 0){
        timer = 0;
    }
    timeEl.textContent = timer;
}

var startTimer = function () {
    timer = 15;
    timeEl.textContent = timer;
    var countdown = function () {
        if (timer > 0) {
            timer--;
            timeEl.textContent = timer;
         } else {
            clearInterval(startCountdown);
        }
    }
    var startCountdown = setInterval(countdown,1000);
}

document.querySelector('#highscore-button').addEventListener("click",removeHeader);

createStartQuizScreen();