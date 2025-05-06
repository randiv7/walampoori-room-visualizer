
import React from "react";
import { useDesign } from "@/contexts/DesignContext";

export const Canvas3D = () => {
  const { currentRoom, placedFurniture } = useDesign();

  return (
    <div className="canvas-3d w-full h-full border border-border rounded-md bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center p-4">
        <h3 className="text-lg font-medium mb-2">3D Visualization</h3>
        <p className="text-sm opacity-70 mb-4">
          In the complete app, this area will display a 3D visualization of your room using Three.js.
        </p>
        <div className="p-4 bg-gray-800 rounded-md max-w-md mx-auto">
          <h4 className="font-medium mb-2">Room Details:</h4>
          {currentRoom && (
            <ul className="text-sm text-left">
              <li>Name: {currentRoom.name}</li>
              <li>Dimensions: {currentRoom.width}m x {currentRoom.length}m x {currentRoom.height}m</li>
              <li>Wall Color: <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: currentRoom.wallColor }}></span> {currentRoom.wallColor}</li>
              <li>Floor Color: <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: currentRoom.floorColor }}></span> {currentRoom.floorColor}</li>
            </ul>
          )}
          {placedFurniture.length > 0 && (
            <>
              <h4 className="font-medium mt-4 mb-2">Furniture Items:</h4>
              <ul className="text-sm text-left">
                {placedFurniture.map((item, index) => (
                  <li key={index}>
                    Item {index + 1}: Position ({item.x.toFixed(1)}, {item.z.toFixed(1)}), 
                    Rotation: {item.rotation.toFixed(0)}°
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
