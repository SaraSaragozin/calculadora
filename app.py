import os
from flask import Flask, render_template, request, jsonify
import sympy as sp

app = Flask(_name_) 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        expression = request.form['expression']
        # Verificar longitud de la expresión antes de evaluarla
        if len(expression) > 17:
            return jsonify(result='Expresión demasiado larga')

        # Verificar que la expresión solo contenga caracteres válidos
        if not all(char.isdigit() or char in '+-*/(). ' for char in expression):
            return jsonify(result='Expresión contiene caracteres no válidos')

        # Evaluar la expresión de forma segura usando sympy
        result = sp.sympify(expression)
        return jsonify(result=str(result))
    except sp.SympifyError:
        return jsonify(result='Expresión inválida')
    except Exception as e:
        return jsonify(result='Error')

# Elimina el bloque "if _name_ == '_main_':"
port = int(os.environ.get("PORT", 5000))  # Utiliza el puerto predeterminado de Heroku (5000)
app.run(debug=True, host='0.0.0.0', port=port)  # Cambia host a '0.0.0.0' para que sea accesible desde cualquier dirección