'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/Toast';
import GameBoard from '@/components/GameBoard';
import api from '@/lib/api';

export default function ReplayPage({ params }) {
    const { id } = use(params);
    const { loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const [replay, setReplay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated) {
            fetchReplay();
        }
    }, [authLoading, isAuthenticated]);

    const fetchReplay = async () => {
        try {
            const response = await api.getReplay(id);
            setReplay(response.data);
        } catch (error) {
            showToast(error.message || 'ไม่พบข้อมูลเกม', 'error');
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    // Auto-play
    useEffect(() => {
        if (!isPlaying || !replay) return;

        if (currentMoveIndex >= replay.moves.length) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentMoveIndex(prev => prev + 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isPlaying, currentMoveIndex, replay]);

    const getCurrentBoard = () => {
        if (!replay || currentMoveIndex === 0) return '---------';
        const move = replay.moves[currentMoveIndex - 1];
        return move?.boardAfterMove || '---------';
    };

    const getLastMovePosition = () => {
        if (!replay || currentMoveIndex === 0) return null;
        const move = replay.moves[currentMoveIndex - 1];
        return move?.position;
    };

    const goToMove = (index) => {
        setIsPlaying(false);
        setCurrentMoveIndex(index);
    };

    const togglePlay = () => {
        if (currentMoveIndex >= replay.moves.length) {
            setCurrentMoveIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const goHome = () => {
        router.push('/');
    };

    if (authLoading || loading) {
        return <LoadingScreen message="กำลังโหลดข้อมูลเกม..." />;
    }

    if (!replay) {
        return null;
    }

    const { game, moves } = replay;

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <ToastContainer />

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <button onClick={goHome} className="btn-secondary text-sm">
                        ← กลับ
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-[var(--foreground-muted)]">ดูย้อนหลัง</p>
                        <p className="font-mono font-bold gradient-text">{game.code}</p>
                    </div>

                    <div className="w-20" />
                </header>

                {/* Game Info */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--x-color)]/20 flex items-center justify-center text-[var(--x-color)]">
                                X
                            </div>
                            <div>
                                <p className="font-semibold">{game.player1?.username}</p>
                                <p className="text-xs text-[var(--foreground-muted)]">
                                    {game.winner?.id === game.player1?.id ? '🏆 ชนะ' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-2xl font-bold">VS</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div>
                                <p className="font-semibold text-right">{game.player2?.username}</p>
                                <p className="text-xs text-[var(--foreground-muted)] text-right">
                                    {game.winner?.id === game.player2?.id ? '🏆 ชนะ' : ''}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[var(--o-color)]/20 flex items-center justify-center text-[var(--o-color)]">
                                O
                            </div>
                        </div>
                    </div>

                    {game.isDraw && (
                        <p className="text-center mt-3 text-[var(--warning)]">🤝 เสมอ!</p>
                    )}
                </div>

                {/* Game Board */}
                <GameBoard
                    board={getCurrentBoard()}
                    disabled={true}
                    lastMovePosition={getLastMovePosition()}
                />

                {/* Controls */}
                <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                        onClick={() => goToMove(0)}
                        className="btn-secondary"
                        disabled={currentMoveIndex === 0}
                    >
                        ⏮️
                    </button>

                    <button
                        onClick={() => goToMove(Math.max(0, currentMoveIndex - 1))}
                        className="btn-secondary"
                        disabled={currentMoveIndex === 0}
                    >
                        ◀️
                    </button>

                    <button
                        onClick={togglePlay}
                        className="btn-primary px-8"
                    >
                        {isPlaying ? '⏸️ หยุด' : '▶️ เล่น'}
                    </button>

                    <button
                        onClick={() => goToMove(Math.min(moves.length, currentMoveIndex + 1))}
                        className="btn-secondary"
                        disabled={currentMoveIndex >= moves.length}
                    >
                        ▶️
                    </button>

                    <button
                        onClick={() => goToMove(moves.length)}
                        className="btn-secondary"
                        disabled={currentMoveIndex >= moves.length}
                    >
                        ⏭️
                    </button>
                </div>

                {/* Progress */}
                <div className="mt-4 text-center text-[var(--foreground-muted)]">
                    <p>ตาที่ {currentMoveIndex} / {moves.length}</p>
                </div>

                {/* Move History */}
                <div className="mt-6 glass-card p-4">
                    <h3 className="font-semibold mb-3">ประวัติการเดิน</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => goToMove(0)}
                            className={`px-3 py-1 rounded-lg text-sm transition-all ${currentMoveIndex === 0
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]'
                                }`}
                        >
                            เริ่มต้น
                        </button>
                        {moves.map((move, index) => (
                            <button
                                key={index}
                                onClick={() => goToMove(index + 1)}
                                className={`px-3 py-1 rounded-lg text-sm transition-all ${currentMoveIndex === index + 1
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]'
                                    }`}
                            >
                                <span className={move.symbol === 'X' ? 'text-[var(--x-color)]' : 'text-[var(--o-color)]'}>
                                    {move.symbol}
                                </span>
                                →{move.position + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
