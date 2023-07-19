import React, { useState } from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  DndProvider
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./App.module.css";

const Input = styled("input")({
  display: "none"
});


const SampleData = [
  {
    "id": 1,
    "parent": 0,
    "droppable": true,
    "text": "Folder 1"
  },
  {
    "id": 2,
    "parent": 1,
    "droppable": false,
    "text": "File 1-1"
  },
  {
    "id": 3,
    "parent": 1,
    "droppable": false,
    "text": "File 1-2"
  },
  {
    "id": 4,
    "parent": 0,
    "droppable": true,
    "text": "Folder 2"
  },
  {
    "id": 5,
    "parent": 4,
    "droppable": true,
    "text": "Folder 2-1"
  },
  {
    "id": 6,
    "parent": 5,
    "droppable": false,
    "text": "File 2-1-1"
  },
  {
    "id": 7,
    "parent": 0,
    "droppable": false,
    "text": "File 3"
  }
]


function App() {
  const [treeData, setTreeData] = useState(SampleData);
  const [lastId, setLastId] = useState(105);

  const handleDrop = (newTree, options) => {
    const { dropTargetId, monitor } = options;
    const itemType = monitor.getItemType();

    if (itemType === NativeTypes.FILE) {
      const files = monitor.getItem().files;
      const nodes = files.map((file, index) => ({
        id: lastId + index,
        parent: dropTargetId,
        text: file.name,
        data: {
          fileSize: `${file.size / 1024}KB`,
          fileType: "text"
        }
      }));

      const mergedTree = [...newTree, ...nodes];
      setTreeData(mergedTree);
      setLastId(lastId + files.length);
    } else {
      setTreeData(newTree);
    }
  };

  return (
    <div className={styles.rootGrid}>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          rootId={0}
          tree={treeData}
          extraAcceptTypes={[NativeTypes.FILE]}
          classes={{
            root: styles.treeRoot,
            draggingSource: styles.draggingSource,
            dropTarget: styles.dropTarget
          }}
          render={(node, options) => <CustomNode node={node} {...options} />}
          dragPreviewRender={(monitorProps) => (
            <CustomDragPreview monitorProps={monitorProps} />
          )}
          onDrop={handleDrop}
        />
      </DndProvider>
    </div>
  );
}

export default App;
