import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Clock, HelpCircle, X } from 'lucide-react';

export default function QuizModal({ quiz, onClose, onSubmit, isSubmitting }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQ = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isLastQuestion = currentQuestionIndex === totalQ - 1;

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQ - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    onSubmit(quiz.quiz_id, selectedAnswers);
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {quiz.is_retest ? 'Adaptive Target Retest' : 'AI Diagnostic Skill Assessment'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              {quiz.topic_title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of {totalQ}
          </span>
          <span className="text-indigo-300 font-medium">
            {answeredCount} of {totalQ} Answered
          </span>
        </div>

        {/* Step indicator bars */}
        <div className="px-6 grid grid-cols-5 gap-1.5 mb-2">
          {quiz.questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                selectedAnswers[q.id] !== undefined
                  ? 'bg-indigo-500'
                  : idx === currentQuestionIndex
                  ? 'bg-indigo-300'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Question Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {/* Metadata badges */}
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(currentQ.difficulty)} uppercase`}>
              {currentQ.difficulty}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Sub-concept: <strong className="text-slate-100">{currentQ.sub_concept}</strong>
            </span>
          </div>

          {/* Question Text */}
          <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
            {currentQ.text}
          </p>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {optionLetters[optIdx]}
                  </span>
                  <span
                    className={`text-sm leading-snug pt-0.5 ${
                      isSelected ? 'text-white font-medium' : 'text-slate-300'
                    }`}
                  >
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting || answeredCount < totalQ}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Grading & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Generate Assessment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
