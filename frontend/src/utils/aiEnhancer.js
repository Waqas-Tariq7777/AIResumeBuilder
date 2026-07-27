import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Enhances text using backend's Gemini AI endpoint.
 * @param {string} text - The original text to enhance.
 * @param {string} type - The section type (e.g. "summary", "experience", "skills", "projects").
 * @returns {Promise<string>} - The enhanced text.
 */
export const enhanceText = async (text, type) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/v1/ai/enhance`,
      { text, type },
      { withCredentials: true }
    );
    return res.data?.data?.enhancedText;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to enhance text using AI";
    throw new Error(message);
  }
};
