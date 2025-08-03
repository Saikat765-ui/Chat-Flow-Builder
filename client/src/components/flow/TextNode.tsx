import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { MessageSquare, GripVertical } from "lucide-react";

// TypeScript interface for Text Node data structure
interface TextNodeData {
  content: string;
}

/**
 * TextNode Component - Represents a text message node in the chatbot flow
 * Features:
 * - Target handle: Can receive multiple incoming connections
 * - Source handle: Can have only ONE outgoing connection (enforced in FlowCanvas)
 * - Editable content through the settings panel
 * - Visual feedback when selected
 */
function TextNode({ data, selected }: NodeProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md border-2 cursor-move hover:shadow-lg transition-shadow duration-200 ${
        selected 
          ? "border-blue-400" 
          : "border-emerald-200"
      }`}
      style={{ width: 200, minHeight: 80 }}
    >
      {/* Target Handle - Left side (can have multiple incoming edges) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-gray-400 bg-white"
        style={{ left: -6 }}
      />
      
      {/* Node Header with icon and title */}
      <div className="bg-emerald-100 px-3 py-2 rounded-t-lg border-b border-emerald-200 flex items-center">
        <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
        <span className="text-sm font-medium text-emerald-800">Send Message</span>
        <GripVertical className="w-4 h-4 text-emerald-400 ml-auto" />
      </div>
      
      {/* Node Content - Display the message text */}
      <div className="p-3">
        <div className="text-sm text-gray-700 break-words min-h-[20px] whitespace-pre-wrap">
          {(data as unknown as TextNodeData)?.content || "Enter your message..."}
        </div>
      </div>

      {/* Source Handle - Right side (can only have ONE outgoing edge) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-gray-400 bg-white"
        style={{ right: -6 }}
      />
    </div>
  );
}

export default memo(TextNode);
