import React from "react";
import ShieldIcon from "../components/icons/ShieldIcon";
import BoltIcon from "../components/icons/BoltIcon";
import UserIcon from "../components/icons/UserIcon";
import LockIcon from "../components/icons/LockIcon";
import Feature from "../components/auth/Feature";
import Field from "../components/auth/Field";
import Cred from "../components/auth/Cred";

export default function Login() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: handle login
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-xl grid grid-cols-1 md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="relative bg-slate-950 text-white p-10 flex flex-col justify-between">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold tracking-wider">
              SMARTRETAIL <span className="text-emerald-400">PRO</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Retail Operations Control System (ROCS)
            </p>
          </div>

          <div className="relative z-10 space-y-8 my-16">
            <Feature
              icon={<ShieldIcon className="h-6 w-6 text-emerald-400" />}
              title="Role-Based Security"
              desc="Granular access control for every employee tier."
              iconBg="bg-emerald-500/20 ring-emerald-400/30"
            />

            <Feature
              icon={<BoltIcon className="h-6 w-6 text-sky-400" />}
              title="High-Speed POS"
              desc="Keyboard-driven interface for rapid billing."
              iconBg="bg-sky-500/20 ring-sky-400/30"
            />
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            Build v2.1.0-RC1 | SRS Compliant
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-slate-500">
            Please enter your credentials to access the system.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field label="Username" icon={<UserIcon className="h-5 w-5" />}>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
            </Field>

            <Field label="Password" icon={<LockIcon className="h-5 w-5" />}>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
            </Field>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition hover:shadow-md hover:scale-105 duration-200"
            >
              Login to ROCS
            </button>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition hover:underline hover:scale-105 inline-block duration-200">
                Forgot password?
              </a>
            </div>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="text-blue-600 hover:text-blue-700 transition font-semibold hover:underline hover:scale-105 inline-block duration-200">
              Don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}