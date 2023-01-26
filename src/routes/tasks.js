const express = require("express");
const {
  getAllTasks,
  getTaskById,
  updateTaskById,
  addTask,
  deleteTaskById,
} = require("../controllers/tasks");
const ownerCheck = require("../middleware/ownerCheck");

//this is another way
//const { Router } = require('express');

const taskRouter = express.Router();

//GET /tasks: get all tasks(allow query params for filtering)
taskRouter.get("/", ownerCheck, getAllTasks);

//GET /tasks/:id   get task by id
taskRouter.get("/:id", getTaskById);

//PUT /tasks/:id  update task by id
taskRouter.put("/:id", updateTaskById);

// POST /tasks: create a new task
taskRouter.post("/", addTask);

//delete a task
taskRouter.delete("/:id", deleteTaskById);

module.exports = taskRouter;
