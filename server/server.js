const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('server/public'));

const tasksRouter = require('./routes/tasksRouter');
app.use('/tasks', tasksRouter);



app.listen(PORT, () => {
    console.log(`listening at port `, PORT)
})