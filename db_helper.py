import sqlite3

# connect to database and configure it
con = sqlite3.connect("workoutDB.db")
cur = con.cursor()

def create_muscle_set():
    """This function querries the DB for the muscles and exports a set of unique muscles for populationg the muscles table"""
    muscle_set = set()
    # querying database for muscles
    muscles = cur.execute("SELECT muscles from exercises")
    for exercise_rows in muscles.fetchall():
        for muscle in exercise_rows:
            current_muscles = muscle.split(",")
            for current_muscle in current_muscles:
                current_muscle = current_muscle.strip()
                if current_muscle != '':
                    muscle_set.update([current_muscle])
    return muscle_set

def create_exercises_list():
    exercise_list = []
    """This function querries the DB for the exercises"""
    exercises = cur.execute("SELECT exercise FROM exercises").fetchall()
    for exercise in exercises:
        exercise_list.append(exercise[0])
    return exercise_list