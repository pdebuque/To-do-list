// const { query } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//GET
// get all rows from the database
router.get('/', (req, res) => {
    const queryText = `SELECT 
                        id, 
                        task_name, 
                        importance, 
                        due_date,
                        to_char(due_date, 'Mon DD, YYYY') AS due_date_pretty, 
                        to_char(date_completed, 'Mon DD, YYYY') AS date_completed_pretty, 
                        done, 
                        notes 
                        FROM tasks 
                        ORDER BY importance`;
    pool.query(queryText)
        .then((result) => {
            // console.log('successful get request');
            // console.log(result.rows)
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('could not get tasks', err)
            res.sendStatus(500)
        })
})

// get all unfinished task rows sorted by given parameter
router.get('/incomplete/:param&:order', (req, res) => {
    console.log('received sort unfinished request', req.params);
    const queryText = `SELECT 
                        id, 
                        task_name, 
                        importance, 
                        due_date,
                        to_char(due_date, 'Mon DD, YYYY') AS due_date_pretty, 
                        done, 
                        to_char(date_completed, 'Mon DD YYYY') AS date_completed_pretty, 
                        notes 
                        FROM tasks 
                        WHERE done=false 
                        ORDER BY ${req.params.param} ${req.params.order};`
    pool.query(queryText)
        .then((result) => {
            console.log('got incomplete tasks');
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('could not get incomplete tasks', err)
            res.sendStatus(500)
        })
})

// get all finished task rows sorted by given paramter
router.get('/complete/:param&:order', (req, res) => {
    console.log('received sort complete request', req.params);
    const queryText = `SELECT id, task_name, importance, to_char(date_completed, 'Mon DD, YYYY') AS date_completed_pretty, done, notes FROM tasks WHERE done=true ORDER BY ${req.params.param} ${req.params.order}`
    pool.query(queryText)
        .then((result) => {
            console.log('got complete tasks');
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('could not get complete tasks', err)
            res.sendStatus(500)
        })
})

// POST
// add a new task
router.post('/', (req, res) => {
    const newTask = req.body;
    const queryText = `INSERT INTO tasks ("task_name", "importance", "due_date", "done", "notes")
    VALUES ($1, $2, $3, false, $4)`
    pool.query(queryText, [newTask.task_name, newTask.importance, newTask.due_date, newTask.notes])
        .then(() => {
            res.sendStatus(201)
        })
        .catch((err) => {
            console.log('could not post task ', err)
            res.sendStatus(500)
        })
})

//PUT
// update task to DONE
router.put('/toggle/:id', (req, res) => {
    const queryText = `UPDATE tasks SET done = NOT done WHERE id = $1`;
    pool.query(queryText, [req.params.id])
        .then(() => {
            console.log('successfully toggled done')
            res.sendStatus(202)
        })
        .catch((err) => {
            console.log('could not update ', err)
            res.sendStatus(500)
        })
})

// complete task: save date completed
router.put('/complete/:id', (req, res) => {
    const queryText = `UPDATE tasks SET done = true, date_completed = $1 WHERE id = $2`
    pool.query(queryText, [req.body.date, req.params.id])
        .then(() => {
            console.log('successfully stored complete date');
            res.sendStatus(202);
        })
        .catch((err) => {
            console.log('date save failed', err);
            res.sendStatus(500)
        })
})

// refresh task: make a task active again
router.put('/refresh/:id', (req, res) => {
    const queryText = `UPDATE tasks SET done = false,
    date_completed = NULL WHERE id = $1`
    pool.query(queryText, [req.params.id])
        .then(() => {
            console.log('successfully refreshed task');
            res.sendStatus(202)
        })
        .catch((err) => {
            console.log('could not refresh task', err)
            res.sendStatus(500)
        })
})

// edit task


router.put('/edit/:id', (req, res) => {
    console.log('editting a task:', req.body);
    const updatedTask = req.body
    const queryText = `UPDATE tasks
                        SET 
                        task_name = $1,
                        importance = $2,
                        due_date = $3,
                        notes = $4
                        WHERE id = $5
                        `
    pool.query(queryText, [updatedTask.task_name, updatedTask.importance, updatedTask.due_date, updatedTask.notes, req.params.id])
        .then(() => {
            console.log('successfully edited task');
            res.sendStatus(202)
        })
        .catch((err) => {
            console.log('could not edit task', err);
            res.sendStatus(500);
        })
})


// DELETE
// delete a task
router.delete('/:id', (req, res) => {
    const queryText = `DELETE FROM tasks WHERE id = $1`;
    pool.query(queryText, [req.params.id])
        .then(() => {
            console.log('delete successful');
            res.sendStatus(202)
        })
        .catch((err) => {
            console.log('could not delete', err)
            res.sendStatus(500)
        })
})

module.exports = router;