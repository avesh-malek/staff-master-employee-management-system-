import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

export const fetchLeaves = createAsyncThunk(
  "leave/fetchLeaves",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const params = new URLSearchParams();

      if (filters.status) params.set("status", filters.status);
      if (filters.month) params.set("month", filters.month);
      if (filters.page) {
        params.set("page", filters.page);
        params.set("limit", 10);
      }

      const query = params.toString();
      return await apiRequest({
        path: query ? `/api/leaves?${query}` : "/api/leaves",
        token,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createLeave = createAsyncThunk(
  "leave/createLeave",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/leaves",
        method: "POST",
        token,
        body: payload,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateLeaveStatus = createAsyncThunk(
  "leave/updateLeaveStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: `/api/leaves/${id}/status`,
        method: "PATCH",
        token,
        body: { status },
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteLeave = createAsyncThunk(
  "leave/deleteLeave",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest({ path: `/api/leaves/${id}`, method: "DELETE", token });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAdminLeaveUnreadCount = createAsyncThunk(
  "leave/fetchAdminLeaveUnreadCount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const data = await apiRequest({
        path: "/api/leaves/admin/unread-count",
        token,
      });

      return data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  requests: [],
  loading: false,
  actionLoading: false,
  error: null,
  unreadCount: 0,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearLeaveState: (state) => {
      state.requests = [];
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
      state.total = 0;
      state.page = 1;
      state.limit = 10;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminLeaveUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchLeaves.pending, (state) => {
        if (state.requests.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || [];
        state.total = action.payload.total ?? 0;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? 10;
        state.totalPages = action.payload.totalPages ?? 1;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leaves";
      })
      .addCase(createLeave.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createLeave.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create leave request";
      })
      .addCase(updateLeaveStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.requests.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index >= 0) state.requests[index] = action.payload;
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to update leave status";
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export const { clearLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
