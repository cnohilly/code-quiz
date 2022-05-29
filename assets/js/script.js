var pageContentEl = document.querySelector("#page-content");
var timeEl = document.querySelector('#time');
var headerEl = document.querySelector('header');
var footerEl = document.querySelector('footer');
var gameTimer = 0;  // timer variable used to keep track of the time for the game
var highscores = [];    // highscores array to store all of the highscores

// Creating the questions for the quiz
var currentQuestion = 0;    // current question that the user is on
var jsQuestions = [];       // array to hold the questions for the quiz
// function to simplify adding questions to the array
var addNewQuestion = function (jsQuestion, answersArr, answerNum) {
    jsQuestions.push({
        question: jsQuestion,
        answers: answersArr,
        answerId: answerNum
    });
};
addNewQuestion("Commonly used data types DO NOT include:", ["strings", "booleans", "alerts", "numbers"], 2);
addNewQuestion("The condition in an if / else statement is enclosed with _____.", ["quotes", "curly brackets", "parentheses", "square brackets"], 2);
addNewQuestion("Arrays in JavaScript can be used to store _____.", ["numbers and strings", "other arrays", "booleans", "all of the above"], 3);
addNewQuestion("A very useful tool used during development and debugging for printing content to the debugger is:", ["JavaScript", "terminal/bash", "for loops", "console.log"], 3);

// function to add a new highscore to the array
var newHighscore = function (name, points) {
    var highscore = {
        initials: name,
        score: points
    };
    highscores.push(highscore);
    sortHighscores();
    saveHighscores();
}

// function to sort the highscores by highest score
var sortHighscores = function () {
    // Will not attempt to sort if there is only one score in the array
    if (highscores.length < 1) {
        return false;
    }
    var temp;   // temp variable to hold value while reassigning
    // var length = highscores.length;
    // for loop that will loop the length of the highscores array - 1 to avoid out of bounds errors
    for (var i = 0; i < highscores.length - 1; i++) {
        // if the score at the first index is less than the score that follows it, we swap the two high scores and start the for loop over
        if (highscores[i].score < highscores[i + 1].score) {
            temp = highscores[i];
            highscores[i] = highscores[i + 1];
            highscores[i + 1] = temp;
            i = -1;
        }
    }
}

// function to create an element and assign the desired information
// uses string for type and id and an array for classes and attributes
var createElement = function (elementType, elementText, elementId, elementClasses, elementAttributes) {
    //creates the new element using the provided type
    var newElement = document.createElement(elementType);
    // if text is passed through it will be assigned to the element
    if (elementText) {
        newElement.textContent = elementText;
    }
    // if an id is provided, will assign the id
    if (elementId) {
        newElement.setAttribute('id', elementId);
    }
    // if an array of classes is provided, will add the classes to the element
    if (elementClasses && typeof elementClasses === 'object') {
        for (var i = 0; i < elementClasses.length; i++) {
            newElement.className += " " + elementClasses[i];
        }
    }
    // if an array of attributes is provided, will add attributes to the element
    if (elementAttributes && typeof elementAttributes === 'object') {
        for (var i = 0; i < elementAttributes.length - 1; i += 2) {
            // the first index is the attribute name, the second is the attribute value
            newElement.setAttribute(elementAttributes[i], elementAttributes[i + 1]);
        }
    }
    return newElement;
};

// creates the opening screen to start the quiz game
var createStartQuizScreen = function () {
    // makes sure the header is being displayed
    headerEl.style.display = 'flex';
    // clears the content currently on the page
    pageContentEl.innerHTML = '';
    // creates a header for the title
    var headingEl = createElement('h2', "Coding Quiz Game", 'title-heading');
    pageContentEl.appendChild(headingEl);

    // creates a div element and paragraph elements to explain the quiz game
    var divEl = createElement('div', false, 'test-begin');
    var pEl = createElement('p', "Try to answer the following code-related questions within the time limit.");
    divEl.appendChild(pEl);
    pEl = createElement('p', "Keep in mind that incorrect answers will penalize your score/time by ten seconds!");
    divEl.appendChild(pEl);

    // creates the button to start the quiz game
    var btnEl = createElement('button', "Start Quiz", 'start-button');
    divEl.appendChild(btnEl);
    pageContentEl.appendChild(divEl);
    // adds an event listener to the start button
    document.querySelector('#start-button').addEventListener("click", startQuiz);
};

// continues to the next question for the quiz. if that was the last question, the timer stops and the quiz ends
var nextQuestion = function () {
    if (currentQuestion < jsQuestions.length) {
        document.querySelector('#question-heading').textContent = jsQuestions[currentQuestion].question;
        for (var i = 0; i < 4; i++) {
            document.querySelector("button[data-answer-id='" + i + "']").textContent = (i + 1) + ". " + jsQuestions[currentQuestion].answers[i];
        }
    } else {
        clearInterval(startCountdown);
        endQuiz();
    }
};

