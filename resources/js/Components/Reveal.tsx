import { __ } from 'laravel-translator';
import { useState } from 'react';

interface RevealProps {
  text?: string | null; // Make text optional and allow null
  lineClamp: number;
}

const Reveal: React.FC<RevealProps> = ({ text = '', lineClamp }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Add null check before calling split
  const shouldShowExpand = text
    ? text.split(' ').length > lineClamp * 10
    : false;

  return (
    <div>
      <div
        className={`cursor-pointer ${!isExpanded ? `line-clamp-${lineClamp}` : ''}`}
        onClick={toggleExpand}
      >
        {text || ''} {/* Use empty string if text is null */}
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
