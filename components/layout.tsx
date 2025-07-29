// filepath: d:\Johan\Documentos\Projects\3d-artist\components\layout\index.tsx
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-container">
      {children}
    </div>
  );
};

export default Layout;