//sometimes they name the file this way.
//tasks.controller.js

const tasks = [];
let currentMaxId = 0;

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

const getAllTasks = (req, res, next) => {
  //   const { id, description, done } = req.query;
  const { description } = req.query;
  let filteredTasks = tasks;

  if (description) {
    filteredTasks = tasks.filter((task) =>
      task.description.includes(description)
    );
  }

  res.json(filteredTasks);
};

const getTaskById = (req, res, next) => {
  const { id } = req.params;
  const task = findTaskByID(parseInt(id));
  if (!task) {
    res.status(404).json({ error: "task not found" });
    return;
  } else {
    res.json(task);
  }
};

const updateTaskById = (req, res) => {
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
};

const addTask = (req, res) => {
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
};

const deleteTaskById = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((task) => task.id === parseInt(id));
  if (index === -1) {
    res.status(404).json({ error: "task not found" });
  }
  //delete the task
  tasks.splice(index, 1);
  res.sendStatus(204); // No Content add after teaching
};

module.exports = {
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  addTask,
};
