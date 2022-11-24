const express = require("express");
const app = express();
const port = 3200;

const connect = require("./schemas");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

connect();

app.use(express.json());

app.listen(port, () => {
  console.log(port, "Server is open with port!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", [postsRouter, commentsRouter]);
