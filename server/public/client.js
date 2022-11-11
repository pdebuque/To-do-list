$(onReady);

function onReady() {
    addClickListeners();
    getTasks();
}

function addClickListeners() {
    $('#submit-task-btn').on('click', addTask);
    $('#task-display').on('click', '.mark-done-btn', toggleDone);
    $('#task-display').on('click', '.delete-task-btn', deleteTask);
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

    $.ajax({
        type: 'DELETE',
        url: `/tasks/${id}`
    }).then(() => {
        getTasks();
    }).catch((err) => {
        console.log('could not delete', err)
    })
}







// ------------------------------------------

const badgeArray = [null, "bg-danger", "bg-warning", "bg-secondary"] // streamlines selection of badge type on rendering

function renderDisplay(array) {
    $('#task-display').empty();
    for (let task of array) {
        $('#task-display').append(`
            <div class="task-container done-${task.done}">
                <div class = "task-header">
                    <span class = "badge rounded-pill ${badgeArray[task.importance]}">${task.importance}</span>
                    <h3 class="task-name">${task.task_name}</h3> 
                    <span class="task-due-date">due: ${task.to_char}</span>
                </div>
                <div class="task-notes"> 
                    ${task.notes}
                </div>
                <div class="task-footer">
                    <button data-id = "${task.id}" class="btn ${task.done ? "btn-danger" : "btn-success"} mark-done-btn">${task.done ? "mark as not done" : "mark as done"}</button> <button data-id = "${task.id}" class="btn btn-danger delete-task-btn">x</button>
                </div> 
            </div>
        `)
    }
}