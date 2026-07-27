import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { signupUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    // Required fields check
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!userName) {
      newErrors.userName = "Username is required";
    } else if (userName.trim().length <= 2) {
      newErrors.userName = "Username must be greater than 2 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");
    
    if (!validate()) return;

    signupUser({ email, userName, password }, () => {
      navigate("/login");
    }, (err) => {
      setServerError(err.response?.data?.message || "Registration failed");
    });
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col justify-between">
      <Header />

      {/* Main split screen layout */}
      <main className="flex-grow pt-20 lg:pt-24 flex items-center justify-center relative overflow-hidden">
        {/* Background ambient lights */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Side: Features Checklist (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 text-left pr-4">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                FREE REGISTRATION
              </span>
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white">
                Unlock your <br />
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  professional potential.
                </span>
              </h1>
              <p className="text-zinc-400 text-base max-w-lg leading-relaxed">
                Join thousands of job seekers who built metrics-driven resumes and landed roles at top-tier companies.
              </p>
            </div>

            {/* Benefit Checkpoints */}
            <div className="space-y-5">
              {[
                {
                  title: "Build Unlimited Resumes",
                  desc: "Create, copy, edit, and adapt resumes for various job roles without limits.",
                  color: "from-emerald-500 to-emerald-600"
                },
                {
                  title: "Real-time AI Keyword Enhancer",
                  desc: "Instantly insert keywords matching exact job openings to bypass ATS filters.",
                  color: "from-teal-500 to-teal-600"
                },
                {
                  title: "Premium PDF Exporter",
                  desc: "Download clean, highly structured, recruiter-ready PDF files in one click.",
                  color: "from-emerald-500 to-teal-500"
                }
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className={`h-10 w-10 flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${feat.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form Container */}
          <div className="col-span-1 lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-zinc-800/100">
              
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-white">Create Account</h2>
                <p className="text-zinc-400 text-xs mt-1.5">Sign up today and land your next role</p>
              </div>

              {serverError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="johndoe"
                    className={`w-full bg-zinc-950 border ${errors.userName ? 'border-rose-500/80' : 'border-zinc-800'} rounded-2xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-all duration-300`}
                  />
                  {errors.userName && (
                    <p className="text-xs text-rose-500 mt-1 pl-1">{errors.userName}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Email Address</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full bg-zinc-950 border ${errors.email ? 'border-rose-500/80' : 'border-zinc-800'} rounded-2xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-all duration-300`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-zinc-950 border ${errors.password ? 'border-rose-500/80' : 'border-zinc-800'} rounded-2xl py-3 pl-4 pr-11 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-all duration-300`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-500 mt-1 pl-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-98 hover:scale-[1.01] mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="absolute inset-0 bg-[conic-gradient(from_0deg,#10b981,#14b8a6,#10b981)] opacity-70 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative block rounded-[15px] bg-zinc-950 py-3.5 text-sm font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </span>
                </button>
              </form>

              {/* Footer info */}
              <div className="mt-6 text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
