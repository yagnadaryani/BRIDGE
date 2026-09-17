'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, Award, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ASSESSMENT_QUESTIONS } from '@/lib/data/questions';
import { logLearningEvent } from '@/lib/engine/eventEngine';
import { getCurrentSessionUser } from '@/lib/firebase/auth';
import { useUIMode } from '@/lib/context/ModeContext';

interface AssessmentViewProps {
  conceptId: string;
  subjectId: string;
}

export function AssessmentView({ conceptId, subjectId }: AssessmentViewProps) {
  const currentUser = getCurrentSessionUser();
  const studentId = currentUser?.id || 'aarav-101';
  const { mode } = useUIMode();
  const isGamified = mode === 'GAMIFIED';

  const questions = ASSESSMENT_QUESTIONS[conceptId] || ASSESSMENT_QUESTIONS['dsa-binary-search'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [confidence, setConfidence] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIdx];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    logLearningEvent({
      studentId,
      subjectId,
      conceptId,
      eventType: 'question_answered',
      result: isCorrect ? 'SUCCESS' : 'FAILURE',
      score: isCorrect ? 100 : 0,
      confidence,
      attemptNumber: currentIdx + 1,
    });
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 rounded-card border shadow-card transition-all ${
        isGamified ? 'bg-gradient-to-r from-surface via-purple-50 to-surface border-purple-200' : 'bg-surface border-subtleBorder'
      }`}>
        <div className="flex items-center space-x-2.5">
          <Award className={`w-5 h-5 ${isGamified ? 'text-purpleAccent' : 'text-primary'}`} />
          <div>
            <h2 className="text-base font-bold text-textMain">
              {isGamified ? 'MISSION CHALLENGE: BOUNDARY BREAKER' : 'Concept Assessment'}
            </h2>
            {isGamified && (
              <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> +40 XP Challenge Reward
              </span>
            )}
          </div>
          <Badge variant={isGamified ? 'purple' : 'info'}>Question {currentIdx + 1} of {questions.length}</Badge>
        </div>

        <div className="text-xs text-textSecondary font-mono font-bold">
          Score: <span className="text-primary">{score}/{questions.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Card className={isGamified ? 'border-purple-200 shadow-cardHover' : ''}>
            <CardHeader className="p-4 mb-2">
              {/* Confidence Selector */}
              <div className="mb-3 p-3 bg-secondaryBg border border-subtleBorder rounded-xl flex items-center justify-between">
                <span className="text-xs text-textMain font-semibold flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1.5 text-primary" /> How confident are you in this answer?
                </span>
                <div className="flex space-x-1.5">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((conf) => (
                    <button
                      key={conf}
                      onClick={() => setConfidence(conf)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        confidence === conf
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-surface text-textSecondary hover:bg-subtleBorder'
                      }`}
                    >
                      {conf}
                    </button>
                  ))}
                </div>
              </div>

              <CardTitle className="text-sm font-bold text-textMain leading-snug">
                {currentQ.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
              <div className="space-y-2">
                {currentQ.options?.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQ.correctAnswer;

                  let btnStyle = 'bg-surface border-subtleBorder text-textMain hover:bg-secondaryBg';
                  if (submitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-primary-light border-primary text-primary font-bold';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      disabled={submitted}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation Output */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 bg-secondaryBg border border-subtleBorder rounded-xl space-y-1 text-xs text-textMain"
                >
                  <span className="font-bold text-primary block">Explanation:</span>
                  <p className="leading-relaxed text-textSecondary">{currentQ.explanation}</p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                {!submitted ? (
                  <Button size="sm" variant={isGamified ? 'gradient' : 'primary'} onClick={handleSubmit} disabled={selectedOption === null} className="text-xs">
                    {isGamified ? 'TAKE CHALLENGE' : 'Submit Answer'}
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleNext} disabled={currentIdx >= questions.length - 1} className="text-xs">
                    Next Question →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
