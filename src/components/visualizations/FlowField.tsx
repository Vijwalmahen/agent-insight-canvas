
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { VisualizationProps, generatePointColors } from './types';

const FlowField = ({ count = 100, mouse, speed = 0.15, size = 0.06, color = '#4C9EEB' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  // Generate data points for the flow field
  const data = useMemo(() => {
    const points = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = 10 / gridSize;
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (points.length < count) {
          const xPos = (x - gridSize / 2) * spacing;
          const zPos = (z - gridSize / 2) * spacing;
          const height = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
          
          points.push({
            position: [xPos, height, zPos],
            originalPosition: [xPos, height, zPos],
            scale: [size * 3, size * 3, size * 3],
            originalScale: [size * 3, size * 3, size * 3],
            flowDirection: [
              Math.sin(x * 0.3) * 0.02,
              Math.cos(z * 0.4) * 0.02,
              Math.sin(x * z * 0.01) * 0.02
            ],
            rotation: [0, 0, 0]
          });
        }
      }
    }
    
    return points;
  }, [count, size]);

  // Calculate point colors with depth gradient
  const pointsColors = useMemo(() => {
    return generatePointColors(data, color);
  }, [data, color]);

  // Animation
  useFrame(() => {
    if (!mesh.current) return;
    
    time.current += 0.01;
    
    // Common animation for rotating the scene
    mesh.current.rotation.y += speed * 0.1;
    
    // Get mouse world position
    const mouseX = mouse.current.x * 5;
    const mouseY = mouse.current.y * 5;

    // Flow field animation - points flow along paths
    mesh.current.children.forEach((child, i) => {
      if (i < data.length && data[i].flowDirection) {
        // Move along flow direction
        child.position.x += data[i].flowDirection[0] * speed * 2;
        child.position.y += data[i].flowDirection[1] * speed * 2;
        child.position.z += data[i].flowDirection[2] * speed * 2;
        
        // Reset if too far from original position
        const origPos = data[i].originalPosition;
        const dist = Math.sqrt(
          Math.pow(child.position.x - origPos[0], 2) +
          Math.pow(child.position.y - origPos[1], 2) +
          Math.pow(child.position.z - origPos[2], 2)
        );
        
        if (dist > 3) {
          child.position.set(origPos[0], origPos[1], origPos[2]);
        }
        
        // Interactive effect with mouse
        const dx = mouseX - child.position.x;
        const dy = mouseY - child.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
          const repelStrength = 0.05 * (1 - distance / 2);
          child.position.x -= dx * repelStrength;
          child.position.y -= dy * repelStrength;
          
          // Highlight affected points
          child.scale.set(
            data[i].originalScale[0] * 1.5,
            data[i].originalScale[1] * 1.5,
            data[i].originalScale[2] * 1.5
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
    </group>
  );
};

export default FlowField;
