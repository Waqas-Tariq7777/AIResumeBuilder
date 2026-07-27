import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

// base API URL
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Load user from localStorage on page load
const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// Auth store
export const useAuthStore = create((set, get) => ({
  user: parsedUser,
  isAdmin: parsedUser?.isAdmin || false,
  loading: false,

  setUser: (userData) => {
    set({ user: userData, isAdmin: userData?.isAdmin || false });
    localStorage.setItem("user", JSON.stringify(userData)); // persist
  },

  // login user
  loginUser: async (credentials, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/v1/auth/login`, credentials, { withCredentials: true });
      const data = res.data?.data;

      if (res.status === 200) {
        // Prevent non-admin from overwriting admin session on dashboard
        if (data.isAdmin === false && get().isAdmin) {
          toast.error("Another admin is already logged in!");
          set({ loading: false });
          return;
        }

        set({ user: data, isAdmin: data.isAdmin || false, loading: false });
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login successful");

        if (onSuccess) onSuccess(data); // <-- pass the fresh data here
      }
    } catch (error) {
      set({ loading: false, user: null, isAdmin: false });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  // signup user
  signupUser: async (userData, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/v1/auth/signup`, userData);
      const data = res.data?.data;

      if (res.status === 201) {
        set({ loading: false });
        toast.success("Registration successful! Please login.");
        if (onSuccess) onSuccess(data);
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Registration failed");
    }
  },

  // logout user
  logoutUser: async () => {
    set({ user: null, isAdmin: false });
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  },
}));
