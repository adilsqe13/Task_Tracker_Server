require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const Task = require('./models/TaskSchema');

app.use(bodyParser.json());
app.use(cors());

// Database
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

//GET ALL TASKS
app.get('/.netlify/functions/server/api/get-all-tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json({ tasks: tasks });
  } catch (error) {
    console.log(error);
    res.json({ tasks: [] });
  }
});

//GET TASK DETAILS
app.get('/.netlify/functions/server/api/get-task-details/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findOne({_id:taskId});
    res.json({ task: task });
  } catch (error) {
    console.log(error);
    res.json({ tasks: [] });
  }
});

//ADD TASK
app.post('/.netlify/functions/server/api/add-task', async (req, res) => {
  const { title, desc, team, assignees, priority } = req.body;
  try {
    const newTask = await Task.create({ title: title.toUpperCase(), desc, team, assignees, priority });
    await newTask.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

//EDIT TASK
app.put('/.netlify/functions/server/api/edit-task', async (req, res) => {
  const { taskId, priority, status } = req.body;
  try {
    if(status === 'completed'){
      await Task.updateOne({ _id: taskId }, { $set: { status: status, priority: priority, end_date: Date.now() } });
    }else{
      await Task.updateOne({ _id: taskId }, { $set: { status: status, priority: priority } });
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});


//DELETE TASK
app.delete('/.netlify/functions/server/api/delete-task/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await Task.deleteOne({ _id: taskId });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});



// SERVER - LISTENING
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports.handler = serverless(app);