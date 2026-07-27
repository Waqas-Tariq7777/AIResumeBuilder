import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)] blur-[90px] pointer-events-none"></div>

      <Header />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        
        {/* Back Link */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors mb-8 group"
        >
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Content Box */}
        <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-900/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-8">
          
          <div className="border-b border-zinc-900 pb-6">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Terms of Use</h1>
            <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest font-semibold">Last Updated: June 1, 2026</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-zinc-400">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide">1. Agreement to Terms</h2>
              <p>
                By accessing and utilizing the **NexResumeBuilder** platform, you agree to comply with and be bound by these Terms of Use. If you do not agree, you are prohibited from utilizing our AI services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide">2. Permitted Use</h2>
              <p>
                You are granted a non-exclusive, non-transferable, revocable license to utilize the resume enhancer simulator to polish experience points, summaries, and career documents for your personal job search campaigns.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide">3. Disclaimer of Warranties</h2>
              <p>
                NexResumeBuilder is provided "as is" and "as available". While our AI models deliver highly polished semantic enhancements, we do not warrant or guarantee that utilizing our platform will secure specific employment offers or callbacks.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide">4. Contact Information</h2>
              <p>
                For legal inquiries or technical clarification regarding NexResumeBuilder terms, please contact:
              </p>
              <div className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-4 font-semibold text-emerald-400 space-y-1">
                <p>Email: waqastariq9101@gmail.com</p>
                <p>Phone: +92 302 5649101</p>
                <p>Location: Mirpur AJK</p>
              </div>
            </section>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}
