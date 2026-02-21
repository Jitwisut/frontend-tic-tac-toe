'use client';

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`spinner ${sizeClasses[size]} ${className}`} />
    );
}

export function LoadingScreen({ message = 'กำลังโหลด...' }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-[var(--foreground-muted)]">{message}</p>
        </div>
    );
}

export function LoadingOverlay({ message = 'กำลังดำเนินการ...' }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-8 flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-[var(--foreground)]">{message}</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
