
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VisualizationProps } from './types';

const WaveSurface = ({ count = 100, mouse, speed = 0.15, color = '#8B5CF6' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  // Generate data points for wave
  const data = useMemo(() => {
    const points = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (points.length < count) {
          // Create a wave pattern
          const xPos = (x - gridSize / 2) * 0.5;
          const zPos = (z - gridSize / 2) * 0.5;
          const distance = Math.sqrt(xPos * xPos + zPos * zPos);
          const height = Math.sin(distance * 2) * 0.5 + 0.5;
          
          points.push({
            position: [xPos, height, zPos],
            originalY: height,
            scale: [0.1, 0.1, 0.1],
            originalScale: [0.1, 0.1, 0.1],
            rotation: [0, 0, 0]
          });
        }
      }
    }
    
    return points;
  }, [count]);

  // Animation
  useFrame(() => {
    if (!mesh.current) return;
    
    // Update time for wave animation
    time.current += 0.01;
    
    // Gentle rotation
    mesh.current.rotation.y += 0.002;
    
    // Get mouse world position
    const mouseX = mouse.current.x * 5;
    const mouseY = mouse.current.y * 5;

    mesh.current.children.forEach((child, i) => {
      if (i < data.length) {
        const dataPoint = data[i];
        // Create ripple effect from mouse
        const childPos = new THREE.Vector3().setFromMatrixPosition(child.matrixWorld);
        const dx = mouseX - childPos.x;
        const dz = -mouseY - childPos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Wave animation combined with mouse interaction
        const originalY = dataPoint.originalY;
        const timeFactor = Math.sin(time.current + childPos.x * 2 + childPos.z * 2) * 0.2;
        let newY = originalY + timeFactor;
        
        // Add mouse ripple effect
        if (distance < 3) {
          const mouseFactor = (1 - distance / 3) * 0.5 * Math.sin(distance * 5 - time.current * 5);
          newY += mouseFactor;
        }
        
        child.position.y = newY;
      }
    });
  });

  return (
    <group ref={mesh}>
      {data.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={color} opacity={0.7} transparent={true} />
        </mesh>
      ))}
    </group>
  );
};

export default WaveSurface;
