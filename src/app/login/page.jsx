"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ToastContainer, showToast } from "@/components/Toast";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/");
        }
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            showToast("กรุณากรอกข้อมูลให้ครบ", "error");
            return;
        }

        setLoading(true);
        try {
            await login(username.trim(), password);
            router.push("/");
        } catch (error) {
            showToast(error.message || "เข้าสู่ระบบไม่สำเร็จ", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-10"></div>
            </div>

            <ToastContainer />

            <div className="glass-card p-6 sm:p-8 w-full max-w-md slide-up">
                {/* Logo */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-orange-500/20 float">
                        ⭕❌
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold gradient-text">เข้าสู่ระบบ</h1>
                    <p className="text-[var(--foreground-muted)] mt-1 text-sm">Tic-Tac-Toe Multiplayer</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm text-[var(--foreground-muted)] mb-1.5 ml-1">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="ใส่ชื่อผู้ใช้"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm text-[var(--foreground-muted)] mb-1.5 ml-1">
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="ใส่รหัสผ่าน"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>กำลังเข้าสู่ระบบ...</span>
                            </>
                        ) : (
                            "เข้าสู่ระบบ"
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--foreground-muted)]">
                        ยังไม่มีบัญชี?{" "}
                        <button
                            onClick={() => router.push("/register")}
                            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                        >
                            สมัครสมาชิก
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
