import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { ArrowRight, ArrowDropDown } from "@mui/icons-material";
import "./Treeview.css";

const serverURI: String = "http://localhost:3000/api";

const Treeview: React.FC = (): ReactElement => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [nodeInputs, setNodeInputs] = useState<{ [key: number]: string }>({});
  const [visibleInputNode, setVisibleInputNode] = useState<number | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURI}/treeviews`);
        setTreeData(response.data);
      } catch (error) {
        console.error("Error fetching tree data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDrop = (
    newTreeData: any[],
    dragSourceId: Number,
    dropTargetId: Number
  ) => {
    axios.put(`${serverURI}/treeviews/${dragSourceId}/move`, { newParentId: dropTargetId });
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
      id: undefined,
      parent: parentId,
      droppable: false,
      text: nodeInputs[parentId],
    };

    axios
      .post(`${serverURI}/treeviews`, { text: nodeInputs[parentId], parentId })
      .then((response) => (newItem.id = response.data.id));

    const updatedTree = [...treeData, newItem];
    setTreeData(updatedTree);

    setNodeInputs({
      ...nodeInputs,
      [parentId]: "",
    });

    setVisibleInputNode(null);
  };

  const handleEditItem = (nodeId: number) => {
    setEditingNodeId(nodeId);
    setNodeInputs({
      ...nodeInputs,
      [nodeId]: treeData.find((node) => node.id === nodeId)?.text || "",
    });
  };

  const handleSaveEdit = (nodeId: number) => {
    const updatedNodeText = nodeInputs[nodeId];
    const updatedTree = treeData.map((node) =>
      node.id === nodeId ? { ...node, text: updatedNodeText } : node
    );

    axios.put(`${serverURI}/treeviews/${nodeId}`, { text: updatedNodeText });

    setTreeData(updatedTree);
    setEditingNodeId(null);
  };

  const handleDeleteItem = (nodeId: number) => {
    const updatedTree = treeData.filter((node) => node.id !== nodeId);
    setTreeData(updatedTree);

    axios.delete(`${serverURI}/treeviews/${nodeId}`);
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
          {editingNodeId === node.id ? (
            <>
              <input
                type="text"
                value={nodeInputs[node.id] || ""}
                onChange={(e) => handleNodeInputChange(node.id, e.target.value)}
                placeholder={`Enter text for node ${node.id}`}
                className="node-input"
              />
              <button onClick={() => handleSaveEdit(node.id)}>Save</button>
              <button onClick={() => setEditingNodeId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span className="node-text">{node.text}</span>
              <button onClick={() => handleEditItem(node.id)}>Edit</button>
              {node.parent !== 0 && (
                <button onClick={() => handleDeleteItem(node.id)}>
                  Delete
                </button>
              )}
            </>
          )}
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
                  placeholder={`Enter text for new item`}
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
          if (dragSource.id === dropTargetId) return;

          const dropTargetNodeIndex = treeData.findIndex(
            (node) => node.id === dropTargetId
          );

          if (dropTargetNodeIndex !== -1) {
            const dropTargetNode = treeData[dropTargetNodeIndex];

            if (!dropTargetNode.droppable) {
              dropTargetNode.droppable = true;
            }
          }

          handleDrop(newTreeData, dragSource.id, dropTargetId);
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
          const extendedNode = { ...node, isOpen, onToggle };
          return renderTreeWithInputs(extendedNode, depth);
        }}
      />
    </DndProvider>
  );
};

export default Treeview;
