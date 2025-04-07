
import * as THREE from 'three';

export interface VisualizationProps {
  count?: number;
  mouse: React.MutableRefObject<THREE.Vector2>;
  speed?: number;
  size?: number;
  color?: string;
}

export interface PointData {
  position: [number, number, number];
  originalPosition?: [number, number, number];
  scale: [number, number, number];
  originalScale?: [number, number, number];
  flowDirection?: [number, number, number];
  connections?: number[];
  height?: number;
  originalHeight?: number;
  originalY?: number;
  rotation?: [number, number, number];
}

export interface ConnectionLine {
  start: [number, number, number];
  end: [number, number, number];
  opacity: number;
}

export const getPointMaterial = (baseColor: string, size: number) => {
  return {
    transparent: true,
    vertexColors: true,
    size: size * 10,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: baseColor,
  };
};

export const generatePointColors = (data: PointData[], baseColor: string) => {
  // Create color array for vertices
  const colors = new Float32Array(data.length * 3);
  const color = new THREE.Color(baseColor);
  
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
};
