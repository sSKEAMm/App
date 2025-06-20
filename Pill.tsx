
import React from 'react';

interface PillProps {
  text: string;
  color?: string; // e.g. 'bg-blue-500 text-white'
  icon?: React.ReactNode;
}

const Pill: React.FC<PillProps> = ({ text, color = 'bg-gray-200 text-gray-700', icon }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} m-0.5`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {text}
    </span>
  );
};

export default Pill;
