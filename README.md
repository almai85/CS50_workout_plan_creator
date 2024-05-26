# WORKOUT GENERATOR
## Video Demo:  https://youtu.be/m04L3kmvt-k
## Description:
### Foreword
Hi CS50,
As working out at the gym—and supporting/helping people get in shape—is a major part of my life, I decided to create a workout generator as my final project for the CS50 course I took between February and May 2024.

### General Description
This is a workout generator for creating gym workouts. You can add and remove exercises by clicking the respective buttons and also move the exercises by drag-and-drop. The user can also download the created workout as an Excel sheet and filter exercises based on the selected muscle group. This project uses a Flask back-end, a SQL database for storing exercise data, JavaScript for rendering the front-end, and CSS and HTML for designing the front-end. It also uses Bootstrap 5 to make the front-end more responsive and give it some basic styling. I had some basic help from ChatGPT in creating this project, especially writing some templates for my JavaScript functions. However, the entire implementation of these functions, which required some further additions, was done by myself.


### Back-End
The core of the back-end is “app.py”. Like mentioned before, the backend uses Flask to render the web pages. It makes use some Flask modules like render_template, jsonify or send_from_dictionary, which enables the possibility to download the created workout as an Excel file. The Excel file is being created with the Python module “xlsxwriter”.
The exercise data, which is necessary for creating a workout, is stored inside a file called “workoutDB.db”, which has been created with the use of sqlite3.
In order to query the DB inside the back-end, I created a python script called “db_helper.py” which is also being imported into app.py.
The back-end has several functionalities: 
-	Rendering the front-end
-	Providing the front-end with a JSON of exercise data from the DB via several GET-requests
-	Creating an Excel with the workout data and uploading it to the user via GET and POST-request. Here, a JS function makes a POST request to the backend with the exercise data from the table in JSON format. The backend creates the excel file. As soon as the creation is finished, the JS function redirects the user to the same address, but via GET method to download the created Excel. As soon as the download is finished, the created Excel file is getting deleted on the server in order so save storage. 

### 
### 
### Front-End
#### HTML + CSS
The basic appearance of the webpage is stored in “layout.html” in the templates folder. It contains a navbar, the header which includes the Bootstrap 5 files and the body which is extended by “index.html” and “construction.html”.
“Index.html” contains the main tables of the front-end. They are being dynamically rendered by some JavaScript functions.
“Construction.html” is a place holder for further pages of the web site that I will include later.
I’ve also included another CSS file called “syle.css” to fine-tune the appearance of the web-page (some other font-sizes, colors and paddings). 

#### JavaScript
The JavaScript file “script.js” contains several functionalities which have been implemented by myself with a slight help from ChatGPT. 
It contains a function to create a new row of the table and populate it with the necessary HTML data and queries the Flask backend in the process to get the required information.
The largest function here is called “getSetsPerMuscle”. It iterates thorugh the workout table each time a change takes place here and updates the table of the muscles that are being worked by the workout. 
The implementation of the function createWorkoutExcel has been a little bit tricky as I had to learn that you can not download files following a POST request and have to redirect the user as to the download via GET reuquest as soon as the POST request is finished. Timing here is very critical. 
The JavaScript file also contains a few event listeners, which watch the workout table for changes and trigger several functions as soon as they take place. 



### Additional Files
Requirements.txt contains all Python modules which have been used during the creation process. 
db_helper.py is a Python script to populate the exercise data base. I created this data base as an Excel file a long time ago. This file is also included in the submitted files. 

### Design Decisions
Rendering the muscles table directly in Java Script and not in the back end was implemented to keep the page responsive and not to spam the backend every time a change in the table takes place. 
Outsourcing the DB operations to an extra Python file was a design decision to keep app.py lean. 