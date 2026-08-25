import { createContext, useCallback, useContext, useState } from "react";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Warnings stay up longer — they're more likely to matter and users
    // shouldn't have to catch them on the first read.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, type === "warning" ? 6000 : 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 w-[92vw] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live={t.type === "warning" ? "assertive" : "polite"}
            className="glass-panel !rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-up shadow-2xl border-l-4"
            style={{
              borderLeftColor:
                t.type === "success" ? "#22C55E" : t.type === "warning" ? "#F97316" : "#2DD4E8",
            }}
          >
            {t.type === "success" && <FiCheckCircle className="text-risk-low mt-0.5 shrink-0" size={18} aria-hidden="true" />}
            {t.type === "warning" && <FiAlertTriangle className="text-risk-high mt-0.5 shrink-0" size={18} aria-hidden="true" />}
            {t.type === "info" && <FiInfo className="text-signal mt-0.5 shrink-0" size={18} aria-hidden="true" />}
            <p className="text-sm text-ink-hi leading-snug flex-1">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="text-ink-mid hover:text-ink-hi shrink-0 -mr-1 -mt-0.5 p-1 rounded"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
