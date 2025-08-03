import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Node } from "@xyflow/react";

interface SettingsPanelProps {
  selectedNode?: Node;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onNodeDelete: (nodeId: string) => void;
  onBackToNodes: () => void;
}

export default function SettingsPanel({
  selectedNode,
  onNodeUpdate,
  onNodeDelete,
  onBackToNodes,
}: SettingsPanelProps) {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (selectedNode?.data && typeof selectedNode.data === 'object' && 'content' in selectedNode.data) {
      setTextContent((selectedNode.data as any).content || "");
    } else {
      setTextContent("");
    }
  }, [selectedNode]);

  const handleTextChange = (value: string) => {
    setTextContent(value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { content: value });
    }
  };

  const handleTextBlur = (e: React.FocusEvent) => {
    // Only auto-deselect if focus is moving outside the settings panel
    // Check if the new focus target is within the settings panel
    const settingsPanelElement = e.currentTarget.closest('[data-settings-panel]');
    const relatedTarget = e.relatedTarget as Element;
    
    if (!settingsPanelElement || !settingsPanelElement.contains(relatedTarget)) {
      // Auto-deselect node when user finishes editing text and focus moves outside
      onBackToNodes();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Auto-deselect on Enter key (but allow Shift+Enter for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onBackToNodes();
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div data-settings-panel>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToNodes}
            className="text-gray-400 hover:text-gray-600 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">Message</h2>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </div>

      {/* Settings Panel Content */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {/* Node Type Display */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Message</div>
              <div className="text-xs text-gray-500">Text message node</div>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="node-text" className="text-sm font-medium text-gray-700">
              Text
            </Label>
            <Textarea
              id="node-text"
              value={textContent}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={handleTextBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message text..."
              className="resize-none"
              rows={4}
            />
          </div>

          {/* Node Properties */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Properties</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Node ID</span>
                <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                  {selectedNode.id}
                </code>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-900">{selectedNode.type}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="pt-4 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <Settings className="w-4 h-4 mr-1" />
              Advanced Settings
            </Button>
          </div>

          {/* Delete Node */}
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                if (selectedNode) {
                  onNodeDelete(selectedNode.id);
                  onBackToNodes();
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Node
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
