import React from "react";

interface BrowserFrameProps {
  children: React.ReactNode;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({ children }) => (
  <div className="border border-secondary">
    {children}
  </div>
);
