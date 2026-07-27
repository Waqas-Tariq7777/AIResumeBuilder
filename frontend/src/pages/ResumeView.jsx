import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResumeStore } from "../store/resumeStore";
import { useAuthStore } from "../store/authStore";

export default function ResumeView() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { currentResume, fetchResumeById, loading } = useResumeStore();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch resume data on mount or ID change
  useEffect(() => {
    if (id) {
      fetchResumeById(id);
    }
  }, [id, fetchResumeById]);

  if (loading && !currentResume) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex justify-center items-center">
        <svg className="animate-spin h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-zinc-400">Resume not found.</p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const formData = {
    title: currentResume.title || "",
    template: (currentResume.template === "modern" ? "modern_standard" : currentResume.template) || "modern_standard",
    accentColor: currentResume.accentColor || "#10b981",
    personalInfo: {
      fullName: currentResume.personalInfo?.fullName || "",
      email: currentResume.personalInfo?.email || "",
      phone: currentResume.personalInfo?.phone || "",
      address: currentResume.personalInfo?.address || "",
      website: currentResume.personalInfo?.website || "",
      profileImage: currentResume.personalInfo?.profileImage || "",
      summary: currentResume.personalInfo?.summary || ""
    },
    education: currentResume.education || [],
    experience: currentResume.experience || [],
    skills: currentResume.skills || [],
    projects: currentResume.projects || [],
    certifications: currentResume.certifications || [],
    languages: currentResume.languages || [],
    hobbies: currentResume.hobbies || []
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-900 text-zinc-900 min-h-screen flex flex-col items-center justify-start pb-12">
      
      {/* Print styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .resume-sheet {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Floating Action Header (No-Print) */}
      <header className="no-print w-full max-w-7xl mx-auto px-4 py-4 mt-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.close()}
            className="px-4 py-2 border border-zinc-850 bg-zinc-900 text-xs font-bold text-zinc-400 rounded-xl hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
          >
            Close Tab
          </button>
          <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
            Viewing: {formData.title || "Untitled Resume"}
          </span>
        </div>

        <button
          onClick={handlePrint}
          className="relative group overflow-hidden rounded-xl p-[1px] transition-transform duration-300 active:scale-95 cursor-pointer shrink-0"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></span>
          <span className="relative block rounded-[11px] bg-zinc-950 px-5 py-2 text-xs font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
            Print / Save PDF
          </span>
        </button>
      </header>

      {/* Resume Container Sheet */}
      <main className="w-full flex justify-center px-4">
        <div 
          className={`resume-sheet w-full lg:min-w-[21cm] lg:max-w-[21cm] min-w-0 max-w-full shadow-2xl rounded-sm border lg:min-h-[29.7cm] min-h-0 flex flex-col lg:justify-between justify-start text-left select-none scale-100 transition-all duration-300 ${
            formData.template === "dark_presentation" 
              ? "bg-zinc-950 text-zinc-100 border-zinc-800 p-8 sm:p-12" 
              : formData.template === "sidebar_dark"
                ? "bg-white text-zinc-900 border-zinc-200 p-0"
                : "bg-white text-zinc-900 border-zinc-200 p-8 sm:p-12"
          }`}
        >
          <div className="flex-grow">
            
            {/* 1. Modern Standard (Waqas Tariq Style) */}
            {formData.template === "modern_standard" && (
              <div className="space-y-6">
                {/* Header Contact Block */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2" style={{ borderColor: formData.accentColor }}>
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-955 uppercase">
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && (
                        <span className="font-semibold" style={{ color: formData.accentColor }}>
                          {formData.personalInfo.website}
                        </span>
                      )}
                    </div>
                  </div>
                  {formData.personalInfo.profileImage && (
                    <img loading="lazy" src={formData.personalInfo.profileImage} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 shrink-0 shadow-md"
                      style={{ borderColor: formData.accentColor }}
                    />
                  )}
                </div>

                {/* Profile Summary */}
                {formData.personalInfo.summary && (
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-750 leading-relaxed italic bg-zinc-50 p-3.5 rounded-xl border-l-4" style={{ borderLeftColor: formData.accentColor }}>
                      {formData.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Grid or Columns for standard fields */}
                <div className="space-y-5">
                  {/* Experience */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 pb-1" style={{ color: formData.accentColor }}>Experience</h3>
                      <div className="space-y-3">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-0.5 text-xs">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{exp.position || "Job Position"}</span>
                              <span className="text-zinc-555 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-zinc-700 italic">{exp.company || "Company Name"}</div>
                            {exp.description && (
                              <p className="text-zinc-650 mt-1 pl-2 border-l-2" style={{ borderColor: formData.accentColor }}>{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {formData.education.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 pb-1" style={{ color: formData.accentColor }}>Education</h3>
                      <div className="space-y-3">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="space-y-0.5 text-xs">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{edu.degree || "Degree Detail"}</span>
                              <span className="text-zinc-555 font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-zinc-700 italic">{edu.school || "School Name"}</div>
                            {edu.description && (
                              <p className="text-zinc-655 mt-1 pl-2 border-l-2" style={{ borderColor: formData.accentColor }}>{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {formData.projects.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 pb-1" style={{ color: formData.accentColor }}>Projects</h3>
                      <div className="space-y-3">
                        {formData.projects.map((proj, idx) => (
                          <div key={idx} className="space-y-0.5 text-xs">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{proj.name || "Project Title"}</span>
                              {proj.link && <span className="text-[10px] font-medium" style={{ color: formData.accentColor }}>{proj.link}</span>}
                            </div>
                            {proj.description && (
                              <p className="text-zinc-650 mt-1">{proj.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills & Certifications Side-by-Side or Stacked */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 pb-1" style={{ color: formData.accentColor }}>Technical Skills</h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {formData.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded border text-[11px] text-zinc-800" style={{ borderColor: `${formData.accentColor}30`, backgroundColor: `${formData.accentColor}10` }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.certifications.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 pb-1" style={{ color: formData.accentColor }}>Certifications</h3>
                        <ul className="list-disc pl-4 text-xs text-zinc-700 space-y-0.5">
                          {formData.certifications.map((cert, idx) => (
                            <li key={idx}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Languages & Hobbies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 pt-3">
                    {formData.languages.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Languages</h4>
                        <p className="text-xs text-zinc-700">{formData.languages.join(", ")}</p>
                      </div>
                    )}
                    {formData.hobbies.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Hobbies</h4>
                        <p className="text-xs text-zinc-700">{formData.hobbies.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Sidebar Dark Layout */}
            {formData.template === "sidebar_dark" && (
              <div className="grid grid-cols-12 items-stretch min-h-[29.7cm]">
                {/* Sidebar (40% width) */}
                <div className="col-span-5 bg-slate-900 text-slate-100 p-8 flex flex-col justify-start space-y-6 border-r border-slate-800">
                  <div className="text-center space-y-3 pb-4 border-b border-slate-800">
                    {formData.personalInfo.profileImage && (
                      <div className="flex justify-center">
                        <img loading="lazy" src={formData.personalInfo.profileImage} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-2 shadow-lg"
                          style={{ borderColor: formData.accentColor }}
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-white uppercase">{formData.personalInfo.fullName || "Your Name"}</h2>
                      <p className="text-[10px] text-zinc-400 tracking-widest mt-1">APPLICANT</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Contact</h4>
                      <div className="text-[11px] space-y-1.5 text-slate-300">
                        {formData.personalInfo.email && <div className="truncate">📧 {formData.personalInfo.email}</div>}
                        {formData.personalInfo.phone && <div>📞 {formData.personalInfo.phone}</div>}
                        {formData.personalInfo.address && <div>📍 {formData.personalInfo.address}</div>}
                        {formData.personalInfo.website && (
                          <div className="truncate font-semibold" style={{ color: formData.accentColor }}>
                            🔗 {formData.personalInfo.website}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    {formData.skills.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {formData.languages.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Languages</h4>
                        <div className="text-[11px] space-y-1">
                          {formData.languages.map((lang, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: formData.accentColor }}></span>
                              {lang}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hobbies */}
                    {formData.hobbies.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Hobbies</h4>
                        <div className="text-[11px] space-y-1">
                          {formData.hobbies.map((hobby, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                              <span className="h-1 w-1 rounded-full bg-slate-500"></span>
                              {hobby}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (White Background) */}
                <div className="col-span-7 bg-white text-zinc-800 p-8 flex flex-col justify-start space-y-6">
                  <div className="space-y-2 pb-4 border-b border-zinc-100">
                    <h2 className="text-3xl font-black text-zinc-950 uppercase tracking-tight">
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                  </div>

                  {/* Summary */}
                  {formData.personalInfo.summary && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b pb-0.5">Profile</h3>
                      <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">{formData.personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: formData.accentColor, borderColor: `${formData.accentColor}30` }}>Experience</h3>
                      <div className="space-y-4">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-zinc-900 leading-tight">
                              <span>{exp.position || "Job Position"}</span>
                              <span className="text-zinc-555 text-[10px] font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-zinc-650 text-[11px] font-semibold">{exp.company || "Company Name"}</div>
                            {exp.description && (
                              <p className="text-zinc-550 text-[11px] mt-1 pl-2.5 border-l-2" style={{ borderColor: `${formData.accentColor}60` }}>{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: formData.accentColor, borderColor: `${formData.accentColor}30` }}>Education</h3>
                      <div className="space-y-4">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-zinc-900 leading-tight">
                              <span>{edu.degree || "Degree"}</span>
                              <span className="text-zinc-555 text-[10px] font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-zinc-650 text-[11px] font-semibold">{edu.school || "School Name"}</div>
                            {edu.description && (
                              <p className="text-zinc-555 text-[11px] mt-1 pl-2.5 border-l-2" style={{ borderColor: `${formData.accentColor}60` }}>{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {formData.projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: formData.accentColor, borderColor: `${formData.accentColor}30` }}>Projects</h3>
                      <div className="space-y-3">
                        {formData.projects.map((proj, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{proj.name}</span>
                              {proj.link && <span className="text-[10px] font-normal" style={{ color: formData.accentColor }}>{proj.link}</span>}
                            </div>
                            {proj.description && (
                              <p className="text-zinc-550 text-[11px] mt-0.5">{proj.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {formData.certifications.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: formData.accentColor, borderColor: `${formData.accentColor}30` }}>Certifications</h3>
                      <div className="flex flex-col gap-1 text-[11px] text-zinc-700 pl-2">
                        {formData.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: formData.accentColor }}></span>
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Minimalist */}
            {formData.template === "minimalist" && (
              <div className="space-y-5">
                <div className="flex justify-between items-start pb-3 border-b border-zinc-200">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-light text-zinc-950 uppercase tracking-wide">
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                    <div className="flex flex-wrap gap-x-3 text-[11px] text-zinc-500 font-medium">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && (
                        <span style={{ color: formData.accentColor }}>
                          {formData.personalInfo.website}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {formData.personalInfo.summary && (
                  <p className="text-[11px] text-zinc-500 italic leading-relaxed">{formData.personalInfo.summary}</p>
                )}

                {/* Education */}
                {formData.education.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Education</h3>
                    <div className="space-y-3">
                      {formData.education.map((edu, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-medium text-zinc-900">
                            <span>{edu.school || "School Name"}</span>
                            <span className="text-zinc-555 text-[10px]">{edu.startDate} - {edu.endDate}</span>
                          </div>
                          <div className="text-zinc-650 text-[11px]" style={{ color: formData.accentColor }}>{edu.degree || "Degree"}</div>
                          {edu.description && (
                            <p className="text-zinc-550 text-[11px] mt-0.5">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {formData.experience.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Experience</h3>
                    <div className="space-y-3">
                      {formData.experience.map((exp, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-medium text-zinc-900">
                            <span>{exp.company || "Company Name"}</span>
                            <span className="text-zinc-555 text-[10px]">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <div className="text-zinc-650 text-[11px]" style={{ color: formData.accentColor }}>{exp.position || "Job Title"}</div>
                          {exp.description && (
                            <p className="text-zinc-550 text-[11px] mt-0.5 whitespace-pre-line">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {formData.projects.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Projects</h3>
                    <div className="space-y-3">
                      {formData.projects.map((proj, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-medium text-zinc-900">
                            <span className="font-semibold">{proj.name}</span>
                            {proj.link && <span className="text-[10px] text-zinc-400">{proj.link}</span>}
                          </div>
                          {proj.description && (
                            <p className="text-zinc-550 text-[11px] mt-0.5">{proj.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Skills */}
                  {formData.skills.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Skills</h3>
                      <p className="text-xs text-zinc-700 leading-relaxed">
                        {formData.skills.join("  •  ")}
                      </p>
                    </div>
                  )}

                  {/* Certifications */}
                  {formData.certifications.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Certifications</h3>
                      <p className="text-xs text-zinc-700 leading-relaxed">
                        {formData.certifications.join("  •  ")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-2">
                  {/* Languages */}
                  {formData.languages.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Languages</h3>
                      <p className="text-xs text-zinc-755 font-medium">{formData.languages.join(", ")}</p>
                    </div>
                  )}
                  {/* Hobbies */}
                  {formData.hobbies.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Hobbies</h3>
                      <p className="text-xs text-zinc-755 font-medium">{formData.hobbies.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Corporate (Accent Header Band) */}
            {formData.template === "corporate" && (
              <div className="space-y-5 -m-8 sm:-m-12">
                {/* Top Banner */}
                <div className="p-8 sm:p-12 text-white flex justify-between items-center gap-6" style={{ backgroundColor: formData.accentColor }}>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight uppercase">
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && <span className="underline">{formData.personalInfo.website}</span>}
                    </div>
                  </div>
                  {formData.personalInfo.profileImage && (
                    <img loading="lazy" src={formData.personalInfo.profileImage} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-lg object-cover border-2 border-white shrink-0 shadow-md"
                    />
                  )}
                </div>

                <div className="p-8 sm:p-12 space-y-6">
                  {formData.personalInfo.summary && (
                    <div className="text-xs text-zinc-700 leading-relaxed border-l-4 pl-4" style={{ borderColor: formData.accentColor }}>
                      {formData.personalInfo.summary}
                    </div>
                  )}

                  {/* Experience */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b-2 pb-1" style={{ borderColor: formData.accentColor }}>Professional Experience</h3>
                      <div className="space-y-4">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{exp.position} - <span className="text-zinc-650 font-semibold">{exp.company}</span></span>
                              <span className="text-zinc-555 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            {exp.description && <p className="text-zinc-655 mt-1 pl-3 border-l" style={{ borderColor: `${formData.accentColor}30` }}>{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b-2 pb-1" style={{ borderColor: formData.accentColor }}>Education</h3>
                      <div className="space-y-4">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{edu.degree} - <span className="text-zinc-650 font-semibold">{edu.school}</span></span>
                              <span className="text-zinc-555 font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            {edu.description && <p className="text-zinc-655 mt-1 pl-3 border-l" style={{ borderColor: `${formData.accentColor}30` }}>{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    {formData.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Core Competencies</h4>
                        <div className="flex flex-wrap gap-1">
                          {formData.skills.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-zinc-100 rounded text-[10px] text-zinc-800 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.certifications.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Certifications</h4>
                        <p className="text-xs text-zinc-700">{formData.certifications.join(", ")}</p>
                      </div>
                    )}
                  </div>

                  {/* Languages and Hobbies */}
                  <div className="grid grid-cols-2 gap-6 pt-3 border-t border-zinc-100">
                    {formData.languages.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Languages</h4>
                        <p className="text-xs text-zinc-700">{formData.languages.join(", ")}</p>
                      </div>
                    )}
                    {formData.hobbies.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Hobbies</h4>
                        <p className="text-xs text-zinc-700">{formData.hobbies.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Creative (Centered Avatar, Soft Panels) */}
            {formData.template === "creative" && (
              <div className="space-y-6">
                {/* Top block */}
                <div className="text-center space-y-4">
                  {formData.personalInfo.profileImage && (
                    <div className="flex justify-center">
                      <img loading="lazy" src={formData.personalInfo.profileImage} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 shadow-xl"
                        style={{ borderColor: formData.accentColor }}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight" style={{ color: formData.accentColor }}>
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                    <div className="flex justify-center flex-wrap gap-3 text-xs text-zinc-500 font-medium">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && (
                        <span className="font-bold underline" style={{ color: formData.accentColor }}>
                          {formData.personalInfo.website}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {formData.personalInfo.summary && (
                  <p className="text-xs text-zinc-600 text-center leading-relaxed max-w-2xl mx-auto italic bg-zinc-50/50 p-4 rounded-3xl border">
                    {formData.personalInfo.summary}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experience */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-3 bg-zinc-50/40 p-5 rounded-2xl border">
                      <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: formData.accentColor }}>Work History</h3>
                      <div className="space-y-3.5">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{exp.position}</span>
                              <span className="text-[10px] text-zinc-555 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-zinc-600 italic">{exp.company}</div>
                            {exp.description && <p className="text-zinc-550 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {formData.education.length > 0 && (
                    <div className="space-y-3 bg-zinc-50/40 p-5 rounded-2xl border">
                      <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b" style={{ color: formData.accentColor }}>Education</h3>
                      <div className="space-y-3.5">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{edu.degree}</span>
                              <span className="text-[10px] text-zinc-555 font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-zinc-600 italic">{edu.school}</div>
                            {edu.description && <p className="text-zinc-555 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Skills */}
                  {formData.skills.length > 0 && (
                    <div className="space-y-2 bg-zinc-50/40 p-4 rounded-2xl border">
                      <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: formData.accentColor }}>Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white border text-zinc-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {formData.certifications.length > 0 && (
                    <div className="space-y-2 bg-zinc-50/40 p-4 rounded-2xl border">
                      <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: formData.accentColor }}>Certificates</h3>
                      <p className="text-xs text-zinc-700 font-medium leading-relaxed">{formData.certifications.join(", ")}</p>
                    </div>
                  )}
                </div>

                {/* Languages and Hobbies */}
                <div className="grid grid-cols-2 gap-4 bg-zinc-50/40 p-4 rounded-2xl border text-xs">
                  {formData.languages.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-zinc-400 font-bold uppercase text-[10px]">Languages</span>
                      <p className="font-semibold text-zinc-800">{formData.languages.join(", ")}</p>
                    </div>
                  )}
                  {formData.hobbies.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-zinc-400 font-bold uppercase text-[10px]">Hobbies</span>
                      <p className="font-semibold text-zinc-800">{formData.hobbies.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. Bold Executive */}
            {formData.template === "bold_executive" && (
              <div className="space-y-6">
                {/* Accent Top Bar */}
                <div className="h-4 -mx-8 sm:-mx-12 -mt-8 sm:-mt-12" style={{ backgroundColor: formData.accentColor }}></div>

                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-4 border-zinc-900">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-zinc-955 uppercase leading-none">
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                    <p className="text-xs font-bold tracking-widest uppercase opacity-80" style={{ color: formData.accentColor }}>EXECUTIVE PROFILE</p>
                  </div>
                  <div className="text-xs text-zinc-600 sm:text-right space-y-1 shrink-0 font-medium">
                    {formData.personalInfo.email && <div>{formData.personalInfo.email}</div>}
                    {formData.personalInfo.phone && <div>{formData.personalInfo.phone}</div>}
                    {formData.personalInfo.address && <div>{formData.personalInfo.address}</div>}
                    {formData.personalInfo.website && <div style={{ color: formData.accentColor }}>{formData.personalInfo.website}</div>}
                  </div>
                </div>

                {formData.personalInfo.summary && (
                  <p className="text-xs text-zinc-700 leading-relaxed font-serif whitespace-pre-line">{formData.personalInfo.summary}</p>
                )}

                {/* Experience */}
                {formData.experience.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-zinc-850 pb-1" style={{ color: formData.accentColor }}>Work History</h3>
                    <div className="space-y-4">
                      {formData.experience.map((exp, idx) => (
                        <div key={idx} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-zinc-900 text-sm">
                            <span>{exp.position}</span>
                            <span className="text-zinc-555 text-xs font-normal">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <div className="font-bold opacity-85">{exp.company}</div>
                          {exp.description && <p className="text-zinc-650 mt-1 pl-3 border-l-2" style={{ borderColor: formData.accentColor }}>{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {formData.education.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-zinc-850 pb-1" style={{ color: formData.accentColor }}>Education</h3>
                    <div className="space-y-4">
                      {formData.education.map((edu, idx) => (
                        <div key={idx} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-zinc-900 text-sm">
                            <span>{edu.degree}</span>
                            <span className="text-zinc-555 text-xs font-normal">{edu.startDate} - {edu.endDate}</span>
                          </div>
                          <div className="font-bold opacity-85">{edu.school}</div>
                          {edu.description && <p className="text-zinc-655 mt-1 pl-3 border-l-2" style={{ borderColor: formData.accentColor }}>{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 border-t pt-4 font-sans text-xs">
                  {formData.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Core Expertise</h4>
                      <p className="text-xs text-zinc-700 leading-relaxed font-medium">{formData.skills.join("  •  ")}</p>
                    </div>
                  )}

                  {formData.certifications.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Professional Credentials</h4>
                      <p className="text-xs text-zinc-700 leading-relaxed font-medium">{formData.certifications.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. Left Border Accent */}
            {formData.template === "left_border" && (
              <div className="space-y-6 min-h-[29.7cm] -m-8 sm:-m-12 flex items-stretch">
                {/* Border accent strip */}
                <div className="w-4 shrink-0" style={{ backgroundColor: formData.accentColor }}></div>

                <div className="flex-grow p-8 sm:p-12 space-y-6">
                  {/* Header info */}
                  <div className="flex justify-between items-start border-b pb-6 gap-6">
                    <div className="space-y-1.5">
                      <h2 className="text-3xl font-extrabold text-zinc-950 uppercase leading-none">{formData.personalInfo.fullName || "Your Full Name"}</h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
                        {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                        {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                        {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      </div>
                    </div>
                    {formData.personalInfo.profileImage && (
                      <img loading="lazy" src={formData.personalInfo.profileImage} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0 border"
                      />
                    )}
                  </div>

                  {formData.personalInfo.summary && (
                    <p className="text-xs text-zinc-650 leading-relaxed">{formData.personalInfo.summary}</p>
                  )}

                  {/* Experience */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-zinc-800">Experience</h3>
                      <div className="space-y-3.5">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{exp.position}</span>
                              <span className="text-zinc-555 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-zinc-600 italic">{exp.company}</div>
                            {exp.description && <p className="text-zinc-555 mt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-zinc-800">Education</h3>
                      <div className="space-y-3.5">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{edu.degree}</span>
                              <span className="text-zinc-555 font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-zinc-600 italic">{edu.school}</div>
                            {edu.description && <p className="text-zinc-555 mt-1">{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs font-sans">
                    {formData.skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Skills</h4>
                        <p className="text-zinc-700">{formData.skills.join(", ")}</p>
                      </div>
                    )}
                    {formData.certifications.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Certifications</h4>
                        <p className="text-zinc-700">{formData.certifications.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 8. Classic Serif */}
            {formData.template === "classic_serif" && (
              <div className="space-y-6 font-serif px-4 py-2">
                <div className="text-center space-y-2 pb-4 border-b border-zinc-200">
                  <h2 className="text-3xl font-normal text-zinc-950 uppercase tracking-wide">
                    {formData.personalInfo.fullName || "Your Full Name"}
                  </h2>
                  <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-zinc-550 italic font-sans">
                    {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                    {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                    {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                    {formData.personalInfo.website && <span style={{ color: formData.accentColor }}>{formData.personalInfo.website}</span>}
                  </div>
                </div>

                {formData.personalInfo.summary && (
                  <p className="text-xs text-zinc-700 leading-relaxed text-center italic">{formData.personalInfo.summary}</p>
                )}

                {/* Experience */}
                {formData.experience.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-center border-b pb-1 font-sans text-zinc-600">Professional Experience</h3>
                    <div className="space-y-4">
                      {formData.experience.map((exp, idx) => (
                        <div key={idx} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-zinc-900">
                            <span className="text-sm font-semibold">{exp.position} — <span className="font-normal italic text-zinc-650">{exp.company}</span></span>
                            <span className="text-zinc-500 font-sans text-[11px] font-normal">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          {exp.description && <p className="text-zinc-655 mt-1 leading-relaxed">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {formData.education.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-center border-b pb-1 font-sans text-zinc-600">Education</h3>
                    <div className="space-y-4">
                      {formData.education.map((edu, idx) => (
                        <div key={idx} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-zinc-900">
                            <span className="text-sm font-semibold">{edu.degree} — <span className="font-normal italic text-zinc-650">{edu.school}</span></span>
                            <span className="text-zinc-555 font-sans text-[11px] font-normal">{edu.startDate} - {edu.endDate}</span>
                          </div>
                          {edu.description && <p className="text-zinc-655 mt-1 leading-relaxed">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 border-t pt-4 font-sans text-xs">
                  {formData.skills.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Technical Skills</h4>
                      <p className="text-zinc-700">{formData.skills.join(", ")}</p>
                    </div>
                  )}
                  {formData.certifications.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Certifications</h4>
                      <p className="text-zinc-700">{formData.certifications.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. Dual Column (50/50 Layout) */}
            {formData.template === "dual_column" && (
              <div className="grid grid-cols-12 gap-8 font-sans">
                {/* Left Column (40%) */}
                <div className="col-span-5 pr-2 border-r space-y-6">
                  {formData.personalInfo.profileImage && (
                    <img loading="lazy" src={formData.personalInfo.profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border"
                    />
                  )}

                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b pb-0.5">Contact</h4>
                    {formData.personalInfo.email && <p className="truncate">📧 {formData.personalInfo.email}</p>}
                    {formData.personalInfo.phone && <p>📞 {formData.personalInfo.phone}</p>}
                    {formData.personalInfo.address && <p>📍 {formData.personalInfo.address}</p>}
                    {formData.personalInfo.website && (
                      <p className="truncate font-semibold" style={{ color: formData.accentColor }}>
                        🔗 {formData.personalInfo.website}
                      </p>
                    )}
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b pb-0.5">Skills</h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.languages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b pb-0.5">Languages</h4>
                      <p className="text-xs text-zinc-750">{formData.languages.join(", ")}</p>
                    </div>
                  )}

                  {formData.hobbies.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b pb-0.5">Hobbies</h4>
                      <p className="text-xs text-zinc-755">{formData.hobbies.join(", ")}</p>
                    </div>
                  )}
                </div>

                {/* Right Column (60%) */}
                <div className="col-span-7 pl-2 space-y-6">
                  <div className="space-y-2 pb-2 border-b">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-955 uppercase">
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                  </div>

                  {formData.personalInfo.summary && (
                    <p className="text-xs text-zinc-650 leading-relaxed italic">
                      {formData.personalInfo.summary}
                    </p>
                  )}

                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: formData.accentColor }}>Experience</h4>
                      <div className="space-y-3">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900 leading-tight">
                              <span>{exp.position}</span>
                              <span className="text-zinc-555 text-[10px] font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-zinc-600 italic">{exp.company}</div>
                            {exp.description && <p className="text-zinc-550 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: formData.accentColor }}>Education</h4>
                      <div className="space-y-3">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900 leading-tight">
                              <span>{edu.degree}</span>
                              <span className="text-zinc-555 text-[10px] font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-zinc-600 italic">{edu.school}</div>
                            {edu.description && <p className="text-zinc-550 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: formData.accentColor }}>Projects</h4>
                      <div className="space-y-3">
                        {formData.projects.map((proj, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{proj.name}</span>
                              {proj.link && <span className="text-[10px] font-normal" style={{ color: formData.accentColor }}>{proj.link}</span>}
                            </div>
                            {proj.description && <p className="text-zinc-550 mt-0.5">{proj.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. Dark Presentation */}
            {formData.template === "dark_presentation" && (
              <div className="space-y-6 font-sans">
                {/* Header Contact Block */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800">
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-3xl font-black tracking-tight text-white uppercase" style={{ textShadow: `0 0 10px ${formData.accentColor}30` }}>
                      {formData.personalInfo.fullName || "Your Full Name"}
                    </h2>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && (
                        <span className="font-semibold" style={{ color: formData.accentColor }}>
                          {formData.personalInfo.website}
                        </span>
                      )}
                    </div>
                  </div>
                  {formData.personalInfo.profileImage && (
                    <img loading="lazy" src={formData.personalInfo.profileImage} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 shrink-0 shadow-lg"
                      style={{ borderColor: formData.accentColor }}
                    />
                  )}
                </div>

                {formData.personalInfo.summary && (
                  <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/60 p-4 rounded-xl border-l-4" style={{ borderLeftColor: formData.accentColor }}>
                    {formData.personalInfo.summary}
                  </p>
                )}

                <div className="space-y-5">
                  {/* Experience */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-1" style={{ color: formData.accentColor }}>Work Experience</h3>
                      <div className="space-y-3">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-zinc-100">
                              <span>{exp.position}</span>
                              <span className="text-zinc-555 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-zinc-400 italic">{exp.company}</div>
                            {exp.description && (
                              <p className="text-zinc-400 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-1" style={{ color: formData.accentColor }}>Education</h3>
                      <div className="space-y-3">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-zinc-100">
                              <span>{edu.degree}</span>
                              <span className="text-zinc-555 font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-zinc-400 italic">{edu.school}</div>
                            {edu.description && (
                              <p className="text-zinc-400 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grid for skills/certs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-1" style={{ color: formData.accentColor }}>Skills</h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {formData.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded border text-[11px] text-zinc-200 bg-zinc-900 border-zinc-855">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.certifications.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-1" style={{ color: formData.accentColor }}>Certifications</h3>
                        <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-0.5">
                          {formData.certifications.map((cert, idx) => (
                            <li key={idx}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Languages and Hobbies */}
                  <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-3">
                    {formData.languages.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-555">Languages</h4>
                        <p className="text-xs text-zinc-300">{formData.languages.join(", ")}</p>
                      </div>
                    )}
                    {formData.hobbies.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-555">Hobbies</h4>
                        <p className="text-xs text-zinc-300">{formData.hobbies.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

    </div>
  );
}
