import { createSlice } from "@reduxjs/toolkit";

// ── Load auth state from localStorage (runs once on app start) ──
function loadAuthFromStorage() {
  try {
    if (typeof window === "undefined") return null; // SSR guard
    const token = localStorage.getItem("aizym_token");
    const user = localStorage.getItem("aizym_user");
    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (_) {}
  return null;
}

// ── Save / clear auth in localStorage ──
function saveAuthToStorage(token, user) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem("aizym_token", token);
    localStorage.setItem("aizym_user", JSON.stringify(user));
  } catch (_) {}
}

function clearAuthFromStorage() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem("aizym_token");
    localStorage.removeItem("aizym_user");
  } catch (_) {}
}

const defaultState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthFromStorage() ?? defaultState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Persist to localStorage so auth survives navigation & refresh
      saveAuthToStorage(action.payload.token, action.payload.user);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      clearAuthFromStorage();
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearAuthFromStorage();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
