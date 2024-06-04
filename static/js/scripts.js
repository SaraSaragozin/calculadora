document.addEventListener('DOMContentLoaded', (event) => {
    const display = document.getElementById('display');

    window.appendCharacter = function(character) {
        display.value += character;
    }

    window.clearDisplay = function() {
        display.value = '';
    }

    window.backspace = function() {
        display.value = display.value.slice(0, -1);
    }

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
            display.value = data.result;
        })
        .catch(error => {
            display.value = 'Error';
        });
    }
});
