import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import { VisualizationProps, generatePointColors } from './types';

const Network = ({ count = 100, mouse, speed = 0.15, size = 0.06, color = '#10B981' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  const time = useRef(0);
  
  // Generate data points and connections for network visualization
  const { data, connections } = useMemo(() => {
    const points = [];
    const lines = [];
    
    // Generate random nodes in 3D space
    for (let i = 0; i < count; i++) {
      const radius = 4;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      
      points.push({
        position: [x, y, z],
        originalPosition: [x, y, z],
        scale: [size * 4, size * 4, size * 4],
        originalScale: [size * 4, size * 4, size * 4],
        connections: [], // Will be filled with nearby node indices
        rotation: [0, 0, 0]
      });
    }
    
    // Find connections (edges) between nodes
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i].position;
      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j].position;
        const dist = Math.sqrt(
          Math.pow(p1[0] - p2[0], 2) +
          Math.pow(p1[1] - p2[1], 2) +
          Math.pow(p1[2] - p2[2], 2)
        );
        
        // Connect nodes that are close enough
        if (dist < 2) {
          points[i].connections.push(j);
          points[j].connections.push(i);
          
          lines.push({
            start: [...p1],
            end: [...p2],
            opacity: 0.2 + Math.random() * 0.3
          });
        }
      }
    }
    
    return { data: points, connections: lines };
  }, [count, size]);

  // Generate point colors with depth gradient
  const pointsColors = useMemo(() => {
    return generatePointColors(data, color);
  }, [data, color]);

  // Animation
  useFrame(() => {
    if (!mesh.current) return;
    
    time.current += 0.01;
    
    // Update hover point from mouse position
    hoverPoint.current.set((mouse.current.x * 5), (mouse.current.y * 5), 0);
    
    // Gently rotate in response to mouse
    mesh.current.rotation.y += speed * 0.1;
    mesh.current.rotation.x = mouse.current.y * 0.3;
    mesh.current.rotation.z = mouse.current.x * -0.2;
    
    // Network graph animation
    mesh.current.children.forEach((child, i) => {
      if (i < data.length) {
        // Pulsating effect with slight motion
        const wiggle = 0.02;
        
        child.position.x += Math.sin(time.current * 0.5 + i) * wiggle;
        child.position.y += Math.cos(time.current * 0.5 + i) * wiggle;
        child.position.z += Math.sin(time.current * 0.3 + i) * wiggle;
        
        // Keep within bounds of original position
        const origPos = data[i].originalPosition;
        const maxDrift = 0.3;
        
        if (Math.abs(child.position.x - origPos[0]) > maxDrift) {
          child.position.x = origPos[0] + maxDrift * Math.sign(child.position.x - origPos[0]);
        }
        if (Math.abs(child.position.y - origPos[1]) > maxDrift) {
          child.position.y = origPos[1] + maxDrift * Math.sign(child.position.y - origPos[1]);
        }
        if (Math.abs(child.position.z - origPos[2]) > maxDrift) {
          child.position.z = origPos[2] + maxDrift * Math.sign(child.position.z - origPos[2]);
        }
        
        // Interactive highlight
        const childWorldPos = new THREE.Vector3();
        child.getWorldPosition(childWorldPos);
        const distance = hoverPoint.current.distanceTo(childWorldPos);
        
        if (distance < 3) {
          const scale = 1 + (1 - distance / 3) * 1;
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
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.length}
            array={new Float32Array(data.flatMap(d => d.position))}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={data.length}
            array={pointsColors}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial 
          transparent
          vertexColors
          size={size * 10}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={color}
        />
      </Points>
      
      {/* Network connections */}
      {connections.map((line, i) => (
        <Line
          key={`line-${i}`}
          points={[line.start, line.end]}
          color={color}
          lineWidth={0.8}
          opacity={line.opacity}
          transparent
        />
      ))}
    </group>
  );
};

export default Network;
