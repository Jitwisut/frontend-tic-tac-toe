"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen, LoadingSpinner } from "@/components/LoadingSpinner";
import { ToastContainer, showToast } from "@/components/Toast";
import api from "@/lib/api";

export default function HomePage() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  // Fetch available rooms
  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const response = await api.getRooms();
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [authLoading, isAuthenticated, router, fetchRooms]);

  // Create new room
  const handleCreateRoom = async () => {
    setCreatingRoom(true);
    try {
      const response = await api.createRoom();
      const room = response.data.room;
      router.push(`/room/${room.code}`);
    } catch (error) {
      showToast(error.message || "ไม่สามารถสร้างห้องได้", "error");
    } finally {
      setCreatingRoom(false);
    }
  };

  // Join room by code
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      showToast("กรุณาใส่รหัสห้อง", "error");
      return;
    }
    setJoiningRoom(true);
    try {
      await api.joinRoom(roomCode.trim());
      router.push(`/room/${roomCode.trim()}`);
    } catch (error) {
      showToast(error.message || "ไม่สามารถเข้าร่วมห้องได้", "error");
    } finally {
      setJoiningRoom(false);
    }
  };

  // Play bot
  const handlePlayBot = () => {
    router.push("/bot");
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-10"></div>
      </div>

      <ToastContainer />

      <div className="max-w-2xl mx-auto flex flex-col gap-5 sm:gap-8">
        {/* Header */}
        <header className="flex items-center justify-between fade-in">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold gradient-text">⭕❌ Tic-Tac-Toe</h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">Multiplayer & AI</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.username}</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary !py-2 !px-3 text-xs sm:text-sm">
              ออก
            </button>
          </div>
        </header>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 slide-up">
          {/* Create Room */}
          <button
            onClick={handleCreateRoom}
            disabled={creatingRoom}
            className="glass-card p-4 sm:p-6 text-center transition-all hover:scale-[1.02] hover:border-[var(--primary)] active:scale-[0.98] cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎮</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">สร้างห้อง</h3>
            <p className="text-[var(--foreground-muted)] text-xs sm:text-sm">สร้างห้องใหม่และเชิญเพื่อน</p>
            {creatingRoom && <LoadingSpinner size="sm" className="mt-2 mx-auto" />}
          </button>

          {/* Join Room */}
          <form onSubmit={handleJoinRoom} className="glass-card p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚪</div>
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">เข้าห้อง</h3>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ใส่รหัสห้อง"
              className="input-field text-center text-sm mb-2 sm:mb-3"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={joiningRoom || !roomCode.trim()}
              className="btn-primary w-full text-sm"
            >
              {joiningRoom ? "กำลังเข้า..." : "เข้าร่วม"}
            </button>
          </form>

          {/* Play Bot */}
          <button
            onClick={handlePlayBot}
            className="glass-card p-4 sm:p-6 text-center transition-all hover:scale-[1.02] hover:border-[var(--secondary)] active:scale-[0.98] cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🤖</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">เล่นกับ Bot</h3>
            <p className="text-[var(--foreground-muted)] text-xs sm:text-sm">ท้าชน AI ที่ไม่เคยแพ้</p>
          </button>
        </div>

        {/* Available Rooms */}
        <section className="fade-in">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              🏠 <span className="gradient-text">ห้องว่าง</span>
            </h2>
            <button
              onClick={fetchRooms}
              className="btn-secondary !py-2 !px-3 text-xs sm:text-sm flex items-center gap-1.5"
              disabled={loadingRooms}
            >
              {loadingRooms ? <LoadingSpinner size="sm" /> : "🔄"} รีเฟรช
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="glass-card p-6 sm:p-8 text-center">
              <p className="text-3xl sm:text-4xl mb-3">🎯</p>
              <p className="text-[var(--foreground-muted)] text-sm sm:text-base">
                ยังไม่มีห้องว่าง —{" "}
                <button onClick={handleCreateRoom} className="text-[var(--primary)] underline">
                  สร้างห้องใหม่
                </button>
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:gap-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="glass-card p-3 sm:p-4 flex items-center justify-between gap-3 transition-all hover:border-[var(--primary)]"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm sm:text-base font-bold text-[var(--primary)] truncate">
                      🎲 {room.code}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] truncate">
                      โฮสต์: {room.player1?.username || "Unknown"} • {room.status === "waiting" ? "รอผู้เล่น" : "กำลังเล่น"}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await api.joinRoom(room.code);
                        router.push(`/room/${room.code}`);
                      } catch (error) {
                        showToast(error.message || "ไม่สามารถเข้าร่วมได้", "error");
                      }
                    }}
                    className="btn-primary !py-2 !px-3 sm:!px-4 text-xs sm:text-sm whitespace-nowrap"
                  >
                    เข้าร่วม
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center pb-4 sm:pb-6">
          <p className="text-[var(--foreground-muted)] text-xs">
            <span className="sm:hidden">สวัสดี, <span className="text-[var(--primary)] font-medium">{user?.username}</span></span>
            <span className="hidden sm:inline">สวัสดี, <span className="text-[var(--primary)] font-medium">{user?.username}</span> • </span>
            Tic-Tac-Toe v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}
