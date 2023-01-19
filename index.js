const express = require('express');

const app = express();
const tasks = [];
let currentMaxId = 0;

// Task format
// {
//     id: number,
//     description: string,
//     done: boolean,
// }

// tasks.push({   
//         id: 1,
//         description: "do the job",
//         done: false    
//     }
// );

// Calling the express.json() method for parsing
app.use(express.json());

//get tasks according to query
function getAllTasks(req, res, next) {
    const {id,description,done} = req.query;

    //check the query key is valid or not
    if(!Object.keys(req.query).every((item) => {
       return item === "id" || item === "description" || item === "done";
    })) {
        res.status(404).json("incorrect query key");
    }

    if(id){
        const index = findTaskByID(parseInt(id));
        (index != -1) ? res.json(tasks[index]): res.json("task not found!");
        return;
    } else if (description) {
        let filteredTasks = tasks.filter((task) => task.description === description);
        if(done) filteredTasks = filteredTasks.filter((task) => task.done.toString() === done);
        filteredTasks.length ? res.json(filteredTasks) : res.json("task not found");
    } else if (done) {
        let filteredTasks = tasks.filter((task) => task.done.toString() === done);
        if(description) filteredTasks = filteredTasks.filter((task) => task.description === description);
        filteredTasks.length ? res.json(filteredTasks) : res.json("task not found");
    }else {
        tasks.length ? res.json(tasks) : res.json("task list is empty");
    }
}

//find Task by ID, return -1 if not found
function findTaskByID (id) {
    // return id && tasks.find((task) => task.id === id);
    if(id) {
        return tasks.findIndex((task) => task.id === id);    
    } else {
        return -1;
    }
}

//find task by description, return -1 if not found
function findTaskByDescription (description) {
    // return id && tasks.find((task) => task.id === id);
    if(description) {
        return tasks.findIndex((task) => task.description === description);    
    } else {
        return -1;
    }
}

function getTasksById(req, res, next) {
    const {id} = req.params;
    const index = findTaskByID(parseInt(id));
    console.log(index);
    if (index != -1){
        res.json(tasks[index]);
    }else{
        res.json("task not found!");
    }
}

function updateTasksById(req, res) {
    const {id} = req.params;
    const {description, done} = req.body;
    const index = findTaskByID(parseInt(id));
    if (index != -1){
        //update the task
        const task = tasks[index];
        task.description = description ?? task.description;
        task.done = done??task.done;
        tasks[index] = task;
        res.json(tasks[index]);
    }else{
        res.json("task not found!");
    }
}

function createNewTaskByDescription(req, res) {
    const {description} = req.body;
    //check whether this task with the same descrition exists already
    const index = findTaskByDescription(description);
    if (index != -1){
        //return the existing task
        res.json(tasks[index]);
    }else{
    //create a new task, id start from 1
        const newId = currentMaxId + 1;
        const newTask = {
            id: newId,
            description: description,
            done: false
        }
        tasks.push(newTask);
        currentMaxId++;
        res.json(newTask);
    }
}

function deleteTask (req,res){
    const {id} = req.params;
    const index = findTaskByID(parseInt(id));
    if (index != -1){
        //delete the task
        tasks.splice(index,1);
        res.json(`task ${id} deleted`);
    }else{
        // res.json(`task ${id} deleted`);
        res.json("task not found!");
    }
}

// POST /tasks: create a new task
app.post('/tasks',createNewTaskByDescription);

//GET /tasks: get all tasks(allow query params for filtering) 
app.get('/tasks', getAllTasks);

//GET /tasks/:id   get task by id
app.get('/tasks/:id', getTasksById);

//PUT /tasks/:id  update task by id
app.put('/tasks/:id', updateTasksById);

//delete a task
app.delete('/tasks/:id', deleteTask);

app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log('sever listening on port 3000');
})