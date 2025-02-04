import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export const notifySuccess = (message) => {
  toast.success(message);
};

export const notifyError = (message) => {
  toast.error(message);
};

export const StickyNote = ({ message, duration = 10000, onClose }) => {
  const [visible, setVisible] = useState(true);
  console.log({message});

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-5 right-1/4 left-1/4 bg-yellow-200 text-black px-4 py-2 rounded-lg shadow-lg flex justify-center items-center gap-2 z-[9999] w-max mx-auto"
      >
      <span>{message}</span>
      <button onClick={() => setVisible(false)}>
        <X size={16} />
      </button>
    </motion.div>
  );
};
