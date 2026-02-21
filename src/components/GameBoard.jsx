'use client';

import { useMemo } from 'react';
import Cell from './Cell';

// Winning combinations for highlighting
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

export function GameBoard({
    board = '---------',
    onCellClick,
    disabled = false,
    winningLine = null,
    lastMovePosition = null,
}) {
    const cells = board.split('');

    // Find winning cells
    const winningCells = useMemo(() => {
        if (!winningLine) {
            // Auto-detect from board
            for (const [a, b, c] of WINNING_COMBINATIONS) {
                if (cells[a] !== '-' && cells[a] === cells[b] && cells[b] === cells[c]) {
                    return [a, b, c];
                }
            }
        }
        return winningLine || [];
    }, [cells, winningLine]);

    return (
        <div className="flex justify-center w-full px-2">
            <div className="glass-card p-3 sm:p-5 w-full" style={{ maxWidth: '380px' }}>
                <div
                    className="grid gap-2 sm:gap-3 w-full"
                    style={{
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        aspectRatio: '1',
                    }}
                >
                    {cells.slice(0, 9).map((value, index) => (
                        <Cell
                            key={index}
                            value={value === '-' ? null : value}
                            onClick={() => onCellClick?.(index)}
                            disabled={disabled}
                            isWinning={winningCells.includes(index)}
                            isLastMove={lastMovePosition === index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GameBoard;
