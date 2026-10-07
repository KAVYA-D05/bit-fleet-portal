import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';

export const Login = () => {
  const { login, googleSSO, loading } = useAuth();

  const [email, setEmail] = useState('kavya.ag23@bitsathy.ac.in');
  const [password, setPassword] = useState('bit12345');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().trim().endsWith('@bitsathy.ac.in')) {
      setError('Access Restricted: Only @bitsathy.ac.in institutional email addresses are permitted.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication error');
    }
  };

  const handleGoogleSSO = async (ssoEmail, ssoName) => {
    setError('');
    try {
      await googleSSO(ssoEmail, ssoName);
    } catch (err) {
      setError(err.message || 'Google SSO failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex flex-col justify-center items-center p-4 font-sans antialiased text-slate-800">
      
      {/* Centered Login Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg max-w-md w-full border border-slate-100 space-y-6">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2.5">
            {/* BIT Head & Gear Logo */}
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a8 8 0 0 0-8 8c0 3.1 1.8 5.8 4.4 7.1L8 22h8l-.4-4.9A8.003 8.003 0 0 0 20 10a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="9" r="2.5" />
                <path d="M12 4v2m0 6v2M7 9H5m14 0h-2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              BIT Fleet Portal
            </h1>
          </div>

          <h2 className="text-lg font-bold text-[#7c3aed] pt-2">
            Hi, Welcome Back!
          </h2>
          <p className="text-[11px] text-slate-400 font-medium">
            Centralized Vehicle Booking for BIT Staff & Administrators
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#f1f4f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all font-medium text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#f1f4f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all font-medium text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {loading ? 'Authenticating with BIT Database...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-xs font-medium">Or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google SSO Button matching uploaded screenshot */}
        <div className="space-y-2">
          
          {/* Primary 1-Click Google Account for Kavya */}
          <button
            type="button"
            onClick={() => handleGoogleSSO('kavya.ag23@bitsathy.ac.in', 'Kavya S')}
            className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#5c3c2e] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                K
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                  Sign in as KAVYA
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  kavya.ag23@bitsathy.ac.in
                </p>
              </div>
            </div>

            {/* Google Logo */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </button>

          {/* Quick toggle for Transport Admin Account */}
          <div className="flex justify-between items-center text-[11px] pt-2 text-slate-400">
            <span>Transport Admin Access:</span>
            <button
              type="button"
              onClick={() => {
                setEmail('transport.admin@bitsathy.ac.in');
                setPassword('bit12345');
              }}
              className="text-purple-700 hover:text-purple-900 font-bold underline"
            >
              Fill Admin Credentials
            </button>
          </div>

        </div>

      </div>

      <p className="text-xs text-slate-400 text-center mt-6">
        Bannari Amman Institute of Technology • Sathyamangalam
      </p>

    </div>
  );
};
