import React from "react";

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode filter"
        onDragStart={(event) => onDragStart(event, "filter")}
        draggable
      >
        Filter Node
      </div>
      <div
        className="dndnode wait"
        onDragStart={(event) => onDragStart(event, "wait")}
        draggable
      >
        Wait Node
      </div>
      <div
        className="dndnode convert"
        onDragStart={(event) => onDragStart(event, "convert")}
        draggable
      >
        Convert Node
      </div>
      <div
        className="dndnode post"
        onDragStart={(event) => onDragStart(event, "post")}
        draggable
      >
        Post Node
      </div>
    </aside>
  );
};
