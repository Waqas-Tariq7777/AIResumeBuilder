import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logoutUser } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b ${
        scrolled 
          ? 'py-2 min-[320px]:py-3.5 bg-zinc-950 lg:bg-zinc-950/75 backdrop-blur-xl border-zinc-800/80 shadow-[0_8px_32px_-6px_rgba(0,0,0,0.5)]' 
          : 'py-3 min-[320px]:py-5 bg-zinc-950 lg:bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-2 min-[340px]:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 min-[320px]:gap-2">
          
          {/* Logo with micro-glow animation */}
          <Link to="/" className="group flex items-center gap-1.5 min-[320px]:gap-2 focus:outline-none shrink-0">
            <div className="relative flex h-7 w-7 min-[320px]:h-9 min-[320px]:w-9 min-[380px]:h-11 min-[380px]:w-11 shrink-0 items-center justify-center rounded-lg min-[320px]:rounded-xl min-[380px]:rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <svg className="h-4 w-4 min-[320px]:h-5 min-[320px]:w-5 min-[380px]:h-6 min-[380px]:w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904zM18 10.5l-.562-2.938L14.5 7l2.938-.562L18 3.5l.562 2.938L21.5 7l-2.938.562L18 10.5z" />
              </svg>
              {/* Outer pulsing ring */}
              <div className="absolute -inset-1 rounded-lg min-[320px]:rounded-xl min-[380px]:rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-0 blur transition-all duration-300 group-hover:opacity-40 group-hover:-inset-1.5"></div>
            </div>
            <span className="text-[10px] min-[320px]:text-xs min-[360px]:text-sm min-[400px]:text-base min-[480px]:text-2xl font-extrabold tracking-tight text-white transition-all duration-300 shrink">
              Nex<span className="hidden min-[320px]:inline bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">ResumeBuilder</span>
              <span className="inline min-[320px]:hidden bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">RB</span>
              <span className="inline-block h-1 w-1 min-[380px]:h-1.5 min-[380px]:w-1.5 rounded-full bg-emerald-500 ml-0.5 animate-pulse"></span>
            </span>
          </Link>
 
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/35 p-1 backdrop-blur-md">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'AI Enhancer', href: '/#demo' },
              { label: 'Comparison', href: '/#comparison' },
              { label: 'Templates', href: '/#templates' },
              { label: 'FAQ', href: '/#faq' }
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-emerald-400 font-semibold tracking-wide max-w-[180px] truncate">
                  {user.email}
                </span>
                <button 
                  onClick={logoutUser}
                  className="relative group overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-95 hover:scale-[1.03] cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative block rounded-[15px] bg-zinc-950 px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold tracking-wide text-zinc-400 hover:text-white transition-all duration-300 active:scale-95">
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="relative group overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-95 hover:scale-[1.03]"
                >
                  {/* Spinning gradient border effect */}
                  <span className="absolute inset-0 bg-[conic-gradient(from_0deg,#10b981,#14b8a6,#10b981)] opacity-70 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative block rounded-[15px] bg-zinc-950 px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                    Get Started Free
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex h-8 w-8 min-[320px]:h-11 min-[320px]:w-11 items-center justify-center rounded-lg min-[320px]:rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white focus:outline-none backdrop-blur-md transition-colors"
            >
              <span className="sr-only">Open Menu</span>
              {isOpen ? (
                <svg className="h-4.5 w-4.5 min-[320px]:h-5 min-[320px]:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5 min-[320px]:h-5 min-[320px]:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with solid background */}
      <div 
        className={`fixed inset-x-0 top-[53px] min-[320px]:top-[73px] bottom-0 z-40 bg-zinc-950 transition-all duration-300 lg:hidden border-t border-zinc-900 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full justify-between px-6 py-8">
          <nav className="flex flex-col gap-3">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'AI Enhancer', href: '/#demo' },
              { label: 'Comparison', href: '/#comparison' },
              { label: 'Templates', href: '/#templates' },
              { label: 'FAQ', href: '/#faq' }
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900/10 px-5 py-4 text-base font-bold text-zinc-300 hover:border-emerald-500/20 hover:bg-zinc-900/40 hover:text-emerald-400 transition-all duration-300"
              >
                <span>{link.label}</span>
                <svg className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pb-8">
            {user ? (
              <>
                <span className="w-full text-center text-base font-bold text-emerald-400 py-2 truncate">
                  {user.email}
                </span>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    logoutUser();
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-500 via-rose-600 to-red-600 py-4 text-center text-base font-bold text-white shadow-xl shadow-red-500/20 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/20 py-4 text-center text-base font-bold text-zinc-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 py-4 text-center text-base font-bold text-white shadow-xl shadow-emerald-500/20"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
