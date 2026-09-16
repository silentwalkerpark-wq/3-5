import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_SLIDES } from './data/quizData';
import { UserSlideProgress, ViewMode } from './types';
import { SlideHeader } from './components/SlideHeader';
import { SlideCard } from './components/SlideCard';
import { SlideNavigation } from './components/SlideNavigation';
import { SlideOverviewModal } from './components/SlideOverviewModal';
import { QuizSummaryModal } from './components/QuizSummaryModal';
import { ImageModal } from './components/ImageModal';
import {
  setMuted,
  getMuted,
  playSlideTransitionSound
} from './utils/audio';

const STORAGE_KEY = 'subjective_quiz_progress_v1';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('quiz');
  const [isMutedState, setIsMutedState] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // User progress across all 12 slides
  const [userProgress, setUserProgress] = useState<Record<number, UserSlideProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    const initial: Record<number, UserSlideProgress> = {};
    QUIZ_SLIDES.forEach((slide) => {
      initial[slide.id] = {
        userAnswer: '',
        isCorrect: null,
        revealedHints: [false, false],
        isAnswerRevealed: false,
        attempts: 0
      };
    });
    return initial;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch {}
  }, [userProgress]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const totalSlides = QUIZ_SLIDES.length;
  const currentSlide = QUIZ_SLIDES[currentIndex];
  const currentSlideProgress = userProgress[currentSlide.id] || {
    userAnswer: '',
    isCorrect: null,
    revealedHints: [false, false],
    isAnswerRevealed: false,
    attempts: 0
  };

  const handleUpdateCurrentProgress = (updated: Partial<UserSlideProgress>) => {
    setUserProgress((prev) => ({
      ...prev,
      [currentSlide.id]: {
        ...prev[currentSlide.id],
        ...updated
      }
    }));
  };

  const handlePrevSlide = useCallback(() => {
    if (currentIndex > 0) {
      playSlideTransitionSound();
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleNextSlide = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      playSlideTransitionSound();
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalSlides]);

  const handleJumpToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      playSlideTransitionSound();
      setCurrentIndex(index);
    }
  }, [totalSlides]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMutedState;
    setIsMutedState(nextMuted);
    setMuted(nextMuted);
  };

  const handleResetQuiz = () => {
    const initial: Record<number, UserSlideProgress> = {};
    QUIZ_SLIDES.forEach((slide) => {
      initial[slide.id] = {
        userAnswer: '',
        isCorrect: null,
        revealedHints: [false, false],
        isAnswerRevealed: false,
        attempts: 0
      };
    });
    setUserProgress(initial);
    setCurrentIndex(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Escape') {
        if (isImageModalOpen) setIsImageModalOpen(false);
        else if (isOverviewOpen) setIsOverviewOpen(false);
        else if (isSummaryOpen) setIsSummaryOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handlePrevSlide,
    handleNextSlide,
    isImageModalOpen,
    isOverviewOpen,
    isSummaryOpen,
    isMutedState
  ]);

  const answeredCount = (Object.values(userProgress) as UserSlideProgress[]).filter(
    (p) => p.isCorrect === true || p.isAnswerRevealed === true
  ).length;

  return (
    <div id="quiz-app-root" className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Slide Navigation Header */}
      <SlideHeader
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        category={currentSlide.category}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((m) => (m === 'quiz' ? 'presentation' : 'quiz'))}
        isMuted={isMutedState}
        onToggleMute={handleToggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenOverview={() => setIsOverviewOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onResetQuiz={handleResetQuiz}
        answeredCount={answeredCount}
      />

      {/* Main Slide Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            <SlideCard
              slide={currentSlide}
              progress={currentSlideProgress}
              viewMode={viewMode}
              onUpdateProgress={handleUpdateCurrentProgress}
              onOpenImageModal={() => setIsImageModalOpen(true)}
              onNextSlide={handleNextSlide}
              isLastSlide={currentIndex === totalSlides - 1}
              onOpenSummary={() => setIsSummaryOpen(true)}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Toolbar */}
      <SlideNavigation
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        slides={QUIZ_SLIDES}
        userProgress={userProgress}
        onPrev={handlePrevSlide}
        onNext={handleNextSlide}
        onJumpToSlide={handleJumpToSlide}
        onOpenSummary={() => setIsSummaryOpen(true)}
      />

      {/* Fullscreen Image Lightbox Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={currentSlide.imageUrl}
        imageAlt={currentSlide.imageAlt}
        imageCaption={currentSlide.imageCaption}
        questionNumber={currentSlide.questionNumber}
      />

      {/* All Slides Overview Grid Modal */}
      <SlideOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        slides={QUIZ_SLIDES}
        userProgress={userProgress}
        currentIndex={currentIndex}
        onSelectSlide={handleJumpToSlide}
      />

      {/* Final Results & Review Summary Modal */}
      <QuizSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        slides={QUIZ_SLIDES}
        userProgress={userProgress}
        onResetQuiz={handleResetQuiz}
        onJumpToSlide={handleJumpToSlide}
      />
    </div>
  );
}
