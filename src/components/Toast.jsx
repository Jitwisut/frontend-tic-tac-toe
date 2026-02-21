'use client';

import { useState, useEffect, useCallback } from 'react';

// Toast Context
let toastCallback = null;

export function setToastCallback(callback) {
    toastCallback = callback;
}

export function showToast(message, type = 'success') {
    if (toastCallback) {
        toastCallback(message, type);
    }
}

// Toast Component
export function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="flex items-center gap-2">
                {type === 'success' && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span className="text-sm">{message}</span>
            </div>
        </div>
    );
}

// Toast Container — centered bottom on mobile, bottom-right on desktop
export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        setToastCallback(addToast);
        return () => setToastCallback(null);
    }, [addToast]);

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-6 z-50 flex flex-col items-center sm:items-end gap-2">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

export default Toast;
