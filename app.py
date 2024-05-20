from flask import Flask, render_template, jsonify, request
from db_helper import create_muscle_set, create_exercises_dict, create_video_dict

# configure Flask app
app = Flask(__name__)


# query DB for muscles and exercises
video_dict = create_video_dict()
exercises_dict = create_exercises_dict()
exercises_list = list(exercises_dict.keys())
muscle_set = create_muscle_set()

# create dictionary with sets per muscle and initialise each value with 0
sets_per_muscle_dict = {}
for muscle in muscle_set:
    muscle = muscle.strip()
    sets_per_muscle_dict[muscle] = 0


@app.route("/")
def index():
    return render_template("index.html", muscle_set=sets_per_muscle_dict)


@app.route("/test")
def test():
    return render_template("test.html")


@app.route("/get_exercises")
def get_exercises():
    """Returns json of all exercises in DB if no request parameter is given,
    returns json of relevant exercises if parameter 'muscle' is provided"""
    exercises = exercises_list
    if request.args.get('muscle') and request.args.get('muscle') != "-":
        print(f"Request for {request.args.get('muscle')} received")
        muscles_list = list(exercises_dict.values())
        exercises = list(exercises_dict.keys())
        exercises_indexes = []
        for i in range(0, len(muscles_list)):
            current_muscles = muscles_list[i]
            for muscle in current_muscles:
                if request.args.get('muscle').lower() == muscle.strip().lower():
                    exercises_indexes.append(i)
        # exercises_indexes = [i for i in range(0, len(muscles_list)) if request.args.get('muscle') in muscles_list[i]]
        searched_exercises = [exercises[i] for i in exercises_indexes]
        return jsonify(searched_exercises)
    return jsonify(exercises)


@app.route("/get_progression")
def get_progression():
    """ Return progression schemes for HTML Table"""
    progression = ["Linear periodization", "Linear Progression"]
    return jsonify(progression)


@app.route("/get_muscles")
def get_muscles():
    if request.args.get('exercise'):
        try:
            return jsonify(exercises_dict[request.args.get('exercise')])
        except KeyError:
            return jsonify(['-'])
    return jsonify(list(muscle_set))


@app.route("/get_video")
def get_video():
    """Return workout videos on request"""
    if request.args.get('exercise'):

        try:
            return jsonify(video_dict[request.args.get('exercise')])
        except KeyError:
            return jsonify(['https://www.google.com'])
    return jsonify(['https://www.google.com'])


@app.route("/get_setspermuscle")
def get_sets_per_muscle():
    return sets_per_muscle_dict


@app.route("/get_exercises_dict")
def get_exercises_dict():
    return jsonify(exercises_dict)


if __name__ == "__main__":
    app.run(debug=True)

