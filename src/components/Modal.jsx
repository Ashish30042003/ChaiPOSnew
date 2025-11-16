import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg", color = "orange" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200`}>
        <div className={`p-4 border-b flex justify-between items-center bg-${color}-50`}>
          <h2 className={`text-lg font-bold text-${color}-900`}>{title}</h2>
          <button onClick={onClose} className={`p-2 hover:bg-${color}-100 rounded-full text-${color}-800`}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
