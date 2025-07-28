import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WindowHeaderProps {
  title: string;
  draggable?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  className?: string;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  draggable = false,
  onClose,
  onMinimize,
  onMaximize,
  onMouseDown,
  className = "",
}) => (
  <div
    className={`pl-4 bg-secondary p-2 flex items-center justify-between ${draggable ? "cursor-move" : ""} ${className}`}
    {...(draggable && onMouseDown ? { onMouseDown } : {})}
  >
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-red-500"></div>
      <div className="w-3 h-3 bg-yellow-500"></div>
      <div className="w-3 h-3 bg-green-500"></div>
      <span className="text-sm text-primary ml-4">{title}</span>
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className={`text-primary w-6 h-6 p-0 rounded-none ${onClose ? 'cursor-pointer hover:bg-primary hover:text-secondary' : 'cursor-default'}`}
        onClick={onClose}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  </div>
);
