import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useResumeStore } from "../store/resumeStore";
import { toast } from "react-toastify";
import { enhanceText } from "../utils/aiEnhancer";
import axios from "axios";

export default function ResumeBuilder() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { currentResume, fetchResumeById, updateResume, loading } = useResumeStore();
  const navigate = useNavigate();

  // Step state (0: Contact Info, 1: Education, 2: Experience, 3: Skills, 4: Projects, 5: Certifications, 6: Languages, 7: Hobbies)
  const [currentStep, setCurrentStep] = useState(0);

  // Modal toggle states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [enhancingEduIndex, setEnhancingEduIndex] = useState(null);
  const [enhancingExpIndex, setEnhancingExpIndex] = useState(null);
  const [enhancingProjIndex, setEnhancingProjIndex] = useState(null);
  const [skillsText, setSkillsText] = useState("");
  const [certsText, setCertsText] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [hobbiesText, setHobbiesText] = useState("");

  // Local state to store edits for instant live-preview rendering
  const [formData, setFormData] = useState({
    title: "",
    template: "modern_standard",
    accentColor: "#10b981",
    personalInfo: { fullName: "", email: "", phone: "", address: "", website: "", profileImage: "", summary: "" },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    hobbies: []
  });

  const stepsList = [
    { label: "Contact Info", id: "personal" },
    { label: "Education", id: "education" },
    { label: "Experience", id: "experience" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Certifications", id: "certifications" },
    { label: "Languages", id: "languages" },
    { label: "Hobbies", id: "hobbies" }
  ];

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

  // Sync loaded resume data into local state
  useEffect(() => {
    if (currentResume) {
      setFormData({
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
      });
      setSkillsText(currentResume.skills?.join(", ") || "");
      setCertsText(currentResume.certifications?.join(", ") || "");
      setLanguagesText(currentResume.languages?.join(", ") || "");
      setHobbiesText(currentResume.hobbies?.join(", ") || "");
    }
  }, [currentResume]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleEnhanceSummary = async () => {
    if (!formData.personalInfo.summary?.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceText(formData.personalInfo.summary, "summary");
      if (enhanced) {
        setFormData((prev) => {
          const updated = {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              summary: enhanced
            }
          };
          // Silently auto-save the enhanced text to database
          updateResume(id, updated, true);
          return updated;
        });
        toast.success("Summary enhanced successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to enhance summary");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleEnhanceEducation = async (idx) => {
    const text = formData.education[idx].description;
    if (!text?.trim()) return;
    setEnhancingEduIndex(idx);
    try {
      const enhanced = await enhanceText(text, "education");
      if (enhanced) {
        setFormData((prev) => {
          const updatedEdu = [...prev.education];
          updatedEdu[idx] = {
            ...updatedEdu[idx],
            description: enhanced
          };
          const updated = { ...prev, education: updatedEdu };
          updateResume(id, updated, true);
          return updated;
        });
        toast.success("Education description enhanced successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to enhance education description");
    } finally {
      setEnhancingEduIndex(null);
    }
  };

  const handleEnhanceExperience = async (idx) => {
    const text = formData.experience[idx].description;
    if (!text?.trim()) return;
    setEnhancingExpIndex(idx);
    try {
      const enhanced = await enhanceText(text, "experience");
      if (enhanced) {
        setFormData((prev) => {
          const updatedExp = [...prev.experience];
          updatedExp[idx] = {
            ...updatedExp[idx],
            description: enhanced
          };
          const updated = { ...prev, experience: updatedExp };
          updateResume(id, updated, true);
          return updated;
        });
        toast.success("Experience description enhanced successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to enhance experience description");
    } finally {
      setEnhancingExpIndex(null);
    }
  };

  const handleEnhanceProject = async (idx) => {
    const text = formData.projects[idx].description;
    if (!text?.trim()) return;
    setEnhancingProjIndex(idx);
    try {
      const enhanced = await enhanceText(text, "projects");
      if (enhanced) {
        setFormData((prev) => {
          const updatedProjects = [...prev.projects];
          updatedProjects[idx] = {
            ...updatedProjects[idx],
            description: enhanced
          };
          const updated = { ...prev, projects: updatedProjects };
          updateResume(id, updated, true);
          return updated;
        });
        toast.success("Project description enhanced successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to enhance project description");
    } finally {
      setEnhancingProjIndex(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size is too large (max 5MB)");
      return;
    }

    setIsUploadingImage(true);
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const uploadUrl = `${apiBaseUrl}/api/v1/resumes/upload-image`;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      console.log("Frontend initiating upload to URL:", uploadUrl);
      console.log("File details:", { name: file.name, size: file.size, type: file.type });
      const response = await axios.post(uploadUrl, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      console.log("Frontend received upload response:", response.data);
      const uploadedUrl = response.data?.data?.imageUrl;
      if (uploadedUrl) {
        setFormData((prev) => {
          const updated = {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              profileImage: uploadedUrl
            }
          };
          updateResume(id, updated, true);
          return updated;
        });
        toast.success("Profile picture uploaded successfully!");
      }
    } catch (error) {
      console.error("Frontend upload error:", error);
      console.error("Error response data:", error.response?.data);
      const message = error.response?.data?.message || "Failed to upload profile picture";
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeProfileImage = () => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profileImage: ""
        }
      };
      updateResume(id, updated, true);
      return updated;
    });
    toast.success("Profile picture removed");
  };

  const handleArrayItemChange = (section, index, field, value) => {
    setFormData((prev) => {
      const updatedList = [...prev[section]];
      updatedList[index] = {
        ...updatedList[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: updatedList
      };
    });
  };

  const addArrayItem = (section, templateObj) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], templateObj]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (e) => {
    const val = e.target.value;
    setSkillsText(val);
    const list = val.split(",").map((s) => s.trim()).filter((s) => s !== "");
    setFormData((prev) => ({
      ...prev,
      skills: list
    }));
  };

  const handleCertsChange = (e) => {
    const val = e.target.value;
    setCertsText(val);
    const list = val.split(",").map((c) => c.trim()).filter((c) => c !== "");
    setFormData((prev) => ({
      ...prev,
      certifications: list
    }));
  };

  const handleLanguagesChange = (e) => {
    const val = e.target.value;
    setLanguagesText(val);
    const list = val.split(",").map((l) => l.trim()).filter((l) => l !== "");
    setFormData((prev) => ({
      ...prev,
      languages: list
    }));
  };

  const handleHobbiesChange = (e) => {
    const val = e.target.value;
    setHobbiesText(val);
    const list = val.split(",").map((h) => h.trim()).filter((h) => h !== "");
    setFormData((prev) => ({
      ...prev,
      hobbies: list
    }));
  };

  // Save changes to Database API
  const saveCurrentData = (silent = false) => {
    updateResume(id, formData, silent);
  };

  const handleNext = () => {
    saveCurrentData(true);
    if (currentStep < stepsList.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.success("Final section saved successfully!");
    }
  };

  const handlePrev = () => {
    saveCurrentData(true);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const changeColor = (colorHex) => {
    setFormData((prev) => {
      const updated = { ...prev, accentColor: colorHex };
      updateResume(id, updated, true); // Save directly to API silently
      return updated;
    });
    setIsColorPickerOpen(false);
    toast.success("Accent color updated");
  };

  const changeTemplate = (templateName) => {
    setFormData((prev) => {
      const updated = { ...prev, template: templateName };
      updateResume(id, updated, true); // Save directly to API silently
      return updated;
    });
    setIsTemplateModalOpen(false);
    toast.success(`Switched to ${templateName} template`);
  };

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

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col justify-between">
      
      {/* Builder Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 py-3 sm:py-4 bg-zinc-950 border-b border-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto min-w-0">
            <Link 
              to="/dashboard"
              className="p-2 border border-zinc-800 bg-zinc-950 rounded-xl hover:border-zinc-700 hover:text-zinc-200 transition-colors shrink-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="min-w-0 flex-grow">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500 text-base sm:text-lg font-black text-white focus:outline-none transition-colors truncate w-full max-w-[240px]"
                title="Rename Resume"
              />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 shrink-0">
            {/* View Button */}
            <button
              onClick={() => window.open(`/resume-view/${id}`, "_blank")}
              className="px-2.5 sm:px-4 py-2 border border-zinc-800 bg-zinc-950 text-[10px] sm:text-xs font-bold rounded-xl sm:rounded-2xl text-emerald-400 border-emerald-500/30 hover:border-emerald-500 hover:bg-zinc-900 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>View</span>
            </button>

            {/* Choose Template Button */}
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-2.5 sm:px-4 py-2 border border-zinc-800 bg-zinc-950 text-[10px] sm:text-xs font-bold rounded-xl sm:rounded-2xl hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="hidden sm:inline">Choose Template</span>
              <span className="sm:hidden">Template</span>
            </button>

            {/* Accent Color Button */}
            <div className="relative">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 border border-zinc-800 bg-zinc-950 text-[10px] sm:text-xs font-bold rounded-xl sm:rounded-2xl hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer whitespace-nowrap"
              >
                <span 
                  className="h-3 w-3 rounded-full border border-zinc-750 shrink-0" 
                  style={{ backgroundColor: formData.accentColor }}
                ></span>
                <span className="hidden sm:inline">Accent Color</span>
                <span className="sm:hidden">Color</span>
              </button>

              {/* Color Dropdown Selection */}
              {isColorPickerOpen && (
                <div className="absolute right-0 mt-2 z-50 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-xl w-48 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Accent Color</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { hex: "#10b981", label: "Emerald" },
                      { hex: "#6366f1", label: "Indigo" },
                      { hex: "#f43f5e", label: "Rose" },
                      { hex: "#f59e0b", label: "Amber" },
                      { hex: "#0ea5e9", label: "Sky" },
                      { hex: "#8b5cf6", label: "Violet" },
                      { hex: "#64748b", label: "Slate" },
                      { hex: "#ec4899", label: "Pink" }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => changeColor(col.hex)}
                        className="h-7 w-7 rounded-full border border-zinc-850 cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        style={{ backgroundColor: col.hex }}
                        title={col.label}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={() => saveCurrentData(false)}
              className="relative group overflow-hidden rounded-xl sm:rounded-2xl p-[1px] transition-transform duration-300 active:scale-95 cursor-pointer shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative block rounded-[11px] sm:rounded-[15px] bg-zinc-950 px-3.5 sm:px-5 py-2 text-[10px] sm:text-xs font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40 whitespace-nowrap">
                Save
              </span>
            </button>
          </div>
          
        </div>
      </header>

      {/* Main Workspace Split layout */}
      <main className="pt-[132px] sm:pt-20 flex-grow grid grid-cols-1 lg:grid-cols-12 items-stretch lg:h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Form Fields & Wizard */}
        <section className="lg:col-span-6 border-r border-zinc-900 flex flex-col lg:h-full min-h-0 bg-zinc-950/40 backdrop-blur-xl justify-between">
          
          {/* Step indicators */}
          <div className="flex border-b border-zinc-900 bg-zinc-950/20 py-2.5 px-4 overflow-x-auto whitespace-nowrap scrollbar-none items-center gap-2">
            {stepsList.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    saveCurrentData(true);
                    setCurrentStep(idx);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    currentStep === idx
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {idx + 1}. {step.label}
                </button>
                {idx < stepsList.length - 1 && (
                  <span className="text-zinc-800">➔</span>
                )}
              </div>
            ))}
          </div>

          {/* Form Scroll Container */}
          <div className="flex-grow overflow-y-auto min-h-0 p-6 sm:p-8 space-y-6">
            
            {/* Step 0: Contact Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Personal Information</h3>
                
                {/* Profile Image Upload */}
                {["modern_standard", "sidebar_dark", "corporate", "creative", "dual_column", "dark_presentation"].includes(formData.template) && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 text-center sm:text-left">
                    <div className="relative shrink-0">
                      {isUploadingImage ? (
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border-2 border-emerald-500 text-emerald-450">
                          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        </div>
                      ) : formData.personalInfo.profileImage ? (
                        <div className="relative group">
                          <img 
                            src={formData.personalInfo.profileImage} 
                            alt="Profile Preview" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={removeProfileImage}
                            className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors shadow-lg"
                            title="Remove Image"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 text-zinc-500">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 w-full min-w-0">
                      <label className="block text-xs font-bold text-zinc-300">Profile Picture</label>
                      <p className="text-[10px] text-zinc-500">Upload a professional photo (JPG, PNG or WEBP).</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-zinc-800 file:text-emerald-400 hover:file:bg-zinc-700 cursor-pointer file:cursor-pointer w-full overflow-hidden disabled:opacity-40"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.personalInfo.fullName}
                      onChange={handlePersonalChange}
                      placeholder="John Doe"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.personalInfo.email}
                      onChange={handlePersonalChange}
                      placeholder="johndoe@example.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.personalInfo.phone}
                      onChange={handlePersonalChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Address/Location</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.personalInfo.address}
                      onChange={handlePersonalChange}
                      placeholder="New York, NY"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Website / LinkedIn</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.personalInfo.website}
                      onChange={handlePersonalChange}
                      placeholder="linkedin.com/in/johndoe"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Profile Summary</label>
                      <button
                        type="button"
                        onClick={handleEnhanceSummary}
                        disabled={isEnhancing || !formData.personalInfo.summary?.trim()}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-350 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        {isEnhancing ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <span>Enhancing...</span>
                          </>
                        ) : (
                          <>
                            <span>✨ Enhance with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      name="summary"
                      value={formData.personalInfo.summary}
                      onChange={handlePersonalChange}
                      placeholder="A highly motivated software engineer with experience building web applications..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Education */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Education Details</h3>
                  <button
                    onClick={() => addArrayItem("education", { school: "", degree: "", startDate: "", endDate: "", description: "" })}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    + Add School
                  </button>
                </div>

                {formData.education.map((edu, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative space-y-4">
                    <button
                      onClick={() => removeArrayItem("education", idx)}
                      className="absolute right-4 top-4 text-zinc-500 hover:text-rose-400 transition-colors text-xs font-bold"
                    >
                      Remove
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">School Name</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleArrayItemChange("education", idx, "school", e.target.value)}
                          placeholder="Stanford University"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Degree / Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayItemChange("education", idx, "degree", e.target.value)}
                          placeholder="B.S. Computer Science"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => handleArrayItemChange("education", idx, "startDate", e.target.value)}
                          placeholder="Sep 2018"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">End Date</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => handleArrayItemChange("education", idx, "endDate", e.target.value)}
                          placeholder="Jun 2022"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description (Optional)</label>
                          <button
                            type="button"
                            onClick={() => handleEnhanceEducation(idx)}
                            disabled={enhancingEduIndex === idx || !edu.description?.trim()}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-350 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            {enhancingEduIndex === idx ? (
                              <>
                                <svg className="animate-spin h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span>Enhancing...</span>
                              </>
                            ) : (
                              <>
                                <span>✨ Enhance with AI</span>
                              </>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={edu.description}
                          onChange={(e) => handleArrayItemChange("education", idx, "description", e.target.value)}
                          placeholder="Graduated with honors, GPA: 3.9..."
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Experience */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Work Experience</h3>
                  <button
                    onClick={() => addArrayItem("experience", { company: "", position: "", startDate: "", endDate: "", description: "" })}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    + Add Experience
                  </button>
                </div>

                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative space-y-4">
                    <button
                      onClick={() => removeArrayItem("experience", idx)}
                      className="absolute right-4 top-4 text-zinc-500 hover:text-rose-400 transition-colors text-xs font-bold"
                    >
                      Remove
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleArrayItemChange("experience", idx, "company", e.target.value)}
                          placeholder="Google"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Job Title / Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleArrayItemChange("experience", idx, "position", e.target.value)}
                          placeholder="Software Engineer"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleArrayItemChange("experience", idx, "startDate", e.target.value)}
                          placeholder="Jul 2022"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => handleArrayItemChange("experience", idx, "endDate", e.target.value)}
                          placeholder="Present"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                          <button
                            type="button"
                            onClick={() => handleEnhanceExperience(idx)}
                            disabled={enhancingExpIndex === idx || !exp.description?.trim()}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-350 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            {enhancingExpIndex === idx ? (
                              <>
                                <svg className="animate-spin h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span>Enhancing...</span>
                              </>
                            ) : (
                              <>
                                <span>✨ Enhance with AI</span>
                              </>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleArrayItemChange("experience", idx, "description", e.target.value)}
                          placeholder="Led frontend optimization, improving render speeds by 25%..."
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Technical Skills</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Skills list (comma separated)</label>
                  <textarea
                    value={skillsText}
                    onChange={handleSkillsChange}
                    placeholder="React, JavaScript, CSS, Node.js, Mongoose"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[140px]"
                  />
                  <p className="text-[10px] text-zinc-600 mt-2">Separate skills with commas (e.g. "React, JavaScript, TypeScript").</p>
                </div>
              </div>
            )}

            {/* Step 4: Projects */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Personal Projects</h3>
                  <button
                    onClick={() => addArrayItem("projects", { name: "", description: "", link: "" })}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    + Add Project
                  </button>
                </div>

                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative space-y-4">
                    <button
                      onClick={() => removeArrayItem("projects", idx)}
                      className="absolute right-4 top-4 text-zinc-500 hover:text-rose-400 transition-colors text-xs font-bold"
                    >
                      Remove
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Project Title</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => handleArrayItemChange("projects", idx, "name", e.target.value)}
                          placeholder="NexResumeBuilder"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Project Link (Optional)</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => handleArrayItemChange("projects", idx, "link", e.target.value)}
                          placeholder="github.com/yourusername/project"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Project Description</label>
                          <button
                            type="button"
                            onClick={() => handleEnhanceProject(idx)}
                            disabled={enhancingProjIndex === idx || !proj.description?.trim()}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-350 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            {enhancingProjIndex === idx ? (
                              <>
                                <svg className="animate-spin h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span>Enhancing...</span>
                              </>
                            ) : (
                              <>
                                <span>✨ Enhance with AI</span>
                              </>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={proj.description}
                          onChange={(e) => handleArrayItemChange("projects", idx, "description", e.target.value)}
                          placeholder="Full-stack resume editor featuring live template rendering and PDF exporter..."
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Certifications */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Certifications</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Certificates list (comma separated)</label>
                  <textarea
                    value={certsText}
                    onChange={handleCertsChange}
                    placeholder="AWS Certified Solutions Architect, Google UX Design Professional"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[140px]"
                  />
                  <p className="text-[10px] text-zinc-600 mt-2">Separate certifications with commas.</p>
                </div>
              </div>
            )}

            {/* Step 6: Languages */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Languages</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Languages list (comma separated)</label>
                  <textarea
                    value={languagesText}
                    onChange={handleLanguagesChange}
                    placeholder="English, Spanish, French, German"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[140px]"
                  />
                  <p className="text-[10px] text-zinc-600 mt-2">Separate languages with commas.</p>
                </div>
              </div>
            )}

            {/* Step 7: Hobbies */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Hobbies</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Hobbies list (comma separated)</label>
                  <textarea
                    value={hobbiesText}
                    onChange={handleHobbiesChange}
                    placeholder="Reading, Photography, Traveling, Hiking"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 transition-colors min-h-[140px]"
                  />
                  <p className="text-[10px] text-zinc-600 mt-2">Separate hobbies with commas.</p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Navigation Buttons */}
          <div className="border-t border-zinc-900 p-4 flex justify-between bg-zinc-950/60 backdrop-blur-md items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-5 py-3 border border-zinc-800 bg-zinc-950 text-xs font-bold text-zinc-400 rounded-2xl hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="relative group overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 active:scale-95 cursor-pointer shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative block rounded-[15px] bg-zinc-950 px-8 py-3 text-xs font-bold text-white transition-all duration-200 group-hover:bg-zinc-950/40">
                {currentStep === stepsList.length - 1 ? "Save Final" : "Save & Next"}
              </span>
            </button>
          </div>

        </section>        {/* Right Column: Live Dynamic Preview Area */}
        <section className="lg:col-span-6 bg-zinc-900/20 p-4 sm:p-8 lg:pl-16 overflow-x-auto w-full flex flex-col justify-start items-start">
          
          <div 
            className={`w-full lg:min-w-[21cm] lg:max-w-[21cm] min-w-0 max-w-full shadow-2xl rounded-sm border lg:min-h-[29.7cm] min-h-0 flex flex-col lg:justify-between justify-start text-left select-none scale-100 transition-all duration-300 ${
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
                      <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 uppercase">
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
                                <span className="text-zinc-500 font-normal">{exp.startDate} - {exp.endDate}</span>
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
                                <span className="text-zinc-500 font-normal">{edu.startDate} - {edu.endDate}</span>
                              </div>
                              <div className="text-zinc-700 italic">{edu.school || "School Name"}</div>
                              {edu.description && (
                                <p className="text-zinc-650 mt-1 pl-2 border-l-2" style={{ borderColor: formData.accentColor }}>{edu.description}</p>
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
                          <p className="text-xs text-zinc-700 font-medium">{formData.languages.join(", ")}</p>
                        </div>
                      )}
                      {formData.hobbies.length > 0 && (
                        <div className="space-y-1.5">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Hobbies</h4>
                          <p className="text-xs text-zinc-700 font-medium">{formData.hobbies.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Sidebar Dark (Max Johnson Style) */}
              {formData.template === "sidebar_dark" && (
                <div className="grid grid-cols-12 gap-0 lg:min-h-[29.7cm] min-h-0 items-stretch">
                  {/* Left Column (Dark Slate Background) */}
                  <div className="col-span-4 bg-slate-900 text-slate-200 p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                      {/* Profile Image */}
                      {formData.personalInfo.profileImage ? (
                        <div className="flex justify-center">
                          <img loading="lazy" src={formData.personalInfo.profileImage} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-3"
                            style={{ borderColor: formData.accentColor }}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 text-slate-500">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-3.5 text-xs">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Contact</h4>
                        {formData.personalInfo.email && <div className="break-all">{formData.personalInfo.email}</div>}
                        {formData.personalInfo.phone && <div>{formData.personalInfo.phone}</div>}
                        {formData.personalInfo.address && <div>{formData.personalInfo.address}</div>}
                        {formData.personalInfo.website && <div className="font-semibold break-all" style={{ color: formData.accentColor }}>{formData.personalInfo.website}</div>}
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
                  <div className="col-span-8 bg-white text-zinc-800 p-8 flex flex-col justify-start space-y-6">
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
                                <span className="text-zinc-500 text-[10px] font-normal">{exp.startDate} - {exp.endDate}</span>
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
                                <span className="text-zinc-500 text-[10px] font-normal">{edu.startDate} - {edu.endDate}</span>
                              </div>
                              <div className="text-zinc-650 text-[11px] font-semibold">{edu.school || "School Name"}</div>
                              {edu.description && (
                                <p className="text-zinc-550 text-[11px] mt-1 pl-2.5 border-l-2" style={{ borderColor: `${formData.accentColor}60` }}>{edu.description}</p>
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
                              <span className="text-zinc-500 text-[10px]">{edu.startDate} - {edu.endDate}</span>
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
                              <span className="text-zinc-500 text-[10px]">{exp.startDate} - {exp.endDate}</span>
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
                                <span className="text-zinc-550 font-normal">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              {exp.description && <p className="text-zinc-650 mt-1 pl-3 border-l" style={{ borderColor: `${formData.accentColor}30` }}>{exp.description}</p>}
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
                                <span className="text-zinc-550 font-normal">{edu.startDate} - {edu.endDate}</span>
                              </div>
                              {edu.description && <p className="text-zinc-650 mt-1 pl-3 border-l" style={{ borderColor: `${formData.accentColor}30` }}>{edu.description}</p>}
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
                        {formData.personalInfo.website && <span className="underline">{formData.personalInfo.website}</span>}
                      </div>
                    </div>
                  </div>

                  {formData.personalInfo.summary && (
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 text-center text-xs text-zinc-650 leading-relaxed italic">
                      "{formData.personalInfo.summary}"
                    </div>
                  )}

                  {/* Grid layout */}
                  <div className="space-y-4">
                    {formData.experience.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950">Work Journey</h3>
                        <div className="grid gap-3">
                          {formData.experience.map((exp, idx) => (
                            <div key={idx} className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-2xl text-xs relative">
                              <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: formData.accentColor }}>
                                {exp.startDate} - {exp.endDate}
                              </span>
                              <h4 className="font-bold text-zinc-900 text-sm">{exp.position}</h4>
                              <div className="text-zinc-600 font-medium">{exp.company}</div>
                              {exp.description && <p className="text-zinc-655 mt-2 pl-3 border-l" style={{ borderColor: formData.accentColor }}>{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.education.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950">Education</h3>
                        <div className="grid gap-3">
                          {formData.education.map((edu, idx) => (
                            <div key={idx} className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-2xl text-xs relative">
                              <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: formData.accentColor }}>
                                {edu.startDate} - {edu.endDate}
                              </span>
                              <h4 className="font-bold text-zinc-900 text-sm">{edu.degree}</h4>
                              <div className="text-zinc-600 font-medium">{edu.school}</div>
                              {edu.description && <p className="text-zinc-655 mt-2 pl-3 border-l" style={{ borderColor: formData.accentColor }}>{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags block for skills, certifications, languages, hobbies */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.skills.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900">Superpowers</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {formData.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-800 rounded-full text-[10px] font-bold border border-zinc-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.certifications.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900">Badges</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {formData.certifications.map((cert, idx) => (
                              <span key={idx} className="px-3 py-1 text-white rounded-full text-[10px] font-bold" style={{ backgroundColor: `${formData.accentColor}dd` }}>
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-3">
                      {formData.languages.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Languages</h4>
                          <div className="flex flex-wrap gap-1">
                            {formData.languages.map((l, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-700 font-medium">{l}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.hobbies.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Hobbies</h4>
                          <div className="flex flex-wrap gap-1">
                            {formData.hobbies.map((h, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-700 font-medium">{h}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Bold Executive */}
              {formData.template === "bold_executive" && (
                <div className="space-y-5">
                  <div className="bg-zinc-800 text-white -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                      <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                        {formData.personalInfo.fullName || "Your Full Name"}
                      </h2>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-zinc-350">
                        {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                        {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                        {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                        {formData.personalInfo.website && <span className="underline" style={{ color: formData.accentColor }}>{formData.personalInfo.website}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    {formData.personalInfo.summary && (
                      <div className="text-xs text-zinc-700 leading-relaxed font-medium">
                        {formData.personalInfo.summary}
                      </div>
                    )}

                    {formData.experience.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b-4 pb-0.5" style={{ borderColor: formData.accentColor }}>Professional History</h3>
                        <div className="space-y-3">
                          {formData.experience.map((exp, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex justify-between font-bold text-zinc-950">
                                <span className="text-sm">{exp.position}</span>
                                <span className="text-zinc-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <div className="text-zinc-600 font-bold uppercase tracking-wider text-[10px]">{exp.company}</div>
                              {exp.description && <p className="text-zinc-650 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.education.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b-4 pb-0.5" style={{ borderColor: formData.accentColor }}>Academic Background</h3>
                        <div className="space-y-3">
                          {formData.education.map((edu, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex justify-between font-bold text-zinc-955">
                                <span className="text-sm">{edu.degree}</span>
                                <span className="text-zinc-500 font-normal">{edu.startDate} - {edu.endDate}</span>
                              </div>
                              <div className="text-zinc-600 font-bold uppercase tracking-wider text-[10px]">{edu.school}</div>
                              {edu.description && <p className="text-zinc-650 mt-1 pl-2 border-l" style={{ borderColor: formData.accentColor }}>{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {formData.skills.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Key Expertise</h4>
                          <p className="text-xs text-zinc-700">{formData.skills.join(", ")}</p>
                        </div>
                      )}
                      {formData.certifications.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Credentials</h4>
                          <p className="text-xs text-zinc-700">{formData.certifications.join(", ")}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-200 pt-3">
                      {formData.languages.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Languages</h4>
                          <p className="text-xs text-zinc-700">{formData.languages.join(", ")}</p>
                        </div>
                      )}
                      {formData.hobbies.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Hobbies</h4>
                          <p className="text-xs text-zinc-700">{formData.hobbies.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Left Border */}
              {formData.template === "left_border" && (
                <div className="space-y-6 border-l-4 pl-6" style={{ borderColor: formData.accentColor }}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-4">
                      <h2 className="text-3xl font-extrabold tracking-tight text-zinc-955 uppercase">
                        {formData.personalInfo.fullName || "Your Full Name"}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-650 font-medium">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && <span className="font-semibold" style={{ color: formData.accentColor }}>{formData.personalInfo.website}</span>}
                    </div>
                  </div>

                  {formData.personalInfo.summary && (
                    <p className="text-xs text-zinc-700 leading-relaxed font-light">{formData.personalInfo.summary}</p>
                  )}

                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950" style={{ color: formData.accentColor }}>Work History</h3>
                      <div className="space-y-3">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{exp.position} @ {exp.company}</span>
                              <span className="text-zinc-550 font-normal">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            {exp.description && <p className="text-zinc-600 mt-1 pl-2 border-l" style={{ borderColor: `${formData.accentColor}40` }}>{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950" style={{ color: formData.accentColor }}>Education</h3>
                      <div className="space-y-3">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-zinc-900">
                              <span>{edu.degree} @ {edu.school}</span>
                              <span className="text-zinc-550 font-normal">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            {edu.description && <p className="text-zinc-600 mt-1 pl-2 border-l" style={{ borderColor: `${formData.accentColor}40` }}>{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {formData.skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Technical Skills</h4>
                        <p className="text-xs text-zinc-700">{formData.skills.join(", ")}</p>
                      </div>
                    )}
                    {formData.certifications.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Certifications</h4>
                        <p className="text-xs text-zinc-700">{formData.certifications.join(", ")}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-3">
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
              )}

              {/* 8. Classic Serif */}
              {formData.template === "classic_serif" && (
                <div className="space-y-6 font-serif">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center gap-4 items-center">
                      <h2 className="text-3xl font-normal text-zinc-950 uppercase tracking-wide">
                        {formData.personalInfo.fullName || "Your Full Name"}
                      </h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 text-xs text-zinc-600 italic">
                      {formData.personalInfo.email && <span>{formData.personalInfo.email}</span>}
                      {formData.personalInfo.phone && <span>{formData.personalInfo.phone}</span>}
                      {formData.personalInfo.address && <span>{formData.personalInfo.address}</span>}
                      {formData.personalInfo.website && <span className="underline">{formData.personalInfo.website}</span>}
                    </div>
                  </div>

                  {formData.personalInfo.summary && (
                    <p className="text-xs text-zinc-700 leading-relaxed text-center italic border-t border-b py-2.5 border-zinc-200">
                      {formData.personalInfo.summary}
                    </p>
                  )}

                  {formData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-center border-b border-zinc-400 pb-0.5">Professional Experience</h3>
                      <div className="space-y-4">
                        {formData.experience.map((exp, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-955">
                              <span>{exp.position} — <span className="font-normal italic">{exp.company}</span></span>
                              <span className="font-normal">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            {exp.description && <p className="text-zinc-650 mt-1 leading-relaxed">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-center border-b border-zinc-400 pb-0.5">Education</h3>
                      <div className="space-y-4">
                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <div className="flex justify-between font-bold text-zinc-955">
                              <span>{edu.degree} — <span className="font-normal italic">{edu.school}</span></span>
                              <span className="font-normal">{edu.startDate} – {edu.endDate}</span>
                            </div>
                            {edu.description && <p className="text-zinc-650 mt-1 leading-relaxed">{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-3 border-t border-zinc-200">
                    {formData.skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-955">Key Skills</h4>
                        <p className="text-xs text-zinc-700 leading-relaxed">{formData.skills.join(", ")}</p>
                      </div>
                    )}
                    {formData.certifications.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-955">Certifications</h4>
                        <p className="text-xs text-zinc-700 leading-relaxed">{formData.certifications.join(", ")}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    {formData.languages.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-955">Languages</h4>
                        <p className="text-xs text-zinc-700">{formData.languages.join(", ")}</p>
                      </div>
                    )}
                    {formData.hobbies.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-955">Hobbies</h4>
                        <p className="text-xs text-zinc-700">{formData.hobbies.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 9. Dual Column */}
              {formData.template === "dual_column" && (
                <div className="grid grid-cols-12 gap-6 lg:min-h-[29.7cm] min-h-0 items-stretch text-zinc-800">
                  {/* Left Column (40%) */}
                  <div className="col-span-5 pr-4 border-r border-zinc-150 flex flex-col justify-start space-y-6">
                    {formData.personalInfo.profileImage && (
                      <div className="flex justify-center">
                        <img loading="lazy" src={formData.personalInfo.profileImage} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-2 shadow-sm"
                          style={{ borderColor: formData.accentColor }}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-3 text-xs">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b pb-0.5">Details</h4>
                      {formData.personalInfo.email && <div className="break-all">Email: {formData.personalInfo.email}</div>}
                      {formData.personalInfo.phone && <div>Phone: {formData.personalInfo.phone}</div>}
                      {formData.personalInfo.address && <div>Location: {formData.personalInfo.address}</div>}
                      {formData.personalInfo.website && <div className="break-all font-medium" style={{ color: formData.accentColor }}>Link: {formData.personalInfo.website}</div>}
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
                        <p className="text-xs text-zinc-750">{formData.hobbies.join(", ")}</p>
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
                                <span className="text-zinc-500 text-[10px] font-normal">{exp.startDate} - {exp.endDate}</span>
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
                                <span className="text-zinc-500 text-[10px] font-normal">{edu.startDate} - {edu.endDate}</span>
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
                                <span className="text-zinc-550 font-normal">{exp.startDate} - {exp.endDate}</span>
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
                                <span className="text-zinc-550 font-normal">{edu.startDate} - {edu.endDate}</span>
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
                              <span key={idx} className="px-2 py-0.5 rounded border text-[11px] text-zinc-200 bg-zinc-900 border-zinc-850">
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
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Languages</h4>
                          <p className="text-xs text-zinc-300">{formData.languages.join(", ")}</p>
                        </div>
                      )}
                      {formData.hobbies.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Hobbies</h4>
                          <p className="text-xs text-zinc-300">{formData.hobbies.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

      </main>

      {/* Modal Popup: Choose Template */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => setIsTemplateModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Choose Resume Template</h3>
            <p className="text-xs text-zinc-400 mb-6 font-medium">Select a structure format that matches your application requirements.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-zinc-850 scrollbar-thumb-zinc-700">
              {[
                { name: "modern_standard", label: "Modern Standard", desc: "Centered profile details with full-width elements." },
                { name: "sidebar_dark", label: "Sidebar Dark", desc: "Classic dark sidebar split layout." },
                { name: "minimalist", label: "Minimal Clean", desc: "Left-aligned metadata with light fonts." },
                { name: "corporate", label: "Corporate Band", desc: "Accent color top header band across the sheet." },
                { name: "creative", label: "Creative Panels", desc: "Centered avatar with soft section panels." },
                { name: "bold_executive", label: "Bold Executive", desc: "Strong headers with dark executive accent band." },
                { name: "left_border", label: "Left Border Accent", desc: "Page layout bordered by accent colors." },
                { name: "classic_serif", label: "Classic Serif", desc: "Georgia serif typography with elegant styling." },
                { name: "dual_column", label: "Dual Column", desc: "Clean 50/50 vertical division layout." },
                { name: "dark_presentation", label: "Dark Presentation", desc: "Tech dark mode sheet layout with highlights." }
              ].map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => changeTemplate(tpl.name)}
                  className={`border text-left p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:border-emerald-500/40 hover:bg-zinc-850/50 transition-all ${
                    formData.template === tpl.name
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-zinc-850 bg-zinc-950/40"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: formData.accentColor }}></div>
                    <h4 className="text-xs font-bold text-zinc-100">{tpl.label}</h4>
                    <p className="text-[9px] text-zinc-500 leading-normal">{tpl.desc}</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 mt-3 block">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
