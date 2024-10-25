let inputScreen = document.getElementById("inputScreen");
let outputScreen = document.getElementById("outputScreen");
let scientificButtons = document.getElementById("scientific-buttons");

function appendNumber(number) {
    // Prevent leading zeroes or appending to existing function calls like cos(30)
    if (inputScreen.innerText === "0" || isScientificFunction()) {
        inputScreen.innerText = "";
    }
    inputScreen.innerText += number;
}

function appendOperator(operator) {
    // Ensure consistent spacing around operators
    if (inputScreen.innerText.slice(-1) !== ' ') {
        inputScreen.innerText += `${operator} `;
    }
}



function appendDecimal() {
    // Split the input into parts by the last operator
    const currentInput = inputScreen.innerText.split(/[\+\-\*\/\s]+/).pop();
    
    // Only append decimal if the current number doesn't have one
    if (!currentInput.includes(".")) {
        inputScreen.innerText += ".";
    }
}

function calculate() {
    try {
        let result = evalMath(inputScreen.innerText);
        outputScreen.innerText = `= ${result}`;
    } catch (error) {
        outputScreen.innerText = "Error";
    }
}

function evalMath(expression) {
    // Replace functions with Math equivalents and automatically close missing parentheses
    expression = expression.replace(/sin\((.*?)\)/g, (_, angle) => Math.sin(toRadians(angle)));
    expression = expression.replace(/cos\((.*?)\)/g, (_, angle) => Math.cos(toRadians(angle)));
    expression = expression.replace(/tan\((.*?)\)/g, (_, angle) => Math.tan(toRadians(angle)));
    expression = expression.replace(/log\((.*?)\)/g, (_, value) => Math.log10(value));
    expression = expression.replace(/sqrt\((.*?)\)/g, (_, value) => Math.sqrt(value));
    expression = expression.replace(/PI/g, Math.PI);
    expression = expression.replace(/E/g, Math.E);
    
    // Automatically close parentheses if missing
    if ((expression.match(/\(/g) || []).length > (expression.match(/\)/g) || []).length) {
        expression += ')';
    }

    // Evaluate the final expression
    return eval(expression);
}

function clearDisplay() {
    inputScreen.innerText = "0";
    outputScreen.innerText = "0";
}

function deleteLast() {
    if (inputScreen.innerText.length > 1) {
        inputScreen.innerText = inputScreen.innerText.slice(0, -1);
    } else {
        inputScreen.innerText = "0";
    }
}

function toggleScientificMode() {
    scientificButtons.classList.toggle("hidden");
}

function appendScientific(func) {
    if (inputScreen.innerText === "0") inputScreen.innerText = ""; // Clear leading zero
    inputScreen.innerText += `${func}(`;
}

function closeParenthesis() {
    inputScreen.innerText += `)`;
}

function toRadians(angle) {
    return (angle * Math.PI) / 180;
}

function isScientificFunction() {
    return /\b(sin|cos|tan|log|sqrt)\(/.test(inputScreen.innerText);
}

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (!isNaN(key)) appendNumber(key);
    else if (key === "Enter") calculate();
    else if (key === "Backspace") deleteLast();
    else if (key === "Escape") clearDisplay();
    else if (["+", "-", "*", "/"].includes(key)) appendOperator(key);
});
