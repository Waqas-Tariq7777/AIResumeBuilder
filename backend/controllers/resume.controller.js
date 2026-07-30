import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Resume } from "../models/resume.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getCachedResume, setCachedResume, deleteCachedResume } from "../utils/resumeCache.js";

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

export {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    uploadProfileImage
};
