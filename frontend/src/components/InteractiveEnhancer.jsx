import { useState, useEffect } from 'react';

const SAMPLES = {
  experience: {
    label: "Work Experience",
    placeholder: "e.g., I worked on a web project and fixed some bugs to make it faster.",
    presets: [
      {
        input: "I was in charge of a website and fixed bugs. I also helped users.",
        enhanced: "Engineered high-performance React web interfaces and resolved 40+ critical legacy bugs, improving load times by 35% and elevating system usability scores."
      },
      {
        input: "I wrote some python scripts to automate reports for my boss.",
        enhanced: "Architected automated Python reporting pipelines, reducing manual data synthesis time by 82% and delivering real-time actionable insights to executive leadership."
      }
    ]
  },
  summary: {
    label: "Professional Summary",
    placeholder: "e.g., I am a web developer with 3 years of experience. I want a new job.",
    presets: [
      {
        input: "I am a marketing person with 5 years experience. I know social media well.",
        enhanced: "Results-driven Digital Marketing Specialist with 5+ years of experience spearheading multi-channel campaigns. Proven expertise in leveraging data analytics to increase organic traffic by 150% and optimize customer acquisition costs."
      },
      {
        input: "Recent computer science graduate looking for entry level developer roles.",
        enhanced: "Ambitious Computer Science Graduate with solid foundations in software engineering, algorithms, and cloud architectures. Passionate about deploying scalable cloud solutions and collaborating in agile development environments."
      }
    ]
  },
  skills: {
    label: "Key Skills",
    placeholder: "e.g., Excel, communication, coding, Javascript.",
    presets: [
      {
        input: "Leadership, talking to clients, project management, coding.",
        enhanced: "Cross-Functional Leadership | Stakeholder Management | Agile Project Management | Full-Stack Software Engineering"
      },
      {
        input: "Microsoft Excel, analytics, SQL, databases.",
        enhanced: "Advanced Financial Analytics | SQL Database Administration & Optimization | Data Warehousing & ETL Pipelines"
      }
    ]
  }
};

