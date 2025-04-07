
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VisualizationProps } from './types';

const BarChart = ({ count = 100, mouse, speed = 0.15, color = '#8B5CF6' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  // Generate data points for bar chart
  const data = useMemo(() => {
    const points = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (points.length < count) {
          // Generate random height for each bar
          const height = Math.random() * 2 + 0.2;
          points.push({
            position: [
              (x - gridSize / 2) * 0.8, 
              height / 2, 
              (z - gridSize / 2) * 0.8
            ],
            height: height,
            originalHeight: height,
            scale: [0.2, height, 0.2],
            originalScale: [0.2, height, 0.2],
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
    
    time.current += 0.01;
    
    // Slow rotation
    mesh.current.rotation.y += 0.002;
    
    // Get mouse world position
    const mouseX = mouse.current.x * 5;
    const mouseY = mouse.current.y * 5;

    mesh.current.children.forEach((child, i) => {
      if (i < data.length) {
        const dataPoint = data[i];
        const childPos = new THREE.Vector3().setFromMatrixPosition(child.matrixWorld);
        
        // Distance from mouse (in world space)
        const dx = mouseX - childPos.x;
        const dz = -mouseY - childPos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Scale bars up when mouse is near
        if (distance < 2) {
          const scale = 1 + (1 - distance / 2) * 0.5;
          child.scale.y = dataPoint.originalScale[1] * scale;
          child.position.y = dataPoint.height * scale / 2;
        } else {
          child.scale.y = dataPoint.originalScale[1];
          child.position.y = dataPoint.height / 2;
        }
      }
    });
  });

  return (
    <group ref={mesh}>
      {data.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} opacity={0.8} transparent={true} />
        </mesh>
      ))}
    </group>
  );
};

export default BarChart;
