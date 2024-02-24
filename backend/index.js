const express = require("express");
const mongoose = require("mongoose");
const port = 8000;
const cron = require("node-cron");
const cors = require("cors");

const { sendEmailTemp } = require("./services/ses");
const { pushSQS, getFromSQS } = require("./services/sqs");

// Define a cron schedule for every 20 seconds
const cronSchedule = "*/5 * * * * *";

// Define the task to be executed
const task = () => {
  console.log("run cron job", new Date().getTime());
  getFromSQS(undefined);
};

cron.schedule(cronSchedule, task);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/subscribe", (req, res) => {
  const { mail } = req.body;
  // there is already a test user who has subscibed=>{
  // id:1,email:'vrajat269@gmail.com'
  // }

  return res.status(200).json({
    success: true,
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("run server");
});
