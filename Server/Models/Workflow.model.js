import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  data: Object,
  position: Object,
});
const EdgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  targetHandle: String,
  sourceHandle: String,
});
const WorkflowSchema = new mongoose.Schema({
  id: String,
  nodes: [NodeSchema],
  edges: [EdgeSchema],
});

const Workflow = mongoose.model('Workflow', WorkflowSchema);

export default Workflow;