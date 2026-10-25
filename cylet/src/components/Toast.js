import React from 'react';
import { Icon } from './Icons.js';

export const Toast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${
              isSuccess
                ? 'bg-emerald-900/95 border-emerald-500/50 text-white'
                : isError
                ? 'bg-red-900/95 border-red-500/50 text-white'
                : 'bg-slate-900/95 border-slate-700/60 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isError
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Icon name={isSuccess ? 'Check' : isError ? 'AlertCircle' : 'Info'} className="w-4 h-4" />
              </div>
              <div>
                {toast.title && <p className="font-semibold text-sm leading-tight">{toast.title}</p>}
                <p className="text-xs text-slate-200 mt-0.5">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
              aria-label="Close notification"
            >
              <Icon name="X" className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
