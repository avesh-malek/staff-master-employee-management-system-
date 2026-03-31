import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMyAttendance",
  async (
    {  month, page = 1, limit = 10, status } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const token = getState().auth.token;

      const query = new URLSearchParams();
      if (month) query.set("month", month);
      if (status) query.set("status", status);
      if (page) {
        query.set("page", page);
        query.set("limit", limit);
      }

      const queryString = query.toString() ? `?${query.toString()}` : "";

      return await apiRequest({
        path: `/api/attendance/me${queryString}`,
        token,
      });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
);

export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/attendance/check-in",
        method: "POST",
        token,
      });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
);

export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/attendance/check-out",
        method: "POST",
        token,
      });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
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
      if (filters.status) query.set("status", filters.status);
      if (filters.page) {
        query.set("page", filters.page);
        query.set("limit", filters.limit || 10);
      }

      const queryString = query.toString() ? `?${query.toString()}` : "";
      return await apiRequest({ path: `/api/attendance${queryString}`, token });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
);

export const fetchAttendancePolicy = createAsyncThunk(
  "attendance/fetchAttendancePolicy",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/attendance/policy", token });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
);

export const updateAttendancePolicy = createAsyncThunk(
  "attendance/updateAttendancePolicy",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/attendance/policy",
        method: "PATCH",
        token,
        body: payload,
      });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
);

export const fetchAttendanceDashboard = createAsyncThunk(
  "attendance/fetchAttendanceDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/attendance/dashboard", token });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      });
    }
  },
);

const initialState = {
  records: [],
  validationErrors: {},
  adminRecords: [],

  loading: false,
  adminLoading: false,
  actionLoading: false,
  error: null,

  // ✅ ADD THESE
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 10,

  adminTotal: 0,
  adminTotalPages: 1,
  adminLimit: 10,

  policy: null,
  policyLoading: false,

  dashboard: {
    totalEmployees: 0,
    present: 0,
    late: 0,
    notCheckedIn: 0,
    absent: 0,
  },
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
      state.adminTotal = 0;
      state.adminTotalPages = 1;
      state.adminPage = 1;
      state.adminLimit = 10;
      state.policy = null;
      state.policyLoading = false;
      state.dashboard = {
        totalEmployees: 0,
        present: 0,
        late: 0,
        notCheckedIn: 0,
        absent: 0,
      };
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

        state.records = action.payload.data || [];
        state.total = action.payload.total ?? 0;
        state.totalPages = action.payload.totalPages ?? 1;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? 10;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch attendance";
      })
      .addCase(checkIn.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.records.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (idx >= 0) state.records[idx] = action.payload;
        else state.records.unshift(action.payload);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to fetch";
      })
      .addCase(checkOut.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.records.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (idx >= 0) state.records[idx] = action.payload;
        else state.records.unshift(action.payload);
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to fetch";
      })
      .addCase(fetchAdminAttendance.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminAttendance.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminRecords = action.payload.data || [];
        state.adminTotal = action.payload.total ?? 0;
        state.adminTotalPages = action.payload.totalPages ?? 1;

        state.adminLimit = action.meta?.arg?.limit || 10;
      })
      .addCase(fetchAdminAttendance.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload?.message || "Failed to fetch";
      })
      .addCase(fetchAttendancePolicy.pending, (state) => {
        state.policyLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendancePolicy.fulfilled, (state, action) => {
        state.policyLoading = false;
        state.policy = action.payload;
      })
      .addCase(fetchAttendancePolicy.rejected, (state, action) => {
        state.policyLoading = false;
        state.error = action.payload?.message || "Failed to fetch";
      })
      .addCase(updateAttendancePolicy.pending, (state) => {
        state.policyLoading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateAttendancePolicy.fulfilled, (state, action) => {
        state.policyLoading = false;
        state.policy = action.payload;
        state.validationErrors = {}; // ✅ clear old errors
      })
      .addCase(updateAttendancePolicy.rejected, (state, action) => {
        state.policyLoading = false;

        state.error =
          action.payload?.message || "Failed to update attendance policy";

        state.validationErrors = action.payload?.errors || {};
      })
      .addCase(fetchAttendanceDashboard.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAttendanceDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(fetchAttendanceDashboard.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch";
      });
  },
});

export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
