
import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';

interface SceneProps {
  isInteractive?: boolean;
  variant?: 'landing' | 'demo' | 'contact';
}

const Scene = ({ isInteractive = false, variant = 'landing' }: SceneProps) => {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { camera } = useThree();
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      // Enhanced sensitivity for more pronounced effect
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Subtle camera movement following mouse
      if (!isInteractive) {
        // Move camera slightly in the direction of mouse movement
        const targetX = mouse.current.x * 0.3;
        const targetY = mouse.current.y * 0.3;
        
        // Smooth camera animation
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        
        // Always look at the center
        camera.lookAt(0, 0, 0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, isInteractive]);

  // Set different parameters based on the variant
  const getVariantSettings = () => {
    switch(variant) {
      case 'demo':
        return {
          particleCount: 800,
          color: '#4C9EEB',
          size: 0.03,
          speed: 0.2
        };
      case 'contact':
        return {
          particleCount: 500,
          color: '#10B981',
          size: 0.025,
          speed: 0.15
        };
      case 'landing':
      default:
        return {
          particleCount: 1000,
          color: '#8B5CF6',
          size: 0.02,
          speed: 0.1
        };
    }
  };

  const settings = getVariantSettings();
  
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
      <pointLight position={[-10, -10, -5]} color={settings.color} intensity={0.5} />
      
      <ParticleField 
        count={settings.particleCount} 
        mouse={mouse} 
        color={settings.color}
        size={settings.size}
        speed={settings.speed}
      />
      
      {isInteractive && <OrbitControls enableZoom={false} enablePan={false} />}
    </>
  );
};

interface ThreeBackgroundProps {
  isInteractive?: boolean;
  variant?: 'landing' | 'demo' | 'contact';
}

const ThreeBackground = ({ isInteractive = false, variant = 'landing' }: ThreeBackgroundProps) => {
  return (
    <div className={`canvas-container ${isInteractive ? 'interactive' : ''}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        <Scene isInteractive={isInteractive} variant={variant} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
