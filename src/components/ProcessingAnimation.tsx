
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingAnimationProps {
  message?: string;
}

const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ 
  message = "Processing your data..." 
}) => {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Increase progress gradually but never reach 100%
        // This gives the impression of progress while we wait for the actual result
        if (prevProgress >= 95) {
          return 95;
        }
        return prevProgress + Math.random() * 3;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-10 px-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
      
      <h3 className="text-xl font-medium text-center">{message}</h3>
      
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center mt-2">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
