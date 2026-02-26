import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAnnouncements",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/announcements", token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "announcements/fetchUnreadCount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/announcements/unread-count", token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAnnouncement = createAsyncThunk(
  "announcements/addAnnouncement",
  async ({ title, message }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/announcements",
        method: "POST",
        token,
        body: { title, message },
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAnnouncementRead = createAsyncThunk(
  "announcements/markRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: `/api/announcements/${id}/read`,
        method: "PATCH",
        token,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest({ path: `/api/announcements/${id}`, method: "DELETE", token });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [],
  unreadCount: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    clearAnnouncementState: (state) => {
      state.list = [];
      state.unreadCount = 0;
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch announcements";
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(addAnnouncement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.list.unshift(action.payload);
      })
      .addCase(addAnnouncement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create announcement";
      })
      .addCase(markAnnouncementRead.fulfilled, (state, action) => {
        const idx = state.list.findIndex((item) => item._id === action.payload._id);
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearAnnouncementState } = announcementSlice.actions;
export default announcementSlice.reducer;
