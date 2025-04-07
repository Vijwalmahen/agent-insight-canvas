
import { useRef } from 'react';
import * as THREE from 'three';
import { 
  DataGlobe, 
  FlowField, 
  Network,
  BarChart,
  ScatterPlot,
  WaveSurface,
  AnalyticsViz
} from './visualizations';
import { VisualizationProps } from './visualizations/types';

interface DataVisualizationProps extends VisualizationProps {
  variant?: 'dataGlobe' | 'flowField' | 'network' | 'bars' | 'scatter' | 'wave' | 'analytics';
}

const DataVisualization = ({ 
  count = 100, 
  mouse, 
  speed = 0.15, 
  size = 0.06, 
  color = '#8B5CF6',
  variant = 'dataGlobe' 
}: DataVisualizationProps) => {
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  
  // Render different visualization based on variant prop
  switch (variant) {
    case 'flowField':
      return <FlowField count={count} mouse={mouse} speed={speed} size={size} color={color} />;
    case 'network':
      return <Network count={count} mouse={mouse} speed={speed} size={size} color={color} />;
    case 'bars':
      return <BarChart count={count} mouse={mouse} speed={speed} color={color} />;
    case 'scatter':
      return <ScatterPlot count={count} mouse={mouse} speed={speed} size={size} color={color} />;
    case 'wave':
      return <WaveSurface count={count} mouse={mouse} speed={speed} color={color} />;
    case 'analytics':
      return <AnalyticsViz count={count} mouse={mouse} speed={speed} size={size} color={color} />;
    case 'dataGlobe':
    default:
      return <DataGlobe count={count} mouse={mouse} speed={speed} size={size} color={color} />;
  }
};

export default DataVisualization;
