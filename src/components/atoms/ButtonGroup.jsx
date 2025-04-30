import React from "react";

export const ButtonGroup = ({ onCancel, onAccept, cancelText = "Cancelar", acceptText = "Aceptar" }) => {
  return (
    <div className="flex justify-end space-x-4 mt-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onAccept}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        {acceptText}
      </button>
    </div>
  );
};