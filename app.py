from flask import Flask, render_template, jsonify
from db_helper import create_muscle_set, create_exercises_list

# configure Flask app
app = Flask(__name__)

# query DB for muscles and exercises
muscle_set = create_muscle_set()
exercises_list = create_exercises_list()

@app.route("/")
def index():
    return render_template("index.html", muscle_set=muscle_set)

@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/get_exercises")
def get_exercises():
    exercises = exercises_list
    return jsonify(exercises)

@app.route("/get_progression")
def get_progression():
    progression = ["Linear periodization", "Linear Progression"]
    return jsonify(progression)


if __name__ == "__main__":
    app.run(debug=True)

# SQL-Abfrage nach Muskel: SELECT * FROM exercises WHERE muscles LIKE '%biceps%';