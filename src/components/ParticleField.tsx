
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';

interface DataVisualizationProps {
  count?: number;
  mouse: React.MutableRefObject<THREE.Vector2>;
  speed?: number;
  size?: number;
  color?: string;
  variant?: 'bars' | 'scatter' | 'wave';
}

const DataVisualization = ({ 
  count = 50, 
  mouse, 
  speed = 0.1, 
  size = 0.04, 
  color = '#8B5CF6',
  variant = 'bars' 
}: DataVisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  
  // Generate data points based on the visualization type
  const data = useMemo(() => {
    const points = [];
    
    if (variant === 'bars') {
      // Create a grid of data points for bar chart
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
    } else if (variant === 'scatter') {
      // Create scattered points in 3D space
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 6;
        const y = (Math.random() - 0.5) * 6;
        const z = (Math.random() - 0.5) * 6;
        
        points.push({
          position: [x, y, z],
          scale: [size * 4, size * 4, size * 4],
          originalScale: [size * 4, size * 4, size * 4],
          rotation: [0, 0, 0]
        });
      }
    } else if (variant === 'wave') {
      // Create a wave/surface plot
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
    }
    
    return points;
  }, [count, size, variant]);
  
  // Connection lines for scatter plot
  const connections = useMemo(() => {
    if (variant !== 'scatter') return [];
    
    const lines = [];
    // Connect points that are close to each other
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const p1 = data[i].position;
        const p2 = data[j].position;
        const distance = Math.sqrt(
          Math.pow(p1[0] - p2[0], 2) + 
          Math.pow(p1[1] - p2[1], 2) + 
          Math.pow(p1[2] - p2[2], 2)
        );
        
        // Only connect points that are close
        if (distance < 2) {
          lines.push({
            start: [...p1],
            end: [...p2],
            opacity: 1 - (distance / 2)
          });
        }
      }
    }
    return lines;
  }, [data, variant]);

  // Wave animation for wave variant
  const time = useRef(0);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Update hover point from mouse position
    hoverPoint.current.set((mouse.current.x * 5), (mouse.current.y * 5), 0);
    
    // Common animation for all variants
    mesh.current.rotation.y += 0.002;
    
    // Get mouse world position
    const mouseX = mouse.current.x * 5;
    const mouseY = mouse.current.y * 5;

    // Animate based on variant type
    if (variant === 'bars') {
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
    } else if (variant === 'scatter') {
      mesh.current.children.forEach((child, i) => {
        if (i < data.length) {
          // Make points pulse when mouse is near
          const childPos = new THREE.Vector3().setFromMatrixPosition(child.matrixWorld);
          const distance = childPos.distanceTo(hoverPoint.current);
          
          if (distance < 2) {
            const scale = 1 + (1 - distance / 2) * 1;
            child.scale.set(
              data[i].originalScale[0] * scale,
              data[i].originalScale[1] * scale,
              data[i].originalScale[2] * scale
            );
          } else {
            child.scale.set(
              data[i].originalScale[0],
              data[i].originalScale[1],
              data[i].originalScale[2]
            );
          }
        }
      });
    } else if (variant === 'wave') {
      // Update time for wave animation
      time.current += 0.01;
      
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
    }
  });

  return (
    <group ref={mesh}>
      {/* Render different visualizations based on the variant */}
      {variant === 'bars' && data.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} opacity={0.8} transparent={true} />
        </mesh>
      ))}
      
      {variant === 'scatter' && data.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={color} opacity={0.7} transparent={true} />
        </mesh>
      ))}
      
      {variant === 'scatter' && connections.map((line, i) => (
        <Line
          key={`line-${i}`}
          points={[line.start, line.end]}
          color={color}
          lineWidth={1}
          opacity={line.opacity * 0.2}
          transparent
        />
      ))}
      
      {variant === 'wave' && data.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={color} opacity={0.7} transparent={true} />
        </mesh>
      ))}
    </group>
  );
};

export default DataVisualization;
