import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  loading: false,

  fetchResumes: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${baseUrl}/api/v1/resumes`, { withCredentials: true });
      if (res.status === 200) {
        set({ resumes: res.data?.data || [], loading: false });
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to load resumes");
    }
  },

  fetchResumeById: async (id) => {
    set({ loading: true, currentResume: null });
    try {
      const res = await axios.get(`${baseUrl}/api/v1/resumes/${id}`, { withCredentials: true });
      if (res.status === 200) {
        set({ currentResume: res.data?.data, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to load resume details");
    }
  },

  createResume: async (title, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/v1/resumes`, { title }, { withCredentials: true });
      if (res.status === 201) {
        const newResume = res.data?.data;
        set((state) => ({
          resumes: [newResume, ...state.resumes],
          loading: false
        }));
        toast.success("Resume created successfully!");
        if (onSuccess) onSuccess(newResume);
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create resume");
    }
  },

  updateResume: async (id, updatedFields, silent = false) => {
    try {
      const res = await axios.put(`${baseUrl}/api/v1/resumes/${id}`, updatedFields, { withCredentials: true });
      if (res.status === 200) {
        const updatedResume = res.data?.data;
        set((state) => ({
          resumes: state.resumes.map((r) => (r._id === id ? updatedResume : r)),
          currentResume: state.currentResume?._id === id ? updatedResume : state.currentResume
        }));
        if (!silent) {
          toast.success("Resume saved successfully!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save resume");
    }
  },

  deleteResume: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`${baseUrl}/api/v1/resumes/${id}`, { withCredentials: true });
      if (res.status === 200) {
        set((state) => ({
          resumes: state.resumes.filter((r) => r._id !== id),
          currentResume: state.currentResume?._id === id ? null : state.currentResume,
          loading: false
        }));
        toast.success("Resume deleted successfully!");
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to delete resume");
    }
  }
}));
