
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { VisualizationProps } from './types';

const ScatterPlot = ({ count = 100, mouse, speed = 0.15, size = 0.06, color = '#8B5CF6' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  const time = useRef(0);
  
  // Generate data points for scatter plot
  const { data, connections } = useMemo(() => {
    const points = [];
    const lines = [];
    
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
    
    // Connect points that are close to each other
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i].position;
        const p2 = points[j].position;
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
    
    return { data: points, connections: lines };
  }, [count, size]);

  // Animation
  useFrame(() => {
    if (!mesh.current) return;
    
    time.current += 0.01;
    
    // Update hover point from mouse position
    hoverPoint.current.set((mouse.current.x * 5), (mouse.current.y * 5), 0);
    
    // Rotation
    mesh.current.rotation.y += 0.002;
    
    // Scale points when mouse is near
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
  });

  return (
    <group ref={mesh}>
      {data.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={color} opacity={0.7} transparent={true} />
        </mesh>
      ))}
      
      {connections.map((line, i) => (
        <Line
          key={`line-${i}`}
          points={[line.start, line.end]}
          color={color}
          lineWidth={1}
          opacity={line.opacity * 0.2}
          transparent
        />
      ))}
    </group>
  );
};

export default ScatterPlot;
