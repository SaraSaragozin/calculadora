import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        expression = request.form['expression']
        result = eval(expression)
        return jsonify(result=str(result))
    except Exception as e:
        return jsonify(result='Error')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8712))
    app.run(debug=True, port=port)

