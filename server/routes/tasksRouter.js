// const { query } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//GET
// get all rows from the database
router.get('/', (req, res) => {
    const queryText = `SELECT id, task_name, importance, to_char(due_date, 'Mon DD, YYYY'), done, notes FROM tasks ORDER BY importance`;
    pool.query(queryText)
        .then((result) => {
            // console.log('successful get request');
            // console.log(result.rows)
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('could not get tasks')
            res.sendStatus(500)
        })
})

// get all unfinished task rows sorted by given parameter
router.get('/incomplete/:param&:order', (req, res) => {
    console.log('received sort unfinished request', req.params);
    const queryText = `SELECT id, task_name, importance, to_char(due_date, 'Mon DD, YYYY'), done, notes FROM tasks WHERE done=false ORDER BY $1 $2`
    pool.query(queryText, [req.params.param, req.params.order])
        .then((result) => {
            console.log('got incomplete tasks');
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('could not get incomplete tasks')
            res.sendStatus(500)
        })
})

// get all finished task rows sorted by given paramter
router.get('/complete/:param&:order', (req, res) => {
    console.log('received sort complete request', req.params);
    const queryText = `SELECT id, task_name, importance, to_char(due_date, 'Mon DD, YYYY'), done, notes FROM tasks WHERE done=true ORDER BY $1 $2`
    pool.query(queryText, [req.params.param, req.params.order])
        .then((result) => {
            console.log('got complete tasks');
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('could not get complete tasks')
            res.sendStatus(500)
        })
})


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