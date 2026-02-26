import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMyAttendance",
  async (month, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const query = month ? `?month=${month}` : "";
      return await apiRequest({ path: `/api/attendance/me${query}`, token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/attendance/check-in", method: "POST", token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/attendance/check-out", method: "POST", token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminAttendance = createAsyncThunk(
  "attendance/fetchAdminAttendance",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const query = new URLSearchParams();

      if (filters.employeeId) query.set("employeeId", filters.employeeId);
      if (filters.date) query.set("date", filters.date);
      if (filters.department) query.set("department", filters.department);

      const queryString = query.toString() ? `?${query.toString()}` : "";
      return await apiRequest({ path: `/api/attendance${queryString}`, token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  records: [],
  adminRecords: [],
  loading: false,
  adminLoading: false,
  actionLoading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceState: (state) => {
      state.records = [];
      state.adminRecords = [];
      state.loading = false;
      state.adminLoading = false;
      state.actionLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch attendance";
      })
      .addCase(checkIn.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.records.findIndex((item) => item._id === action.payload._id);
        if (idx >= 0) state.records[idx] = action.payload;
        else state.records.unshift(action.payload);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to check in";
      })
      .addCase(checkOut.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.records.findIndex((item) => item._id === action.payload._id);
        if (idx >= 0) state.records[idx] = action.payload;
        else state.records.unshift(action.payload);
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to check out";
      })
      .addCase(fetchAdminAttendance.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminAttendance.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminRecords = action.payload;
      })
      .addCase(fetchAdminAttendance.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload || "Failed to fetch admin attendance";
      });
  },
});

export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
