import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InteractiveEnhancer from '../components/InteractiveEnhancer';
import bannerBg from '../assets/images/banner_bg.png';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the NexResumeBuilder integration process my resume details?",
      a: "NexResumeBuilder interfaces securely with advanced AI models. By analyzing your raw input points against professional semantic frameworks, it instantly constructs action-focused, impact-oriented bullet points that contain metrics-driven accomplishments."
    },
    {
      q: "Are the generated templates fully ATS-compatible?",
      a: "Yes. Every resume template in our gallery is engineered alongside recruitment algorithm experts. We omit complex tables or non-standard characters that break parsing, ensuring your applications receive high-ranking match scores."
    },
    {
      q: "Can I customize or prompt the AI for specific keywords?",
      a: "Absolutely. Once the baseline resume is generated, you can refine sections, edit vocabulary, or inject specific keywords directly to align with target job descriptions."
    },
    {
      q: "Is my personal work history secure with NexResumeBuilder?",
      a: "Data protection is central to our infrastructure. Your inputs are exclusively analyzed for real-time formatting and are never stored permanently, sold, or shared with third-party networks."
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Writing Speed" },
    { value: "98.4%", label: "ATS Pass Rate" },
    { value: "40%", label: "Salary Increase Average" }
  ];

  const features = [
    {
      title: "NexResumeBuilder Experience Polisher",
      desc: "Converts brief experience descriptions into professional accomplishments with active verbs and key performance indicators.",
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Executive Profile Synthesizer",
      desc: "Creates structured, compelling summaries that capture the candidate's career highlights in 3 lines.",
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Targeted Skill Optimizer",
      desc: "Scrapes your resume text and maps corresponding skills perfectly to suit algorithmic recruiters.",
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Seamless One-Click PDF Export",
      desc: "Instantly compile resumes into standardized layouts that download instantly in pixel-perfect formats.",
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Premium Background Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Floating Animated Gradient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_70%)] blur-[100px] animate-pulse duration-[8s] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.08),transparent_70%)] blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)] blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-3 min-[380px]:px-6 pt-24 pb-16 border-b border-zinc-900/60 bg-zinc-950 overflow-hidden">
        {/* Isolated background image container with reduced opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none z-0"
          style={{ backgroundImage: `url(${bannerBg})` }}
        ></div>
        {/* Subtle blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] z-0"></div>
        <div className="mx-auto max-w-7xl w-full relative z-10">
          
          {/* Main Hero grid containing content and decorative card display */}
          <div className="grid gap-6 min-[380px]:gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-7 space-y-6 min-[380px]:space-y-8 text-left">
              
              {/* Premium Glow Capsule Badge */}
              <div className="inline-flex items-center gap-1.5 min-[320px]:gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 min-[320px]:px-4 min-[320px]:py-2 text-[9px] min-[320px]:text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-xl animate-fade-in shadow-[0_4px_30px_rgba(16,185,129,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                NexResumeBuilder AI Core Integration
              </div>

              {/* Dynamic H1 Header */}
              <h1 className="text-xl min-[320px]:text-2xl min-[360px]:text-3xl min-[480px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Create Your Resume With{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">
                  AI Content Enhancement
                </span>
              </h1>

              {/* Responsive subtitle */}
              <p className="max-w-xl text-xs min-[320px]:text-sm sm:text-base text-zinc-400 leading-relaxed">
                Eliminate blank page anxiety. NexResumeBuilder translates standard job bullet points into professional, metric-heavy, and high-impact descriptions instantly.
              </p>

              {/* Premium Interactive CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href="#demo"
                  className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2.5 min-[320px]:px-4 min-[320px]:py-3 sm:px-8 sm:py-4.5 text-[10px] min-[320px]:text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white shadow-xl shadow-emerald-500/15 hover:shadow-emerald-500/25 hover:scale-[1.03] active:scale-95 transition-all duration-300"
                >
                  Create My Resume
                </a>
                <a
                  href="#features"
                  className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/35 backdrop-blur-md px-3 py-2.5 min-[320px]:px-4 min-[320px]:py-3 sm:px-8 sm:py-4.5 text-[10px] min-[320px]:text-xs sm:text-sm font-extrabold uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white hover:scale-[1.03] active:scale-95 transition-all duration-300"
                >
                  Explore Features
                </a>
              </div>

              {/* Premium Stat Boxes layout */}
              <div className="grid grid-cols-1 min-[260px]:grid-cols-3 gap-4 min-[360px]:gap-6 pt-6 min-[380px]:pt-10 border-t border-zinc-900">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-xl min-[320px]:text-2xl sm:text-3xl font-black tracking-tight text-white">{stat.value}</p>
                    <p className="text-[9px] min-[320px]:text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">{stat.label}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Display column */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-[380px] rounded-2xl min-[320px]:rounded-3xl border border-zinc-800/80 bg-zinc-900/10 p-3.5 min-[320px]:p-6 shadow-[0_32px_96px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                
                {/* Embedded dynamic light circle */}
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-600/10 blur-[50px]"></div>

                <div className="flex items-center justify-between mb-4 min-[320px]:mb-6">
                  <span className="text-[10px] min-[320px]:text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Template</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 min-[320px]:px-2.5 min-[320px]:py-1 text-[9px] min-[320px]:text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">ATS Match: 99%</span>
                </div>

                {/* Simulated Glass Resume Section preview */}
                <div className="space-y-3 min-[320px]:space-y-4">
                  <div className="h-6 w-2/3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-transparent p-[1px]">
                    <div className="h-full w-full rounded-xl bg-zinc-950 px-3 py-1 flex items-center"><span className="text-[9px] min-[320px]:text-[10px] font-extrabold text-emerald-400">Sarah Jenkins | Director</span></div>
                  </div>
                  
                  <div className="space-y-2 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-3 min-[320px]:p-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-3.5 w-20 min-[320px]:w-24 rounded bg-zinc-800"></div>
                      <div className="h-2 w-10 min-[320px]:w-12 rounded bg-zinc-800"></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded bg-zinc-800/60"></div>
                      <div className="h-2 w-11/12 rounded bg-zinc-800/60"></div>
                      <div className="h-2 w-5/6 rounded bg-zinc-800/60"></div>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-3 min-[320px]:p-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-3.5 w-24 min-[320px]:w-32 rounded bg-zinc-800"></div>
                      <div className="h-2 w-10 min-[320px]:w-12 rounded bg-zinc-800"></div>
                    </div>
                    {/* Simulated enhanced bullet block */}
                    <div className="flex items-start gap-2 pt-1">
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 shrink-0">
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="h-2.5 w-full rounded bg-emerald-400/10"></div>
                        <div className="h-2 w-4/5 rounded bg-emerald-400/10"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating secondary accent badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 min-[380px]:left-auto min-[380px]:-left-6 min-[380px]:translate-x-0 flex items-center gap-2.5 min-[320px]:gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-3 min-[320px]:p-4 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-bounce duration-[6s] shrink-0 w-[140px] min-[320px]:w-auto">
                <div className="flex h-8 w-8 min-[320px]:h-10 min-[320px]:w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <svg className="h-4.5 w-4.5 min-[320px]:h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] min-[320px]:text-xs font-extrabold uppercase tracking-widest text-zinc-400">System Rating</p>
                  <p className="text-xs min-[320px]:text-sm font-bold text-white">4.9/5 stars</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Interactive AI Preview Demo */}
      <section id="demo" className="py-14 px-3 min-[380px]:px-6 border-t border-zinc-900 bg-zinc-950/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10 space-y-4">
            <h2 className="text-xl min-[320px]:text-2xl min-[480px]:text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Experience the NexResumeBuilder Enhancer
            </h2>
            <p className="mt-3 text-xs min-[320px]:text-sm text-zinc-400 max-w-xl mx-auto">
              Simulate NexResumeBuilder's performance below. Choose any category, use a pre-built sample, or edit input parameters directly to watch optimization run.
            </p>
          </div>
          
          <InteractiveEnhancer />
        </div>
      </section>

      {/* Supercharged Features Grid */}
      <section id="features" className="relative py-14 px-3 min-[380px]:px-6 border-t border-zinc-900 overflow-hidden">
        
        {/* Dynamic colored shadow background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_65%)] blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-xl min-[320px]:text-2xl min-[480px]:text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Engineered For Modern Recruitment
            </h2>
            <p className="text-xs min-[320px]:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Every tool and optimization structure has been tuned alongside talent acquisition experts to deliver immediate professional appeal.
            </p>
          </div>

          <div className="grid gap-4 min-[380px]:gap-8 grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-3xl border border-zinc-800/60 bg-zinc-950/45 p-5 min-[320px]:p-6 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/40 hover:bg-zinc-900/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] overflow-hidden"
              >
                {/* Colored shadow back-glow on card hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 -z-10"></div>
                
                {/* Diagonal shimmering glass reflection shine */}
                <div className="absolute top-0 -left-[100%] h-full w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-[1s] ease-out pointer-events-none"></div>

                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800/80 mb-6 group-hover:scale-105 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-base min-[320px]:text-lg font-bold text-white mb-3 tracking-wide group-hover:text-emerald-400 transition-colors duration-300">{item.title}</h3>
                <p className="text-xs min-[320px]:text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI vs Traditional Side-By-Side Comparison */}
      <section id="comparison" className="py-14 px-3 min-[380px]:px-6 bg-zinc-950/20 border-t border-zinc-900">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10 space-y-4">
            <h2 className="text-xl min-[320px]:text-2xl min-[480px]:text-3xl font-extrabold text-white">Traditional Methods vs NexResumeBuilder</h2>
            <p className="text-xs min-[320px]:text-sm text-zinc-400 max-w-lg mx-auto">Compare formatting constraints against modern automated career architectures.</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 border-b border-zinc-800 bg-zinc-950/80 text-[10px] min-[320px]:text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-300">
              <div className="px-4 py-3 min-[380px]:px-6 min-[380px]:py-5">Traditional Resume Crafting</div>
              <div className="px-4 py-3 min-[380px]:px-6 min-[380px]:py-5 border-t min-[480px]:border-t-0 min-[480px]:border-l border-zinc-800 bg-emerald-500/5 text-emerald-400">NexResumeBuilder AI</div>
            </div>
            
            <div className="divide-y divide-zinc-800/80 text-xs min-[320px]:text-sm leading-relaxed">
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2">
                <div className="px-4 py-4 min-[380px]:px-6 min-[380px]:py-5 text-zinc-400">Hours spent editing formats, vocabulary margins, and structure configurations.</div>
                <div className="px-4 py-4 min-[380px]:px-6 min-[380px]:py-5 border-t min-[480px]:border-t-0 min-[480px]:border-l border-zinc-800 bg-emerald-500/5 text-zinc-200">Instant AI synthesis generates metric-heavy professional structures in under 10 seconds.</div>
              </div>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2">
                <div className="px-4 py-4 min-[380px]:px-6 min-[380px]:py-5 text-zinc-400">Passive sentences detailing daily operational tasks ("I was responsible for customer inquiries").</div>
                <div className="px-4 py-4 min-[380px]:px-6 min-[380px]:py-5 border-t min-[480px]:border-t-0 min-[480px]:border-l border-zinc-800 bg-emerald-500/5 text-zinc-200">Active verb structure focusing heavily on quantifiable metrics and outcomes ("Optimized response rates by 24%").</div>
              </div>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2">
                <div className="px-4 py-4 min-[380px]:px-6 min-[380px]:py-5 text-zinc-400">Static templates that scramble formatting constraints when exported across editors.</div>
                <div className="px-4 py-4 min-[380px]:px-6 min-[380px]:py-5 border-t min-[480px]:border-t-0 min-[480px]:border-l border-zinc-800 bg-emerald-500/5 text-zinc-200">Perfect data preservation ensures layouts adjust on the fly without column breaking.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Grid */}
      <section id="templates" className="py-14 px-3 min-[380px]:px-6 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-xl min-[320px]:text-2xl min-[480px]:text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              ATS-Optimized Templates
            </h2>
            <p className="text-xs min-[320px]:text-sm text-zinc-400 max-w-xl mx-auto">
              Sleek layout designs constructed to pass major algorithm filters while looking gorgeous.
            </p>
          </div>

          <div className="grid gap-4 min-[380px]:gap-8 grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3">
            {[
              { name: 'Executive Modern', tag: 'Most Popular', desc: 'Sleek dark outlines for management.' },
              { name: 'Minimalist Tech', tag: 'Developer-First', desc: 'Compact configurations for engineers.' },
              { name: 'Creative Portfolio', tag: 'Aesthetic', desc: 'Dynamic elements for creative directors.' }
            ].map((tmpl, idx) => (
              <div key={idx} className="group relative rounded-3xl border border-zinc-850 bg-zinc-900/10 p-3 min-[320px]:p-5 transition-all duration-500 hover:border-zinc-750 hover:bg-zinc-900/20 hover:scale-[1.01] hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]">
                
                {/* Template Mockup display inside parent grid */}
                <div className="relative aspect-[4/5] rounded-2xl bg-zinc-950 border border-zinc-900 p-3 min-[320px]:p-5 flex flex-col gap-3 min-[320px]:gap-4 overflow-hidden shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] transition-all">
                  
                  {/* Mock Page layouts */}
                  <div className="h-5 w-1/3 rounded bg-zinc-900"></div>
                  <div className="flex gap-2">
                    <div className="h-2.5 w-12 rounded bg-zinc-900"></div>
                    <div className="h-2.5 w-20 rounded bg-zinc-900"></div>
                    <div className="h-2.5 w-10 rounded bg-zinc-900"></div>
                  </div>
                  <hr className="border-zinc-900" />
                  <div className="space-y-2">
                    <div className="h-4 w-1/4 rounded bg-zinc-800/80"></div>
                    <div className="h-2.5 w-full rounded bg-zinc-900"></div>
                    <div className="h-2.5 w-full rounded bg-zinc-900"></div>
                    <div className="h-2.5 w-11/12 rounded bg-zinc-900"></div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 w-1/3 rounded bg-zinc-800/80"></div>
                    <div className="h-2.5 w-full rounded bg-zinc-900"></div>
                    <div className="h-2.5 w-5/6 rounded bg-zinc-900"></div>
                  </div>
                  
                  {/* Absolute Badge */}
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                    {tmpl.tag}
                  </span>

                  {/* Glassy hover slide up panel */}
                  <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <a 
                      href="#demo"
                      className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-600 transition-transform active:scale-95 hover:scale-105"
                    >
                      Use Template
                    </a>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-white text-sm min-[320px]:text-base tracking-wide truncate">{tmpl.name}</h3>
                    <p className="text-[10px] min-[320px]:text-xs text-zinc-500 mt-1 truncate">{tmpl.desc}</p>
                  </div>
                  <span className="text-[9px] min-[320px]:text-[10px] font-bold tracking-wider uppercase text-zinc-500 bg-zinc-900/60 border border-zinc-800/80 px-1.5 py-0.5 rounded shrink-0">ATS OK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-14 px-3 min-[380px]:px-6 border-t border-zinc-900 bg-zinc-950/20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-xl min-[320px]:text-2xl min-[480px]:text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-xs min-[320px]:text-sm text-zinc-400">
              Clear architecture insights concerning the NexResumeBuilder integration model.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isSelected = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/10 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-zinc-800"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-4 py-4 min-[320px]:px-6 min-[320px]:py-5 text-left text-zinc-300 hover:text-white focus:outline-none transition-colors duration-200"
                  >
                    <span className="font-bold text-xs min-[320px]:text-sm sm:text-base tracking-wide">{faq.q}</span>
                    <span className="ml-4 flex-shrink-0">
                      {isSelected ? (
                        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {isSelected && (
                    <div className="px-4 pb-4 min-[320px]:px-6 min-[320px]:pb-6 text-xs min-[320px]:text-sm leading-relaxed text-zinc-400 border-t border-zinc-900/60 pt-4 bg-zinc-950/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final Hero Banner */}
      <section className="py-14 px-3 min-[380px]:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-800/80 p-4 py-10 min-[320px]:p-8 sm:p-16 relative overflow-hidden backdrop-blur-2xl shadow-2xl text-center bg-zinc-950">
          {/* Isolated background image container with reduced opacity */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none z-0"
            style={{ backgroundImage: `url(${bannerBg})` }}
          ></div>
          {/* Subtle blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[3px] z-0"></div>
          
          {/* Accent lighting elements behind CTA */}
          <div className="absolute top-0 left-0 z-0 h-72 w-72 rounded-full bg-emerald-600/5 blur-[90px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 z-0 h-72 w-72 rounded-full bg-teal-600/5 blur-[90px] pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-xl min-[320px]:text-2xl min-[480px]:text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Upgrade Your Vocabulary Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xs min-[320px]:text-sm leading-relaxed text-zinc-400">
              Join thousands of modern job applicants who leveraged NexResumeBuilder AI rewriting to secure callbacks and competitive salary negotiations.
            </p>
            
            <div className="mt-8 min-[320px]:mt-10 flex justify-center">
              <a
                href="#demo"
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 min-[320px]:px-10 min-[320px]:py-5 text-[10px] min-[320px]:text-xs font-extrabold uppercase tracking-widest text-white shadow-xl shadow-emerald-500/15 hover:shadow-emerald-500/25 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                Get Started For Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
