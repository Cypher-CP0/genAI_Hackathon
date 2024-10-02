// src/components/ui/textarea.js

import React from "react";

const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
};

export { Textarea };
