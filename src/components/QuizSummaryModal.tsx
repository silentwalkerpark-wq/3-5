import React from 'react';
import { X, CheckCircle2, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { QuizSlide, UserSlideProgress } from '../types';

interface QuizSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: QuizSlide[];
  userProgress: Record<number, UserSlideProgress>;
  onResetQuiz: () => void;
  onJumpToSlide: (index: number) => void;
}

export const QuizSummaryModal: React.FC<QuizSummaryModalProps> = ({
  isOpen,
  onClose,
  slides,
  userProgress,
  onResetQuiz,
  onJumpToSlide
}) => {
  if (!isOpen) return null;

  const total = slides.length;
  let correctCount = 0;
  let revealedCount = 0;
  let totalWrongAttempts = 0;

  slides.forEach((s) => {
    const prog = userProgress[s.id];
    if (prog?.isCorrect === true) {
      correctCount += 1;
    } else if (prog?.isAnswerRevealed === true) {
      revealedCount += 1;
    }
    totalWrongAttempts += prog?.wrongAttempts || 0;
  });

  const unansweredCount = total - correctCount - revealedCount;
  const basePoints = correctCount * 10;
  const penaltyPoints = totalWrongAttempts * 2;
  const finalScore = Math.max(0, basePoints - penaltyPoints);
  const scorePercent = Math.round((finalScore / 120) * 100);

  return (
    <div
      id="quiz-summary-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="quiz-summary-dialog"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">퀴즈 학습 및 채점 결과</h2>
              <p className="text-xs text-slate-500">12문제 (문제당 10점, 오답 1회당 -2점 감점 / 총 120점 만점)</p>
            </div>
          </div>
          <button
            id="close-summary-btn"
            onClick={onClose}
            aria-label="결과창 닫기"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Stats Bar */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-bold text-blue-600 mb-1">최종 점수</p>
              <p className="text-2xl font-black text-blue-900">{finalScore} <span className="text-xs font-normal text-slate-500">/ 120점</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-600 mb-1">정답 획득</p>
              <p className="text-2xl font-black text-emerald-900">+{basePoints}점 <span className="text-xs font-normal text-emerald-700">({correctCount}개)</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
              <p className="text-xs font-bold text-rose-600 mb-1">오답 감점</p>
              <p className="text-2xl font-black text-rose-900">-{penaltyPoints}점 <span className="text-xs font-normal text-rose-700">({totalWrongAttempts}회)</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-1">미완료</p>
              <p className="text-2xl font-black text-slate-700">{unansweredCount} <span className="text-xs font-normal text-slate-500">/ {total}</span></p>
            </div>
          </div>
          <div className="text-xs text-center text-slate-500 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200">
            💡 채점 공식: (정답 {correctCount}개 × 10점 = {basePoints}점) - (오답 제출 {totalWrongAttempts}회 × 2점 = {penaltyPoints}점 감점) = <strong>총 {finalScore}점</strong> (120점 만점)
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            12개 문제별 결과 및 정답
          </h3>
          {slides.map((slide, index) => {
            const prog = userProgress[slide.id];
            const isCorrect = prog?.isCorrect === true;
            const isRevealed = prog?.isAnswerRevealed === true && !isCorrect;

            return (
              <div
                key={slide.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {slide.questionNumber}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {slide.topic}
                      </span>
                      <span className="text-[10px] text-slate-500 px-1.5 py-0.2 bg-slate-200/60 rounded">
                        {slide.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">
                      {slide.question}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>정답</span>
                    </span>
                  ) : prog?.isPassed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 text-slate-700">
                      <span>통과</span>
                    </span>
                  ) : isRevealed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                      <span>공개됨</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200 text-slate-600">
                      <span>미풀이</span>
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onJumpToSlide(index);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="해당 슬라이드로 이동"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            id="reset-all-btn"
            onClick={() => {
              if (window.confirm('모든 문제 풀이 기록을 초기화하시겠습니까?')) {
                onResetQuiz();
                onClose();
              }
            }}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>처음부터 다시 풀기</span>
          </button>

          <button
            id="finish-close-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
          >
            슬라이드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
