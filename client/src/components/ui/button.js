// Named export example for button.js

import React from 'react';
import { cn } from '../../lib/utils'; // Adjust path as necessary

// Button Component
export const Button = ({ className, ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition duration-150 ease-in-out',
        className
      )}
      {...props}
    />
  );
};

// No `export default` statement here for named export
