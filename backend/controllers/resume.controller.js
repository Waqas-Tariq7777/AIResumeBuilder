import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Resume } from "../models/resume.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getCachedResume, setCachedResume, deleteCachedResume } from "../utils/resumeCache.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// @desc Create a new resume
// @route POST /api/v1/resumes
// @access Private
const createResume = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Resume title is required");
    }

    const resume = await Resume.create({
        title: title.trim(),
        user: req.user._id,
        personalInfo: { fullName: "", email: "", phone: "", address: "", website: "" },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        template: "modern_standard"
    });

    return res.status(201).json(
        new ApiResponse(201, resume, "Resume created successfully")
    );
});

// @desc Get all resumes of the user
// @route GET /api/v1/resumes
// @access Private
const getUserResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ user: req.user._id })
        .select("title updatedAt")
        .sort({ updatedAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, resumes, "Resumes retrieved successfully")
    );
});

// @desc Get single resume by ID
// @route GET /api/v1/resumes/:id
// @access Private
const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let resume = getCachedResume(id);

    if (!resume) {
        resume = await Resume.findById(id).lean();
        if (resume) {
            setCachedResume(id, resume);
        }
    }

    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    if (resume.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to access this resume");
    }

    return res.status(200).json(
        new ApiResponse(200, resume, "Resume retrieved successfully")
    );
});

// @desc Update resume details
// @route PUT /api/v1/resumes/:id
// @access Private
const updateResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, personalInfo, education, experience, skills, projects, certifications, template, accentColor, languages, hobbies } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (personalInfo !== undefined) updateFields.personalInfo = personalInfo;
    if (education !== undefined) updateFields.education = education;
    if (experience !== undefined) updateFields.experience = experience;
    if (skills !== undefined) updateFields.skills = skills;
    if (projects !== undefined) updateFields.projects = projects;
    if (certifications !== undefined) updateFields.certifications = certifications;
    if (template !== undefined) updateFields.template = template;
    if (accentColor !== undefined) updateFields.accentColor = accentColor;
    if (languages !== undefined) updateFields.languages = languages;
    if (hobbies !== undefined) updateFields.hobbies = hobbies;

    const resume = await Resume.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { $set: updateFields },
        { new: true, runValidators: true }
    ).lean();

    if (!resume) {
        throw new ApiError(404, "Resume not found or you do not have permission to update it");
    }

    deleteCachedResume(id);

    return res.status(200).json(
        new ApiResponse(200, resume, "Resume updated successfully")
    );
});

// @desc Delete resume
// @route DELETE /api/v1/resumes/:id
// @access Private
const deleteResume = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const resume = await Resume.findById(id).lean();

    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    if (resume.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this resume");
    }

    await Resume.findByIdAndDelete(id);
    deleteCachedResume(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Resume deleted successfully")
    );
});

// @desc Upload profile image to Cloudinary and return optimized URL
// @route POST /api/v1/resumes/upload-image
// @access Private
const uploadProfileImage = asyncHandler(async (req, res) => {
    console.log("Backend uploadProfileImage triggered.");
    console.log("req.file details:", req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    } : "No file found in request");

    if (!req.file) {
        throw new ApiError(400, "No image file uploaded");
    }

    try {
        console.log("Initiating Cloudinary upload stream...");
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "nex_resume_profile_images",
                    transformation: [
                        { width: 300, height: 300, crop: "thumb", gravity: "face" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary stream callback error:", error);
                        reject(error);
                    } else {
                        console.log("Cloudinary stream callback success:", result);
                        resolve(result);
                    }
                }
            );
            uploadStream.end(req.file.buffer);
        });

        console.log("Cloudinary upload successful, result URL:", result.secure_url);
        return res.status(200).json(
            new ApiResponse(200, { imageUrl: result.secure_url }, "Image uploaded successfully")
        );
    } catch (error) {
        console.error("Cloudinary Upload Error Catch Block:", error);
        throw new ApiError(500, "Failed to upload image to Cloudinary");
    }
});

