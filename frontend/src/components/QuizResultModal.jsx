import React, { useState } from 'react';
import { 
  Sparkles, Award, TrendingUp, AlertTriangle, CheckCircle2, 
  ArrowRight, BookOpen, Clock, RefreshCw, X, ChevronDown, ChevronUp
} from 'lucide-react';

export default function QuizResultModal({ result, onClose, onStartRetest }) {
  const [completedRecs, setCompletedRecs] = useState({});
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!result) return null;

  const toggleRec = (idx) => {
    setCompletedRecs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const allRecsDone = result.recommendations.length > 0 && 
    result.recommendations.every((_, idx) => completedRecs[idx]);

  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return {
          color: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'Intermediate':
        return {
          color: 'from-blue-500 to-indigo-500',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        };
      case 'Advanced':
        return {
          color: 'from-emerald-500 to-teal-500',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      default:
        return {
          color: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const levelBadge = getLevelBadge(result.level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {result.is_retest ? 'Retest Assessment Evaluation' : 'AI Diagnostic Evaluation'}
              </span>
              <h3 className="text-lg font-bold text-white">{result.topic_title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Level Improvement Banner (Payoff Moment) */}
          {result.level_improved && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-sky-500/20 border border-emerald-500/40 flex items-center gap-4 animate-bounce-subtle">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Skill Progression Verified
                </div>
                <div className="text-base font-bold text-white">
                  Congratulations! Your level advanced from{' '}
                  <span className="text-amber-400 underline decoration-amber-400/50">{result.prior_level}</span> &rarr;{' '}
                  <span className="text-emerald-400 underline decoration-emerald-400/50">{result.level}</span>!
                </div>
              </div>
            </div>
          )}

          {/* Score & Level Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Score Box */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-xs font-medium text-slate-400">Assessment Score</span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {result.score_percentage}%
              </div>
              <span className="text-xs text-slate-400 mt-0.5">
                {result.correct_count} of {result.total_questions} Correct
              </span>
            </div>

            {/* Level Classification */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-xs font-medium text-slate-400">Classified Level</span>
              <div className="mt-1 flex justify-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${levelBadge.bg}`}>
                  <Award className="w-4 h-4" />
                  {result.level}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                {result.score_percentage <= 40
                  ? 'Foundational Phase (0-40%)'
                  : result.score_percentage <= 75
                  ? 'Proficient Core (41-75%)'
                  : 'Mastery (76-100%)'}
              </span>
            </div>

            {/* Diagnostic Ratio */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-xs font-medium text-slate-400">Identified Focus Areas</span>
              <div className="text-3xl font-extrabold text-rose-400 mt-1">
                {result.weak_sub_concepts.length}
              </div>
              <span className="text-xs text-slate-400 mt-0.5">Sub-concepts to strengthen</span>
            </div>
          </div>

          {/* Weak Sub-concepts Chips */}
          {result.weak_sub_concepts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Identified Weak Sub-Concepts:</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.weak_sub_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 & 4 AI Personalized Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI-Generated Targeted Study Plan
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                Mark tasks complete to unlock retest
              </span>
            </div>

            <div className="space-y-2.5">
              {result.recommendations.map((rec, idx) => {
                const isDone = !!completedRecs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleRec(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-300'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {rec.type}
                        </span>
                        <h5 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {rec.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {rec.reason}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> ~{rec.estimated_minutes} mins
                        </span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">Target: {rec.target_sub_concept}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      <button
                        type="button"
                        className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-slate-700 hover:border-indigo-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Breakdown Toggle */}
          <div className="border-t border-slate-800 pt-4">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showBreakdown ? 'Hide Detailed Answers' : 'View Question & Answer Breakdown'}
            </button>

            {showBreakdown && (
              <div className="mt-3 space-y-2.5">
                {result.question_breakdown.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      q.is_correct
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-rose-500/5 border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-200">Q{idx + 1}: {q.question_text}</span>
                      <span className={q.is_correct ? 'text-emerald-400' : 'text-rose-400'}>
                        {q.is_correct ? ' Correct' : ' Incorrect'}
                      </span>
                    </div>
                    <div className="text-slate-400 grid grid-cols-2 gap-2">
                      <div>Your Answer: <strong className={q.is_correct ? 'text-emerald-300' : 'text-rose-300'}>{q.user_answer}</strong></div>
                      <div>Correct Answer: <strong className="text-slate-200">{q.correct_answer}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Close Summary
          </button>

          {!result.is_retest && (
            <button
              onClick={() => onStartRetest(result.topic_id)}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Take Adaptive Retest on Weak Areas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
