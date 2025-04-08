import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticleProps {
  count?: number;
  mouse: React.MutableRefObject<THREE.Vector2>;
  speed?: number;
  size?: number;
  color?: string;
  lineOpacity?: number;
  maxConnections?: number;
  connectionDistance?: number;
}

const ParticleField = ({ 
  count = 80, 
  mouse, 
  speed = 0.1, 
  size = 0.04, 
  color = '#8B5CF6',
  lineOpacity = 0.2,
  maxConnections = 3,
  connectionDistance = 2.5
}: ParticleProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      
      temp.push({ 
        x, y, z, 
        vx: (Math.random() - 0.5) * 0.01, 
        vy: (Math.random() - 0.5) * 0.01, 
        vz: (Math.random() - 0.5) * 0.01 
      });
    }
    return temp;
  }, [count]);

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;
      sizes[i] = size;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, [particles, size]);

  const linesGeometry = useMemo(() => {
    return new THREE.BufferGeometry();
  }, []);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: lineOpacity,
    });
  }, [color, lineOpacity]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;
    
    hoverPoint.current.set((mouse.current.x * 7), (mouse.current.y * 7), 0);
    
    for (let i = 0; i < particles.length; i++) {
      const i3 = i * 3;
      const particle = particles[i];
      
      particle.vx += (Math.random() - 0.5) * 0.002;
      particle.vy += (Math.random() - 0.5) * 0.002;
      particle.vz += (Math.random() - 0.5) * 0.002;
      
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      const dx = hoverPoint.current.x - x;
      const dy = hoverPoint.current.y - y;
      const dz = hoverPoint.current.z - z;
      
      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const force = Math.max(0, 1 - distance / 4.0);
      
      if (distance < 4.0) {
        const angle = Math.atan2(dy, dx) + (Math.PI / 2);
        const strength = 0.05 * force;
        
        particle.vx += Math.cos(angle) * strength;
        particle.vy += Math.sin(angle) * strength;
        
        sizes[i] = size * (1 + force * 3);
      } else {
        if (Math.abs(x) > 5) particle.vx -= x * 0.003;
        if (Math.abs(y) > 5) particle.vy -= y * 0.003;
        if (Math.abs(z) > 5) particle.vz -= z * 0.003;
        
        sizes[i] = size;
      }
      
      positions[i3] += particle.vx;
      positions[i3 + 1] += particle.vy;
      positions[i3 + 2] += particle.vz;
      
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      particle.vz *= 0.95;
    }
    
    const connections: number[] = [];
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particles.length; i++) {
      const i3 = i * 3;
      const p1x = posArray[i3];
      const p1y = posArray[i3 + 1];
      const p1z = posArray[i3 + 2];
      
      let connectionsCount = 0;
      
      for (let j = i + 1; j < particles.length && connectionsCount < maxConnections; j++) {
        const j3 = j * 3;
        const p2x = posArray[j3];
        const p2y = posArray[j3 + 1];
        const p2z = posArray[j3 + 2];
        
        const dx = p1x - p2x;
        const dy = p1y - p2y;
        const dz = p1z - p2z;
        
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist < connectionDistance) {
          connections.push(p1x, p1y, p1z, p2x, p2y, p2z);
          connectionsCount++;
        }
      }
    }
    
    linesRef.current.geometry.setAttribute(
      'position', 
      new THREE.Float32BufferAttribute(connections, 3)
    );
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
    
    pointsRef.current.rotation.y += 0.001;
    linesRef.current.rotation.y += 0.001;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry {...particlesGeometry} />
        <pointsMaterial
          size={size}
          sizeAttenuation={true}
          color={color}
          transparent
          opacity={0.8}
          alphaTest={0.01}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <primitive object={lineMaterial} />
      </lineSegments>
    </>
  );
};

export default ParticleField;
