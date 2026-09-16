import React, { useState, useEffect, useRef } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  Eye,
  RotateCcw
} from 'lucide-react';
import { QuizSlide, UserSlideProgress, ViewMode } from '../types';
import { checkAnswer } from '../utils/answerChecker';
import {
  playCorrectSound,
  playIncorrectSound,
  playHintSound,
  playRevealSound
} from '../utils/audio';

interface SlideCardProps {
  slide: QuizSlide;
  progress: UserSlideProgress;
  viewMode: ViewMode;
  onUpdateProgress: (updated: Partial<UserSlideProgress>) => void;
  onOpenImageModal: () => void;
  onNextSlide: () => void;
  isLastSlide: boolean;
  onOpenSummary: () => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  progress,
  viewMode,
  onUpdateProgress,
  onOpenImageModal,
  onNextSlide,
  isLastSlide,
  onOpenSummary
}) => {
  const [inputValue, setInputValue] = useState(progress.userAnswer || '');
  const [validationMessage, setValidationMessage] = useState<{
    type: 'correct' | 'incorrect' | 'revealed' | null;
    text: string;
  }>({ type: null, text: '' });
  const [imageError, setImageError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value if user already typed
  useEffect(() => {
    setInputValue(progress.userAnswer || '');
    if (progress.isCorrect) {
      setValidationMessage({
        type: 'correct',
        text: '정답입니다! 훌륭합니다 🎉'
      });
    } else if (progress.isAnswerRevealed) {
      setValidationMessage({
        type: 'revealed',
        text: `정답: ${slide.answer}`
      });
    } else {
      setValidationMessage({ type: null, text: '' });
    }
  }, [slide.id, progress.isCorrect, progress.isAnswerRevealed, progress.userAnswer, slide.answer]);

  // Focus input automatically on slide change in quiz mode
  useEffect(() => {
    if (viewMode === 'quiz' && !progress.isCorrect && !progress.isAnswerRevealed) {
      inputRef.current?.focus();
    }
  }, [slide.id, viewMode, progress.isCorrect, progress.isAnswerRevealed]);

  const handleToggleHint = (hintIndex: 0 | 1) => {
    const currentHints = [...progress.revealedHints] as [boolean, boolean];
    const willOpen = !currentHints[hintIndex];
    currentHints[hintIndex] = willOpen;

    if (willOpen) {
      playHintSound();
    }

    onUpdateProgress({
      revealedHints: currentHints
    });
  };

  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const isMatch = checkAnswer(trimmed, slide.answer, slide.acceptedAnswers);
    const newAttempts = (progress.attempts || 0) + 1;

    if (isMatch) {
      playCorrectSound();
      onUpdateProgress({
        userAnswer: trimmed,
        isCorrect: true,
        isAnswerRevealed: true,
        attempts: newAttempts
      });
      setValidationMessage({
        type: 'correct',
        text: '정답입니다! 완벽하게 맞히셨습니다 🎉'
      });
    } else {
      playIncorrectSound();
      onUpdateProgress({
        userAnswer: trimmed,
        isCorrect: false,
        attempts: newAttempts
      });
      setValidationMessage({
        type: 'incorrect',
        text: '오답입니다. 힌트를 확인하고 다시 시도해보세요!'
      });
    }
  };

  const handleRevealAnswer = () => {
    playRevealSound();
    onUpdateProgress({
      isAnswerRevealed: true,
      revealedHints: [true, true]
    });
    setValidationMessage({
      type: 'revealed',
      text: `정답은 "${slide.answer}"입니다.`
    });
  };

  const handleRetry = () => {
    setInputValue('');
    onUpdateProgress({
      userAnswer: '',
      isCorrect: null,
      isAnswerRevealed: false
    });
    setValidationMessage({ type: null, text: '' });
    inputRef.current?.focus();
  };

  const isResolved = progress.isCorrect === true || progress.isAnswerRevealed;

  return (
    <article
      id={`slide-card-${slide.id}`}
      className="max-w-6xl w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all my-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Column: Question, Hints, Answering Area (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Top metadata badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                <span>문제 {slide.questionNumber}</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {slide.category}
              </span>

              {isResolved && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>정답: {slide.topic}</span>
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed tracking-tight mb-6">
              {slide.question}
            </h2>

            {/* Two Progressive Hints Section */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  힌트 (총 2개)
                </span>
                <span className="text-xs text-slate-400">
                  클릭하여 힌트를 확인할 수 있습니다
                </span>
              </div>

              {/* Hint 1 */}
              <div
                id={`hint-container-1-${slide.id}`}
                className={`rounded-2xl border transition-all ${
                  progress.revealedHints[0]
                    ? 'bg-amber-50/60 border-amber-200/80 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  id={`toggle-hint-1-${slide.id}`}
                  onClick={() => handleToggleHint(0)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-sm font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>힌트 1</span>
                    {!progress.revealedHints[0] && (
                      <span className="text-xs font-normal text-slate-500">
                        (클릭하여 열기)
                      </span>
                    )}
                  </div>
                  {progress.revealedHints[0] ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {progress.revealedHints[0] && (
                  <div className="px-4 pb-3.5 pt-1 text-sm text-slate-700 leading-relaxed border-t border-amber-100 animate-fadeIn">
                    <p>{slide.hints[0]}</p>
                  </div>
                )}
              </div>

              {/* Hint 2 */}
              <div
                id={`hint-container-2-${slide.id}`}
                className={`rounded-2xl border transition-all ${
                  progress.revealedHints[1]
                    ? 'bg-amber-50/60 border-amber-200/80 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  id={`toggle-hint-2-${slide.id}`}
                  onClick={() => handleToggleHint(1)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-sm font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>힌트 2 (결정적 힌트)</span>
                    {!progress.revealedHints[1] && (
                      <span className="text-xs font-normal text-slate-500">
                        (클릭하여 열기)
                      </span>
                    )}
                  </div>
                  {progress.revealedHints[1] ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {progress.revealedHints[1] && (
                  <div className="px-4 pb-3.5 pt-1 text-sm text-slate-700 leading-relaxed border-t border-amber-100 animate-fadeIn">
                    <p>{slide.hints[1]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Answer Input or Presentation Control Section */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            {viewMode === 'quiz' ? (
              <div>
                {!isResolved ? (
                  <form onSubmit={handleCheckAnswer} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          ref={inputRef}
                          id={`answer-input-${slide.id}`}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="주관식 정답을 입력하세요..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-slate-900 placeholder-slate-400 bg-white shadow-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        id={`submit-answer-btn-${slide.id}`}
                        disabled={!inputValue.trim()}
                        className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                          inputValue.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-[0.98]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>정답 확인</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>엔터(Enter) 키로 빠르게 제출할 수 있습니다</span>
                      <button
                        type="button"
                        id={`giveup-btn-${slide.id}`}
                        onClick={handleRevealAnswer}
                        className="text-slate-500 hover:text-blue-600 font-semibold underline underline-offset-2 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>정답 바로 보기</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Answer Resolved Card */
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        progress.isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            progress.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                          }`}
                        >
                          {progress.isCorrect ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Sparkles className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {progress.isCorrect ? '정답 완료' : '정답 공개'}
                          </p>
                          <p className="text-lg font-extrabold text-slate-900">
                            정답: <span className="text-blue-600 underline decoration-blue-300">{slide.answer}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          id={`retry-btn-${slide.id}`}
                          onClick={handleRetry}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors shadow-xs"
                          title="다시 풀기"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>다시 풀기</span>
                        </button>

                        <button
                          type="button"
                          id={`next-action-btn-${slide.id}`}
                          onClick={isLastSlide ? onOpenSummary : onNextSlide}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>{isLastSlide ? '결과 보기' : '다음 문제'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Feedback Message */}
                {validationMessage.text && validationMessage.type === 'incorrect' && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between animate-shake">
                    <div className="flex items-center gap-2 font-medium">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{validationMessage.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      className="text-xs font-bold text-rose-700 underline shrink-0 hover:text-rose-900"
                    >
                      정답 확인하기
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Presentation Mode Controls */
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    발표자 제어판
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleHint(0)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        progress.revealedHints[0]
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      힌트 1 {progress.revealedHints[0] ? '숨기기' : '공개'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleHint(1)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        progress.revealedHints[1]
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      힌트 2 {progress.revealedHints[1] ? '숨기기' : '공개'}
                    </button>
                    <button
                      type="button"
                      id={`presenter-reveal-btn-${slide.id}`}
                      onClick={() => {
                        if (progress.isAnswerRevealed) {
                          onUpdateProgress({ isAnswerRevealed: false });
                        } else {
                          handleRevealAnswer();
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        progress.isAnswerRevealed
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                      }`}
                    >
                      {progress.isAnswerRevealed ? '정답 숨기기' : '정답 발표'}
                    </button>
                  </div>
                </div>

                {progress.isAnswerRevealed && (
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 text-slate-900">
                    <p className="text-xs text-indigo-600 font-bold">정답</p>
                    <p className="text-xl font-black text-slate-900">{slide.answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High Quality Photo & Expanded Facts Card (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-50/80 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Visual Photo Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/90 shadow-sm aspect-4/3 flex items-center justify-center">
              {!imageError ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-slate-800 to-indigo-950 flex flex-col items-center justify-center p-6 text-center text-white">
                  <span className="text-3xl mb-2">📸</span>
                  <p className="font-bold text-sm">{slide.topic}</p>
                  <p className="text-xs text-slate-300 mt-1">{slide.imageCaption}</p>
                </div>
              )}

              {/* Photo Zoom overlay button */}
              <button
                type="button"
                id={`zoom-image-btn-${slide.id}`}
                onClick={onOpenImageModal}
                aria-label="사진 크게 보기"
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs opacity-80 group-hover:opacity-100 transition-all shadow-md"
                title="사진 크게 보기"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Photo Caption Badge */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 text-left">
                <p className="text-xs font-medium text-white/95 truncate">
                  {slide.imageCaption}
                </p>
                <p className="text-[10px] text-white/70 truncate">
                  {slide.imageAlt}
                </p>
              </div>
            </div>

            {/* Detailed Explanation and Key Facts (visible if answer is revealed/resolved, or presentation mode) */}
            {isResolved ? (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wide">
                  <BookOpen className="w-4 h-4" />
                  <span>해설 및 배경 지식</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {slide.explanation}
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-900 mb-1.5">핵심 요약</p>
                  <ul className="space-y-1.5">
                    {slide.keyFacts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 rounded-2xl p-5 border border-dashed border-slate-300 text-center text-slate-500 space-y-1">
                <HelpCircle className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <p className="text-xs font-semibold text-slate-700">문제 풀이 가이드</p>
                <p className="text-xs text-slate-500">
                  사진과 힌트를 참고하여 정답을 맞춰보세요. 정답을 맞히거나 정답을 공개하면 상세 해설이 나타납니다.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 mt-4 text-center">
            {slide.questionNumber} / 12번째 문제 • {slide.category}
          </div>
        </div>
      </div>
    </article>
  );
};
