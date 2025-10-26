import React from 'react';

interface BrainLogoProps extends React.SVGProps<SVGSVGElement> {
    isPulsing?: boolean;
}

const BrainLogo: React.FC<BrainLogoProps> = ({ isPulsing = true, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={isPulsing ? 'animate-pulse' : ''}
      {...props}
    >
      <path d="M9.5 2c-1.78 0-3.46.46-4.8 1.29a5.1 5.1 0 0 0-1.2 1.2C2.46 6.54 2 8.22 2 10c0 1.78.46 3.46 1.29 4.8a5.1 5.1 0 0 0 1.2 1.2c1.34.83 3.02 1.29 4.8 1.29s3.46-.46 4.8-1.29a5.1 5.1 0 0 0 1.2-1.2c.83-1.34 1.29-3.02 1.29-4.8s-.46-3.46-1.29-4.8a5.1 5.1 0 0 0-1.2-1.2C12.96 2.46 11.28 2 9.5 2z" />
      <path d="M14.5 2c1.78 0 3.46.46 4.8 1.29a5.1 5.1 0 0 1 1.2 1.2c.83 1.34 1.29 3.02 1.29 4.8s-.46 3.46-1.29 4.8a5.1 5.1 0 0 1-1.2 1.2c-1.34.83-3.02 1.29-4.8 1.29s-3.46-.46-4.8-1.29a5.1 5.1 0 0 1-1.2-1.2C7.71 13.46 7.25 11.78 7.25 10c0-1.78.46-3.46 1.29-4.8a5.1 5.1 0 0 1 1.2-1.2C11.04 2.46 12.72 2 14.5 2z" />
      <path d="M12 10v4" />
      <path d="M9.5 8c-1.42 0-2.5 1.5-2.5 3s1.08 3 2.5 3" />
      <path d="M14.5 8c1.42 0 2.5 1.5 2.5 3s-1.08 3-2.5 3" />
    </svg>
  );
};

export default BrainLogo;