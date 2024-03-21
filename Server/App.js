import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import csvtojson from 'csvtojson';
import Workflow from "./Models/Workflow.model.js"
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/workflows');

app.post('/save-workflow', async (req, res) => {
  const workflow = new Workflow(req.body);
  await workflow.save();
  res.status(200).send('Workflow saved successfully');
});
app.get('/load-workflows', async (req, res) => {
  const workflow = await Workflow.find();
  res.status(200).json(workflow);
});
app.get('/load-workflow/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).send('Workflow not found');
    }
    res.json(workflow);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.post('/execute-workflow/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).send('Workflow not found');
    }

    let data = req.body.data; 
    console.log(req.body.data)

    for (const node of workflow.nodes) {
      switch (node.type) {
        case 'filter':
          if (data[node.column]) {
            data[node.column] = data[node.column].toLowerCase();
          } else {
            throw new Error(`Column ${node.column} not found in data`);
          }
          break;
        case 'wait':
          await new Promise(resolve => setTimeout(resolve, 60000));
          break;
        case 'convert':
          if (typeof data === 'string') {
            data = await csvtojson().fromString(data);
          } else {
            throw new Error('Data is not a CSV string');
          }
          break;
        case 'post':
          const response = await axios.post(node.url, data);
          console.log(`POST request sent to ${node.url}. Response status: ${response.status}`);
          break;
      }
    }

    res.status(200).send('Workflow executed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error executing workflow: ${error.message}`);
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Server running on port 3000'));