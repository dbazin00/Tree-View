import { ReactElement, useState } from "react";
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { ArrowRight, ArrowDropDown } from "@mui/icons-material";
import initialData from "./sample-default.json";
import "./Treeview.css"; // Importing external styles

const Treeview: React.FC = (): ReactElement => {
  const [treeData, setTreeData] = useState<any[]>(initialData);

  const [nodeInputs, setNodeInputs] = useState<{ [key: number]: string }>({});

  // State to track which node's input field is visible
  const [visibleInputNode, setVisibleInputNode] = useState<number | null>(null);

  const handleDrop = (newTreeData: any[]) => {
    setTreeData(newTreeData);
  };

  const handleNodeInputChange = (nodeId: number, value: string) => {
    setNodeInputs({
      ...nodeInputs,
      [nodeId]: value,
    });
  };

  const handleAddItem = (parentId: number) => {
    if (!nodeInputs[parentId]) return;

    const parentNodeIndex = treeData.findIndex((node) => node.id === parentId);
    if (parentNodeIndex === -1) return;

    const parentNode = treeData[parentNodeIndex];
    if (!parentNode.droppable) {
      parentNode.droppable = true;
    }

    const newItem = {
      id: Date.now(),
      parent: parentId,
      droppable: false,
      text: nodeInputs[parentId],
    };

    const updatedTree = [...treeData, newItem];
    setTreeData(updatedTree);

    setNodeInputs({
      ...nodeInputs,
      [parentId]: "",
    });

    setVisibleInputNode(null);
  };

  const toggleInputVisibility = (nodeId: number) => {
    setVisibleInputNode(visibleInputNode === nodeId ? null : nodeId);
  };

  const renderTreeWithInputs = (node: any, depth: number): ReactElement => {
    return (
      <div key={node.id}>
        <div className="tree-node" style={{ marginLeft: depth * 20 }}>
          {node.droppable && (
            <span className="toggle-icon" onClick={node.onToggle}>
              {node.isOpen ? <ArrowDropDown /> : <ArrowRight />}
            </span>
          )}
          <span className="node-text">{node.text}</span>
        </div>

        {node.droppable && node.isOpen && (
          <div>
            {node.children?.map((childNode: any) =>
              renderTreeWithInputs(childNode, depth + 1)
            )}
          </div>
        )}

        {(node.droppable === undefined ||
          node.droppable === false ||
          node.isOpen) && (
          <div className="tree-input" style={{ marginLeft: (depth + 1) * 20 }}>
            {visibleInputNode === node.id ? (
              <>
                <input
                  type="text"
                  value={nodeInputs[node.id] || ""}
                  onChange={(e) =>
                    handleNodeInputChange(node.id, e.target.value)
                  }
                  placeholder={`Enter text for node ${node.id}`}
                  className="node-input"
                />
                <button onClick={() => handleAddItem(node.id)}>Add</button>
                <button onClick={() => setVisibleInputNode(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <a href="#" onClick={() => toggleInputVisibility(node.id)}>
                Add new item
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        classes={{ root: "treeView" }}
        tree={treeData}
        rootId={0}
        onDrop={(newTreeData, { dragSource, dropTargetId }) => {
          // Ensure the dragged node is not dropped on itself
          if (dragSource.id === dropTargetId) return;

          const dropTargetNodeIndex = treeData.findIndex(
            (node) => node.id === dropTargetId
          );

          // If the drop target node exists
          if (dropTargetNodeIndex !== -1) {
            const dropTargetNode = treeData[dropTargetNodeIndex];

            // If the node is not droppable, make it droppable upon a drop
            if (!dropTargetNode.droppable) {
              dropTargetNode.droppable = true;
            }
          }

          // Update the tree state
          handleDrop(newTreeData); // Call the existing handleDrop function
        }}
        sort={false}
        insertDroppableFirst={false}
        canDrop={(_, { dropTargetId }) => {
          const dropTargetNode = treeData.find(
            (node) => node.id === dropTargetId
          );
          return dropTargetNode
            ? dropTargetNode.droppable || !dropTargetNode.droppable
            : false;
        }}
        dropTargetOffset={5}
        render={(node, { depth, isOpen, onToggle }) => {
          // Add isOpen and onToggle props to the node to manage expansion
          const extendedNode = { ...node, isOpen, onToggle };
          return renderTreeWithInputs(extendedNode, depth);
        }}
      />
    </DndProvider>
  );
};

export default Treeview;
