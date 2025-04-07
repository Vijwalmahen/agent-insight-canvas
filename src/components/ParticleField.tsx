
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

interface ParticleProps {
  count?: number;
  mouse: React.MutableRefObject<THREE.Vector2>;
  speed?: number;
  size?: number;
  color?: string;
}

const ParticleField = ({ count = 1000, mouse, speed = 0.1, size = 0.02, color = '#8B5CF6' }: ParticleProps) => {
  const mesh = useRef<THREE.Points>(null);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      
      temp.push({ x, y, z, vx: 0, vy: 0, vz: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    
    // Update positions
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const sizes = mesh.current.geometry.attributes.size.array as Float32Array;
    
    // Convert mouse position to 3D space
    hoverPoint.current.set((mouse.current.x * 3), (mouse.current.y * 3), 0);
    
    for (let i = 0; i < particles.length; i++) {
      const i3 = i * 3;
      const particle = particles[i];
      
      // Get current position
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Calculate distance to mouse
      const dx = hoverPoint.current.x - x;
      const dy = hoverPoint.current.y - y;
      const dz = hoverPoint.current.z - z;
      
      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const force = Math.max(0, 1 - distance / 1.5);
      
      // Apply force toward or away from mouse
      if (distance < 1.5) {
        particle.vx += dx * force * 0.01;
        particle.vy += dy * force * 0.01;
        particle.vz += dz * force * 0.01;
        
        // Make particles near mouse larger
        sizes[i] = size * (1 + force);
      } else {
        // Return to original position
        particle.vx += (particle.x - x) * speed * 0.01;
        particle.vy += (particle.y - y) * speed * 0.01;
        particle.vz += (particle.z - z) * speed * 0.01;
        
        // Reset size
        sizes[i] = size;
      }
      
      // Apply velocity with damping
      positions[i3] += particle.vx;
      positions[i3 + 1] += particle.vy;
      positions[i3 + 2] += particle.vz;
      
      particle.vx *= 0.9;
      particle.vy *= 0.9;
      particle.vz *= 0.9;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;
    
    mesh.current.rotation.x += 0.0005;
    mesh.current.rotation.y += 0.0005;
  });

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

  return (
    <points ref={mesh}>
      <bufferGeometry {...particlesGeometry} />
      <PointMaterial
        size={size}
        sizeAttenuation={true}
        color={color}
        transparent
        opacity={0.8}
      />
    </points>
  );
};

export default ParticleField;
