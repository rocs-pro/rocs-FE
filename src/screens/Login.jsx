import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import bgImage from "../assets/images/registration-bg.png";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: handle login
  };

  // COMPONENT: Background Wrapper with Blur
  const BackgroundWrapper = ({ children }) => (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover blur-sm scale-110" />
        <div className="absolute inset-0 bg-brand-deep/80 mix-blend-multiply"></div>
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );

  return (
    <BackgroundWrapper>
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* SIDE BAR */}
        <div className="hidden md:flex w-5/12 bg-brand-deep p-8 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight">Smart Retail <span style={{ color: 'rgb(52 211 153 / var(--tw-text-opacity, 1))' }}>Pro</span></span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome Back.</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sign in to secure terminal to access store operations and reporting.
            </p>
          </div>

          {/* CIRCLES SIDES BAR*/}
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-brand/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-brand/20 rounded-full blur-xl"></div>
        </div>

        {/* FORM AREA */}
        <div className="w-full md:w-7/12 p-8 md:p-10 bg-pos-bg">
          <h3 className="text-2xl font-bold text-pos-text mb-6">Login to Account</h3>

          <form onSubmit={onSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                <input type="text" required placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                <input type="password" required placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm font-mono" />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login to ROCS"}
            </button>

            <div className="mt-4 text-center">
              <a href="#" className="text-xs font-bold text-slate-400 hover:text-brand transition-colors">
                Forgot Password?
              </a>
            </div>

            <div className="h-px bg-slate-200 my-6"></div>

            <div className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-brand hover:underline">
                Register New ID
              </Link>
            </div>

          </form>
        </div>
      </div>
    </BackgroundWrapper>
  );
}