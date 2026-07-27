import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    personalInfo: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        address: { type: String, default: "" },
        website: { type: String, default: "" },
        profileImage: { type: String, default: "" },
        summary: { type: String, default: "" }
    },
    education: [{
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" }
    }],
    experience: [{
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" }
    }],
    skills: [String],
    projects: [{
        name: { type: String, default: "" },
        description: { type: String, default: "" },
        link: { type: String, default: "" }
    }],
    certifications: [String],
    languages: [String],
    hobbies: [String],
    template: {
        type: String,
        default: "modern_standard"
    },
    accentColor: {
        type: String,
        default: "#10b981"
    }
}, { timestamps: true });

resumeSchema.index({ user: 1, updatedAt: -1 });

export const Resume = mongoose.model("Resume", resumeSchema);
