const display = document.getElementById('display');
const historyList = document.getElementById('historyList');
let useRadians = false;

function append(char) {
  display.value += char;
}

function clearDisplay() {
  display.value = '';
}

function clearHistory() {
  historyList.innerHTML = '';
}

function toggleMode() {
  useRadians = document.getElementById('modeToggle').checked;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

function wrapTrigFunctions(input, funcName) {
  return input.replace(new RegExp(`${funcName}\\(([^()]*?(\\([^()]*\\)[^()]*)*?)\\)`, 'g'), (match, inner) => {
    if (useRadians) {
      return `Math.${funcName}(${inner})`;
    } else {
      return `Math.${funcName}(degToRad(${inner}))`;
    }
  });
}

function wrapInverseTrigFunctions(input, funcName) {
  return input.replace(new RegExp(`${funcName}\\(([^()]*?(\\([^()]*\\)[^()]*)*?)\\)`, 'g'), (match, inner) => {
    if (useRadians) {
      return `Math.${funcName}(${inner})`;
    } else {
      return `radToDeg(Math.${funcName}(${inner}))`;
    }
  });
}

function preprocess(input) {
  input = input.replace(/π/g, 'Math.PI');
  input = input.replace(/(\d+)(Math\.PI)/g, '$1*$2');

  input = wrapTrigFunctions(input, 'sin');
  input = wrapTrigFunctions(input, 'cos');
  input = wrapTrigFunctions(input, 'tan');

  input = wrapInverseTrigFunctions(input, 'asin');
  input = wrapInverseTrigFunctions(input, 'acos');
  input = wrapInverseTrigFunctions(input, 'atan');

  input = input.replace(/log\(/g, 'Math.log10(');
  input = input.replace(/ln\(/g, 'Math.log(');
  input = input.replace(/sqrt\(/g, 'Math.sqrt(');
  input = input.replace(/([^\s()]+)\^([^\s()]+)/g, 'Math.pow($1,$2)');

  return input;
}

function calculate() {
  try {
    const raw = display.value;
    const expression = preprocess(raw);
    const result = eval(expression);

    if (!isFinite(result) || isNaN(result)) {
      display.value = 'Undefined';
      addToHistory(`${raw} = Undefined`);
    } else {
      display.value = parseFloat(result.toFixed(10));
      addToHistory(`${raw} = ${display.value}`);
    }
  } catch (e) {
    display.value = 'Error';
    console.error(e);
  }
}

function addToHistory(entry) {
  const li = document.createElement('li');
  li.textContent = entry;
  historyList.prepend(li);
}

// Keyboard support
document.addEventListener('keydown', function (event) {
  const key = event.key;
  if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')', '^'].includes(key)) {
    append(key);
  } else if (key === 'Enter') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    display.value = display.value.slice(0, -1);
  } else if (key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
