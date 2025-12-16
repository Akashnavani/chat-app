import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSendingOtp: false,
  isVerifyingOtp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ---- CHECK AUTH ----
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ---- SEND OTP ----
  sendOtp: async (data) => {
    set({ isSendingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/send-otp", data);
      toast.success(res.data.message);
      return true; // success flag for UI to switch to OTP step
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while sending OTP");
      return false;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  // ---- VERIFY OTP ----
  verifyOtp: async (data) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/verify-otp", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket(); // connect after signup
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during verification");
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  // ---- LOGIN ----
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during login");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ---- LOGOUT ----
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // ---- UPDATE PROFILE ----
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "An error occurred during profile update");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ---- CONNECT SOCKET ----
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket });

    // LISTEN FOR ONLINE USERS
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ---- DISCONNECT SOCKET ----
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
