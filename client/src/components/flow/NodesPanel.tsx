import { DragEvent } from "react";
import { MessageSquare, GitBranch, Database } from "lucide-react";

/**
 * NodesPanel Component - Houses all available node types for the flow builder
 * 
 * This panel is designed to be extensible - new node types can be easily added
 * by creating new draggable node components and corresponding node implementations.
 * 
 * Current supported nodes:
 * - Text Message Node: Basic text message for chatbot responses
 * 
 * Future node types (shown as disabled):
 * - Condition Node: For branching conversation flow
 * - API Call Node: For making external API requests
 */
export default function NodesPanel() {
  /**
   * Handles the start of dragging a node from the panel
   * Sets the node type in the drag data for drop handling in FlowCanvas
   */
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Nodes Panel</h2>
      </div>

      {/* Nodes Panel Content */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Available Nodes</h3>
            
            {/* Draggable Message Node */}
            <div 
              className="bg-white border-2 border-gray-200 rounded-lg p-3 cursor-grab hover:border-blue-300 hover:shadow-md transition-all duration-200 active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, "textNode")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Message</div>
                  <div className="text-xs text-gray-500">Send a text message</div>
                </div>
              </div>
            </div>
          </div>

          {/* Future Node Types */}
          <div className="space-y-2 opacity-50">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Coming Soon</div>
            
            <div className="bg-gray-50 border-2 border-gray-100 rounded-lg p-3 cursor-not-allowed">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Condition</div>
                  <div className="text-xs text-gray-400">Branch conversation flow</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-gray-100 rounded-lg p-3 cursor-not-allowed">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">API Call</div>
                  <div className="text-xs text-gray-400">Make external requests</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
