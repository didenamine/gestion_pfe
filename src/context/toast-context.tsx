import { Alert } from "@/components/alert";
import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "info" | "success" | "warning" | "error";

type Toast = {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
};

type ToastContextValue = {
  showToast: (opts: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {toasts.map((toast) => (
          <Alert
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
