import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import csvtojson from 'csvtojson';
import Workflow from "./Models/Workflow.model.js"
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/workflows');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage })

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


app.post('/execute-workflow/:id', upload.single("file"), async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).send('Workflow not found');
    }

    const fileData = fs.readFileSync(`./uploads/${req.file.originalname}`, 'utf8');
    let data=[];

    for (const node of workflow.nodes) {
      switch (node.type) {
        case 'filter':
          await new Promise((resolve, reject) => {
            fs.createReadStream(`./uploads/${req.file.originalname}`)
              .pipe(csv())
              .on('data', (row) => {
                row.Name = row.Name.toLowerCase(); 
                data.push(row);
              })
              .on('end', () => {
                resolve();
                console.log(data)
              })
              .on('error', (error) => {
                reject(error);
              });
          });
          break;
        case 'wait':
          await new Promise(resolve => setTimeout(resolve, 60000));
          break;
        case 'convert':
          if (typeof fileData === 'string') {
            data = await csvtojson().fromString(fileData);
            console.log(data)
          } else {
            throw new Error('Data is not a CSV string');
          }
          break;
        case 'post':
          if (data) {
            const response = await axios.post("https://workflow-catcher.requestcatcher.com", data);
            console.log(`POST request sent to https://workflow-catcher.requestcatcher.com. Response status: ${response.status}`);
          } else {
            throw new Error('No data to send');
          }
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