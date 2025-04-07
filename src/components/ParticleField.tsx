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
  variant?: 'dataGlobe' | 'flowField' | 'network' | 'bars' | 'scatter' | 'wave';
}

const DataVisualization = ({ 
  count = 100, 
  mouse, 
  speed = 0.15, 
  size = 0.06, 
  color = '#8B5CF6',
  variant = 'dataGlobe' 
}: DataVisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  
  // Generate data points based on the visualization type
  const data = useMemo(() => {
    const points = [];
    
    if (variant === 'dataGlobe') {
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
    } else if (variant === 'flowField') {
      // Create a flow field visualization (like data streams)
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
    } else if (variant === 'network') {
      // Create a network graph visualization
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
          }
        }
      }
    } else if (variant === 'bars') {
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
  
  // Connection lines for network and data globe visualizations
  const connections = useMemo(() => {
    const lines = [];
    
    if (variant === 'network') {
      // Add connections between nodes based on the connections array
      for (let i = 0; i < data.length; i++) {
        const connections = data[i]?.connections || [];
        const p1 = data[i].position;
        
        for (let j = 0; j < connections.length; j++) {
          const connIdx = connections[j];
          if (connIdx > i) { // Avoid duplicate lines
            const p2 = data[connIdx].position;
            lines.push({
              start: [...p1],
              end: [...p2],
              opacity: 0.2 + Math.random() * 0.3
            });
          }
        }
      }
    } else if (variant === 'dataGlobe') {
      // Create connections between points on the globe surface
      const connectionsPerPoint = 2;
      
      for (let i = 0; i < data.length; i++) {
        if (i >= count * 0.75) continue; // Don't connect inner points
        
        const p1 = data[i].position;
        
        // Find nearest neighbors
        const distances = [];
        for (let j = 0; j < data.length; j++) {
          if (i !== j && j < count * 0.75) { // Only connect surface points
            const p2 = data[j].position;
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
            const p2 = data[j].position;
            lines.push({
              start: [...p1],
              end: [...p2],
              opacity: 0.15 + Math.random() * 0.15
            });
          }
        }
      }
    } else if (variant === 'scatter') {
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
    }
    
    return lines;
  }, [data, variant, count]);

  // Animation
  const time = useRef(0);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    time.current += 0.01;
    
    // Update hover point from mouse position
    hoverPoint.current.set((mouse.current.x * 5), (mouse.current.y * 5), 0);
    
    // Common animation for all variants
    if (variant === 'dataGlobe' || variant === 'flowField' || variant === 'network') {
      mesh.current.rotation.y += speed * 0.1;
    } else {
      mesh.current.rotation.y += 0.002;
    }
    
    // Get mouse world position
    const mouseX = mouse.current.x * 5;
    const mouseY = mouse.current.y * 5;

    // Variant-specific animations
    if (variant === 'dataGlobe') {
      // Data globe animation - points pulsate and follow mouse movement
      mesh.current.rotation.x = mouse.current.y * 0.2;
      mesh.current.rotation.z = mouse.current.x * -0.1;
      
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
    } else if (variant === 'flowField') {
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
    } else if (variant === 'network') {
      // Network graph animation
      // Gently rotate in response to mouse
      mesh.current.rotation.x = mouse.current.y * 0.3;
      mesh.current.rotation.z = mouse.current.x * -0.2;
      
      mesh.current.children.forEach((child, i) => {
        if (i < data.length) {
          // Pulsating effect with slight motion
          const timeFactor = Math.sin(time.current + i * 0.2);
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
    } else if (variant === 'bars') {
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

  // Calculate point colors with depth gradient
  const getPointMaterial = (baseColor: string) => {
    const color = new THREE.Color(baseColor);
    const h = new THREE.Color().setHSL(color.getHSL({ h: 0, s: 0, l: 0 }).h, 0.8, 0.6);
    
    return (
      <PointMaterial 
        transparent
        vertexColors
        size={size * 10}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={baseColor}
      />
    );
  };
  
  // Set vertex colors for depth and highlight effects
  const pointsColors = useMemo(() => {
    if (!data.length) return [];
    
    // Create color array for vertices
    const colors = new Float32Array(data.length * 3);
    const color = new THREE.Color(color);
    
    for (let i = 0; i < data.length; i++) {
      // Vary color based on distance from center
      const point = data[i].position;
      const distance = Math.sqrt(point[0] * point[0] + point[1] * point[1] + point[2] * point[2]);
      const maxDist = 5; // Approximate max distance
      
      // Adjust saturation and lightness based on distance
      const h = color.getHSL({ h: 0, s: 0, l: 0 }).h;
      const s = 0.5 + 0.5 * (1 - Math.min(distance / maxDist, 1));
      const l = 0.5 + 0.3 * (1 - Math.min(distance / maxDist, 1));
      
      color.setHSL(h, s, l);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return colors;
  }, [data, color]);

  return (
    <group ref={mesh}>
      {/* Create different visualizations based on the variant */}
      {variant === 'dataGlobe' && (
        <>
          {/* Points for the data globe */}
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
            {getPointMaterial(color)}
          </Points>
          
          {/* Connection lines */}
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
        </>
      )}
      
      {variant === 'flowField' && (
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
          {getPointMaterial(color)}
        </Points>
      )}
      
      {variant === 'network' && (
        <>
          {/* Network nodes */}
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
            {getPointMaterial(color)}
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
        </>
      )}
      
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
