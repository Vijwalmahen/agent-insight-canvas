
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import { VisualizationProps, generatePointColors } from './types';

const DataGlobe = ({ count = 100, mouse, speed = 0.15, size = 0.06, color = '#8B5CF6' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  const time = useRef(0);
  
  // Generate data points for the globe
  const { data, connections } = useMemo(() => {
    const points = [];
    const lines = [];
    
    // Create points on a sphere surface (data globe)
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = 4 * Math.cos(theta) * Math.sin(phi);
      const y = 4 * Math.sin(theta) * Math.sin(phi);
      const z = 4 * Math.cos(phi);
      
      // Add some randomization for more natural look
      const jitter = 0.3;
      const jx = x + (Math.random() - 0.5) * jitter;
      const jy = y + (Math.random() - 0.5) * jitter;
      const jz = z + (Math.random() - 0.5) * jitter;
      
      points.push({
        position: [jx, jy, jz],
        scale: [size * 5, size * 5, size * 5],
        originalPosition: [jx, jy, jz],
        originalScale: [size * 5, size * 5, size * 5],
        rotation: [0, 0, 0]
      });
    }
    
    // Add some data points inside the globe (representing data clusters)
    for (let i = 0; i < count/3; i++) {
      const radius = 3 * Math.random();
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      points.push({
        position: [x, y, z],
        scale: [size * 3, size * 3, size * 3],
        originalPosition: [x, y, z],
        originalScale: [size * 3, size * 3, size * 3],
        rotation: [0, 0, 0]
      });
    }
    
    // Create connections between points on the globe surface
    const connectionsPerPoint = 2;
    
    for (let i = 0; i < points.length; i++) {
      if (i >= count * 0.75) continue; // Don't connect inner points
      
      const p1 = points[i].position;
      
      // Find nearest neighbors
      const distances = [];
      for (let j = 0; j < points.length; j++) {
        if (i !== j && j < count * 0.75) { // Only connect surface points
          const p2 = points[j].position;
          const distance = Math.sqrt(
            Math.pow(p1[0] - p2[0], 2) + 
            Math.pow(p1[1] - p2[1], 2) + 
            Math.pow(p1[2] - p2[2], 2)
          );
          distances.push({ index: j, distance });
        }
      }
      
      // Sort by distance
      distances.sort((a, b) => a.distance - b.distance);
      
      // Connect to closest neighbors
      for (let k = 0; k < Math.min(connectionsPerPoint, distances.length); k++) {
        const j = distances[k].index;
        if (j > i) { // Avoid duplicate lines
          const p2 = points[j].position;
          lines.push({
            start: [...p1],
            end: [...p2],
            opacity: 0.15 + Math.random() * 0.15
          });
        }
      }
    }
    
    return { data: points, connections: lines };
  }, [count, size]);

  // Generate point colors
  const pointsColors = useMemo(() => {
    return generatePointColors(data, color);
  }, [data, color]);

  // Animation
  useFrame(() => {
    if (!mesh.current) return;
    
    time.current += 0.01;
    
    // Update hover point from mouse position
    hoverPoint.current.set((mouse.current.x * 5), (mouse.current.y * 5), 0);
    
    // Rotate the globe
    mesh.current.rotation.y += speed * 0.1;
    mesh.current.rotation.x = mouse.current.y * 0.2;
    mesh.current.rotation.z = mouse.current.x * -0.1;
    
    // Animate points
    mesh.current.children.forEach((child, i) => {
      if (i < data.length) {
        // Pulsate effect
        const pulseFactor = Math.sin(time.current * 2 + i * 0.1) * 0.05 + 1;
        child.scale.set(
          data[i].originalScale[0] * pulseFactor,
          data[i].originalScale[1] * pulseFactor,
          data[i].originalScale[2] * pulseFactor
        );
        
        // Highlight points near mouse
        const childWorldPos = new THREE.Vector3();
        child.getWorldPosition(childWorldPos);
        const distance = hoverPoint.current.distanceTo(childWorldPos);
        
        if (distance < 3) {
          const intensity = 1 - distance / 3;
          child.scale.multiplyScalar(1 + intensity * 0.5);
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
      
      {connections.map((line, i) => (
        <Line
          key={`line-${i}`}
          points={[line.start, line.end]}
          color={color}
          lineWidth={0.6}
          opacity={line.opacity}
          transparent
          alphaTest={0.2}
        />
      ))}
    </group>
  );
};

export default DataGlobe;
