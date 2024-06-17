document.addEventListener('DOMContentLoaded', (event) => {
    const display = document.getElementById('display');

    window.appendCharacter = function(character) {
        const currentValue = display.value;
        if (currentValue.length >= 20) {
            return;  // No agregar más caracteres si la longitud de la expresión es 20 o más
        }

        const lastOperand = currentValue.split(/[+\-*/]/).pop();

        // Verificar si el carácter es un dígito, un punto decimal, una operación matemática, o un paréntesis
        if (/\d/.test(character) || (character === '.' && lastOperand.indexOf('.') === -1) || /[+\-*/()]/.test(character)) {
            const integerDigits = lastOperand.split('.')[0].length;
            const decimalDigits = lastOperand.split('.')[1] ? lastOperand.split('.')[1].length : 0;

            if (/[+\-*/()]/.test(character)) {
                // Si el carácter es una operación matemática o un paréntesis
                if (character === '(') {
                    // Permitir el paréntesis de apertura siempre
                    display.value += character;
                } else if (character === ')') {
                    // Permitir el paréntesis de cierre si ya hay un paréntesis de apertura sin cerrar
                    const openParens = (currentValue.match(/\(/g) || []).length;
                    const closeParens = (currentValue.match(/\)/g) || []).length;
                    if (openParens > closeParens && !/[+\-*/]$/.test(currentValue)) {
                        display.value += character;
                    }
                } else if (character === '-' && (currentValue === '' || /[+\-*/(]$/.test(currentValue))) {
                    // Permitir el signo negativo si es el primer carácter o después de un operador o un paréntesis de apertura
                    display.value += character;
                } else if (!/[+\-*/]$/.test(currentValue) && currentValue !== '') {
                    // Permitir operaciones matemáticas si no es el último carácter y el valor actual no está vacío
                    display.value += character;
                }
            } else if (lastOperand.includes('.')) {
                // Si ya hay un punto decimal en el último operando, verificar los dígitos decimales
                if (decimalDigits < 5) {
                    display.value += character;
                }
            } else {
                // Si no hay punto decimal en el último operando, verificar los dígitos enteros
                if (integerDigits < 9 || (integerDigits < 10 && character === '.')) {
                    display.value += character;
                }
            }
        }
    };

    window.clearDisplay = function() {
        display.value = '';
    };

    window.backspace = function() {
        display.value = display.value.slice(0, -1);
    };

    window.calculateResult = function() {
        const expression = display.value;
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `expression=${encodeURIComponent(expression)}`,
        })
        .then(response => response.json())
        .then(data => {
            // Redondear el resultado a 10 dígitos
            let result = parseFloat(data.result);
            if (!isNaN(result)) {
                if (result.toString().length > 10) {
                    result = result.toPrecision(10);
                }
                display.value = result;
            } else {
                display.value = 'Error';
            }
        })
        .catch(error => {
            display.value = 'Error';
        });
    };
});
