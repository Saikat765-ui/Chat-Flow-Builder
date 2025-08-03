import { useState, useCallback, useRef } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowCanvas from "@/components/flow/FlowCanvas";
import NodesPanel from "@/components/flow/NodesPanel";
import SettingsPanel from "@/components/flow/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, AlertCircle } from "lucide-react";
import { useFlow } from "@/hooks/use-flow";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

/**
 * FlowBuilder - Main component for the chatbot flow builder application
 * 
 * Features implemented:
 * - Drag and drop nodes from the Nodes Panel
 * - Visual flow editor with React Flow
 * - Settings panel for editing selected nodes
 * - Save validation to prevent invalid flows
 * - Connection rules: source handles can only have one outgoing edge
 */
export default function FlowBuilder() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, addNode, updateNode, deleteNode } = useFlow();
  const { toast } = useToast();

  // Validate flow mutation
  const validateFlow = useMutation({
    mutationFn: async (data: { nodes: any[], edges: any[] }) => {
      const response = await apiRequest("POST", "/api/flows/validate", data);
      return response.json();
    },
    onSuccess: () => {
      setValidationError(null);
      saveFlow.mutate({ name: "Chatbot Flow", nodes, edges });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Cannot save Flow";
      setValidationError(errorMessage);
      setTimeout(() => setValidationError(null), 3000);
    },
  });

  // Save flow mutation
  const saveFlow = useMutation({
    mutationFn: async (data: { name: string, nodes: any[], edges: any[] }) => {
      const response = await apiRequest("POST", "/api/flows", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Flow saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save flow",
        variant: "destructive",
      });
    },
  });

  const handleSave = useCallback(() => {
    validateFlow.mutate({ nodes, edges });
  }, [nodes, edges, validateFlow]);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: any) => {
    updateNode(nodeId, data);
  }, [updateNode]);

  const isLoading = validateFlow.isPending || saveFlow.isPending;

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Chatbot Flow Builder</h1>
          </div>
          <div className="flex items-center space-x-3">
            {validationError && (
              <Alert variant="destructive" className="w-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Flow Canvas */}
          <div className="flex-1">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeSelect={handleNodeSelect}
              onAddNode={addNode}
              selectedNodeId={selectedNodeId}
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {selectedNodeId ? (
              <SettingsPanel
                selectedNode={nodes.find(n => n.id === selectedNodeId)}
                onNodeUpdate={handleNodeUpdate}
                onNodeDelete={deleteNode}
                onBackToNodes={() => setSelectedNodeId(null)}
              />
            ) : (
              <NodesPanel />
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
