import { __ } from 'laravel-translator';
import { useState } from 'react';

interface RevealProps {
  text?: string; // Make text optional
  lineClamp: number;
}

const Reveal: React.FC<RevealProps> = ({ text = '', lineClamp }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowExpand = text.split(' ').length > lineClamp * 10; // Rough estimate of words per line

  return (
    <div>
      <div
        className={`cursor-pointer ${!isExpanded ? `line-clamp-${lineClamp}` : ''}`}
        onClick={toggleExpand}
      >
        {text}
      </div>
      {shouldShowExpand && (
        <span className="text-blue-500 hover:underline" onClick={toggleExpand}>
          {isExpanded ? __('messages.see_less') : __('messages.see_more')}
        </span>
      )}
    </div>
  );
};

export default Reveal;
