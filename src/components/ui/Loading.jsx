import React from 'react';

export const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    default: 'w-16 h-16 border-4', 
    large: 'w-24 h-24 border-6',
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.default;
  
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-background">
      <div className="flex flex-col items-center">
        <div className={`${spinnerSize} border-t-accent border-accent/30 rounded-full animate-spin`}></div>
        {text && <p className="mt-4 text-lg font-medium">{text}</p>}
      </div>
    </div>
  );
};

export default Loading; 