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
    // Dropdown-Menü für Exercises erstellen und Optionen vom Server laden
    var select_exercise = document.createElement('select');
    select_exercise.className = "form-select";
    select_exercise.id = 'dropdown_exercise' + (table.rows.length - 1);  // Eindeutige ID für jedes Dropdown
    var select_progression = document.createElement('select');
    select_progression.className = "form-select";
    select_progression.id = 'dropdown_progression' + (table.rows.length - 1);  // Eindeutige ID für jedes Dropdown
    // Inhalt zu den Zellen hinzufügen
    cell1.appendChild(select_exercise);
    loadExerciseOptions(select_exercise.id);
    cell2.innerHTML = "Quads";
    cell3.innerHTML = "1";
    cell4.innerHTML = "3";
    cell5.innerHTML = "11";
    cell6.appendChild(select_progression)
    loadProgressionOptions(select_progression.id)
    cell7.innerHTML = '<a href="https://youtu.be/bEv6CCg2BC8?si=MqfxOisM7fd2ptcY">Link</a>';
    cell8.innerHTML = '<td><button class="btn btn-danger">Delete</button></td>'

    // Funktion zum Laden der Übungen aus dem Flask-Backend
    async function loadExerciseOptions(selectId) {
        const response = await fetch('/get_exercises');
        const options = await response.json();
        const selectElement = document.getElementById(selectId);
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
}

document.addEventListener('DOMContentLoaded', function() {
    // Event-Listener für die Tabelle hinzufügen
    var table = document.getElementById('workout-table');
    var draggedRow = null;

    table.addEventListener('click', function(event) {
        // Prüfen, ob das geklickte Element ein Button ist
        var target = event.target;
        if (target.tagName === 'BUTTON') {
            // Die Elternzeile des Buttons finden
            var row = target.closest('tr');
            // Die Zeile aus der Tabelle entfernen
            row.remove();
        }
    });

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
