import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { QuizSlide, UserSlideProgress } from '../types';

interface SlideNavigationProps {
  currentIndex: number;
  totalSlides: number;
  slides: QuizSlide[];
  userProgress: Record<number, UserSlideProgress>;
  onPrev: () => void;
  onNext: () => void;
  onJumpToSlide: (index: number) => void;
  onOpenSummary: () => void;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentIndex,
  totalSlides,
  slides,
  userProgress,
  onPrev,
  onNext,
  onJumpToSlide,
  onOpenSummary
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  return (
    <footer id="slide-navigation" className="w-full bg-white/95 backdrop-blur-sm border-t border-slate-200 py-3 px-4 sticky bottom-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Previous Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            id="prev-slide-btn"
            onClick={onPrev}
            disabled={isFirst}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isFirst
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100'
                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 슬라이드</span>
          </button>

          {/* Mobile middle info */}
          <span className="sm:hidden text-xs font-semibold text-slate-600">
            {currentIndex + 1} / {totalSlides}
          </span>

          <button
            id="mobile-next-slide-btn"
            onClick={isLast ? onOpenSummary : onNext}
            className={`sm:hidden px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isLast
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>{isLast ? '결과 보기' : '다음'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Slide Jump Pills with state indicators */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1 max-w-xl">
          {slides.map((slide, index) => {
            const progress = userProgress[slide.id];
            const isActive = index === currentIndex;
            const isCorrect = progress?.isCorrect === true;
            const isRevealed = progress?.isAnswerRevealed === true && !isCorrect;

            let badgeStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent';
            if (isCorrect) {
              badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
            } else if (isRevealed) {
              badgeStyle = 'bg-amber-50 text-amber-700 border-amber-300';
            }

            if (isActive) {
              badgeStyle += ' ring-2 ring-blue-600 ring-offset-1 font-bold';
            }

            return (
              <button
                key={slide.id}
                id={`slide-dot-${slide.id}`}
                onClick={() => onJumpToSlide(index)}
                aria-label={`문제 ${slide.questionNumber}: ${slide.topic}`}
                title={`문제 ${slide.questionNumber}: ${slide.topic}`}
                className={`relative px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1 ${badgeStyle}`}
              >
                <span>{slide.questionNumber}</span>
                {isCorrect && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                {isRevealed && <Eye className="w-3 h-3 text-amber-600" />}
              </button>
            );
          })}

          {/* 13th Slide Button: Score Slide */}
          <button
            id="slide-dot-score"
            onClick={() => onJumpToSlide(slides.length)}
            aria-label="13. 최종 점수 발표"
            title="13. 최종 점수 발표 (120점 만점)"
            className={`relative px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1 shrink-0 ${
              currentIndex === slides.length
                ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-500 ring-offset-1 font-bold shadow-xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>최종 점수</span>
          </button>
        </div>

        {/* Right: Next or Results Button */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 mr-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">→</kbd>
            <span>이동 /</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">Space</kbd>
            <span>다음</span>
          </div>

          {isLast ? (
            <button
              id="finish-summary-btn"
              onClick={() => onJumpToSlide(0)}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>1번 문제로</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="next-slide-btn"
              onClick={onNext}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>{currentIndex === slides.length - 1 ? '최종 점수 보기' : '다음 슬라이드'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
