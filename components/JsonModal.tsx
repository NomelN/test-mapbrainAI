"use client";

import { useEffect, useRef } from "react";

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: unknown;
  title: string;
}

export default function JsonModal({
  isOpen,
  onClose,
  data,
  title,
}: JsonModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold gradient-text">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <pre className="bg-gray-50 dark:bg-black/50 p-5 rounded-2xl overflow-x-auto text-sm border border-gray-200 dark:border-gray-800">
            <code className="text-gray-800 dark:text-gray-200 font-mono">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            }}
            className="px-6 py-2.5 bg-mapbrain-deepPink text-white font-semibold rounded-full hover:bg-mapbrain-pink transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Copier
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
