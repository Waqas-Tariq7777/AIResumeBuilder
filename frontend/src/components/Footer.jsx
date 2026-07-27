import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-2xl overflow-hidden py-16">
      
      {/* Radiant backlight effect inside footer */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-96 -translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-600/5 to-teal-600/5 blur-[120px]"></div>
      
      <div className="mx-auto max-w-7xl px-3 min-[380px]:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Brand Presentation Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 min-[320px]:h-10 min-[320px]:w-10 items-center justify-center rounded-xl min-[320px]:rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.25)] shrink-0">
                <svg className="h-4.5 w-4.5 min-[320px]:h-5.5 min-[320px]:w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904z" />
                </svg>
              </div>
              <span className="text-base min-[320px]:text-xl font-black text-white shrink">
                Nex<span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">ResumeBuilder</span>
              </span>
            </div>
            <p className="max-w-xs text-xs min-[320px]:text-sm leading-relaxed text-zinc-400">
              Transforming standard resumes into metrics-driven professional masterpieces utilizing advanced AI models.
            </p>
            {/* Social Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { 
                  name: 'LinkedIn', 
                  url: 'https://www.linkedin.com/in/waqas-tariq-9a0a2b332?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
                  svg: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/> 
                },
                { 
                  name: 'GitHub', 
                  url: 'https://github.com/Waqas-Tariq7777',
                  svg: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/> 
                },
                { 
                  name: 'Instagram', 
                  url: 'https://www.instagram.com/waqas_tariq77?igsh=MWoyNTZmc203NjhyYQ%3D%3D&utm_source=qr',
                  svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/> 
                }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-8 w-8 min-[320px]:h-10 min-[320px]:w-10 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-900/40 text-zinc-500 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                >
                  <svg className="h-4.5 w-4.5 min-[320px]:h-5 min-[320px]:w-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Contact navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-2">
            {/* Product Column */}
            <div className="col-span-1">
              <h3 className="text-xs min-[320px]:text-sm font-bold tracking-wider text-white uppercase mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/#demo" className="text-xs min-[320px]:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200">AI Enhancer</a>
                </li>
                <li>
                  <a href="/#features" className="text-xs min-[320px]:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200">Features</a>
                </li>
                <li>
                  <a href="/#templates" className="text-xs min-[320px]:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200">Resume Designs</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="col-span-1">
              <h3 className="text-xs min-[320px]:text-sm font-bold tracking-wider text-white uppercase mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/#faq" className="text-xs min-[320px]:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200">Help & FAQs</a>
                </li>
                <li>
                  <Link to="/privacy" className="text-xs min-[320px]:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-xs min-[320px]:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200">Terms of Use</Link>
                </li>
              </ul>
            </div>

            {/* Custom Contact Box */}
            <div className="col-span-2 sm:col-span-1 flex flex-col justify-start">
              <h3 className="text-xs min-[320px]:text-sm font-bold tracking-wider text-white uppercase mb-4">Contact Us</h3>
              <ul className="space-y-4 text-xs min-[320px]:text-sm text-zinc-400">
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:waqastariq9101@gmail.com" className="hover:text-emerald-400 transition-colors break-all">waqastariq9101@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a href="tel:+923025649101" className="hover:text-emerald-400 transition-colors break-words">+92 302 5649101</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="break-words">Mirpur AJK</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="mt-16 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] min-[320px]:text-xs text-zinc-500 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} NexResumeBuilder Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
