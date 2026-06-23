import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

const TOAST_STYLES = {
  success: {
    border: '1px solid rgba(16, 185, 129, 0.35)',
    background: 'rgba(10, 30, 20, 0.97)',
    iconColor: '#10b981',
    Icon: CheckCircle,
  },
  error: {
    border: '1px solid rgba(239, 68, 68, 0.35)',
    background: 'rgba(30, 10, 10, 0.97)',
    iconColor: '#ef4444',
    Icon: XCircle,
  },
  info: {
    border: '1px solid rgba(139, 92, 246, 0.35)',
    background: 'rgba(14, 10, 30, 0.97)',
    iconColor: '#a78bfa',
    Icon: Info,
  },
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => {
        const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
        const { Icon } = style;
        return (
          <div
            key={t.id}
            className="toast-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: style.border,
              background: style.background,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              minWidth: '280px',
              maxWidth: '400px',
              pointerEvents: 'all',
              animation: 'toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Icon size={18} style={{ color: style.iconColor, flexShrink: 0 }} />
            <span style={{
              flex: 1,
              fontSize: '0.875rem',
              color: '#f1f5f9',
              fontWeight: 500,
              lineHeight: 1.4,
            }}>
              {t.message}
            </span>
            <button
              onClick={() => onRemove(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.1rem',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
