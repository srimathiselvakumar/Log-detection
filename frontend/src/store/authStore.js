// src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    // API call to backend
    set({ isAuthenticated: true, user: { name: 'Admin', email: credentials.email } });
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));

export default useAuthStore;