// @desc Parse uploaded resume file (PDF/DOCX) using Gemini AI and create a structured resume
// @route POST /api/v1/resumes/upload-existing
// @access Private
const uploadExistingResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No resume file uploaded");
    }

    const { mimetype, buffer, originalname } = req.file;
    let rawText = "";

    console.log("Parsing document:", { originalname, mimetype, size: buffer.length });

    try {
        if (mimetype === "application/pdf") {
            const result = await pdfParse(buffer);
            rawText = result.text;
        } else if (
            mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimetype === "application/msword"
        ) {
            const data = await mammoth.extractRawText({ buffer });
            rawText = data.value;
        } else {
            throw new ApiError(400, "Unsupported file format. Only PDF and DOCX files are allowed.");
        }
    } catch (err) {
        console.error("Document text extraction failed:", err);
        throw new ApiError(500, `Failed to extract text from document: ${err.message}`);
    }

    if (!rawText || rawText.trim() === "") {
        throw new ApiError(400, "Extracted text is empty. The uploaded file may be scanned or empty.");
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new ApiError(500, "Gemini API key is not configured in the backend environment");
    }

    const promptText = `Analyze the following raw text extracted from a resume and extract the structured information.
Format the output as a valid JSON object matching the following structure:
{
  "title": "Resume Title (e.g., Software Engineer Resume)",
  "personalInfo": {
    "fullName": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "address": "Address",
    "website": "Website or LinkedIn URL",
    "summary": "Professional Summary"
  },
  "education": [
    {
      "school": "School/University Name",
      "degree": "Degree/Major",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Any description, coursework, or achievements"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Start Date",
      "endDate": "End Date",
      "description": "Work description and responsibilities"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project details/description",
      "link": "Project link if any"
    }
  ],
  "certifications": ["Certification 1"],
  "languages": ["Language 1"],
  "hobbies": ["Hobby 1"]
}

Rules:
1. Return ONLY the JSON object. Do not include any markdown formatting like \`\`\`json or explanations.
2. If a field is not present in the text, default it to empty string "" or empty array [] as appropriate.

Raw Resume Text:
${rawText}
`;

    let structuredData;
    try {
        console.log("Sending text to Gemini for structuring...");
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errData = await response.json();
            throw new ApiError(
                response.status,
                errData?.error?.message || "Error response from Gemini API"
            );
        }

        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new ApiError(500, "Failed to retrieve parsed data from Gemini API response");
        }

        // Clean up markdown block if Gemini wraps it in ```json ... ```
        let cleanedJsonText = responseText.trim();
        if (cleanedJsonText.startsWith("```json")) {
            cleanedJsonText = cleanedJsonText.slice(7).trim();
        }
        if (cleanedJsonText.startsWith("```")) {
            cleanedJsonText = cleanedJsonText.slice(3).trim();
        }
        if (cleanedJsonText.endsWith("```")) {
            cleanedJsonText = cleanedJsonText.slice(0, -3).trim();
        }

        structuredData = JSON.parse(cleanedJsonText);
    } catch (err) {
        console.error("Gemini AI Resume Parsing Error:", err);
        throw new ApiError(500, `Failed to parse resume content using AI: ${err.message}`);
    }

    // Default template and colors if not set
    const resume = await Resume.create({
        user: req.user._id,
        title: structuredData.title || originalname.replace(/\.[^/.]+$/, "") || "Uploaded Resume",
        personalInfo: {
            fullName: structuredData.personalInfo?.fullName || "",
            email: structuredData.personalInfo?.email || "",
            phone: structuredData.personalInfo?.phone || "",
            address: structuredData.personalInfo?.address || "",
            website: structuredData.personalInfo?.website || "",
            profileImage: "",
            summary: structuredData.personalInfo?.summary || ""
        },
        education: structuredData.education || [],
        experience: structuredData.experience || [],
        skills: structuredData.skills || [],
        projects: structuredData.projects || [],
        certifications: structuredData.certifications || [],
        languages: structuredData.languages || [],
        hobbies: structuredData.hobbies || [],
        template: "modern_standard",
        accentColor: "#10b981"
    });

    console.log("Successfully created structured resume:", resume._id);

    return res.status(201).json(
        new ApiResponse(201, resume, "Resume parsed and created successfully")
    );
});

export {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    uploadProfileImage,
    uploadExistingResume
};
