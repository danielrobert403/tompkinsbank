import React from 'react';

interface TompkinsLogoProps {
  className?: string;
  textColor?: string;
  leafColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const TompkinsLogo: React.FC<TompkinsLogoProps> = ({
  className = '',
  textColor = 'text-[#004732]',
  leafColor = '#C5832B',
  size = 'md',
  showSubtitle = false,
}) => {
  const textSizes = {
    sm: 'text-lg tracking-wider',
    md: 'text-2xl tracking-wider',
    lg: 'text-3xl tracking-widest',
    xl: 'text-4xl tracking-widest',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-serif font-bold uppercase leading-none ${textSizes[size]} ${textColor}`}>
            TOMPKINS
          </span>
          {/* Authentic Acorn & Oak Leaf Silhouette Motif */}
          <svg
            viewBox="0 0 64 50"
            className={`${iconSizes[size]} shrink-0`}
            fill={leafColor}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Acorn */}
            <path d="M12 28 C10 22 15 18 19 20 C23 22 24 28 20 32 C17 35 13 33 12 28 Z" fill={leafColor} />
            <path d="M17 19 C18 15 22 14 23 18 C24 19 22 21 19 21 C17 21 16 20 17 19 Z" fill="#996017" />
            <path d="M22 15 C23 12 22 10 24 9" stroke="#996017" strokeWidth="2" strokeLinecap="round" />
            {/* Oak Leaf */}
            <path
              d="M26 34 C25 29 27 24 32 23 C31 18 35 14 41 15 C44 11 50 11 54 15 C58 13 63 16 63 21 C64 26 60 29 62 33 C58 37 53 35 50 38 C46 41 41 40 37 42 C33 44 28 41 26 34 Z"
              fill={leafColor}
            />
            {/* Leaf Vein */}
            <path
              d="M30 36 C38 31 46 27 57 20"
              stroke="#A86E20"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {showSubtitle && (
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
            Bank &amp; Trust
          </span>
        )}
      </div>
    </div>
  );
};
