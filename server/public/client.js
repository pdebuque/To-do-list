$(onReady);

function onReady() {
    addClickListeners();
    getTasks();
}

function addClickListeners() {
    $('#submit-task-btn').on('click', addTask); // submit tasks to task list
    $('#all-content').on('click', '.mark-done-box', toggleComplete); // when user clicks the mark done button in incomplete tasks, fire a put request to update its date_completed in db
    $('#all-content').on('click', '.submit-edit-btn', editTask)
    $('#all-content').on('click', '.comp-delete-btn', deleteTask)
    $('#all-content').on('click', '.comp-toggle-btn', toggleComplete)
    $('#all-content').on('click', '.delete-task-btn', deleteTask);
    $('#sort-incomp').on('click', '.btn-group', sortIncomplete);
    $('#sort-comp').on('click', '.btn-group', sortComplete);
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

function toggleComplete() {
    console.log('in toggleComplete');
    const id = $(this).data('id');
    console.log(id, $(this).data('done'));
    // if the task is complete, do refresh it 
    if ($(this).data('done')) {
        refreshTask(id)
    } else {
        completeTask(id)
    }
}
// save the date completed
function completeTask(id) {
    console.log('in completeTask');
    const now = new Date().toDateString();
    // const id = $(this).data('id');
    $.ajax({
        type: 'PUT',
        url: `/tasks/complete/${id}`,
        data: {
            date: now
        }
    }).then(() => {
        console.log('completed task');
        getTasks();
    }).catch((err) => {
        console.log('could not complete task', err)
    })
}

function refreshTask(id) {
    console.log('in refreshTask');
    // const id = $(this).data('id');
    $.ajax({
        type: 'PUT',
        url: `/tasks/refresh/${id}`,
        data: {
            data: null
        }
    }).then(() => {
        console.log('refreshed task');
        getTasks();
    }).catch((err) => {
        console.log('could not refresh task', err)
    })
}

function deleteTask() {
    const id = $(this).data('id');
    const name = $(this).data('name');
    Swal.fire({
        title: `Are you sure you want to delete '${name}'?`,
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

// get requests for sorting
function sortIncomplete() {
    // harvest from dom
    const param = $('#incomp-param-sel input[name="incomp-param"]:checked').val();
    const order = $('#incomp-order-sel input[name="incomp-order"]:checked').val();
    console.log('incomplete: data to send: ', param, order)

    $.ajax({
        type: 'GET',
        url: `/tasks/incomplete/${param}&${order}`
    }).then((res) => {
        console.log('incomplete tasks received', res);
        renderIncomplete(res);
    }).catch((err) => {
        console.log('could not receive incomplete tasks', err)
    })
}

function sortComplete() {
    // harvest from dom
    const param = $('#comp-param-sel input[name="comp-param"]:checked').val();
    const order = $('#comp-order-sel input[name="comp-order"]:checked').val();

    $.ajax({
        type: 'GET',
        url: `/tasks/complete/${param}&${order}`
    }).then((res) => {
        console.log('complete tasks received', res);
        renderComplete(res);
    }).catch((err) => {
        console.log('could not receive complete tasks', err)
    })
}

function editTask() {
    console.log('in editTask()')
    const id = $(this).data('id');
    const updatedTask = {
        task_name: $(`#task-name-input-${id}`).val() || $(this).data('task_name'),
        importance: $(`#task-importance-input-${id}`).val() || $(this).data('importance'),
        due_date: $(`#date-input-${id}`).val() || $(this).data('due_date'),
        notes: $(`#notes-input-${id}`).val()
    };

    $.ajax({
        type: 'PUT',
        url: `/tasks/edit/${id}`,
        data: updatedTask
    }).then(() => {
        getTasks()
    }).catch((err) => {
        console.log('could not update task', err)
    })
}


// ------------------ render ------------------------

const badgeArray = [null, "bg-danger", "bg-warning", "bg-secondary"] // streamlines selection of badge type on rendering

function renderDisplay(array) {
    const todoArr = [];
    const completeArr = [];
    for (let task of array) { // funnel all tasks into complete and incomplete
        if (task.done) {
            completeArr.push(task)
        } else {
            todoArr.push(task)
        }
    }

    renderIncomplete(todoArr); // separate out render functions to better work with sorting
    renderComplete(completeArr);
}

function renderIncomplete(array) {
    console.log('in renderIncomplete()');
    $('#task-display').empty();
    for (let task of array) {
        $('#task-display').append(`
        <div class="task-container">
            <div class="task-container-min">
                <div class="task-container-front">
                    <span class="task-importance task-importance-${task.importance}">${task.importance}</span>
                    <a class="btn" data-bs-toggle="collapse" href="#task-notes-${task.id}" role="button"
                         aria-expanded="false" aria-controls="collapseButton">
                        <img class="task-three-dots-icon" src="images/three dots.png" alt="three dots">
                    </a>
                    <span class="task-name">${task.task_name}</span>
                </div>
                <div class="task-container-back">
                    <span class="task-due-date">due ${task.due_date_pretty}</span>
                    <img src="images/complete.png" alt="complete icon" class="mark-done-box" data-done="false" data-id="${task.id}" id = "done-box-${task.id}">
                    
                </div>
            </div>
            <div class="collapse" id="task-notes-${task.id}">
                <div class="task-notes-flex">
                    <div class="task-notes">
                        ${task.notes ? task.notes : '<i> no notes! </i>'}
                    </div>
                    <img class="edit-btn" data-bs-toggle="collapse" data-id="${task.id}" data-task_name="${task.task_name}" data-due_date="${task.due_date}" data-notes = "${task.notes}" href="#edit-inputs-${task.id}" src="images/edit.png" alt="edit icon">
                    <img src="images/delete.png" data-id="${task.id}" data-name="${task.task_name}" alt="delete icon" class="delete-task-btn">
                </div>
            </div>
            <div class="collapse" id="edit-inputs-${task.id}">
            <div class="card card-body">
            <form id="edit-inputs-form-${task.id} class="row g-3" novalidate>
                <div class="col-lg-6">
                    <label for="task-name-input-${task.id}" class="form-label">Edit task name</label>
                    <input type="text" class="form-control" id="task-name-input-${task.id}" placeholder="if empty, '${task.task_name}'">
                </div>
                <div class="invalid-feedback">
                    Please enter a task name.
                </div>
                <div class="col-lg-2">
                    <div class="task-input dropdown">
                        <label for="importance-input-${task.id}" class="form-label">Importance</label>
                        <select class="form-control" id="importance-input-${task.id}" required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                </div>
                <div class="col-lg-3">
                    <label for="date-input-${task.id}" class="form-label">Date</label>
                    <input type="date" class="form-control" id="date-input-${task.id}">
                </div>
                <div class="col-lg-7">
                    <label for="notes-input-${task.id}" class="form-label">Notes</label>
                    <textarea class="form-control" id="notes-input-${task.id}" rows="3"
                        placeholder="leave empty to delete notes"></textarea>
                </div>
                <div class="col-lg-5"></div>
                <div class="col-lg-10">
                    <button id="submit-task-btn-${task.id}" type="submit" class="btn btn-primary submit-edit-btn" data-id="${task.id}" data-task_name="${task.task_name}" data-importance="${task.importance}" data-due_date="${task.due_date}" data-notes = "${task.notes}">Submit</button>
                    <button id="cancel-task-btn-${task.id}" type="submit" class="btn btn-secondary"
                        data-bs-toggle="collapse" href="#edit-inputs-${task.id}" aria-expanded="false"
                        aria-controls="collapseButton">Cancel</button>

                </div>
        </div>
            </div>
        </div>

`)
    }
}

function renderComplete(array) {
    console.log('in renderComplete()');
    $('#task-complete-display').empty();
    for (let task of array) {
        $('#task-complete-display').append(`
        <div class="comp-container">
            <div class="comp-min">
                <div class="comp-front">
                    <div class="grey"></div>
                    <a class="btn" data-bs-toggle="collapse" href="#comp-notes-${task.id}" role="button"
                        aria-expanded="false" aria-controls="collapseButton">
                        <img class="comp-three-dots-icon" src="images/three dots.png" alt="three dots">
                    </a>
                    <div class="comp-name">
                        ${task.task_name}
                    </div>
                </div>
                <div class="comp-back">
                    <img src="images/incomplete.png" alt="incomplete icon" data-done = "${task.done}" data-id="${task.id}" class="comp-toggle-btn">
                    <img src="images/delete.png" alt="delete icon" data-name="${task.task_name}" data-id = "${task.id}" class="comp-delete-btn">
                </div>
            </div>
            <div class="collapse" id="comp-notes-${task.id}">
                <div class="comp-notes-flex">
                    <div class="comp-notes">
                        completed ${task.date_completed_pretty}
                    </div>

                </div>
            </div>
        </div>
            `)
    }
}
