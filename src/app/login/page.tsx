'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { loginWithRole } from '@/lib/firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginWithRole(email, roleTab);
      if (user.role === 'TEACHER') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    } catch (err: any) {
      setError('Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudentLogin = async () => {
    setLoading(true);
    await loginWithRole('aarav@bridge.edu', 'STUDENT');
    router.push('/student');
  };

  const handleDemoTeacherLogin = async () => {
    setLoading(true);
    await loginWithRole('teacher@bridge.edu', 'TEACHER');
    router.push('/teacher');
  };

  return (
    <div className="min-h-screen bg-page text-textMain flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purpleAccent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 bg-surface border border-subtleBorder px-4 py-1.5 rounded-full text-xs text-primary shadow-card">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span className="font-semibold">Personalizing the Learning Process</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-wider text-textMain">
          BRIDGE
        </h1>
        <p className="text-xs text-textSecondary font-mono">
          Build • Reason • Intervene • Diagnose • Grow • Express
        </p>
      </div>

      {/* Main Auth Card */}
      <Card className="max-w-md w-full bg-surface border-subtleBorder shadow-card">
        <CardHeader className="p-6 pb-2">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-secondaryBg rounded-xl border border-subtleBorder mb-4">
            <button
              onClick={() => setRoleTab('STUDENT')}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                roleTab === 'STUDENT'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-textSecondary hover:text-textMain'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>STUDENT</span>
            </button>
            <button
              onClick={() => setRoleTab('TEACHER')}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                roleTab === 'TEACHER'
                  ? 'bg-surface text-purpleAccent shadow-sm'
                  : 'text-textSecondary hover:text-textMain'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>TEACHER</span>
            </button>
          </div>

          <CardTitle className="text-sm font-bold text-textMain text-center">
            {roleTab === 'STUDENT'
              ? isSignUp ? 'Create Student Account' : 'Student Sign In'
              : isSignUp ? 'Create Teacher Account' : 'Teacher Sign In'}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-4">
          <form onSubmit={handleAuth} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-textSecondary block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === 'STUDENT' ? 'aarav@bridge.edu' : 'teacher@bridge.edu'}
                className="w-full bg-secondaryBg border border-subtleBorder rounded-xl px-3 py-2 text-xs text-textMain placeholder-textMuted focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-textSecondary block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-secondaryBg border border-subtleBorder rounded-xl px-3 py-2 text-xs text-textMain placeholder-textMuted focus:outline-none focus:border-primary"
              />
            </div>

            {error && <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full text-xs py-2.5 font-bold">
              {loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="flex justify-between items-center text-xs text-textSecondary pt-1">
            <button onClick={() => setIsSignUp(!isSignUp)} className="hover:text-primary font-medium">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Quick Demo Accounts Banner */}
          <div className="pt-3 border-t border-subtleBorder space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-textMuted block text-center">
              Instant 1-Click Evaluation Accounts
            </span>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoStudentLogin}
                className="text-[11px] border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold"
              >
                Demo Student (Aarav)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoTeacherLogin}
                className="text-[11px] border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-semibold"
              >
                Demo Teacher (Dr. Rao)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
