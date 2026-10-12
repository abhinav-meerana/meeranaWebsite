// Alert.js
import React from 'react';

function Alert({ message, onClose, type = "success" }) {
  const isError = type === "error";
  const headerBg = isError ? "bg-[#DC2626]" : "bg-[#072FA5]";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202124] text-[#f5f5f5] rounded-[10px] shadow-lg w-full max-w-[90%] md:max-w-[500px] relative z-10">
        {/* Top Bar with Close Button */}
        <div className={`${headerBg} p-4 rounded-t-[10px] flex justify-between items-center`}>
          <h3 className="text-lg font-semibold">{isError ? "Notice" : "Notification"}</h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-white px-3 py-1 rounded-full hover:bg-black/30 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Message Content */}
        <div className="p-6 text-center">
          <span>{message}</span>
        </div>

        {/* Bottom Close Button */}
        <div className="flex justify-center mt-4 mb-4">
          <button
            onClick={onClose}
            className={`${isError ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#072FA5] hover:bg-[#062480]"} cursor-pointer text-white px-6 py-2 rounded-full transition-colors`}
          >
            Close
          </button>
        </div>
      </div>

      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-0"
        onClick={onClose}
      ></div>
    </div>
  );
}

export default Alert;
