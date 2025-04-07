
import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import DataVisualization from './ParticleField';

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
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Set different visualization parameters based on the variant
  const getVariantSettings = () => {
    switch(variant) {
      case 'demo':
        return {
          dataPoints: 64,
          color: '#4C9EEB',
          size: 0.04,
          speed: 0.2,
          visualType: 'scatter' as const
        };
      case 'contact':
        return {
          dataPoints: 100,
          color: '#10B981',
          size: 0.03,
          speed: 0.15,
          visualType: 'wave' as const
        };
      case 'landing':
      default:
        return {
          dataPoints: 49,
          color: '#8B5CF6',
          size: 0.05,
          speed: 0.1,
          visualType: 'bars' as const
        };
    }
  };

  const settings = getVariantSettings();
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} color="#8B5CF6" intensity={0.5} />
      
      <DataVisualization 
        count={settings.dataPoints} 
        mouse={mouse} 
        color={settings.color}
        size={settings.size}
        speed={settings.speed}
        variant={settings.visualType}
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
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
        <Scene isInteractive={isInteractive} variant={variant} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
