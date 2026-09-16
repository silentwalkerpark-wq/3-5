import React from 'react';
import { X, CheckCircle2, Eye, HelpCircle } from 'lucide-react';
import { QuizSlide, UserSlideProgress } from '../types';

interface SlideOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: QuizSlide[];
  userProgress: Record<number, UserSlideProgress>;
  currentIndex: number;
  onSelectSlide: (index: number) => void;
}

export const SlideOverviewModal: React.FC<SlideOverviewModalProps> = ({
  isOpen,
  onClose,
  slides,
  userProgress,
  currentIndex,
  onSelectSlide
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="slide-overview-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="slide-overview-dialog"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">전체 12개 슬라이드 목록</h2>
            <p className="text-xs text-slate-500">원하는 슬라이드를 클릭하면 바로 이동합니다</p>
          </div>
          <button
            id="close-overview-btn"
            onClick={onClose}
            aria-label="목록 닫기"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((slide, index) => {
            const prog = userProgress[slide.id];
            const isCurrent = index === currentIndex;
            const isCorrect = prog?.isCorrect === true;
            const isRevealed = prog?.isAnswerRevealed === true && !isCorrect;

            return (
              <button
                key={slide.id}
                id={`overview-item-${slide.id}`}
                onClick={() => {
                  onSelectSlide(index);
                  onClose();
                }}
                className={`relative text-left rounded-2xl border p-3 transition-all hover:shadow-md flex flex-col justify-between group overflow-hidden ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden mb-2.5 bg-slate-900">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[11px] font-bold text-white">
                    Q{slide.questionNumber}
                  </div>

                  <div className="absolute top-2 right-2">
                    {isCorrect && (
                      <span className="p-1 rounded-full bg-emerald-500 text-white shadow-xs block">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isRevealed && (
                      <span className="p-1 rounded-full bg-amber-500 text-white shadow-xs block">
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {!isCorrect && !isRevealed && (
                      <span className="p-1 rounded-full bg-slate-700/80 text-slate-300 shadow-xs block">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      {slide.category}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded">
                        현재
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">
                    {slide.topic}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {slide.question}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
