const express = require("express");

const app = express();
const tasks = [];
let currentMaxId = 0;

// Task format
// {
//     id: number,
//     description: string,
//     done: boolean,
// }

app.use(cors);

// Calling the express.json() method for parsing
app.use(express.json());

// CORS  Cross Origin Resource Sharing
function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
}

//get all tasks or according to description
function getAllTasks(req, res, next) {
  //   const { id, description, done } = req.query;
  const { description } = req.query;
  console.log(req.query);
  let filteredTasks = tasks;

  //we don't check the query is valid or not, if not, just return empty task
  //check the query key is valid or not
  /*
  if (
    !Object.keys(req.query).every((item) => {
      return item === "id" || item === "description" || item === "done";
    })
  ) {
    res.status(404).json("incorrect query key");
    return;
  }
  */

  /*
  if (id) {
    const index = findTaskByID(parseInt(id));
    index != -1 ? res.json(tasks[index]) : res.json("task not found!");
    return;
  } else if (description) {
    let filteredTasks = tasks.filter(
      (task) => task.description === description
    );
    //don't write if statement in one line
    if (done)
      filteredTasks = filteredTasks.filter(
        (task) => task.done.toString() === done
      );
    filteredTasks.length ? res.json(filteredTasks) : res.json("task not found");
  } else if (done) {
    let filteredTasks = tasks.filter((task) => task.done.toString() === done);
    if (description)
      filteredTasks = filteredTasks.filter(
        (task) => task.description === description
      );
    filteredTasks.length ? res.json(filteredTasks) : res.json("task not found");
  } else {
    tasks.length ? res.json(tasks) : res.json("task list is empty");
  }
  */

  if (description) {
    filteredTasks = tasks.filter((task) =>
      task.description.includes(description)
    );
  }

  res.json(filteredTasks);
}

//find Task by ID, return undefined if not found
function findTaskByID(id) {
  // return id && tasks.find((task) => task.id === id);
  if (!id) {
    return undefined;
  }

  //return undefined if not found
  return tasks.find((task) => task.id === id);
}

//find task by description, return undefined if not found
function findTaskByDescription(description) {
  if (!description) {
    return undefined;
  }

  //return undefined if not found
  return tasks.find((task) => task.description === description);
}

function getTasksById(req, res, next) {
  const { id } = req.params;
  const task = findTaskByID(parseInt(id));
  if (!task) {
    res.status(404).json({ error: "task not found" });
    return;
  } else {
    res.json(task);
  }
}

function updateTasksById(req, res) {
  const { id } = req.params;
  const { description, done } = req.body;
  const task = findTaskByID(parseInt(id));
  if (!task) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  //update the task
  task.description = description ?? task.description;
  if (done != null) {
    //!! convert anthing to boolean
    task.done = !!done;
  }

  //this way, we cannot modify the done to false
  //   task.done = done ?? task.done;
  res.json(task);
}

function createNewTaskByDescription(req, res) {
  const { description } = req.body;
  //check whether this task with the same descrition exists already
  //this is add workload to the server, so we don't check this
  const newTask = {
    id: ++currentMaxId,
    description,
    //= description: description
    done: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask); //add status code after teaching
}

function deleteTask(req, res) {
  const { id } = req.params;
  const index = tasks.findIndex((task) => task.id === parseInt(id));
  if (index === -1) {
    res.status(404).json({ error: "task not found" });
  }
  //delete the task
  tasks.splice(index, 1);
  res.sendStatus(204); // No Content add after teaching
}

// POST /tasks: create a new task
app.post("/tasks", createNewTaskByDescription);

//GET /tasks: get all tasks(allow query params for filtering)
app.get("/tasks", getAllTasks);

//GET /tasks/:id   get task by id
app.get("/tasks/:id", getTasksById);

//PUT /tasks/:id  update task by id
app.put("/tasks/:id", updateTasksById);

//delete a task
app.delete("/tasks/:id", deleteTask);

app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log("sever listening on port 3000");
});
