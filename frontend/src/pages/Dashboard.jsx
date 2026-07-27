import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useResumeStore } from "../store/resumeStore";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user, logoutUser } = useAuthStore();
  const { resumes, fetchResumes, createResume, deleteResume, uploadExistingResume, loading } = useResumeStore();
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchResumes();
    }
  }, [user, navigate, fetchResumes]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Selected file: ${file.name}`);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }
    uploadExistingResume(selectedFile, (newResume) => {
      setSelectedFile(null);
      navigate(`/resume-builder/${newResume._id}`);
    });
  };

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
    <div className="bg-zinc-950 text-white min-h-screen relative flex flex-col justify-between">
      
      {/* Custom Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 py-3.5 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 shadow-[0_8px_32px_-6px_rgba(0,0,0,0.5)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Side: Logo & Breadcrumb */}
          <div className="flex items-center gap-3 select-none">
            <div className="relative group shrink-0">
              <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                <svg className="h-5 w-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904z" />
                </svg>
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-30 blur-sm"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Nex<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Resume</span>
              </span>
              <span className="text-zinc-650 font-medium text-lg hidden sm:inline-block">/</span>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-md hidden sm:inline-block">
                Dashboard
              </span>
            </div>
          </div>

          {/* Right Side: User Status & Logout */}
          <div className="flex items-center gap-4">
            {user?.email && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900/60 border border-zinc-800/80 rounded-full text-xs font-bold text-emerald-400 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {user.email}
              </div>
            )}
            <button 
              onClick={logoutUser}
              className="relative group overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-95 hover:scale-[1.03] cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 opacity-80 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative block rounded-[15px] bg-zinc-950 px-5 py-2 text-xs font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard options */}
      <main className="pt-24 pb-12 flex flex-col justify-start relative overflow-hidden flex-grow px-4 sm:px-6 lg:px-8">
        {/* Glowing visual effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-5xl w-full relative z-10 text-center space-y-12 py-8">
          
          {/* Header Title Section */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Resume <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto">
              Create a new resume from scratch, upload an existing one, or manage your saved resumes.
            </p>
          </div>

          {/* Creation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Card 1: Create New */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-lg transition-all duration-300 hover:border-emerald-500/30 hover:scale-[1.02] group">
              <div className="space-y-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:rotate-6 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                    Create New Resume
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                    Build a professional, ATS-optimized resume from the ground up using our guided step-by-step assistant.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full relative group/btn overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-98 mt-8 cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80 group-hover/btn:opacity-100 transition-opacity"></span>
                <span className="relative block rounded-[15px] bg-zinc-950 py-3.5 text-sm font-bold text-white transition-all duration-200 group-hover/btn:bg-zinc-950/40">
                  Start Building
                </span>
              </button>
            </div>

            {/* Card 2: Upload Existing */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-lg transition-all duration-300 hover:border-teal-500/30 hover:scale-[1.02] group">
              <form onSubmit={handleUploadSubmit} className="w-full flex flex-col justify-between h-full items-center">
                <div className="space-y-6 flex flex-col items-center w-full">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:-rotate-6 transition-transform duration-300">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>

                  <div className="space-y-2 w-full">
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                      Upload Existing Resume
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mx-auto">
                      Upload your PDF/Word file to enhance descriptions, fix formatting errors, and adapt it to job openings.
                    </p>
                  </div>

                  {/* File Input UI Container */}
                  <div className="w-full mt-4">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-800 hover:border-teal-500/50 rounded-2xl cursor-pointer bg-zinc-950/60 hover:bg-zinc-950 transition-colors py-2 px-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-zinc-500 font-semibold truncate max-w-[200px]">
                          {selectedFile ? selectedFile.name : "Click to select resume file"}
                        </span>
                        <span className="text-[10px] text-zinc-600 mt-1">PDF, DOC, DOCX up to 5MB</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full relative group/btn overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-98 mt-6 cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80 group-hover/btn:opacity-100 transition-opacity"></span>
                  <span className="relative block rounded-[15px] bg-zinc-950 py-3.5 text-sm font-bold text-white transition-all duration-200 group-hover/btn:bg-zinc-950/40">
                    Upload Resume
                  </span>
                </button>
              </form>
            </div>

          </div>

          {/* User's Existing Resumes Section */}
          <div className="text-left space-y-6 max-w-4xl mx-auto pt-6">
            <h2 className="text-xl font-bold tracking-tight text-white pl-1">Your Resumes</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-3xl p-12 text-center text-zinc-500">
                No resumes found. Click "Start Building" above to create your first resume!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {resumes.map((resume) => (
                  <div key={resume._id} className="bg-zinc-900/35 border border-zinc-800/80 rounded-2xl p-6 flex justify-between items-center hover:border-zinc-700/80 transition-all duration-300 group">
                    <div className="space-y-1.5 min-w-0 pr-4">
                      <h4 className="font-bold text-zinc-100 truncate group-hover:text-emerald-400 transition-colors">
                        {resume.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Edit button */}
                      <button
                        onClick={() => navigate(`/resume-builder/${resume._id}`)}
                        className="p-2 border border-zinc-800 bg-zinc-950/60 rounded-xl hover:border-emerald-500/40 hover:text-emerald-400 cursor-pointer transition-colors"
                        title="Edit Resume"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this resume?")) {
                            deleteResume(resume._id);
                          }
                        }}
                        className="p-2 border border-zinc-800 bg-zinc-950/60 rounded-xl hover:border-rose-500/40 hover:text-rose-400 cursor-pointer transition-colors"
                        title="Delete Resume"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Modal Popup: Resume Title */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setResumeTitle("");
              }}
              className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Resume Title</h3>
            <p className="text-xs text-zinc-400 mb-4">Please give your resume a title to start building.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="Software Engineer Resume"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                autoFocus
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setResumeTitle("");
                  }}
                  className="flex-1 rounded-2xl border border-zinc-800 py-3 text-center text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 relative group overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-95 cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative block rounded-[15px] bg-zinc-950 py-2.5 text-xs font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                    Create
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
