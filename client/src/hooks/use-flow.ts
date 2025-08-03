import { useState, useCallback } from "react";
import { Node, Edge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from "@xyflow/react";

export function useFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position,
      data: { content: "" },
    };
    setNodes((prev) => [...prev, newNode]);
  }, []);

  const updateNode = useCallback((nodeId: string, data: any) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNode,
    deleteNode,
  };
}
