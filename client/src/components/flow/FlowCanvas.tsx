import { useCallback, useRef, DragEvent } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowInstance,
  Node,
  Edge,
  Connection,
  NodeTypes,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TextNode from "./TextNode";

/**
 * Node Types Registry - Define all available node types for the flow
 * This object maps node type strings to their React components
 * 
 * To add a new node type:
 * 1. Create a new node component (e.g., ConditionNode.tsx)
 * 2. Add it to this nodeTypes object
 * 3. Add the corresponding drag item in NodesPanel
 */
const nodeTypes: NodeTypes = {
  textNode: TextNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeSelect: (nodeId: string | null) => void;
  onAddNode: (type: string, position: { x: number; y: number }) => void;
  selectedNodeId: string | null;
}

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
  onAddNode,
  selectedNodeId,
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  /**
   * Handle connection between nodes
   * Enforces the rule: Source handle can only have ONE outgoing edge
   * Target handle can have MULTIPLE incoming edges
   */
  const onConnect = useCallback(
    (params: Connection) => {
      // Check if source handle already has an outgoing edge
      const existingSourceEdge = edges.find(edge => 
        edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      
      // Create new edge object
      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };
      
      if (existingSourceEdge) {
        // Replace existing edge (source handle constraint: only one outgoing edge)
        onEdgesChange([
          { type: 'remove', id: existingSourceEdge.id },
          { type: 'add', item: newEdge }
        ]);
      } else {
        // Add new edge (no conflict)
        onEdgesChange([{ type: 'add', item: newEdge }]);
      }
    },
    [edges, onEdgesChange]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  // Handle canvas click (deselect nodes)
  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  // Handle drag over for drop functionality
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop to create new nodes
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onAddNode(type, position);
    },
    [screenToFlowPosition, onAddNode]
  );

  // Update nodes with selection state
  const nodesWithSelection = nodes.map(node => ({
    ...node,
    selected: node.id === selectedNodeId,
  }));

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#64748b"
        />
        <MiniMap 
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-200 rounded-lg"
          style={{ backgroundColor: 'white' }}
        />
      </ReactFlow>
    </div>
  );
}
