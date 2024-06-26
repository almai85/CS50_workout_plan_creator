// Daten abholen, welche Übung welche Muskleln trainiert
var exercise_dict = "";
try {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_exercises_dict", true);
    xhr.send()
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            exercise_dict = JSON.parse(xhr.responseText);
        }
    }
} catch (error) {
    console.error('Failed to fetch exercise dict:', error);
}

// Initiales JSON mit trainierten Muskeln abhoeln
var sets_per_muscle_dict = "";
try {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_setspermuscle", true);
    xhr.send()
    xhr.onload = () => {
        if (xhr.readyState = 4 && xhr.status == 200) {
            sets_per_muscle_dict = JSON.parse(xhr.responseText);
        }
    }
} catch (error) {
    console.error('Failed to fets muscles set dict', error);
}


async function addRowToTable() {
    // Hizufügen von einer neuen Reihe in die Workout-Table; Aufruf durch Ereignisse
    // Zugriff auf die Tabelle über ihre ID
    var table = document.getElementById("workout-table");
    // Eine neue Zeile am Ende der Tabelle erstellen
    var newRow = table.insertRow(-1);
    newRow.draggable = true;
    // Hier können Sie so viele Zellen hinzufügen, wie benötigt werden
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);
    var cell7 = newRow.insertCell(6);
    var cell8 = newRow.insertCell(7);
    var cell9 = newRow.insertCell(8);
    // Dropdown-Menü für Exercises erstellen und Optionen vom Server laden
    var muscle_filter = document.createElement('select');
    muscle_filter.className = "form-select muscle-filter";
    muscle_filter.id = 'dropdown_muscle_filter' + (table.rows.length - 1);  // Eindeutige ID für jedes Dropdown
    var select_exercise = document.createElement('select');
    select_exercise.className = "form-select dropdown_exercise";
    select_exercise.id = 'dropdown_exercise' + (table.rows.length - 1);  // Eindeutige ID für jedes Dropdown   
    var select_progression = document.createElement('select');
    select_progression.className = "form-select";
    select_progression.id = 'dropdown_progression' + (table.rows.length - 1);  // Eindeutige ID für jedes Dropdown
    // Inhalt zu den Zellen hinzufügen
    cell1.appendChild(muscle_filter);
    loadMuscleFilter(muscle_filter.id);
    cell2.appendChild(select_exercise);
    loadExerciseOptions(select_exercise.id);
    cell3.innerHTML = '<p>-</p>';
    cell4.innerHTML = '<input class="form-control form-control-sm" type="number" autocomplete="off" placeholder="0" min="0" value="0">';
    cell5.innerHTML = '<input class="form-control form-control-sm working-sets" type="number" autocomplete="off" placeholder="0" min="0" value="0">';
    cell6.innerHTML = '<input class="form-control form-control-sm rep-input" type="text" autocomplete="off" placeholder="0 - 0">';
    cell7.appendChild(select_progression)
    loadProgressionOptions(select_progression.id)
    cell8.innerHTML = '<a>-</a>';
    cell9.innerHTML = '<td><button class="btn btn-danger">Delete</button></td>'

    // Funktion zum Laden der Übungen aus dem Flask-Backend
    async function loadExerciseOptions(selectId) {
        const response = await fetch('/get_exercises');
        const options = await response.json();
        const selectElement = document.getElementById(selectId);
        
        let optionElement = document.createElement('option');
        optionElement.textContent = '-';
        optionElement.value = '-';
        selectElement.appendChild(optionElement);

        options.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionElement.value = option;
            selectElement.appendChild(optionElement);
        });
    }

    // Funktion zum Laden des Progression-Schemas aus dem Flask-Backend
    async function loadProgressionOptions(selectId) {
        const response = await fetch('/get_progression');
        const options = await response.json();
        const selectElement = document.getElementById(selectId);
        options.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionElement.value = option;
            selectElement.appendChild(optionElement);
        });
    }

    // Funktion zum Laden der Muskeln aus dem Backend
    async function loadMuscleFilter(selectId) {
        const response = await fetch('/get_muscles');
        const options = await response.json();
        const selectElement = document.getElementById(selectId);
        let optionElement = document.createElement('option');
        optionElement.textContent = '-';
        optionElement.value = '-';
        selectElement.appendChild(optionElement);        
        options.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionElement.value = option;
            selectElement.appendChild(optionElement);
        });
    }
}

