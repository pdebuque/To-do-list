# Full-stack to-do list

## Contributors

* Paolo Debuque

## Description

This project is a classic full-stack to-do list. User can add new tasks, sort tasks, and toggle between completed and uncomplete tasks. All tasks are saved on a database


## Prerequisites

You need:
- [node.js](https://nodejs.org/en/download/)

## Installation

1. Clone the repo.
2. Open the terminal and navigate to the cloned repo.
3. Run `npm install`.
4. Create a database in postgreSQL titled 'tasks' execute 'to-do db.sql' file to create your table.

## Usage

1. In the terminal, navigate to the cloned repo
2. Run `npm start` to start the server
3. Visit localhost:5000 in your local browser

## Features

- Create a task by pressing the + button in the TASKS header. Tasks must have a name, due date, and importance (1 is high)
- Sort uncompleted tasks by importance or due date, ascending or descending
- Mark tasks completed with the check icon on the right. Completed tasks are archived in the right sidebar, and can be restored with the back arrow or deleted with the trash icon.
- Notes and options to delete or edit uncompleted tasks can be accessed with the three dot icon

## Acknowledgment

Thanks to Prime Academy for making this possible, and thanks to Shawl!