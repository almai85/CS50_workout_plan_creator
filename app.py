from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/get_exercises")
def get_exercises():
    exercises = ["Bench-Press", "Squats", "Plank", "Cable Flyes"]
    return jsonify(exercises)

@app.route("/get_progression")
def get_progression():
    progression = ["Linear periodization", "Linear Progression"]
    return jsonify(progression)

if __name__ == "__main__":
    app.run(debug=True)