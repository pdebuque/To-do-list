$(onReady);

function onReady() {
    addClickListeners();
    getTasks();
}

function addClickListeners() {
    $('#submit-task-btn').on('click', addTask);
    $('#all-content').on('click', '.mark-done-btn', toggleDone);
    $('#all-content').on('click', '.delete-task-btn', deleteTask);
}

function addTask() {
    const newTask = {
        task_name: $('#task-name-input').val(),
        importance: $('#importance-input').val(),
        due_date: $('#date-input').val(),
        done: false,
        notes: $('#notes-input').val()
    }
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    }).then(() => {
        getTasks()
    }).catch((err) => {
        console.log('could not add task ', err)
    })

    $('#task-name-input').val('');
    $('#importance-input').val('');
    $('#date-input').val('');
    $('#notes-input').val('');
}

function getTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).then((res) => {
        renderDisplay(res)
    }).catch((err) => {
        console.log('could not get tasks ', err)
    })
};

function toggleDone() {
    const id = $(this).data('id');

    $.ajax({
        type: 'PUT',
        url: `/tasks/toggle/${id}`,
        data: { data: null }
    }).then(() => {
        getTasks();
    }).catch((err) => {
        console.log('could not toggle. ', err)
    })
}


function deleteTask() {
    const id = $(this).data('id');
    Swal.fire({
        title: `Are you sure you want to delete ${id}?`,
        showCancelButton: true,
        confirmButtonText: 'Delete',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: `/tasks/${id}`
            }).then(() => {
                getTasks();
            }).catch((err) => {
                console.log('could not delete', err)
            })
        } else if (result.isDenied) {
            console.log('delete canceled');
        }
    })
}







// ------------------------------------------

const badgeArray = [null, "bg-danger", "bg-warning", "bg-secondary"] // streamlines selection of badge type on rendering

function renderDisplay(array) {
    $('#task-display').empty();
    $('#task-complete-display').empty();
    const todoArr = [];
    const completeArr = [];
    for (let task of array) { // funnel all tasks into complete and incomplete
        if (task.done) {
            completeArr.push(task)
        } else {
            todoArr.push(task)
        }
    }

    for (let task of todoArr) {
        $('#task-display').append(`
            <div class="task-container done-${task.done}">
                <div class = "task-header">
                    <div class="imp-and-name"> 
                        <span class = "importance badge rounded-pill ${badgeArray[task.importance]}">${task.importance}</span>
                        <h3 class="task-name">${task.task_name}</h3> 
                    </div>
                    <span class="task-due-date">due: ${task.to_char}</span>
                </div>
                <div class="task-notes"> 
                    <div class="notes-spacer"></div>
                    <div>${task.notes}</div>
                </div>
                <div class="task-footer">
                    <button data-id = "${task.id}" class="btn ${task.done ? "btn-danger" : "btn-success"} mark-done-btn">${task.done ? "mark as not done" : "mark as done"}</button> <button data-id = "${task.id}" class="btn btn-danger delete-task-btn">x</button>
                </div> 
            </div>
        `)
    }
    for (let task of completeArr) {
        $('#task-complete-display').append(`
            <div class="task-container done-${task.done}">
                <div class = "task-header">
                    <div class="imp-and-name"> 
                        <span class = "importance badge rounded-pill ${badgeArray[task.importance]}">${task.importance}</span>
                        <h3 class="task-name">${task.task_name}</h3> 
                    </div>
                    <span class="task-due-date">due: ${task.to_char}</span>
                </div>
                <div class="task-notes"> 
                    <div class="notes-spacer"></div>
                    <div>${task.notes}</div>
                </div>
                <div class="task-footer">
                    <button data-id = "${task.id}" class="btn ${task.done ? "btn-danger" : "btn-success"} mark-done-btn">${task.done ? "mark as not done" : "mark as done"}</button> <button data-id = "${task.id}" class="btn btn-danger delete-task-btn">x</button>
                </div> 
            </div>
        `)
    }
}
