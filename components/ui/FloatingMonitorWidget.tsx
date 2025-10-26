import React from 'react';

const FloatingMonitorWidget: React.FC = () => {
  return (
    <div className="fixed bottom-24 right-6 bg-secondary-bg p-3 rounded-lg shadow-lg z-20 hidden lg:block">
      <p className="text-sm text-soft-gray">Screen Monitor Widget</p>
    </div>
  );
};

export default FloatingMonitorWidget;
