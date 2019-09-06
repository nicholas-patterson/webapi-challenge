const express = require("express");
const server = express();
const actionRouter = require("./routes/actionRoutes");
const projectRouter = require("./routes/projectRoutes");

//Global Middleware
server.use(express.json());
server.use(logger);
server.use("/actions", actionRouter);
server.use("/projects", projectRouter);

function logger(req, res, next) {
  console.log(
    `${new Date().toISOString()} there was a ${req.method} request to ${
      req.url
    }`
  );
  next();
}

module.exports = server;
