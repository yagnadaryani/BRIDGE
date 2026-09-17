import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { GraduationCap, School, ShieldCheck, Sparkles, ArrowRight, User, Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginView: React.FC = () => {
  const { loginAsStudent, loginAsTeacher, loginWithEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<UserRole>('STUDENT');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide valid credentials.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    loginWithEmail(email, activeTab, name);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle architectural background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-3">
            <span className="font-extrabold text-xl tracking-wider">B</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            BRIDGE
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mt-1">
            Build • Reason • Intervene • Diagnose • Grow • Express
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
            "Most platforms personalize the content. <br className="hidden sm:inline" />
            <strong className="text-slate-800 font-semibold not-italic">BRIDGE personalizes the learning process.</strong>"
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('STUDENT')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'STUDENT'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>STUDENT</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TEACHER')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'TEACHER'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>TEACHER</span>
          </button>
        </div>

        {/* Quick Demo Login Option */}
        <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100/90 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Instant Evaluator Access
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-200/80 text-indigo-800">
              ONE-CLICK DEMO
            </span>
          </div>
          <p className="text-xs text-indigo-700 mb-3">
            {activeTab === 'STUDENT'
              ? 'Enter as Aarav Sharma (CS Sem 4) to test the Binary Search repair loop and interactive logic lab.'
              : 'Enter as Prof. Ramesh Kulkarni to view cohort diagnostics, recurring gaps, and growth replay.'}
          </p>
          <button
            type="button"
            onClick={activeTab === 'STUDENT' ? loginAsStudent : loginAsTeacher}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-indigo-300 transition-all flex items-center justify-center gap-2"
          >
            <span>
              {activeTab === 'STUDENT' ? 'Launch as Aarav (Demo Student)' : 'Launch as Prof. Kulkarni (Demo Teacher)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-xs uppercase font-medium">Or email sign in</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Manual Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Maya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder={activeTab === 'STUDENT' ? 'student@eng.edu' : 'faculty@eng.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
          >
            {isSignUp ? `Register as ${activeTab}` : `Sign In to ${activeTab} Portal`}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-dimensional Learner Model Active</span>
        </div>
      </motion.div>
    </div>
  );
};
