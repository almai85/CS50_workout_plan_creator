import xlrd
import sqlite3

# connect to database and configure it
con = sqlite3.connect("workoutDB.db")
cur = con.cursor()


# Defining data structure
EXERCISE_INDEX = 0
MUSCLES_INDEX = 1
VIDEO_INDEX = 2

# red excel data
excel_file = xlrd.open_workbook("exercises_xls.xls")
excel_data = excel_file.sheet_by_index(0)

# interate through row
for rx in range(excel_data.nrows):
    if rx == 0:
        continue
    exercise = excel_data.row(rx)[EXERCISE_INDEX].value
    muscles = excel_data.row(rx)[MUSCLES_INDEX].value
    video = excel_data.row(rx)[VIDEO_INDEX].value
    cur.execute("INSERT INTO exercises (exercise, muscles, video) VALUES (?, ?, ?)", [exercise, muscles, video])

con.commit()
