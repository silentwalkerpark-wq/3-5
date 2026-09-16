import React from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { QuizSlide, UserSlideProgress } from '../types';

interface ScoreSlideProps {
  slides: QuizSlide[];
  userProgress: Record<number, UserSlideProgress>;
  onResetQuiz: () => void;
  onJumpToSlide: (index: number) => void;
}

export const ScoreSlide: React.FC<ScoreSlideProps> = ({
  slides,
  userProgress,
  onResetQuiz,
  onJumpToSlide
}) => {
  const totalQuestions = slides.length; // 12
  const maxScore = totalQuestions * 10; // 120

  // Calculate stats
  let correctCount = 0;
  let totalWrongAttempts = 0;
  let revealedWithoutCorrect = 0;

  slides.forEach((slide) => {
    const prog = userProgress[slide.id];
    if (prog?.isCorrect === true) {
      correctCount += 1;
    } else if (prog?.isAnswerRevealed === true) {
      revealedWithoutCorrect += 1;
    }
    totalWrongAttempts += prog?.wrongAttempts || 0;
  });

  const basePoints = correctCount * 10;
  const penaltyPoints = totalWrongAttempts * 2;
  const finalScore = Math.max(0, basePoints - penaltyPoints);
  const scorePercent = Math.round((finalScore / maxScore) * 100);

  // Friendly title for 3rd graders
  let rankBadge = {
    title: '🏆 전설의 상식 퀴즈 왕!',
    subtitle: '와, 정말 대단해요! 모든 문제를 척척 맞힌 최고의 퀴즈 천재예요!',
    color: 'from-amber-400 via-yellow-400 to-amber-500',
    textColor: 'text-amber-950',
    starCount: 5
  };

  if (finalScore >= 110) {
    rankBadge = {
      title: '🏆 120점 만점급 상식 왕!',
      subtitle: '틀린 문제 없이 완벽에 가깝게 해냈어요! 진짜 자랑스러워요!',
      color: 'from-amber-400 to-yellow-500',
      textColor: 'text-amber-950',
      starCount: 5
    };
  } else if (finalScore >= 90) {
    rankBadge = {
      title: '🌟 멋진 척척박사 탐험가!',
      subtitle: '상식이 아주 풍부하네요! 어려운 문제도 씩씩하게 잘 풀었어요.',
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-950',
      starCount: 4
    };
  } else if (finalScore >= 70) {
    rankBadge = {
      title: '🎖️ 씩씩한 상식 꿈나무!',
      subtitle: '포기하지 않고 끝까지 문제를 풀어낸 멋진 도전 정신!',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-950',
      starCount: 3
    };
  } else {
    rankBadge = {
      title: '🌱 쑥쑥 자라는 호기심 대장!',
      subtitle: '새로운 낱말과 상식을 배웠어요! 한 번 더 도전하면 더 높은 점수를 받을 수 있어요!',
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-purple-950',
      starCount: 2
    };
  }

  return (
    <article
      id="score-slide-card"
      className="max-w-5xl w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden my-4"
    >
      {/* Top Banner with Grade / Trophy */}
      <div className={`p-6 sm:p-8 bg-gradient-to-r ${rankBadge.color} text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs`}>
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner shrink-0">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rankBadge.starCount ? 'text-white fill-white' : 'text-white/40'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-white/90 ml-1.5 px-2 py-0.5 rounded-full bg-black/20">
                13 / 13 슬라이드
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-xs">
              {rankBadge.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/95 mt-1 max-w-lg font-medium">
              {rankBadge.subtitle}
            </p>
          </div>
        </div>

        {/* Big Score Box */}
        <div className="bg-white/95 text-slate-900 rounded-3xl p-5 sm:p-6 text-center shadow-lg border border-white/40 min-w-[180px] shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            최종 점수
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-black text-blue-600 tracking-tight">
              {finalScore}
            </span>
            <span className="text-lg font-bold text-slate-400">/ 120점</span>
          </div>
          <div className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            성취도 {scorePercent}%
          </div>
        </div>
      </div>

      {/* Score Calculation Breakdown Formula */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          📊 점수 계산 방식 안내 (총 120점 만점)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Base Points */}
          <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">정답 맞힘 (문제당 10점)</p>
              <p className="text-lg font-extrabold text-slate-900">
                +{basePoints}점{' '}
                <span className="text-xs font-normal text-emerald-600">({correctCount}문제)</span>
              </p>
            </div>
          </div>

          {/* Deduction */}
          <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">오답 제출 감점 (1회당 -2점)</p>
              <p className="text-lg font-extrabold text-rose-600">
                -{penaltyPoints}점{' '}
                <span className="text-xs font-normal text-slate-500">({totalWrongAttempts}회 오답)</span>
              </p>
            </div>
          </div>

          {/* Final Total */}
          <div className="p-4 rounded-2xl bg-white border border-blue-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">합계 최종 점수</p>
              <p className="text-lg font-extrabold text-blue-600">
                {finalScore}점{' '}
                <span className="text-xs font-normal text-slate-500">/ 120점 만점</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Questions Breakdown Table */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>12문제별 채점 결과 및 오답 내역</span>
            <span className="text-xs font-normal text-slate-500">(카드를 클릭하면 해당 문제로 바로 이동해요)</span>
          </h3>
          <span className="text-xs text-slate-500">
            정답 {correctCount} / 오답 감점 {penaltyPoints}점
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {slides.map((slide, index) => {
            const prog = userProgress[slide.id];
            const isCorrect = prog?.isCorrect === true;
            const wrongCount = prog?.wrongAttempts || 0;
            const itemPenalty = wrongCount * 2;
            const itemEarned = isCorrect ? Math.max(0, 10 - itemPenalty) : 0;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => onJumpToSlide(index)}
                className="text-left p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-300 transition-all flex items-center gap-3 group"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-0.5 left-0.5 px-1 bg-black/70 rounded text-[9px] font-bold text-white">
                    {slide.questionNumber}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {slide.topic}
                    </p>
                    {isCorrect ? (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                        +10점
                      </span>
                    ) : prog?.isAnswerRevealed ? (
                      <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                        공개됨
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                        미풀이
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>
                      {wrongCount > 0 ? (
                        <span className="text-rose-600 font-semibold">
                          오답 {wrongCount}회 (-{itemPenalty}점)
                        </span>
                      ) : (
                        <span className="text-slate-400">오답 없음</span>
                      )}
                    </span>
                    <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[10px]">
                      복습 <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('점수를 초기화하고 1번 문제부터 다시 도전해볼까요?')) {
              onResetQuiz();
            }
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>점수 초기화하고 다시 도전하기</span>
        </button>

        <button
          type="button"
          onClick={() => onJumpToSlide(0)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span>1번 문제로 돌아가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
