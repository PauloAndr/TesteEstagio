// src/components/CustomButton.js
"use client";

export default function CustomButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-48 h-14 px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition-colors text-lg shadow ${className}`}
    >
      {children}
    </button>
  );
}
