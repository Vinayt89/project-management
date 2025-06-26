
import React from 'react';
import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, buttonText, onButtonClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {buttonText && (
        <Button onClick={onButtonClick} className="bg-blue-500 hover:bg-blue-600">
          + {buttonText}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
