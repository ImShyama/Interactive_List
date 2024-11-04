import React, { useState, useEffect } from 'react';

const Alert = ({ message, type, show, duration = 5000, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration); // Auto remove after 5 seconds
      return () => clearTimeout(timer); // Clear timeout if the component unmounts or show becomes false
    }
  }, [show, duration, onClose]);

  if (!show) return null; // Hide if show is false

  // Alert styles based on type
  const alertStyles = {
    success: 'bg-green-100 text-green-700 border-green-400',
    error: 'bg-red-100 text-red-700 border-red-400',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 border rounded-lg shadow-lg ${alertStyles[type]}`} role="alert">
      <span>{message}</span>
      
      {/* Progress Bar */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div
          className="bg-blue-500 h-1 rounded-full"
          style={{
            animation: `progress ${duration}ms linear`,
          }}
        ></div>
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Alert;
