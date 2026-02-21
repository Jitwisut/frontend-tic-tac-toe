'use client';

import { XIcon, OIcon } from './Cell';

export function PlayerCard({
    player,
    symbol,
    isCurrentTurn = false,
    isWinner = false,
    isYou = false,
}) {
    if (!player) {
        return (
            <div className="glass-card p-3 sm:p-4 flex flex-col items-center gap-2 opacity-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--glass-bg)] flex items-center justify-center border border-[var(--glass-border)]">
                    <span className="text-xl sm:text-2xl">?</span>
                </div>
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">รอผู้เล่น...</p>
                    <p className="font-semibold text-sm">ว่าง</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`
        glass-card p-3 sm:p-4 flex flex-col items-center gap-2 transition-all duration-300
        ${isCurrentTurn ? 'glow-active' : ''}
        ${isWinner ? 'border-[var(--success)] bg-[var(--success)]/10' : ''}
      `}
        >
            <div
                className={`
          w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
          ${symbol === 'X' ? 'bg-[var(--x-color)]/20 text-[var(--x-color)]' : 'bg-[var(--o-color)]/20 text-[var(--o-color)]'}
        `}
            >
                {symbol === 'X' ? (
                    <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                    <OIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
            </div>
            <div className="text-center min-w-0 w-full">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-sm sm:text-base truncate max-w-[80px] sm:max-w-[120px]">{player.username}</p>
                    {isYou && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] whitespace-nowrap">
                            คุณ
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    {isCurrentTurn && (
                        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                    )}
                    <p className="text-xs text-[var(--foreground-muted)]">
                        {isCurrentTurn ? '🎮 กำลังเล่น' : isWinner ? '🏆 ชนะ!' : `ผู้เล่น ${symbol}`}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;
