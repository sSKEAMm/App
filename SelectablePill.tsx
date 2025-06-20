
import React from 'react';

interface SelectablePillProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  colorConfig?: {
    selectedBg: string; // e.g., 'bg-green-500'
    selectedText: string; // e.g., 'text-white'
    defaultBg: string; // e.g., 'bg-gray-200'
    defaultText: string; // e.g., 'text-gray-700'
  };
}

const SelectablePill: React.FC<SelectablePillProps> = ({
  label,
  isSelected,
  onSelect,
  colorConfig = {
    selectedBg: 'bg-green-500',
    selectedText: 'text-white',
    defaultBg: 'bg-gray-200',
    defaultText: 'text-gray-700',
  },
}) => {
  const baseClasses = 'px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1';
  const selectedClasses = `${colorConfig.selectedBg} ${colorConfig.selectedText} focus:ring-green-400`;
  const defaultClasses = `${colorConfig.defaultBg} ${colorConfig.defaultText} hover:bg-gray-300 focus:ring-gray-400`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
};

export default SelectablePill;