export default function InteractiveEnhancer() {
  const [activeTab, setActiveTab] = useState('experience');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [targetEnhanced, setTargetEnhanced] = useState('');

  useEffect(() => {
    setInputText(SAMPLES[activeTab].presets[0].input);
    setOutputText('');
    setTargetEnhanced('');
  }, [activeTab]);

  useEffect(() => {
    if (targetEnhanced && typingIndex < targetEnhanced.length) {
      const timeout = setTimeout(() => {
        setOutputText(prev => prev + targetEnhanced[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 12);
      return () => clearTimeout(timeout);
    } else if (targetEnhanced && typingIndex === targetEnhanced.length) {
      setIsEnhancing(false);
    }
  }, [typingIndex, targetEnhanced]);

  const handleEnhance = () => {
    if (!inputText.trim()) return;
    setIsEnhancing(true);
    setOutputText('');
    setTypingIndex(0);

    const matchedPreset = SAMPLES[activeTab].presets.find(
      p => p.input.toLowerCase().trim() === inputText.toLowerCase().trim()
    );

    let enhancedResult = "";
    if (matchedPreset) {
      enhancedResult = matchedPreset.enhanced;
    } else {
      enhancedResult = `Strategically modernized ${inputText} utilizing advanced frameworks, driving a 28% increase in operational throughput and establishing scalable delivery frameworks.`;
    }

    setTimeout(() => {
      setTargetEnhanced(enhancedResult);
    }, 1000);
  };

  const loadPreset = (text) => {
    setInputText(text);
    setOutputText('');
    setTargetEnhanced('');
  };

  return (
    <div className="relative mx-auto max-w-4xl rounded-3xl border border-zinc-800/80 bg-zinc-900/20 p-5 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-8">
      
      {/* Absolute top glowing blur spot for active card premium look */}
      <div className="absolute top-0 left-1/2 -z-10 h-48 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-[80px]"></div>

      {/* Terminal window controls */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-zinc-800"></span>
          <span className="h-3 w-3 rounded-full bg-zinc-800"></span>
          <span className="h-3 w-3 rounded-full bg-zinc-800"></span>
          <span className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-3">NexResumeBuilder Workspace v2.0</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          Simulated AI Live
        </div>
      </div>

      {/* Tab Selectors with premium pills styling */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {Object.entries(SAMPLES).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative rounded-xl px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-95 ${
              activeTab === key
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.25)]'
                : 'bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60 hover:bg-zinc-900/40'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Preset Pills */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Examples:</span>
        {SAMPLES[activeTab].presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(preset.input)}
            className="rounded-xl bg-zinc-950/30 border border-zinc-800/80 px-4 py-1.5 text-xs font-medium text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/5 active:scale-95 transition-all duration-300"
          >
            Sample Setup #{idx + 1}
          </button>
        ))}
      </div>

      {/* Main Dual Panels */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        
        {/* Input Panel */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span>Plain Bullet/Description</span>
            <span className="text-[10px] text-zinc-600">Dynamic Editor</span>
          </label>
          <div className="relative flex-1 group">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText('');
                setTargetEnhanced('');
              }}
              placeholder={SAMPLES[activeTab].placeholder}
              rows={5}
              className="w-full h-full min-h-[160px] rounded-2xl border border-zinc-800/80 bg-zinc-950/60 px-5 py-4 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-zinc-950/90 focus:shadow-[0_0_25px_rgba(16,185,129,0.03)]"
            />
            {/* Glowing focus backdrop overlay */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur-sm -z-10 group-focus-within:opacity-10 transition-opacity duration-500"></div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span>NexResumeBuilder Premium Output</span>
          </label>
          
          <div className="relative flex-1 rounded-2xl border border-zinc-800/80 bg-zinc-950/30 p-5 min-h-[160px] flex items-center justify-center overflow-hidden transition-all duration-500 group">
            
            {/* Soft inner emerald glow backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)] pointer-events-none"></div>

            {isEnhancing && !outputText ? (
              <div className="relative flex flex-col items-center gap-3.5 text-zinc-400">
                {/* Floating sparkling spark icon */}
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">
                  <svg className="h-6 w-6 animate-spin duration-[3s]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span className="text-xs font-semibold tracking-wider text-emerald-400/80 animate-pulse uppercase">Rewriting descriptions...</span>
              </div>
            ) : outputText ? (
              <div className="relative w-full h-full text-sm leading-relaxed text-zinc-100">
                <div className="border-l-3 border-emerald-500 bg-emerald-500/5 rounded-r-xl px-4 py-3 border border-emerald-500/20 shadow-[0_8px_32px_-8px_rgba(16,185,129,0.05)]">
                  <p className="font-semibold text-zinc-200">{outputText}</p>
                </div>
                {typingIndex < targetEnhanced.length && (
                  <span className="inline-block w-2 h-4.5 ml-1 bg-emerald-500 animate-pulse align-middle"></span>
                )}
              </div>
            ) : (
              <div className="text-center max-w-xs relative z-10">
                <svg className="mx-auto h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904z" />
                </svg>
                <span className="text-xs text-zinc-600 font-semibold uppercase tracking-wider block">Ready to enhance</span>
                <span className="text-[11px] text-zinc-700 block mt-1">Press the enhance button below to run NexResumeBuilder AI optimization.</span>
              </div>
            )}

            {/* Glowing borders around active rewrite */}
            {outputText && (
              <div className="absolute inset-0 rounded-2xl border border-emerald-500/10 pointer-events-none"></div>
            )}
          </div>
        </div>

      </div>

      {/* Primary Action Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !inputText.trim()}
          className={`relative group overflow-hidden rounded-2xl px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-xl transition-all duration-300 active:scale-95 ${
            isEnhancing || !inputText.trim()
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)]'
          }`}
        >
          {/* Animated gradient fill background */}
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 transition-all duration-300 group-hover:scale-105"></span>
          <span className="relative flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904z" />
            </svg>
            Enhance with NexResumeBuilder AI
          </span>
        </button>
      </div>

    </div>
  );
}
