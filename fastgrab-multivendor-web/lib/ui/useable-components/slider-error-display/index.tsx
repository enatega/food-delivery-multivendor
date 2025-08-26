import React from 'react';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12 text-red-500 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
      <p className="text-red-600 text-center mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;