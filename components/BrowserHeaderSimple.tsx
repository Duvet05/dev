"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { SiArtstation, SiInstagram, SiSketchfab } from "react-icons/si";
import { NavigationSimple } from "@/components/NavigationSimple";
import { usePathname } from "next/navigation";

export const BrowserHeaderSimple: React.FC = () => {
  const pathname = usePathname();
  const currentUrl = pathname === '/projects' ? 'HTTPS://CUADOT.COM/PROJECTS' : 'HTTPS://CUADOT.COM';
  
  return (
    <>
      <div className="bg-primary border-b border-secondary p-2 pl-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="bg-black text-white px-3 py-1 text-sm font-mono border border-secondary">
            {currentUrl}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent border-secondary text-white hover:bg-white hover:text-black rounded-none">
            <SiArtstation className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent border-secondary text-white hover:bg-white hover:text-black rounded-none">
            <SiInstagram className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent border-secondary text-white hover:bg-white hover:text-black rounded-none">
            <SiSketchfab className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <NavigationSimple />
    </>
  );
};
