const express = require("express");
const taskRouter = require("./tasks");

const router = express.Router();

router.use("/tasks", taskRouter);
// router.use("/users", userRouter);

module.exports = router;
