import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useResumeStore } from "../store/resumeStore";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user, logoutUser } = useAuthStore();
  const { resumes, fetchResumes, createResume, deleteResume, loading } = useResumeStore();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchResumes();
    }
  }, [user, navigate, fetchResumes]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) {
      toast.error("Resume title is required");
      return;
    }
    createResume(resumeTitle.trim(), (newResume) => {
      setIsModalOpen(false);
      setResumeTitle("");
      navigate(`/resume-builder/${newResume._id}`);
    });
  };

  if (!user) return null;

  return (
    <div className="bg-zinc-950 text-white min-h-screen relative flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Background Gradients/Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Bar Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 py-3 sm:py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-900 shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 select-none">
            <div className="relative group shrink-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white">
                Nex<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Resume</span>
              </span>
              <span className="text-zinc-800 font-medium text-lg hidden sm:inline-block">/</span>
              <span className="text-xs font-semibold tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded-md hidden sm:inline-block">
                Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {user?.email && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {user.email}
              </div>
            )}
            <button 
              onClick={logoutUser}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-16 flex-grow px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Welcome / Hero Banner Section */}
        <div className="mb-12 bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 border border-zinc-900 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium uppercase tracking-wide">
              Professional Resume Builder
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Create a Standout <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Resume</span> In Minutes
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Use our AI-powered assistant to write ATS-optimized descriptions, polish formatting, and highlight your achievements to get noticed by recruiters.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative shrink-0 overflow-hidden rounded-2xl p-[1px] shadow-[0_4px_30px_rgba(16,185,129,0.15)] transition-transform duration-300 active:scale-95 hover:scale-[1.03] cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-2 rounded-[15px] bg-zinc-950 px-6 py-4 text-sm font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Build New Resume
            </span>
          </button>
        </div>

        {/* Resumes Grid Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-white">Your Resumes</h2>
              <span className="text-xs bg-zinc-900 text-zinc-400 px-2.5 py-0.5 rounded-full font-bold border border-zinc-800">
                {resumes.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-zinc-900/10 border border-zinc-900 rounded-3xl p-16 text-center max-w-xl mx-auto space-y-6">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-zinc-900/80 border border-zinc-850 flex items-center justify-center text-zinc-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-200">No resumes yet</h3>
                <p className="text-xs text-zinc-550 max-w-sm mx-auto leading-relaxed">
                  Start by building a new resume. Your documents will appear here once created.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
              >
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div 
                  key={resume._id} 
                  className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800/80 hover:bg-zinc-900/30 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Resume Icon & Action Header */}
                    <div className="flex justify-between items-start">
                      <div className="h-11 w-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Edit Link Button */}
                        <button
                          onClick={() => navigate(`/resume-builder/${resume._id}`)}
                          className="p-2 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 hover:text-emerald-400 rounded-lg cursor-pointer transition-colors"
                          title="Edit Resume"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this resume?")) {
                              deleteResume(resume._id);
                            }
                          }}
                          className="p-2 bg-zinc-900 border border-zinc-800 hover:border-rose-500/30 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                          title="Delete Resume"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">
                        {resume.title}
                      </h4>
                      <p className="text-[11px] text-zinc-550">
                        Edited {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      Resume Document
                    </span>
                    <button
                      onClick={() => navigate(`/resume-builder/${resume._id}`)}
                      className="text-xs text-emerald-400 group-hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Open Editor
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Modal Popup: Create Resume */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800/80 p-7 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setResumeTitle("");
              }}
              className="absolute right-5 top-5 text-zinc-550 hover:text-zinc-350 focus:outline-none cursor-pointer transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-white">Create New Resume</h3>
              <p className="text-xs text-zinc-400">Give your new resume a title to start building your professional profile.</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">Resume Title</label>
                <input
                  type="text"
                  required
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer Resume"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setResumeTitle("");
                  }}
                  className="flex-1 rounded-xl border border-zinc-800 py-3 text-center text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 relative group overflow-hidden rounded-xl p-[1px] transition-transform duration-300 active:scale-95 cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative block rounded-[11px] bg-zinc-950 py-3 text-xs font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                    Create Resume
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-900/60 text-center text-zinc-650 text-xs">
        &copy; {new Date().getFullYear()} NexResume. All rights reserved.
      </footer>

    </div>
  );
}
