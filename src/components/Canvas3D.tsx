
import React, { Suspense } from "react";
import { useDesign } from "@/contexts/DesignContext";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export const Canvas3D = () => {
  const { currentRoom, placedFurniture, furnitureCatalog } = useDesign();

  const getFurnitureById = (id: string) => {
    return furnitureCatalog.find(item => item.id === id);
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <p>No room configuration found.</p>
      </div>
    );
  }

  return (
    <div className="canvas-3d w-full h-full border border-border rounded-md bg-gray-900 relative">
      <Canvas shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1} 
            castShadow 
          />
          
          {/* Room */}
          <Room room={currentRoom} />
          
          {/* Furniture */}
          {placedFurniture.map((item, index) => {
            const furniture = getFurnitureById(item.furnitureId);
            if (!furniture) return null;
            
            return (
              <Furniture 
                key={index}
                furniture={furniture}
                position={item}
              />
            );
          })}
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
          <PerspectiveCamera
            makeDefault
            position={[currentRoom.width / 2, currentRoom.height * 1.5, currentRoom.length * 1.5]}
            fov={50}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/60 text-white p-2 rounded">
        <p className="text-xs">Room: {currentRoom.name}</p>
        <p className="text-xs">Dimensions: {currentRoom.width}m x {currentRoom.length}m x {currentRoom.height}m</p>
        <p className="text-xs">Items: {placedFurniture.length}</p>
      </div>
    </div>
  );
};

// Room component
interface RoomProps {
  room: {
    width: number;
    length: number;
    height: number;
    wallColor: string;
    floorColor: string;
  };
}

const Room = ({ room }: RoomProps) => {
  return (
    <group>
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[room.width / 2, 0, room.length / 2]}
        receiveShadow
      >
        <planeGeometry args={[room.width, room.length]} />
        <meshStandardMaterial color={room.floorColor} />
      </mesh>
      
      {/* Back Wall */}
      <mesh 
        position={[room.width / 2, room.height / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[room.width, room.height]} />
        <meshStandardMaterial color={room.wallColor} />
      </mesh>
      
      {/* Left Wall */}
      <mesh 
        rotation={[0, Math.PI / 2, 0]}
        position={[0, room.height / 2, room.length / 2]}
        receiveShadow
      >
        <planeGeometry args={[room.length, room.height]} />
        <meshStandardMaterial color={room.wallColor} />
      </mesh>
    </group>
  );
};

// Furniture component
interface FurnitureProps {
  furniture: {
    width: number;
    length: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
    rotation: number;
    scale: number;
    color: string;
  };
}

const Furniture = ({ furniture, position }: FurnitureProps) => {
  return (
    <group 
      position={[position.x, position.y + furniture.height * position.scale / 2, position.z]} 
      rotation={[0, position.rotation * Math.PI / 180, 0]}
      scale={position.scale}
    >
      <mesh castShadow>
        <boxGeometry args={[furniture.width, furniture.height, furniture.length]} />
        <meshStandardMaterial color={position.color} />
      </mesh>
    </group>
  );
};
