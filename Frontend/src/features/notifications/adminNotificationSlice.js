import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

export const fetchAdminNotifications = createAsyncThunk(
  "adminNotifications/fetchAdminNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/notifications", token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminNotificationUnreadCount = createAsyncThunk(
  "adminNotifications/fetchUnreadCount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/notifications/unread-count", token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAdminNotificationRead = createAsyncThunk(
  "adminNotifications/markRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: `/api/notifications/${id}/read`,
        method: "PATCH",
        token,
      });
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

const adminNotificationSlice = createSlice({
  name: "adminNotifications",
  initialState,
  reducers: {
    clearAdminNotificationState: (state) => {
      state.list = [];
      state.unreadCount = 0;
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })
      .addCase(fetchAdminNotificationUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(markAdminNotificationRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markAdminNotificationRead.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.list.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) {
          const wasUnread = !state.list[index].isRead;
          state.list[index] = action.payload;
          if (wasUnread && state.unreadCount > 0) {
            state.unreadCount -= 1;
          }
        }
      })
      .addCase(markAdminNotificationRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to mark notification";
      });
  },
});

export const { clearAdminNotificationState } = adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;
