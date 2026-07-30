import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const enhanceResumeText = asyncHandler(async (req, res) => {
    const { text, type } = req.body;

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Text to enhance is required");
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new ApiError(500, "Gemini API key is not configured in the backend environment");
    }

    let instruction = "Improve this text for a resume. Make it professional, grammatically correct, concise, and ATS-friendly while preserving the original meaning.";

    if (type === "summary") {
        instruction = "Improve this professional summary for a resume. Make it professional, grammatically correct, concise, compelling, and ATS-friendly, while preserving the original meaning. Return ONLY the improved summary text, with no extra formatting, quotes, markdown labels, introduction, or explanations.";
    } else if (type === "education") {
        instruction = "Improve this education details/description for a resume. Describe academic achievements, relevant projects, or coursework in a professional, concise, grammatically correct, and ATS-friendly format. Return ONLY the improved description, with no extra formatting, quotes, markdown labels, introduction, or explanations.";
    } else if (type === "experience") {
        instruction = "Improve this work experience description/bullet point for a resume. Enhance it using strong action verbs, quantify achievements if possible, make it concise, grammatically correct, and ATS-friendly. Return ONLY the improved description, with no extra formatting, quotes, markdown labels, introduction, or explanations.";
    } else if (type === "skills") {
        instruction = "Improve this skills list/section for a resume. Make it clean, professional, properly formatted, and ATS-friendly. Return ONLY the improved skills text, with no extra formatting, quotes, markdown labels, introduction, or explanations.";
    } else if (type === "projects") {
        instruction = "Improve this project description for a resume. Highlight technologies used, impact, and achievements, make it concise, professional, and ATS-friendly. Return ONLY the improved project description, with no extra formatting, quotes, markdown labels, introduction, or explanations.";
    }

    try {
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
                                    text: `${instruction}\n\nOriginal Text:\n${text}`
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
        const enhancedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!enhancedText) {
            throw new ApiError(500, "Failed to retrieve enhanced text from Gemini API response");
        }

        // Clean up wrapping quotes or backticks if any
        let cleanedText = enhancedText.trim();
        if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
            cleanedText = cleanedText.slice(1, -1).trim();
        }
        if (cleanedText.startsWith('`') && cleanedText.endsWith('`')) {
            cleanedText = cleanedText.slice(1, -1).trim();
        }

        return res.status(200).json(
            new ApiResponse(200, { enhancedText: cleanedText }, "Text enhanced successfully")
        );
    } catch (error) {
        console.error("Gemini AI Enhancement Error:", error.message);
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Error occurred while enhancing text using Gemini AI"
        );
    }
});

export { enhanceResumeText };
