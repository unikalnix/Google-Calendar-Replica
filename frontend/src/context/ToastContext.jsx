import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToastState] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const setToast = (message, type, duration = 3000) => {
    if (timeoutId) clearTimeout(timeoutId);

    setToastState({ message, type });

    const id = setTimeout(() => {
      setToastState("");
      setTimeoutId(null);
    }, duration);

    setTimeoutId(id);
  };

  return (
    <ToastContext.Provider value={{ setToast }}>
      {children}
      {toast && <Toast type={toast.type} message={toast.message} />}
    </ToastContext.Provider>
  );
};

// Hook for consuming context easily
export const useToast = () => useContext(ToastContext);
