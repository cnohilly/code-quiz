var pageContentEl = document.querySelector("#page-content");
var timeEl = document.querySelector('#time');
var headerEl = document.querySelector('header');
headerEl.style.display = 'flex';

var timer = 0; 

// Creating the questions for the quiz
var currentQuestion = 0;
var jsQuestions = [];
var addNewQuestion = function(jsQuestion,answersArr,answerNum){
   jsQuestions.push({
       question: jsQuestion,
       answers: answersArr,
       answerId: answerNum
   });
};
addNewQuestion("Commonly used data types DO NOT include:",["strings","booleans","alerts","nubmers"],2);
addNewQuestion("The condition in an if / else statement is enclosed with _____.",["quotes","curly brackets","paranthesis","square brackets"],1);


var createStartQuizScreen = function(){
    pageContentEl.innerHTML = '';
    var headerEl = document.createElement('h2');
    headerEl.setAttribute('id','title-heading');
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
};

var nextQuestion = function(){
    if (currentQuestion < jsQuestions.length){
        document.querySelector('#question-heading').textContent = jsQuestions[currentQuestion].question;
        for (var i = 0; i < 4; i++){
           document.querySelector("button[data-answer-id='" + i + "']").textContent = (i+1) + ". " + jsQuestions[currentQuestion].answers[i];
        }
    } else {
        console.log("Quiz is over!");
        clearInterval(startCountdown);
        endQuiz();
    }
};

var startQuiz = function(){
    startTimer();
    pageContentEl.innerHTML = '';
    var headerEl = document.createElement('h2');
    headerEl.setAttribute('id','question-heading');
    pageContentEl.appendChild(headerEl);

    var answersEl = document.createElement('ul');
    answersEl.setAttribute('id','answers-list');
    var answerListEl, buttonEl;
    for(var i = 0; i < 4; i++){
        answerListEl = document.createElement('li');
        buttonEl = document.createElement('button');
        buttonEl.setAttribute('data-answer-id',i);
        buttonEl.addEventListener('click',answerQuestion);
        //buttonEl.textContent = "Test";
        answerListEl.appendChild(buttonEl);
        answersEl.appendChild(answerListEl);
    }
    // answerListEl.addEventListener('click',answerQuestion);
    pageContentEl.appendChild(answersEl);
    nextQuestion();
};

var answerQuestion = function(event){
    console.log("hello");
    var answerId = event.target.getAttribute("data-answer-id");
    if (answerId != jsQuestions[currentQuestion].answerId){
        wrongAnswer();
    }
    currentQuestion++;
    nextQuestion();
};

var wrongAnswer = function(){
    timer = timer - 10;
    if (timer <= 0){
        timer = 0;
    }
    timeEl.textContent = timer;
};

// Timer function - startCountdown needs to be global so other
// functions may access it and stop the timer
var startCountdown;
var startTimer = function () {
    timer = 25;
    timeEl.textContent = timer;
    var countdown = function () {
        if (timer > 0) {
            timer--;
            timeEl.textContent = timer;
         } else {
            clearInterval(startCountdown);
        }
    }
    startCountdown = setInterval(countdown,1000);
};

var endQuiz = function(){
    pageContentEl.innerHTML = '';
    
    var headingEl = document.createElement('h2');
    headingEl.setAttribute('id','quiz-end-heading');
    headingEl.textContent = "All done!";
    pageContentEl.appendChild(headingEl);
    var pEl = document.createElement('p');
    pEl.textContent = "Your final score is " + timer + ".";
    pageContentEl.appendChild(pEl);

    var divEl = document.createElement('div');
    divEl.setAttribute('id','quiz-end');
    var spanEl = document.createElement('span');
    spanEl.textContent = "Enter initials:";
    divEl.appendChild(spanEl);
    var inputEl = document.createElement('input');
    inputEl.setAttribute('type','text');
    inputEl.setAttribute('name','initials');
    inputEl.setAttribute('placeholder','Initials');
    inputEl.setAttribute('maxlength','3');
    divEl.appendChild(inputEl);
    var buttonEl = document.createElement('button');
    buttonEl.setAttribute('id','save-score');
    buttonEl.setAttribute('type','submit');
    buttonEl.textContent = "Submit";
    divEl.appendChild(buttonEl);
    pageContentEl.appendChild(divEl);
};

var headerToggle = function(){
    if(headerEl.style.display === "flex"){
        headerEl.style.display = 'none';
    } else {
        headerEl.style.display = 'flex';
    }
};

document.querySelector('#highscore-button').addEventListener("click",headerToggle);

createStartQuizScreen();