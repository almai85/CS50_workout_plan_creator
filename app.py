from flask import Flask, render_template, jsonify, request, send_from_directory
from db_helper import create_muscle_set, create_exercises_dict, create_video_dict
import xlsxwriter
import time

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


@app.route("/download_workout", methods=["POST", "GET"])
def download_workout():
    """This function generates an Excel file from the workout table and sends ist to the user"""
    filename = 'test_workout_2.xlsx'
    if request.method == "POST":
        workout_plan = request.json
        exercises_plan = xlsxwriter.Workbook(filename)
        workout_sheet = exercises_plan.add_worksheet()
        row = col = 0
        bold = exercises_plan.add_format({'bold': True, 'font_size': 16})
        regular = exercises_plan.add_format({'font_size': 12})
        workout_list = ["Exercise", "Muscles Worked", "Warm Up Sets", "Working Sets", "Reps", "Progression Scheme", "Tutorial Video"]
        for element in workout_list:
            workout_sheet.write(row, col, element, bold)
            col += 1
        col = 0
        row = 1
        for exercise_number in workout_plan:
            for component in workout_plan[exercise_number]:
                workout_sheet.set_column(row, col, 30)
                workout_sheet.write(row, col, workout_plan[exercise_number][component], regular)
                col +=1
            row +=1
            col = 0
        exercises_plan.close()
        return send_from_directory("", filename)
    if request.method == "GET":
        print("Hello World")
        return send_from_directory("", filename)


if __name__ == "__main__":
    app.run(debug=True)
