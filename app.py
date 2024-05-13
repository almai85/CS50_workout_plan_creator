from flask import Flask, render_template, jsonify, request
from db_helper import create_muscle_set, create_exercises_dict

# configure Flask app
app = Flask(__name__)


# query DB for muscles and exercises
exercises_dict = create_exercises_dict()
exercises_list = list(exercises_dict.keys())
muscle_set = create_muscle_set()


@app.route("/")
def index():
    return render_template("index.html", muscle_set=muscle_set)


@app.route("/test")
def test():
    return render_template("test.html")


@app.route("/get_exercises")
def get_exercises():
    """Returns json of all exercises in DB if no request parameter is given,
    returns json of relevant exercises if parameter 'muscle' is provided"""
    exercises = exercises_list
    if request.args.get('muscle'):
        print(f"Request for {request.args.get('muscle')} received")
        muscles_list = list(exercises_dict.values())
        exercises = list(exercises_dict.keys())
        exercises_indexes = [i for i in range(0, len(muscles_list)) if request.args.get('muscle') in muscles_list[i]]
        searched_exercises = [exercises[i] for i in exercises_indexes]
        return jsonify(searched_exercises)
    return jsonify(exercises)


@app.route("/get_progression")
def get_progression():
    progression = ["Linear periodization", "Linear Progression"]
    return jsonify(progression)


@app.route("/get_muscles")
def get_muscles():
    return jsonify(list(muscle_set))


if __name__ == "__main__":
    app.run(debug=True)

