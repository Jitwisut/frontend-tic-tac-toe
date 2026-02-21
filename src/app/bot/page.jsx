'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen, LoadingSpinner } from '@/components/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/Toast';
import GameBoard from '@/components/GameBoard';
import WinModal from '@/components/WinModal';
import api from '@/lib/api';

export default function BotPage() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);
    const [makingMove, setMakingMove] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const [lastMovePosition, setLastMovePosition] = useState(null);
    const [goFirst, setGoFirst] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const createGame = async () => {
        setLoading(true);
        try {
            const response = await api.createBotGame(goFirst);
            setGame(response.data.game);
            setLastMovePosition(null);
            setShowWinModal(false);
        } catch (error) {
            showToast(error.message || 'ไม่สามารถสร้างเกมได้', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMove = async (position) => {
        if (!game || makingMove || game.status === 'finished') return;
        if (game.currentTurn !== 'player') {
            showToast('รอ Bot เดิน...', 'error');
            return;
        }

        // 1. Optimistic Update
        const originalGame = { ...game };
        const newBoard = game.board.split('');
        newBoard[position] = game.playerSymbol;

        setGame(prev => ({
            ...prev,
            board: newBoard.join(''),
            currentTurn: 'bot'
        }));
        setLastMovePosition(position);

        setMakingMove(true);

        try {
            const response = await api.makeBotMove(originalGame.id, position, originalGame.version);

            setGame(response.data.game);

            if (response.data.botMove !== undefined && response.data.botMove !== null) {
                setLastMovePosition(response.data.botMove);
            }

            if (response.data.game.status === 'finished') {
                setTimeout(() => setShowWinModal(true), 500);
            }
        } catch (error) {
            // Revert on error
            setGame(originalGame);
            showToast(error.message || 'ไม่สามารถเดินได้', 'error');
        } finally {
            setMakingMove(false);
        }
    };

    const playAgain = () => {
        setGame(null);
        setShowWinModal(false);
        setLastMovePosition(null);
    };

    const goHome = () => {
        router.push('/');
    };

    if (authLoading) {
        return <LoadingScreen message="กำลังตรวจสอบสิทธิ์..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    // --- SETUP SCREEN ---
    if (!game) {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <ToastContainer />
                <div className="glass-card p-6 sm:p-8 max-w-md w-full text-center slide-up">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-4xl sm:text-5xl shadow-lg shadow-orange-500/20 float">
                        🤖
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">เล่นกับ Bot</h1>
                    <p className="text-[var(--foreground-muted)] text-sm mb-6">Bot นี้ใช้ Minimax Algorithm ไม่มีวันแพ้!</p>

                    <div className="mb-6">
                        <p className="text-sm text-[var(--foreground-muted)] mb-3">เลือกว่าใครเดินก่อน</p>
                        <div className="flex gap-3">
                            <button onClick={() => setGoFirst(true)} className={`flex-1 p-3 sm:p-4 rounded-xl border transition-all ${goFirst ? 'border-[var(--primary)] bg-[var(--primary)]/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-[var(--glass-border)] bg-[var(--glass-bg)]'}`}>
                                <span className="text-xl sm:text-2xl block mb-1">👤</span><span className="text-xs sm:text-sm">คุณ (X)</span>
                            </button>
                            <button onClick={() => setGoFirst(false)} className={`flex-1 p-3 sm:p-4 rounded-xl border transition-all ${!goFirst ? 'border-[var(--primary)] bg-[var(--primary)]/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-[var(--glass-border)] bg-[var(--glass-bg)]'}`}>
                                <span className="text-xl sm:text-2xl block mb-1">🤖</span><span className="text-xs sm:text-sm">Bot (X)</span>
                            </button>
                        </div>
                    </div>

                    <button onClick={createGame} className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                        {loading ? <><LoadingSpinner size="sm" /><span>กำลังสร้างเกม...</span></> : 'เริ่มเกม'}
                    </button>
                    <button onClick={goHome} className="btn-secondary w-full mt-3">กลับหน้าหลัก</button>
                </div>
            </div>
        );
    }

    // --- GAME SCREEN ---
    const isPlayerTurn = game.currentTurn === 'player';
    const canMove = game.status === 'in-progress' && isPlayerTurn && !makingMove;

    const getWinnerInfo = () => {
        if (game.winner === 'player') return { username: user?.username || 'คุณ' };
        if (game.winner === 'bot') return { username: 'Bot' };
        return null;
    };

    // Fix: consistent draw detection — null winner + finished status = draw
    const gameIsDraw = !game.winner && game.status === 'finished';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-10"></div>
            </div>

            <ToastContainer />

            <div className="w-full max-w-lg flex flex-col gap-4 sm:gap-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <button onClick={goHome} className="btn-secondary text-xs sm:text-sm !px-3 !py-2 sm:!px-4 sm:!py-2.5">← กลับ</button>
                    <div className="text-center">
                        <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Mode</p>
                        <h1 className="font-bold gradient-text text-lg sm:text-2xl">🤖 vs Bot</h1>
                    </div>
                    <button onClick={playAgain} className="btn-secondary text-xs sm:text-sm !px-3 !py-2 sm:!px-4 sm:!py-2.5">เริ่มใหม่</button>
                </header>

                {/* Status */}
                <div className="text-center">
                    <div className={`inline-block px-5 py-2.5 rounded-full glass-card border border-[var(--glass-border)] shadow-lg transition-all duration-300 ${isPlayerTurn && game.status === 'in-progress' ? 'glow-active' : ''}`}>
                        <div className="text-base sm:text-lg font-medium flex items-center justify-center gap-2 min-h-[28px]">
                            <div className={`transition-opacity duration-200 ${makingMove ? 'opacity-100' : 'opacity-0'} w-5 h-5 flex items-center`}>
                                <LoadingSpinner size="sm" />
                            </div>

                            <span>
                                {game.status === 'finished'
                                    ? (gameIsDraw ? '🤝 เสมอ!' : `🏆 ${game.winner === 'player' ? 'คุณ' : 'Bot'} ชนะ!`)
                                    : (isPlayerTurn ? '🎮 ถึงตาคุณ!' : '⏳ Bot กำลังคิด...')
                                }
                            </span>

                            <div className="w-5"></div>
                        </div>
                    </div>
                </div>

                {/* Players Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Player Card */}
                    <div className={`glass-card p-3 sm:p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${isPlayerTurn && game.status === 'in-progress' ? 'glow-active' : ''}`}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-xl sm:text-2xl">
                            {game.playerSymbol === 'X' ? '👤' : '🤖'}
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm truncate max-w-[100px]">{game.playerSymbol === 'X' ? (user?.username || 'คุณ') : 'Bot'}</p>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                                <span className={`w-2 h-2 rounded-full ${isPlayerTurn ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                <span className="text-xs text-[var(--foreground-muted)]">Player {game.playerSymbol}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bot Card */}
                    <div className={`glass-card p-3 sm:p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${!isPlayerTurn && game.status === 'in-progress' ? 'border-[var(--secondary)] shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}`}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-xl sm:text-2xl">
                            {game.playerSymbol === 'O' ? '👤' : '🤖'}
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm truncate max-w-[100px]">{game.playerSymbol === 'O' ? (user?.username || 'คุณ') : 'Bot'}</p>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                                <span className={`w-2 h-2 rounded-full ${!isPlayerTurn ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                <span className="text-xs text-[var(--foreground-muted)]">Player {game.playerSymbol === 'X' ? 'O' : 'X'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Board */}
                <GameBoard
                    board={game.board}
                    onCellClick={handleMove}
                    disabled={!canMove}
                    lastMovePosition={lastMovePosition}
                />

                {/* Bot Hint */}
                <div className="text-center mt-2">
                    <span className="px-4 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--foreground-muted)] text-xs sm:text-sm">
                        💡 Bot ใช้ Minimax Algorithm (Hard)
                    </span>
                </div>
            </div>

            <WinModal
                isOpen={showWinModal}
                onClose={() => setShowWinModal(false)}
                winner={getWinnerInfo()}
                isDraw={gameIsDraw}
                onPlayAgain={playAgain}
                onGoHome={goHome}
            />
        </div>
    );
}