// LOGIN LOGIC
const loginScreen = document.getElementById('login-screen');
const calculator = document.getElementById('calculator');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginText = document.getElementById('login-text');
const errorMsg = document.getElementById('error-msg');
const retryBox = document.getElementById('retry-box');
const retryNo = document.getElementById('retry-no');
const retryYes = document.getElementById('retry-yes');
const quizBox = document.getElementById('quiz-box');
const quizBtns = document.querySelectorAll('.quiz-btn');
const quizError = document.getElementById('quiz-error');

const CORRECT_PASSWORD = '191209';
let loginStep = 'password'; // password -> retry -> quiz

loginBtn.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
    const value = passwordInput.value;

    if (loginStep === 'password') {
        if (value === CORRECT_PASSWORD) {
            loginText.innerText = 'Inserisci la data di nascita di Anna per entrare';
            passwordInput.value = '';
            passwordInput.placeholder = 'GGMMAA';
            errorMsg.innerText = '';
            loginStep = 'dob';
        } else {
            showRetry();
        }
    } else if (loginStep === 'dob') {
        // Qui metti la vera data di nascita di Anna in formato GGMMAA
        const ANNA_DOB = '191209'; // CAMBIA QUESTA BRO
        if (value === ANNA_DOB) {
            unlockCalculator();
        } else {
            showRetry();
        }
    }
}

function showRetry() {
    errorMsg.innerText = 'Password errata. Provare con un altro metodo?';
    retryBox.classList.add('active');
    loginBtn.style.display = 'none';
}

retryNo.addEventListener('click', () => {
    retryBox.classList.remove('active');
    loginBtn.style.display = 'block';
    passwordInput.value = '';
    errorMsg.innerText = '';
    loginStep = 'password';
    loginText.innerText = 'Inserisci la password';
    passwordInput.placeholder = '••••••';
});

retryYes.addEventListener('click', () => {
    retryBox.classList.remove('active');
    quizBox.classList.add('active');
    errorMsg.innerText = '';
});

quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.answer === 'A') {
            unlockCalculator();
        } else {
            quizError.innerText = 'Risposta sbagliata';
            setTimeout(() => quizError.innerText = '', 2000);
        }
    });
});

function unlockCalculator() {
    loginScreen.classList.add('hidden');
    setTimeout(() => {
        calculator.classList.add('active');
    }, 400);
}

// CALCOLATRICE
const resultElement = document.getElementById('result');
const operationElement = document.getElementById('operation');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;

function updateDisplay() {
    if (currentInput.length > 9) {
        resultElement.classList.add('small');
    } else {
        resultElement.classList.remove('small');
    }
    resultElement.innerText = currentInput;
    if (operation!= null) {
        operationElement.innerText = `${previousInput} ${getDisplayOperator(operation)}`;
    } else {
        operationElement.innerText = '';
    }
    resultElement.classList.add('result-update');
    setTimeout(() => resultElement.classList.remove('result-update'), 200);
}

function getDisplayOperator(op) {
    const operators = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' };
    return operators[op] || op;
}

function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput.length >= 12) return;
    currentInput += number;
}

function chooseOperation(op) {
    if (currentInput === '') return;
    if (previousInput!== '') compute();
    operation = op;
    previousInput = currentInput;
    shouldResetScreen = true;
}

function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/':
            if (current === 0) {
                currentInput = 'Errore';
                operation = null;
                previousInput = '';
                shouldResetScreen = true;
                return;
            }
            computation = prev / current;
            break;
        case '%': computation = prev % current; break;
        default: return;
    }
    // Easter egg amore invece di napoletano
    if (computation === 14) {
        currentInput = 'Ti amo Anna';
    } else if (computation === 23 || computation === 71) {
        currentInput = 'Per sempre ❤️';
    } else {
        currentInput = Math.round(computation * 100000000) / 100000000;
        currentInput = currentInput.toString();
    }
    operation = null;
    previousInput = '';
    shouldResetScreen = true;
}

function clear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
}

function deleteNumber() {
    if (shouldResetScreen) return;
    currentInput = currentInput.toString().slice(0, -1);
    if (currentInput === '') currentInput = '0';
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.dataset.number);
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.dataset.operator);
        updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

clearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteNumber();
    updateDisplay();
});

updateDisplay();