// Funktion, um die Exercise-Auswahl zu aktualisieren, wenn sich der Filter-Wert beim Muskel ändert
async function updateOptionsForSelect(selectElement, selectElement2, selectElement8, muscle) {
    try {
        const response = await fetch(`/get_exercises?muscle=${encodeURIComponent(muscle)}`);
        const options = await response.json();
        selectElement.innerHTML = ''; // Alte Optionen entfernen
        options.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionElement.value = option;
            selectElement.appendChild(optionElement);
        });
        exercise = selectElement.value;
        updateMusclesWorked(selectElement2, exercise);
        loadVideoLink(selectElement8, exercise);
    } catch (error) {
        console.error('Failed to fetch options:', error);
        // Optional: Benutzer über das Problem informieren
    }
}

// Funktion, um die Muskeln zu laden, welche durch eine Übung angesteuert werden
async function updateMusclesWorked(pElement, exercise) {
    try {
        const response = await fetch(`/get_muscles?exercise=${encodeURIComponent(exercise)}`);
        const musclesWorked = await response.json();
        pElement.innerHTML = musclesWorked; // Text einfügen
    } catch (error) {
        console.error('Failed to fetch text:', error);
        // Optional: Benutzer über das Problem informieren
    }
}

// Funktion, um Sets pro Muskel des aktuellen Workouts zu laden und die muscles worked Tabelle zu befüllen
async function getSetsPerMuscle() {
    // Parsen der Workout-Tabelle auf der Seite und Übungen + Arbeitssets
    // pro Übung definieren + bestimmen, welche Muskeln durch das aktuelle Workout angesprochen werden
    var muscles_table = document.getElementById('muscles_table');
    var workout_table = document.getElementById('workout-table');
    var exercise_json = {};
    var sets_per_muscle_dict_work = JSON.parse(JSON.stringify(sets_per_muscle_dict));
    for (var i = 2, row; row = workout_table.rows[i]; i++) {
        try {
            var exercise = row.cells[1].querySelector(".dropdown_exercise").value;
            var reps = parseInt(row.cells[4].querySelector(".working-sets").value);
            if (exercise != "-" && reps > 0) {
                if (exercise_json[exercise]) {
                    // wenn eine Übung doppelt vorkommt, muss man zunächst dafür sorgen, dass sie nicht bei den Muskeln worked
                    // doppelt gezählt wird
                    for (var j = 0, muscle; muscle = exercise_dict[exercise][j]; j++) {
                        muscle = muscle.trim();
                        sets_per_muscle_dict_work[muscle] = sets_per_muscle_dict_work[muscle] - exercise_json[exercise];
                    }
                    exercise_json[exercise] = exercise_json[exercise] + reps;
                    for (var j = 0, muscle; muscle = exercise_dict[exercise][j]; j++) {
                        muscle = muscle.trim();
                        sets_per_muscle_dict_work[muscle] = sets_per_muscle_dict_work[muscle] + exercise_json[exercise];
                    }
                } else {
                    exercise_json[exercise] = reps;
                    for (var j = 0, muscle; muscle = exercise_dict[exercise][j]; j++) {
                        muscle = muscle.trim();
                        sets_per_muscle_dict_work[muscle] = parseInt(sets_per_muscle_dict_work[muscle]) + reps;
                    }

                }
            }
        } catch (error) {
            console.error('Failed to fetch exercise from dropdown')
        }
    }

    // Muscles worked tabelle befüllen mit erstellten Daten
    for (i = 1, row; row = muscles_table.rows[i]; i++) {
        try {
            var muscle_worked = row.cells[0].innerHTML.trim();
            var sets_worked = sets_per_muscle_dict_work[muscle_worked];
            row.cells[1].innerHTML = sets_worked;
        } catch (error) {
            console.error('Failed to fetch muscles from muscles worked table')
        }
    }
}

// Funktion, um das den Link zum Tutorial-Video der Übung zu laden
async function loadVideoLink(aElement, exercise) {
    try {
        const response = await fetch(`/get_video?exercise=${encodeURIComponent(exercise)}`);
        const tutorialVideo = await response.json();
        aElement.innerHtml = 'Link';
        aElement.textContent = 'Link';
        aElement.href = tutorialVideo;
    } catch (error) {
        console.error('Failed to fetch text:', error);
        // Optional: Benutzer über das Problem informieren
    }
}

