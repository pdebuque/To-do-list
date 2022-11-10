$(onReady);

function onReady() {
    addClickListeners();
}

function addClickListeners() {
    $('#submit-task-btn').on('click', addTask);
}

function addTask() {
    const newTask = {
        task_name: $('#task-name-input').val(),
        importance: $('#importance-input').val(),
        due_date: $('#date-input').val(),
        notes: $('#notes-input').val()
    }
    $.ajax({
        type: 'PUT',
        url: '/tasks',
        data: newTask
    }).then(() => {
        getTasks()
    }).catch((err) => {
        console.log('could not add task ', err)
    })

    $('task-name-input').val('');
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
    }).catch('could not get tasks ', err)
};

function renderDisplay(array) {
    $('#task-display').empty();
    for (let task of array) {
        $('#task-display').append(`
            <div class="task-container">
                ${task.task_name}. Due ${task.due_date}. <button class="mark-done-btn">mark as done</button>
            </div>
        `)
    }
}