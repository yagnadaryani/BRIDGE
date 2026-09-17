import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Building, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  ArrowRight,
  Cpu
} from 'lucide-react';

export const AuthView = () => {
  const { loginUser, registerUser, gamification, t } = useApp();
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register_student' | 'register_teacher' | 'forgot'
  const [role, setRole] = useState('student'); // 'student' | 'teacher'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [subjectDomain, setSubjectDomain] = useState('Operating Systems & Systems Architecture');

  // Forgot password state
  const [resetStep, setResetStep] = useState(1); // 1: send email, 2: enter code & new pass
  const [resetCode, setResetCode] = useState('');
  const [inputResetCode, setInputResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const session = await loginUser(email, password);
      setSuccess(`Authenticated! Welcome back, ${session.user.name}.`);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } font-sans finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const session = await registerUser({
        name,
        email,
        password,
        role,
        college: college || 'University Partner',
        institution: college || 'University Partner',
        department: department || 'Engineering',
        yearOfStudy,
        subjectDomain
      });
      setSuccess(`Account created! Welcome to BRIDGE, ${session.user.name}.`);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (resetStep === 1) {
        if (!email) throw new Error('Please enter your email.');
        // Call simulated backend reset
        const resetInfo = window.bridgeDB ? window.bridgeDB.forgotPassword(email) : { resetCode: 849201 };
        setResetCode(resetInfo.resetCode || 849201);
        setResetStep(2);
        setSuccess(`Verification code sent to ${email}! Code: ${resetInfo.resetCode || 849201}`);
      } else {
        if (inputResetCode !== String(resetCode)) {
          throw new Error('Invalid verification code.');
        }
        if (!newPassword || newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters.');
        }
        setSuccess('Password updated successfully! You can now log in.');
        setTimeout(() => {
          setAuthTab('login');
          setResetStep(1);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    }
  };

  const handleQuickDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setRole(demoRole);
    setAuthTab('login');
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      gamification ? 'bg-[#060911] text-white' : 'bg-white text-black'
    }`}>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Branding Hero Banner (5 cols) */}
        <div className={`md:col-span-5 p-8 rounded-3xl border flex flex-col justify-between min-h-[500px] shadow-2xl ${
          gamification
            ? 'glass-panel border-cyan-500/40 bg-slate-950/90 text-white'
            : 'bg-slate-900 border-black text-white shadow-xl'
        }`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg">
                <Cpu className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-wider text-gradient font-['Outfit'] block">
                  BRIDGE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                  SMART EDUCATION PLATFORM
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="text-xl font-extrabold font-['Outfit'] leading-tight">
                AI-Powered Learning, Interactive Labs & Career Readiness
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Personalized STEM ecosystem for engineering students and faculty. Experience virtual labs, adaptive career pathing, real-time analytics, and gamified missions.
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2.5 mt-6">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Demo Accounts:
            </span>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('priya@bridge.edu', 'student')}
                className="w-full px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-left font-bold transition-all flex items-center justify-between"
              >
                <span>🎓 Priya Sharma (Student)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher@bridge.edu', 'teacher')}
                className="w-full px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-left font-bold transition-all flex items-center justify-between"
              >
                <span>👩‍🏫 Dr. Sarah (Faculty)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Authentication Card (7 cols) */}
        <div className={`md:col-span-7 p-8 rounded-3xl border space-y-6 shadow-2xl ${
          gamification
            ? 'glass-panel border-white/10 bg-slate-950 text-white'
            : 'bg-white border-black text-black shadow-xl'
        }`}>
          {/* Header & Role Switcher */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-500 block">
                  Secure Authentication & RBAC
                </span>
                <h1 className={`text-2xl font-extrabold font-['Outfit'] ${gamification ? 'text-white' : 'text-black'}`}>
                  {authTab === 'login' ? 'Sign In to BRIDGE' : authTab === 'forgot' ? 'Reset Password' : `Register New ${role === 'teacher' ? 'Faculty' : 'Student'}`}
                </h1>
              </div>

              {/* Role Toggle Selector */}
              {authTab !== 'forgot' && (
                <div className="flex p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      if (authTab !== 'login') setAuthTab('register_student');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      role === 'student'
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('teacher');
                      if (authTab !== 'login') setAuthTab('register_teacher');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      role === 'teacher'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Teacher
                  </button>
                </div>
              )}
            </div>

            {/* Mode Tabs (Sign In vs Register vs Reset) */}
            <div className={`flex border-b pb-2 gap-4 text-xs font-bold ${gamification ? 'border-white/10' : 'border-slate-300'}`}>
              <button
                onClick={() => {
                  setAuthTab('login');
                  setError('');
                }}
                className={`pb-1 transition-all ${authTab === 'login' ? 'text-cyan-600 border-b-2 border-cyan-600 font-extrabold' : gamification ? 'text-slate-400' : 'text-slate-700'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthTab(role === 'teacher' ? 'register_teacher' : 'register_student');
                  setError('');
                }}
                className={`pb-1 transition-all ${authTab.startsWith('register') ? 'text-cyan-600 border-b-2 border-cyan-600 font-extrabold' : gamification ? 'text-slate-400' : 'text-slate-700'}`}
              >
                Create Account ({role === 'teacher' ? 'Faculty' : 'Student'})
              </button>
              <button
                onClick={() => {
                  setAuthTab('forgot');
                  setError('');
                }}
                className={`pb-1 transition-all ${authTab === 'forgot' ? 'text-cyan-600 border-b-2 border-cyan-600 font-extrabold' : gamification ? 'text-slate-400' : 'text-slate-700'}`}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Alert Banners */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Form 1: SIGN IN */}
          {authTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@bridge.edu"
                    className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none ${
                      gamification ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-500' : 'bg-white border border-black text-black placeholder-slate-600 focus:border-cyan-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none ${
                      gamification ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-500' : 'bg-white border border-black text-black placeholder-slate-600 focus:border-cyan-700'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              </button>
            </form>
          )}

          {/* Form 2: REGISTER (Student or Teacher) */}
          {authTab.startsWith('register') && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@bridge.edu"
                      className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none ${
                      gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                    }`}
                  />
                </div>
              </div>

              {/* Student specific fields */}
              {role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>College / Institution</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. IIT Bombay"
                        className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none ${
                          gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Branch / Dept</label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none ${
                          gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                        }`}
                      >
                        <option value="Computer Science Engineering">Computer Science (CSE)</option>
                        <option value="Electronics & Communication">Electronics (ECE)</option>
                        <option value="Information Technology">Information Tech (IT)</option>
                        <option value="Electrical Engineering">Electrical Eng (EE)</option>
                        <option value="Data Science & AI">Data Science & AI</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Year of Study</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none ${
                          gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                        }`}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher specific fields */}
              {role === 'teacher' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Institution / University</label>
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Tech"
                      className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Subject / Teaching Domain</label>
                    <input
                      type="text"
                      required
                      value={subjectDomain}
                      onChange={(e) => setSubjectDomain(e.target.value)}
                      placeholder="e.g. Operating Systems & Cloud Architecture"
                      className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-xs font-extrabold shadow-lg hover:opacity-95 flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : `Register as ${role === 'teacher' ? 'Faculty Member' : 'Student'}`}</span>
              </button>
            </form>
          )}

          {/* Form 3: FORGOT PASSWORD */}
          {authTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {resetStep === 1 ? (
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="registered-user@bridge.edu"
                      className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Enter 6-Digit Verification Code</label>
                    <input
                      type="text"
                      required
                      value={inputResetCode}
                      onChange={(e) => setInputResetCode(e.target.value)}
                      placeholder="e.g. 849201"
                      className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase mb-1 ${gamification ? 'text-slate-200' : 'text-black'}`}>Enter New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none ${
                        gamification ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500' : 'bg-white border border-black text-black focus:border-cyan-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 text-white text-xs font-extrabold shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{resetStep === 1 ? 'Send Verification Code' : 'Update & Reset Password'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