// function to start the quiz, called when the start button is clicked on the main screen
var startQuiz = function () {
    // starts the timer for the game
    startTimer();
    currentQuestion = 0;
    // clears the content currently on the page
    pageContentEl.innerHTML = '';
    // creates a header element that will be used to display questions
    var headingEl = createElement('h2', false, 'question-heading');
    pageContentEl.appendChild(headingEl);

    // creates an unordered list element and several list item elements with buttons for the question answers
    var answersEl = createElement('ul', false, 'answers-list');
    var answerListEl, buttonEl;
    for (var i = 0; i < 4; i++) {
        answerListEl = createElement('li');
        buttonEl = createElement('button', false, false, false, ['data-answer-id', i]);
        buttonEl.addEventListener('click', answerQuestion);
        answerListEl.appendChild(buttonEl);
        answersEl.appendChild(answerListEl);
    }
    pageContentEl.appendChild(answersEl);
    nextQuestion();
};

// Declaring footerTimeout to be used within the answerQuestion function
var footerTimeout;
// Called when selecting an answer
var answerQuestion = function (event) {
    var result = "";
    var answerId = event.target.getAttribute("data-answer-id");
    if (answerId != jsQuestions[currentQuestion].answerId) {
        result = "Wrong!";
        wrongAnswer();
    } else {
        result = "Correct!";
    }
    document.querySelector('#question-result').textContent = result;
    footerEl.style.display = 'block';
    clearTimeout(footerTimeout);
    footerTimeout = setTimeout(function () {
        footerEl.style.display = "none";
    }, 2000);
    currentQuestion++;
    nextQuestion();
};

var wrongAnswer = function () {
    gameTimer = gameTimer - 10;
    if (gameTimer <= 0) {
        gameTimer = 0;
    }
    timeEl.textContent = gameTimer;
};

// timer function - startCountdown needs to be global so other
// functions may access it and stop the timer
var startCountdown;
var startTimer = function () {
    gameTimer = Math.floor(jsQuestions.length * 12.5);
    timeEl.textContent = gameTimer;
    var countdown = function () {
        if (gameTimer > 0) {
            gameTimer--;
            timeEl.textContent = gameTimer;
        } else {
            clearInterval(startCountdown);
        }
    }
    startCountdown = setInterval(countdown, 1000);
};

var endQuiz = function () {
    pageContentEl.innerHTML = '';
    var headingEl = createElement('h2', "All done!", 'quiz-end-heading');
    pageContentEl.appendChild(headingEl);
    var pEl = createElement('p', "Your final score is " + gameTimer + ".");
    pageContentEl.appendChild(pEl);

    var formEl = createElement('form', false, 'quiz-end');
    var spanEl = createElement('span', "Enter initials:");
    formEl.appendChild(spanEl);
    var inputEl = createElement('input', false, false, false, ['type', 'text', 'name', 'initials', 'placeholder', 'Initials', 'maxlength', '3']);
    formEl.appendChild(inputEl);
    var buttonEl = createElement('button', "Submit", 'save-score', false, ['type', 'submit']);
    formEl.appendChild(buttonEl);
    formEl.addEventListener('submit', submitScore);
    pageContentEl.appendChild(formEl);
};

var submitScore = function (event) {
    event.preventDefault();
    var playerInitials = document.querySelector("input[name='initials']").value;
    newHighscore(playerInitials, gameTimer);
    createHighscoreScreen();
};

var createHighscoreScreen = function () {
    headerEl.style.display = 'none';
    clearInterval(startCountdown);
    pageContentEl.innerHTML = '';
    var headingEl = createElement('h2', 'High scores', 'highscore-header');
    pageContentEl.appendChild(headingEl);
    var unorderedEl, liEl, spanEl, pEl;
    // if there are any highscores saved
    if (highscores.length > 0) {
        unorderedEl = createElement('ul', false, 'highscore-list');
        liEl = createElement('li', 'Initials');
        spanEl = createElement('span', 'Score');
        liEl.appendChild(spanEl);
        unorderedEl.appendChild(liEl);
        for (var i = 0; i < highscores.length; i++) {
            liEl = createElement('li', (i + 1) + ". " + highscores[i].initials);
            spanEl = createElement('span', highscores[i].score);
            liEl.appendChild(spanEl);
            unorderedEl.appendChild(liEl);
        }
        pageContentEl.appendChild(unorderedEl);
    } else { // informs there are no highscores if none are saved
        pEl = createElement('p', 'There are currently no highscores.');
        pageContentEl.appendChild(pEl);
    }
    var divEl = createElement('div', false, 'highscore-buttons');
    var buttonEl = createElement('button', 'Back', 'back-button');
    buttonEl.addEventListener('click', createStartQuizScreen);
    divEl.appendChild(buttonEl);
    buttonEl = createElement('button', 'Clear Highscores', 'clear-highscores');
    // creates button for clearing highscores and remakes the screen
    buttonEl.addEventListener('click', function () {
        highscores = [];
        createHighscoreScreen();
        saveHighscores();
    });
    divEl.appendChild(buttonEl);
    pageContentEl.appendChild(divEl);
};

var saveHighscores = function () {
    localStorage.setItem("code-quiz-highscores", JSON.stringify(highscores));
};

var loadHighscores = function () {
    highscores = localStorage.getItem("code-quiz-highscores");
    if (!highscores) {
        highscores = [];
    } else {
        highscores = JSON.parse(highscores);
    }
};

document.querySelector('#highscore-button').addEventListener("click", createHighscoreScreen);

loadHighscores();
createStartQuizScreen();