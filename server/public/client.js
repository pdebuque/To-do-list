$(onReady);

function onReady() {
    addClickListeners();
    getTasks();
}

function addClickListeners() {
    $('#submit-task-btn').on('click', addTask);
    $('#all-content').on('click', '.mark-done-btn', toggleDone);
    $('#all-content').on('click', '.delete-task-btn', deleteTask);
    $('#sort-incomp').on('click', '.btn-group', sortIncomplete)
    $('#sort-comp').on('click', '.btn-group', sortComplete)
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
    console.log('in sortIncomplete()')
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
    console.log('in sortComplete()')
    // harvest from dom
    const param = $('#comp-param-sel input[name="comp-param"]:checked').val();
    const order = $('#comp-order-sel input[name="comp-order"]:checked').val();

    $.ajax({
        type: 'GET',
        url: `/tasks/complete/${param}&${order}`
    }).then((res) => {
        console.log('complete tasks received', res);
        renderIncomplete(res);
    }).catch((err) => {
        console.log('could not receive complete tasks', err)
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
    $('#task-display').empty();
    for (let task of array) {
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
                    <button data-id = "${task.id}" class="btn ${task.done ? "btn-danger" : "btn-success"} mark-done-btn">${task.done ? "mark as not done" : "mark as done"}</button> <button data-name = "${task.task_name}" data-id = "${task.id}" class="btn btn-danger delete-task-btn">x</button>
                </div> 
            </div>
        `)
    }
}

function renderComplete(array) {
    $('#task-complete-display').empty();
    for (let task of array) {
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
