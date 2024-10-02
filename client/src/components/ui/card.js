import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`shadow-lg p-6 rounded-lg bg-white ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={`border-b pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h2 className={`text-2xl font-bold ${className}`}>
      {children}
    </h2>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardDescription = ({ children, className }) => {
  return (
    <p className={`text-gray-600 ${className}`}>
      {children}
    </p>
  );
};
