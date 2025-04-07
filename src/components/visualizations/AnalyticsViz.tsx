
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { VisualizationProps, generatePointColors } from './types';

const AnalyticsViz = ({ count = 250, mouse, speed = 0.15, size = 0.06, color = '#8B5CF6' }: VisualizationProps) => {
  const mesh = useRef<THREE.Group>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  const time = useRef(0);
  
  // Generate richer data visualization with multiple components
  const { dataPoints, connections, surfaces, axes } = useMemo(() => {
    const points = [];
    const lines = [];
    const surfaces = [];
    
    // Create core structure - a data landscape
    const gridSize = Math.ceil(Math.sqrt(count * 0.5));
    const spacing = 0.5;
    
    // Create main data sphere with more points
    const sphereRadius = 4.5;
    for (let i = 0; i < count * 0.6; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);
      
      // Add some randomization for more natural look
      const jitter = 0.6;
      const jx = x + (Math.random() - 0.5) * jitter;
      const jy = y + (Math.random() - 0.5) * jitter;
      const jz = z + (Math.random() - 0.5) * jitter;
      
      points.push({
        position: [jx, jy, jz],
        scale: [size * 5, size * 5, size * 5],
        originalPosition: [jx, jy, jz],
        originalScale: [size * 5, size * 5, size * 5],
        rotation: [0, 0, 0],
        type: 'sphere'
      });
    }
    
    // Add data clusters - dense areas of points
    for (let c = 0; c < 5; c++) {
      // Create a cluster center
      const clusterX = (Math.random() - 0.5) * 8;
      const clusterY = (Math.random() - 0.5) * 8;
      const clusterZ = (Math.random() - 0.5) * 8;
      const clusterSize = Math.random() * 1.5 + 0.8;
      
      // Add the cluster center as a slightly larger point
      points.push({
        position: [clusterX, clusterY, clusterZ],
        scale: [size * 10, size * 10, size * 10],
        originalPosition: [clusterX, clusterY, clusterZ],
        originalScale: [size * 10, size * 10, size * 10],
        rotation: [0, 0, 0],
        type: 'cluster'
      });
      
      // Add points around this cluster
      for (let i = 0; i < count * 0.08; i++) {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        
        const x = clusterX + Math.sin(angle1) * Math.cos(angle2) * clusterSize * Math.random();
        const y = clusterY + Math.sin(angle1) * Math.sin(angle2) * clusterSize * Math.random();
        const z = clusterZ + Math.cos(angle1) * clusterSize * Math.random();
        
        points.push({
          position: [x, y, z],
          scale: [size * 4, size * 4, size * 4],
          originalPosition: [x, y, z],
          originalScale: [size * 4, size * 4, size * 4],
          rotation: [0, 0, 0],
          type: 'clusterPoint'
        });
      }
    }
    
    // Add flowing data streams
    const streamCount = 4;
    for (let s = 0; s < streamCount; s++) {
      const streamPoints = 15;
      const streamStart = [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      ];
      
      const streamEnd = [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      ];
      
      const streamPoints3D = [];
      
      // Create points along the stream path with a curve
      for (let i = 0; i < streamPoints; i++) {
        const t = i / (streamPoints - 1);
        const curveHeight = Math.sin(t * Math.PI) * 2;
        
        const x = streamStart[0] * (1 - t) + streamEnd[0] * t;
        const y = streamStart[1] * (1 - t) + streamEnd[1] * t + curveHeight;
        const z = streamStart[2] * (1 - t) + streamEnd[2] * t;
        
        // Store the 3D point for the line
        streamPoints3D.push([x, y, z] as [number, number, number]);
        
        // Add data point
        points.push({
          position: [x, y, z],
          scale: [size * 4, size * 4, size * 4],
          originalPosition: [x, y, z],
          originalScale: [size * 4, size * 4, size * 4],
          rotation: [0, 0, 0],
          type: 'stream',
          streamId: s
        });
      }
      
      // Add the stream line
      lines.push({
        points: streamPoints3D,
        color: color,
        width: 0.5,
        opacity: 0.3,
        type: 'stream'
      });
    }
    
    // Create more connections for network effect
    // Connect points that are closer together
    for (let i = 0; i < points.length; i += 3) { // Skip some points for performance
      const p1 = points[i].position;
      for (let j = i + 1; j < points.length; j += 3) {
        const p2 = points[j].position;
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        const dz = p1[2] - p2[2];
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (distance < 2.5) {
          // Create connection with fade based on distance
          lines.push({
            points: [p1, p2] as [number[], number[]],
            color: color,
            width: 0.2,
            opacity: 0.1 + (1 - distance/2.5) * 0.2,
            type: 'connection'
          });
        }
      }
    }
    
    // Create coordinate data axes (x, y, z)
    const axesData = [
      // X-axis
      { 
        points: [[-6, 0, 0], [6, 0, 0]] as [number[], number[]],
        color: '#FF5555',
        width: 0.8,
        opacity: 0.4,
        type: 'axis'
      },
      // Y-axis  
      {
        points: [[0, -6, 0], [0, 6, 0]] as [number[], number[]],
        color: '#55FF55', 
        width: 0.8,
        opacity: 0.4,
        type: 'axis'
      },
      // Z-axis
      {
        points: [[0, 0, -6], [0, 0, 6]] as [number[], number[]],
        color: '#5555FF',
        width: 0.8, 
        opacity: 0.4,
        type: 'axis'
      }
    ];
    
    // Create abstract data surface - a parametric surface
    const surfaceMesh = {
      position: [0, 0, 0] as [number, number, number],
      scale: [3.5, 3.5, 3.5] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      color: color,
      opacity: 0.2,
      distort: 1.5
    };
    
    return { 
      dataPoints: points, 
      connections: [...lines], 
      axes: axesData,
      surfaces: [surfaceMesh]
    };
  }, [count, size, color]);

  // Generate point colors with depth gradient
  const pointsColors = useMemo(() => {
    return generatePointColors(dataPoints, color);
  }, [dataPoints, color]);

  // Animation
  useFrame(() => {
    if (!mesh.current) return;
    
    time.current += 0.01;
    
    // Update hover point from mouse position
    hoverPoint.current.set(mouse.current.x * 10, mouse.current.y * 10, 0);
    
    // Core animation - smooth rotation based on mouse position
    mesh.current.rotation.y += speed * 0.05;
    mesh.current.rotation.x = (mouse.current.y * 0.2) * (1 - Math.abs(mouse.current.x) * 0.5);
    
    // Animate points
    mesh.current.children.forEach((child) => {
      if (!child.userData.type) return;
      
      const childWorldPos = new THREE.Vector3();
      child.getWorldPosition(childWorldPos);
      const dist = childWorldPos.distanceTo(hoverPoint.current);
      
      switch (child.userData.type) {
        case 'sphere': {
          // Points on the sphere - subtle pulsating
          const pulseFactor = Math.sin(time.current + child.position.x + child.position.z) * 0.05;
          child.scale.multiplyScalar(1 + pulseFactor);
          
          // Hover effect - inflate near mouse cursor
          if (dist < 4) {
            const scale = 1 + (1 - dist / 4) * 0.8;
            child.scale.multiplyScalar(scale);
          }
          break;
        }
        
        case 'cluster': {
          // Cluster centers pulse more visibly
          const pulseFactor = Math.sin(time.current * 2) * 0.15 + 1;
          child.scale.set(
            child.userData.originalScale[0] * pulseFactor,
            child.userData.originalScale[1] * pulseFactor,
            child.userData.originalScale[2] * pulseFactor
          );
          break;
        }
        
        case 'clusterPoint': {
          // Small movement and hover effect
          child.position.x += Math.sin(time.current + child.position.z) * 0.002;
          child.position.y += Math.cos(time.current + child.position.x) * 0.002;
          child.position.z += Math.sin(time.current * 0.7 + child.position.y) * 0.002;
          
          // Hover highlight
          if (dist < 3) {
            const scale = 1 + (1 - dist / 3) * 0.7;
            child.scale.multiplyScalar(scale);
          }
          break;
        }
        
        case 'stream': {
          // Stream points flow along their path
          const streamId = child.userData.streamId || 0;
          const offset = (time.current * 0.5 + streamId) % 1;
          const pos = child.userData.originalPosition;
          
          child.position.x = pos[0];
          child.position.y = pos[1] + Math.sin(time.current * 2 + streamId * Math.PI * 2) * 0.2;
          child.position.z = pos[2];
          
          // Pulsate and hover effect
          if (dist < 2.5) {
            const scale = 1 + (1 - dist / 2.5) * 0.8;
            child.scale.multiplyScalar(scale);
          }
          break;
        }
      }
    });
  });

  return (
    <group ref={mesh}>
      {/* Main data points */}
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dataPoints.length}
            array={new Float32Array(dataPoints.flatMap(d => d.position))}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={dataPoints.length}
            array={pointsColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          transparent
          vertexColors
          size={size * 12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Data connections */}
      {connections.map((connection, i) => (
        <Line
          key={`line-${i}`}
          points={connection.points}
          color={connection.color}
          lineWidth={connection.width}
          transparent
          opacity={connection.opacity}
        />
      ))}
      
      {/* Coordinate axes */}
      {axes.map((axis, i) => (
        <Line
          key={`axis-${i}`}
          points={axis.points}
          color={axis.color}
          lineWidth={axis.width}
          transparent
          opacity={axis.opacity}
        />
      ))}
      
      {/* Abstract data surface */}
      {surfaces.map((surface, i) => (
        <mesh 
          key={`surface-${i}`} 
          position={surface.position} 
          scale={surface.scale} 
          rotation={surface.rotation}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            color={surface.color}
            transparent
            opacity={surface.opacity}
            distort={surface.distort}
            speed={0.8}
          />
        </mesh>
      ))}
      
      {/* Create a core data center sphere */}
      <Sphere args={[1.8, 16, 16]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={0.6}
        />
      </Sphere>
    </group>
  );
};

export default AnalyticsViz;
