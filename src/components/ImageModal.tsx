import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  questionNumber: number;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  imageCaption,
  questionNumber
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="image-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="image-modal-content"
        className="relative max-h-[92vh] max-w-4xl w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/60 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90 text-slate-200">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600/30 text-indigo-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              문제 {questionNumber} 관련 사진
            </span>
            <span className="text-sm text-slate-400 font-medium truncate max-w-md">
              {imageCaption}
            </span>
          </div>
          <button
            id="close-image-modal-btn"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex-1 flex items-center justify-center p-4 bg-black/40 overflow-hidden min-h-[300px] max-h-[75vh]">
          <img
            src={imageUrl}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg select-none"
          />
        </div>

        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>{imageAlt}</span>
          <span className="text-slate-500">ESC 또는 바깥 영역 클릭 시 닫힙니다</span>
        </div>
      </div>
    </div>
  );
};
