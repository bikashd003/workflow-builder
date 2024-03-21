import React from "react";
import "./App.css";
import WorkflowEditor from "./Components/WorkflowEditor";
import "./Components/workflow.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar";
const router = createBrowserRouter([
  {
    path: "/",
    element: (<>
        <Navbar />
      <div className="container">
        <WorkflowEditor />
      </div>
    </>
    
    ),
  },
  {
    path: "/execution",
    element: (
      <>hello</>
    ),
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
