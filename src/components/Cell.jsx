'use client';

import { memo } from 'react';

// X Icon SVG
function XIcon({ className = '' }) {
    // If custom className has size classes, use only custom; otherwise use defaults
    const hasCustomSize = className.includes('w-') || className.includes('h-');
    const sizeClass = hasCustomSize ? '' : 'w-10 h-10 sm:w-14 sm:h-14';

    return (
        <svg
            className={`${sizeClass} ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        >
            <path d="M18 6L6 18M6 6l12 12" className="pop" />
        </svg>
    );
}

// O Icon SVG
function OIcon({ className = '' }) {
    const hasCustomSize = className.includes('w-') || className.includes('h-');
    const sizeClass = hasCustomSize ? '' : 'w-10 h-10 sm:w-14 sm:h-14';

    return (
        <svg
            className={`${sizeClass} ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        >
            <circle cx="12" cy="12" r="8" className="pop" />
        </svg>
    );
}

// Cell Component
function Cell({
    value,
    onClick,
    disabled = false,
    isWinning = false,
    isLastMove = false
}) {
    const getSymbol = () => {
        if (value === 'X') return <XIcon />;
        if (value === 'O') return <OIcon />;
        return null;
    };

    const cellClass = `
    cell
    ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}
    ${disabled ? 'disabled' : ''}
    ${isWinning ? 'winning' : ''}
    ${isLastMove ? 'ring-2 ring-yellow-400/50' : ''}
  `;

    return (
        <button
            className={cellClass}
            onClick={onClick}
            disabled={disabled || !!value}
            aria-label={`Cell ${value || 'empty'}`}
        >
            {getSymbol()}
        </button>
    );
}

export default memo(Cell);
export { XIcon, OIcon };
