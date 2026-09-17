'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Code2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { logLearningEvent } from '@/lib/engine/eventEngine';
import { verifyInterventionRetry } from '@/lib/engine/interventionEngine';
import { getCurrentSessionUser } from '@/lib/firebase/auth';

const INITIAL_BUGGY_CODE = `// Binary Search Implementation in JavaScript
// Goal: Return the index of target in sorted arr, or -1 if not found.

function binarySearch(arr, target) {
  let low = 0;
  // BUG: high is set to arr.length instead of arr.length - 1
  let high = arr.length;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
`;

const FIXED_CORRECT_CODE = `// Binary Search Implementation in JavaScript
// Corrected boundary invariant: high = arr.length - 1

function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1; // Correct index bound!

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
`;

export function DSACodeStudio() {
  const currentUser = getCurrentSessionUser();
  const studentId = currentUser?.id || 'aarav-101';

  const [code, setCode] = useState(INITIAL_BUGGY_CODE);
  const [running, setRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [activeIntervention, setActiveIntervention] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Array visualizer state
  const demoArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

  const handleRunCode = async () => {
    setRunning(true);
    setExecutionResult(null);
    setVerificationResult(null);

    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setExecutionResult(data);

      if (!data.success) {
        logLearningEvent({
          studentId,
          subjectId: 'dsa',
          conceptId: 'dsa-binary-search',
          eventType: 'code_failed',
          result: 'FAILURE',
          score: 40,
          errorType: data.errorType || 'BOUNDARY_OFF_BY_ONE',
          codeSnippet: code,
          attemptNumber: 1,
        });

        if (data.errorType === 'BOUNDARY_OFF_BY_ONE' || code.includes('high = arr.length')) {
          setActiveIntervention({
            diagnosisId: `diag-${Date.now()}`,
            category: 'PREREQUISITE_GAP',
            title: 'Prerequisite Gap: Array Index & Boundary Handling',
            explanation: 'Your code sets `high = arr.length`. In zero-indexed arrays, the last valid element is at index `arr.length - 1`. Accessing `arr[arr.length]` returns `undefined`, breaking comparisons!',
            rootGapTitle: 'Array Boundary Pointer Calculation',
            contrastExample: {
              wrong: 'let high = arr.length; // Points outside array!',
              right: 'let high = arr.length - 1; // Points to last valid element',
            },
            repairPrompt: 'Fix index initialization to `let high = arr.length - 1;` and click "Run & Submit" to verify repair!'
          });
        }
      } else {
        logLearningEvent({
          studentId,
          subjectId: 'dsa',
          conceptId: 'dsa-binary-search',
          eventType: 'code_passed',
          result: 'SUCCESS',
          score: 100,
          codeSnippet: code,
          attemptNumber: 2,
        });

        if (activeIntervention) {
          const vRes = verifyInterventionRetry(studentId, activeIntervention.diagnosisId, true, 100);
          setVerificationResult(vRes);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const handleApplyFixSnippet = () => {
    setCode(FIXED_CORRECT_CODE);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-subtleBorder p-4 rounded-card shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-textMain">DSA Code Studio: Binary Search</h2>
            <Badge variant="info">O(log N)</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Write a complete Binary Search algorithm in JavaScript to find the index of a target number.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleApplyFixSnippet} className="text-xs">
            Auto-Insert Fix Template
          </Button>
          <Button size="sm" onClick={handleRunCode} disabled={running} className="text-xs space-x-1.5">
            {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Run & Submit Code</span>
          </Button>
        </div>
      </div>

      {/* Editor & Execution Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Monaco Editor (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-subtleBorder rounded-card overflow-hidden shadow-card flex flex-col min-h-[420px]">
          <div className="px-4 py-2.5 bg-secondaryBg border-b border-subtleBorder flex items-center justify-between text-xs text-textSecondary font-semibold">
            <span className="font-mono text-textMain">binarySearch.js</span>
            <span>JavaScript (ES6)</span>
          </div>

          <div className="flex-1 min-h-[380px]">
            <Editor
              height="380px"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Test Cases & Visualization Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">

          {/* Live State Visualizer */}
          <Card>
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">Live Array Pointer Visualizer</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex flex-wrap gap-1.5 justify-center py-3 bg-secondaryBg rounded-xl border border-subtleBorder">
                {demoArray.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-10 rounded-lg flex flex-col items-center justify-center text-xs font-mono transition-all ${
                      idx === 5
                        ? 'bg-primary-light border-2 border-primary text-primary font-bold shadow-sm'
                        : 'bg-surface border border-subtleBorder text-textMain'
                    }`}
                  >
                    <span>{val}</span>
                    <span className="text-[9px] text-textMuted">[{idx}]</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-textSecondary text-center mt-2 font-medium">
                Target: 23 (Expected index: 5) | Length N = 10 (Indices 0 to 9)
              </p>
            </CardContent>
          </Card>

          {/* Test Case Results Output */}
          {executionResult && (
            <Card className={executionResult.success ? 'border-emerald-300 bg-emerald-50/50' : 'border-rose-300 bg-rose-50/50'}>
              <CardHeader className="p-3 mb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center">
                  {executionResult.success ? (
                    <span className="text-emerald-700 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> All Tests Passed!</span>
                  ) : (
                    <span className="text-rose-700 flex items-center"><AlertTriangle className="w-4 h-4 mr-1.5 text-rose-600" /> Test Suite Failed ({executionResult.passedCount}/{executionResult.totalCount})</span>
                  )}
                </CardTitle>
                <Badge variant={executionResult.success ? 'success' : 'destructive'} className="text-[10px]">
                  {executionResult.success ? '100% Passed' : executionResult.errorType || 'ERROR'}
                </Badge>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2 text-xs">
                {executionResult.results.map((res: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-subtleBorder">
                    <span className="font-mono text-textMain">Target: {res.testCase.target}</span>
                    <span className={res.passed ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {res.passed ? `Passed (Idx ${res.actual})` : `Failed (${res.error || 'Wrong answer'})`}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Targeted Diagnostic Intervention Banner (Light Warning Surface: #FFF9EC, border #F1D99A, icon/text #E59A18) */}
          {activeIntervention && !verificationResult && (
            <div className="p-4 bg-[#FFF9EC] border border-[#F1D99A] rounded-card space-y-3 shadow-card animate-in fade-in">
              <div className="flex items-center justify-between">
                <Badge variant="warning" className="text-[10px]">ROOT-CAUSE DIAGNOSIS</Badge>
                <span className="text-[11px] text-[#E59A18] font-bold">{activeIntervention.rootGapTitle}</span>
              </div>
              <h4 className="text-xs font-bold text-textMain">{activeIntervention.title}</h4>
              <p className="text-xs text-textSecondary leading-relaxed">{activeIntervention.explanation}</p>

              <div className="p-3 bg-surface rounded-xl text-xs space-y-1 font-mono border border-[#F1D99A]">
                <div className="text-rose-600 font-medium">✖ {activeIntervention.contrastExample.wrong}</div>
                <div className="text-emerald-700 font-bold">✔ {activeIntervention.contrastExample.right}</div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-textSecondary italic">{activeIntervention.repairPrompt}</span>
                <Button size="sm" variant="primary" onClick={handleApplyFixSnippet} className="text-xs py-1 px-3">
                  Apply Fix →
                </Button>
              </div>
            </div>
          )}

          {/* Intervention Verification Result Card */}
          {verificationResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-card space-y-3 shadow-card animate-in zoom-in-95">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900">INTERVENTION VERIFIED SUCCESSFUL!</h4>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-emerald-200 text-xs font-mono">
                <div>
                  <span className="text-textMuted block text-[10px]">Before Repair</span>
                  <span className="text-rose-600 font-bold text-sm">{verificationResult.beforeScore}%</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-textMuted block text-[10px]">After Repair</span>
                  <span className="text-emerald-600 font-bold text-sm">{verificationResult.afterScore}%</span>
                </div>
                <div>
                  <span className="text-textMuted block text-[10px]">Status</span>
                  <Badge variant="success" className="text-[10px]">VERIFIED CLOSED</Badge>
                </div>
              </div>

              <p className="text-xs text-emerald-800 font-medium">{verificationResult.message}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