// Funktion, welche ein POST-Request mit der Workout-Tabelle an das Backend schickt, damit
// dieses ein XLS daraus erstellt und es dem User schickt
async function createWorkoutExcel() {
    const table = document.getElementById('workout-table');
    if (!table) {
        console.error('Tabelle mit der Klasse "workout-table" nicht gefunden.');
        return;
    }
    const tableData = {};
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        if (index > 0) {
            const rowData = {};

            // Zellen der aktuellen Zeile auswählen
            const cells = row.querySelectorAll('td');
    
            // Daten extrahieren und dem rowData-Objekt hinzufügen
            rowData.exercise = cells[1].querySelector("select").value;
            rowData.musclesWorked = cells[2].innerText.trim();
            rowData.warmUpSets = cells[3].querySelector('input').value.trim();
            rowData.workingSets = cells[4].querySelector('input').value.trim();
            rowData.reps = cells[5].querySelector('input').value.trim();
            rowData.progressionScheme = cells[6].querySelector('select').value.trim();
            rowData.videoLink = cells[7].querySelector('a').href.trim();
    
            // rowData dem tableData-Objekt hinzufügen
            tableData[index - 1] = rowData;
        }
    });
    const jsonData = JSON.stringify(tableData);

    // Daten über POST-Request an Backend senden
    fetch('/download_workout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == '201') {
            window.location.replace('/download_workout?filename=' + data.c);
        } else {
            alert ('An error occured while generationg the Excel file - please contact the administrator')
            throw new Error('Ein Fehler beim Generieren des Excels ist aufgetreten');
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    // Event-Listener für die Tabelle hinzufügen
    var table = document.getElementById('workout-table');
    var draggedRow = null;

    // Prüfen, ob sich der Wert der Exercise geändert hat
    table.addEventListener('change', function(event) {
        if (event.target.tagName === 'SELECT' && event.target.classList.contains("dropdown_exercise")) {
            const exercise = event.target.value;
            const row = event.target.closest('tr');
            const selectInColumn3 = row.cells[2].querySelector('p');
            const selectInColumn8 = row.cells[7].querySelector('a');
            updateMusclesWorked(selectInColumn3, exercise);
            loadVideoLink(selectInColumn8, exercise);
            getSetsPerMuscle();
        }
    });

    // Prüfen, ob sich der Filter-Wert geändert hat
    table.addEventListener('change', function(event) {
        if (event.target.tagName === 'SELECT' && event.target.classList.contains("muscle-filter")) {
            const muscle = event.target.value;
            const row = event.target.closest('tr');
            const selectInColumn2 = row.cells[1].querySelector('select');
            const selectInColumn3 = row.cells[2].querySelector('p');
            const selectInColumn8 = row.cells[7].querySelector('a');
            updateOptionsForSelect(selectInColumn2, selectInColumn3, selectInColumn8,muscle);
            getSetsPerMuscle();
        }
    });

    // Prüfen, ob sich die Anzahl der Working-Sets geändert hat und Funktion zum Ändern der Sets pro Muskel Tabelle aufrufen
    table.addEventListener('change', function(event) {
        if (event.target.tagName == 'INPUT' && event.target.classList.contains("working-sets")) {
            getSetsPerMuscle();
        }
    });
    
    // Trigger, eine Reihe in der Tabelle zu löschen
    table.addEventListener('click', function(event) {
        // Prüfen, ob das geklickte Element ein Button ist
        var target = event.target;
        if (target.tagName === 'BUTTON') {
            // Die Elternzeile des Buttons finden
            var row = target.closest('tr');
            // Die Zeile aus der Tabelle entfernen
            row.remove();
        }
        getSetsPerMuscle();
    });

    // Trigger und Funktion, die Zeilen der Tabelle zu verschieben
    table.addEventListener('dragstart', function (event) {
        // Die zu verschiebende Zeile markieren
        draggedRow = event.target.closest('tr');
        event.dataTransfer.effectAllowed = 'move';
    });
    table.addEventListener('dragover', function (event) {
        // Standardverhalten verhindern, um Drop zu ermöglichen
        event.preventDefault();
    });
    table.addEventListener('drop', function (event) {
        event.preventDefault();
        // Ermitteln, wo die Zeile abgelegt wird
        var targetRow = event.target.closest('tr');
        if (targetRow && draggedRow !== targetRow) {
            // Entscheiden, ob die Zeile vor oder nach dem Ziel eingefügt wird
            var compare = compareDocumentPosition(targetRow, draggedRow);
            if (compare & Node.DOCUMENT_POSITION_FOLLOWING) {
                targetRow.before(draggedRow);
            } else {
                targetRow.after(draggedRow);
            }
        }
    });
    function compareDocumentPosition(a, b) {
        return a.compareDocumentPosition(b);
    }
});

