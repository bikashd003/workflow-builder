import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "./workflow.css";

const Execution = () => {
  const [workflows, setWorkflows] = useState([]);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/load-workflows")
      .then((response) => {
        setWorkflows(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleWorkflowChange = (event) => {
    setSelectedWorkflow(event.target.value);
    axios
      .get(`http://localhost:3000/load-workflow/${event.target.value}`)
      .then((response) => {
        setNodes(response.data.nodes);
        setEdges(response.data.edges);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`http://localhost:3000/execute-workflow/${selectedWorkflow}`, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Select Workflow:
          <select value={selectedWorkflow} onChange={handleWorkflowChange}>
            <option value="">Select a workflow</option>
            {workflows.map((workflow) => (
              <option key={workflow._id} value={workflow._id}>
                {workflow._id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Upload File:
          <input type="file" onChange={handleFileChange} name="file"/>
        </label>
        <button type="submit" className="exe-btn">Execute Workflow</button>
      </form>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              fitView
              className="background"
            ></ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default Execution;
