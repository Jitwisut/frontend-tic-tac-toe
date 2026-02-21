'use client';

import { useEffect, useState } from 'react';

// Simple confetti particle
function ConfettiParticle({ delay, left }) {
    const colors = ['#F97316', '#F59E0B', '#FB923C', '#FBBF24', '#10B981'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div
            className="absolute w-3 h-3 rounded-full"
            style={{
                left: `${left}%`,
                backgroundColor: color,
                animation: `confetti-fall 2s ease-out ${delay}s forwards`,
                opacity: 0,
            }}
        />
    );
}

export function WinModal({
    isOpen,
    onClose,
    winner,
    isDraw = false,
    onPlayAgain,
    onGoHome,
}) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen && !isDraw) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isDraw]);

    if (!isOpen) return null;

    return (
        <>
            {/* Confetti */}
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <ConfettiParticle
                            key={i}
                            delay={Math.random() * 0.5}
                            left={Math.random() * 100}
                        />
                    ))}
                </div>
            )}

            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="glass-card p-8 max-w-md w-full text-center slide-up">
                    {/* Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl float"
                        style={{
                            background: isDraw
                                ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
                                : 'linear-gradient(135deg, #10B981 0%, #F59E0B 100%)'
                        }}
                    >
                        {isDraw ? '🤝' : '🏆'}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold mb-2 gradient-text">
                        {isDraw ? 'เสมอ!' : 'ชนะ!'}
                    </h2>

                    {/* Winner name */}
                    {winner && !isDraw && (
                        <p className="text-xl text-[var(--foreground-muted)] mb-6">
                            🎉 <span className="text-[var(--foreground)] font-semibold">{winner.username}</span> ชนะเกมนี้!
                        </p>
                    )}

                    {isDraw && (
                        <p className="text-lg text-[var(--foreground-muted)] mb-6">
                            ไม่มีใครชนะ ลองอีกครั้ง!
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {onPlayAgain && (
                            <button onClick={onPlayAgain} className="btn-primary flex-1">
                                เล่นอีกครั้ง
                            </button>
                        )}
                        <button onClick={onGoHome || onClose} className="btn-secondary flex-1">
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WinModal;
