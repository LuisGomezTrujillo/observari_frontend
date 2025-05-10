import React, { useEffect } from "react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Solo prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevenir scroll
    } else {
      document.body.style.overflow = ""; // Restaurar scroll
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Cerrar"
          >
            <span className="text-xl sm:text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
