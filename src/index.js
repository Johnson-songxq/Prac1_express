const express = require("express");
const cors = require("./middleware/cors");
// const router = require("./routes/index");
// const router = require("./routes/index.js");
// the above the two equas this one
const router = require("./routes");

const app = express();

// Calling the express.json() method for parsing
app.use(express.json());
app.use(cors);

app.use(router);

app.listen(3000, () => {
  console.log("sever listening on port 3000");
});
