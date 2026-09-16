import React from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Grid,
  BookOpen,
  Award,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { ViewMode } from '../types';

interface SlideHeaderProps {
  currentIndex: number;
  totalSlides: number;
  category: string;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenOverview: () => void;
  onOpenSummary: () => void;
  onResetQuiz: () => void;
  answeredCount: number;
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({
  currentIndex,
  totalSlides,
  category,
  viewMode,
  onToggleViewMode,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenOverview,
  onOpenSummary,
  onResetQuiz,
  answeredCount
}) => {
  const progressPercent = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <header id="slide-header" className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      {/* Top thin progress bar */}
      <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: App Title and Slide Index Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              주관식 상식 퀴즈
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
              {currentIndex + 1} / {totalSlides}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {category}
            </span>
          </div>
        </div>

        {/* Right: Controls & Mode Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              id="mode-quiz-btn"
              onClick={() => viewMode !== 'quiz' && onToggleViewMode()}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'quiz'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="정답을 직접 입력하고 채점하는 모드"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>퀴즈 모드</span>
            </button>
            <button
              id="mode-presentation-btn"
              onClick={() => viewMode !== 'presentation' && onToggleViewMode()}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'presentation'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="수업 및 발표용 슬라이드 뷰"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>발표 모드</span>
            </button>
          </div>

          {/* Slide Overview button */}
          <button
            id="overview-toggle-btn"
            onClick={onOpenOverview}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="전체 12개 슬라이드 한눈에 보기"
          >
            <Grid className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">슬라이드 목록</span>
          </button>

          {/* Results Summary button */}
          <button
            id="summary-modal-btn"
            onClick={onOpenSummary}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="결과 및 복습 현황"
          >
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">결과 ({answeredCount}/{totalSlides})</span>
          </button>

          {/* Sound Toggle button */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleMute}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isMuted ? '소리 켜기' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle-btn"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isFullscreen ? '전체화면 종료 (ESC)' : '전체화면 (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reset button */}
          <button
            id="reset-quiz-btn"
            onClick={onResetQuiz}
            aria-label="처음부터 다시 풀기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="퀴즈 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
