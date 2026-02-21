"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen, LoadingSpinner } from "@/components/LoadingSpinner";
import { ToastContainer, showToast } from "@/components/Toast";
import GameBoard from "@/components/GameBoard";
import PlayerCard from "@/components/PlayerCard";
import WinModal from "@/components/WinModal";
import api from "@/lib/api";

export default function RoomPage({ params }) {
  const { code } = use(params);
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [making, setMakingMove] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [lastMovePosition, setLastMovePosition] = useState(null);

  // Use ref to track room status to avoid re-render loop in useCallback
  const roomStatusRef = useRef(null);

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    try {
      const response = await api.getRoom(code);
      const newRoom = response.data.room;

      // Check if game just ended
      if (newRoom.status === "finished" && roomStatusRef.current !== "finished") {
        setShowWinModal(true);
      }

      roomStatusRef.current = newRoom.status;
      setRoom(newRoom);

      // Find last move position
      if (newRoom.moves && newRoom.moves.length > 0) {
        const lastMove = newRoom.moves[newRoom.moves.length - 1];
        setLastMovePosition(lastMove?.position);
      }
    } catch (error) {
      console.error("Failed to fetch room:", error);
      showToast(error.message || "ไม่พบห้อง", "error");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [code, router]);

  // Initial fetch
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchRoom();
    }
  }, [authLoading, isAuthenticated, router, fetchRoom]);

  // Polling for game updates (every 2 seconds)
  useEffect(() => {
    if (!room || room.status === "finished") return;

    const interval = setInterval(fetchRoom, 2000);
    return () => clearInterval(interval);
  }, [room?.status, fetchRoom]);

  // Make a move
  const handleMove = async (position) => {
    if (!room || making) return;

    // Validate turn
    const isPlayer1 = room.player1Id === user?.id;
    const isPlayer2 = room.player2Id === user?.id;
    const isMyTurn =
      (isPlayer1 && room.currentTurn === "player1") ||
      (isPlayer2 && room.currentTurn === "player2");

    if (!isMyTurn) {
      showToast("ยังไม่ถึงตาคุณ!", "error");
      return;
    }

    setMakingMove(true);
    try {
      const response = await api.makeMove(room.id, position, room.version);
      const newRoom = response.data.room;
      roomStatusRef.current = newRoom.status;
      setRoom(newRoom);
      setLastMovePosition(position);

      if (newRoom.status === "finished") {
        setShowWinModal(true);
      }
    } catch (error) {
      showToast(error.message || "ไม่สามารถเดินได้", "error");
      // Refresh room state
      fetchRoom();
    } finally {
      setMakingMove(false);
    }
  };

  // Copy invite link
  const copyInviteLink = () => {
    const link = `${code}`;
    navigator.clipboard.writeText(link);
    showToast("คัดลอกรหัสห้องแล้ว!", "success");
  };

  // Go home
  const goHome = () => {
    router.push("/");
  };

  if (authLoading || loading) {
    return <LoadingScreen message="กำลังโหลดห้อง..." />;
  }

  if (!room) {
    return null;
  }

  // Determine game state
  const isPlayer1 =
    (room.player1Id && room.player1Id === user?.id) ||
    room.player1?.id === user?.id;
  const isPlayer2 =
    (room.player2Id && room.player2Id === user?.id) ||
    room.player2?.id === user?.id;
  const isSpectator = !isPlayer1 && !isPlayer2;
  const isMyTurn =
    (isPlayer1 && room.currentTurn === "player1") ||
    (isPlayer2 && room.currentTurn === "player2");
  const canMove = room.status === "in-progress" && isMyTurn && !making;

  // Status message
  const getStatusMessage = () => {
    if (room.status === "waiting") {
      return isPlayer1 ? "รอผู้เล่นคนที่ 2 เข้าร่วม..." : "กำลังเข้าร่วม...";
    }
    if (room.status === "finished") {
      if (room.isDraw) return "🤝 เสมอ!";
      if (room.winner) return `🏆 ${room.winner.username} ชนะ!`;
    }
    if (isSpectator) {
      return room.currentTurn === "player1"
        ? `ตาของ ${room.player1?.username}`
        : `ตาของ ${room.player2?.username}`;
    }
    return isMyTurn ? "🎮 ถึงตาคุณแล้ว!" : "⏳ รอฝ่ายตรงข้าม...";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-10"></div>
      </div>

      <ToastContainer />

      <div className="w-full max-w-lg flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button onClick={goHome} className="btn-secondary text-xs sm:text-sm !px-3 !py-2 sm:!px-4 sm:!py-2.5">
            ← กลับ
          </button>

          <div className="text-center">
            <p className="text-xs text-[var(--foreground-muted)]">รหัสห้อง</p>
            <p className="font-mono text-lg sm:text-xl font-bold gradient-text">{code}</p>
          </div>

          <button onClick={copyInviteLink} className="btn-secondary text-xs sm:text-sm !px-3 !py-2 sm:!px-4 sm:!py-2.5">
            📋 คัดลอก
          </button>
        </header>

        {/* Status */}
        <div className="text-center">
          <div
            className={`inline-block px-5 py-2.5 rounded-full glass-card ${isMyTurn ? "glow-active" : ""}`}
          >
            <div className="text-base sm:text-lg font-medium flex items-center justify-center gap-2">
              {making && <LoadingSpinner size="sm" className="inline" />}
              {getStatusMessage()}
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 gap-3">
          <PlayerCard
            player={room.player1}
            symbol="X"
            isCurrentTurn={
              room.status === "in-progress" && room.currentTurn === "player1"
            }
            isWinner={room.winner?.id === room.player1?.id}
            isYou={isPlayer1}
          />
          <PlayerCard
            player={room.player2}
            symbol="O"
            isCurrentTurn={
              room.status === "in-progress" && room.currentTurn === "player2"
            }
            isWinner={room.winner?.id === room.player2?.id}
            isYou={isPlayer2}
          />
        </div>

        {/* Game Board */}
        <GameBoard
          board={room.board}
          onCellClick={handleMove}
          disabled={!canMove || room.status !== "in-progress"}
          lastMovePosition={lastMovePosition}
        />

        {/* Spectator Badge */}
        {isSpectator && room.status === "in-progress" && (
          <div className="text-center mt-2">
            <span className="px-4 py-2 rounded-full bg-[var(--warning)]/20 text-[var(--warning)] text-sm">
              👀 คุณกำลังดูเกมในฐานะผู้ชม
            </span>
          </div>
        )}

        {/* Waiting Room Actions */}
        {room.status === "waiting" && isPlayer1 && (
          <div className="mt-4 text-center">
            <p className="text-[var(--foreground-muted)] mb-4 text-sm">
              แชร์รหัสห้อง <span className="font-mono font-bold text-[var(--primary)]">{code}</span>{" "}
              ให้เพื่อน
            </p>
            <button onClick={copyInviteLink} className="btn-primary">
              คัดลอกลิงก์เชิญ
            </button>
          </div>
        )}
      </div>

      {/* Win Modal */}
      <WinModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        winner={room.winner}
        isDraw={room.isDraw}
        onGoHome={goHome}
      />
    </div>
  );
}
