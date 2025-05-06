import React, { useEffect, useRef, useState } from "react";
import { useDesign } from "@/contexts/DesignContext";
import { Canvas, Rect } from "fabric";

export const Canvas2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const { currentRoom, placedFurniture, furnitureCatalog, updateFurniturePosition } = useDesign();
  
  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#f0f0f0",
        selection: true,
      });
      
      setFabricCanvas(canvas);
      
      return () => {
        canvas.dispose();
      };
    }
  }, [canvasRef, fabricCanvas]);
  
  // Draw room
  useEffect(() => {
    if (!fabricCanvas || !currentRoom) return;
    
    // Clear canvas
    fabricCanvas.clear();
    
    // Calculate scale to fit room in canvas
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    const roomWidth = currentRoom.width;
    const roomLength = currentRoom.length;
    
    // Use the smallest scale to ensure room fits in canvas
    const scaleX = canvasWidth / roomWidth;
    const scaleY = canvasHeight / roomLength;
    const scale = Math.min(scaleX, scaleY) * 0.8; // 80% of available space
    
    // Create room rectangle
    const scaledWidth = roomWidth * scale;
    const scaledLength = roomLength * scale;
    const room = new Rect({
      left: (canvasWidth - scaledWidth) / 2,
      top: (canvasHeight - scaledLength) / 2,
      width: scaledWidth,
      height: scaledLength,
      fill: currentRoom.floorColor,
      stroke: currentRoom.wallColor,
      strokeWidth: 10,
      selectable: false,
    });
    
    fabricCanvas.add(room);
    fabricCanvas.renderAll();
    
  }, [fabricCanvas, currentRoom]);

  // Draw furniture
  useEffect(() => {
    if (!fabricCanvas || !currentRoom || placedFurniture.length === 0) return;
    
    // Calculate scale
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    const roomWidth = currentRoom.width;
    const roomLength = currentRoom.length;
    
    const scaleX = canvasWidth / roomWidth;
    const scaleY = canvasHeight / roomLength;
    const scale = Math.min(scaleX, scaleY) * 0.8;
    
    // Room position
    const roomLeft = (canvasWidth - (roomWidth * scale)) / 2;
    const roomTop = (canvasHeight - (roomLength * scale)) / 2;
    
    // Add furniture
    placedFurniture.forEach((item, index) => {
      const furniture = furnitureCatalog.find(f => f.id === item.furnitureId);
      if (!furniture) return;
      
      // Calculate furniture position in canvas coordinates
      const furnitureX = roomLeft + (item.x * scale);
      const furnitureZ = roomTop + (item.z * scale);
      
      // Calculate furniture dimensions in canvas coordinates
      const furnitureWidth = furniture.width * scale * item.scale;
      const furnitureLength = furniture.length * scale * item.scale;
      
      const rect = new Rect({
        left: furnitureX,
        top: furnitureZ,
        width: furnitureWidth,
        height: furnitureLength,
        fill: item.color,
        angle: item.rotation,
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: true,
        cornerColor: 'rgba(121, 82, 179, 0.7)',
        transparentCorners: false,
      });
      
      rect.on('moving', (e) => {
        const target = e.target;
        const roomBounds = {
          left: roomLeft,
          top: roomTop,
          right: roomLeft + (roomWidth * scale),
          bottom: roomTop + (roomLength * scale)
        };
        
        // Keep furniture within room bounds
        if (target.left < roomBounds.left) target.left = roomBounds.left;
        if (target.top < roomBounds.top) target.top = roomBounds.top;
        if (target.left + target.width > roomBounds.right) target.left = roomBounds.right - target.width;
        if (target.top + target.height > roomBounds.bottom) target.top = roomBounds.bottom - target.height;
      });
      
      rect.on('modified', () => {
        // Convert back to room coordinates
        const updatedX = ((rect.left || 0) - roomLeft) / scale;
        const updatedZ = ((rect.top || 0) - roomTop) / scale;
        const updatedRotation = rect.angle || 0;
        
        updateFurniturePosition(index, { 
          x: updatedX, 
          z: updatedZ, 
          rotation: updatedRotation 
        });
      });
      
      fabricCanvas.add(rect);
    });
    
    fabricCanvas.renderAll();
    
  }, [fabricCanvas, currentRoom, placedFurniture, furnitureCatalog, updateFurniturePosition]);
  
  return (
    <div className="canvas-container w-full h-full">
      <canvas ref={canvasRef} className="border border-border rounded-md"></canvas>
    </div>
  );
};
