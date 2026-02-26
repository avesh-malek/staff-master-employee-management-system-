import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

const storageUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");
const savedUser = storageUser ? JSON.parse(storageUser) : null;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiRequest({
        path: "/api/auth/login",
        method: "POST",
        body: credentials,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized");
      }

      const user = await apiRequest({
        path: "/api/auth/me",
        method: "GET",
        token,
      });

      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const data = await apiRequest({
        path: "/api/auth/forgot-password",
        method: "POST",
        body: { email },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  token: savedToken || null,
  user: savedUser,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,
  infoMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload.token);
      state.loading = false;
      state.error = null;
      state.infoMessage = null;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.infoMessage = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.infoMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.infoMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unauthorized";
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.infoMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.infoMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to process request";
      });
  },
});

export const { setSession, logout, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
