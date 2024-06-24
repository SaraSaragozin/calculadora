document.addEventListener('DOMContentLoaded', (event) => {
    const display = document.getElementById('display');

    window.appendCharacter = function (character) {
        const currentValue = display.value;
        if (currentValue.length >= 17) {
            return;  // No agregar más caracteres si la longitud de la expresión es 17 o más
        }

        const lastChar = currentValue.slice(-1);
        const isOperator = /[+\-*/]/.test(character);
        const lastIsOperator = /[+\-*/]/.test(lastChar);

        if (isOperator && lastIsOperator) {
            return;  // No permitir operadores consecutivos
        }

        const lastOperand = currentValue.split(/[+\-*/]/).pop();

        if (/\d/.test(character) || (character === '.' && lastOperand.indexOf('.') === -1) || /[+\-*/()]/.test(character)) {
            if (/[+\-*/()]/.test(character)) {
                if (character === '(') {
                    display.value += character;
                } else if (character === ')') {
                    const openParens = (currentValue.match(/\(/g) || []).length;
                    const closeParens = (currentValue.match(/\)/g) || []).length;
                    if (openParens > closeParens && !/[+\-*/]$/.test(currentValue)) {
                        display.value += character;
                    }
                } else if (character === '-' && (currentValue === '' || /[+\-*/(]$/.test(currentValue))) {
                    display.value += character;
                } else if (!/[+\-*/]$/.test(currentValue) && currentValue !== '') {
                    display.value += character;
                }
            } else {
                display.value += character;
            }
        }
    };

    window.clearDisplay = function () {
        display.value = '';
    };

    window.backspace = function () {
        display.value = display.value.slice(0, -1);
    };

    window.calculateResult = function () {
        const expression = display.value;
    
        try {
            // Evalúa la expresión utilizando eval
            let result = eval(expression);
    
            // Verifica si el resultado es un número
            if (typeof result === 'number' && !isNaN(result) && result !== Infinity && result !== -Infinity) {
                // Convierte el resultado a string para manipular los ceros innecesarios
                let resultString = result.toString();
    
                // Elimina ceros innecesarios al final del resultado
                resultString = resultString.includes('.') ? resultString.replace(/(\.[0-9]*[1-9])0+$|\.0+$/, "$1") : resultString;
    
                display.value = resultString;
            } else {
                throw new Error('Invalid expression');
            }
        } catch (error) {
            display.value = 'Error';
        }
    };
});
