import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const downloadAttendanceFile = async ({ path, token }) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = "Failed to export attendance";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      message = payload?.message || message;
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = "attendance.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

export const exportMyAttendance = createAsyncThunk(
  "attendanceExport/exportMyAttendance",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const query = new URLSearchParams();

      if (filters.month) query.set("month", filters.month);
      if (filters.status) query.set("status", filters.status);

      const queryString = query.toString() ? `?${query.toString()}` : "";

      await downloadAttendanceFile({
        path: `/api/attendance/export/me${queryString}`,
        token,
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to export attendance");
    }
  },
);

export const exportAdminAttendance = createAsyncThunk(
  "attendanceExport/exportAdminAttendance",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const query = new URLSearchParams();

      if (filters.employeeId) query.set("employeeId", filters.employeeId);
      if (filters.date) query.set("date", filters.date);
      if (filters.from) query.set("from", filters.from);
      if (filters.to) query.set("to", filters.to);
      if (filters.department) query.set("department", filters.department);
      if (filters.status) query.set("status", filters.status);

      const queryString = query.toString() ? `?${query.toString()}` : "";

      await downloadAttendanceFile({
        path: `/api/attendance/export/admin${queryString}`,
        token,
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to export attendance");
    }
  },
);

const initialState = {
  employeeLoading: false,
  adminLoading: false,
  error: null,
};

const attendanceExportSlice = createSlice({
  name: "attendanceExport",
  initialState,
  reducers: {
    clearAttendanceExportState: (state) => {
      state.employeeLoading = false;
      state.adminLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportMyAttendance.pending, (state) => {
        state.employeeLoading = true;
        state.error = null;
      })
      .addCase(exportMyAttendance.fulfilled, (state) => {
        state.employeeLoading = false;
      })
      .addCase(exportMyAttendance.rejected, (state, action) => {
        state.employeeLoading = false;
        state.error = action.payload || "Failed to export attendance";
      })
      .addCase(exportAdminAttendance.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(exportAdminAttendance.fulfilled, (state) => {
        state.adminLoading = false;
      })
      .addCase(exportAdminAttendance.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload || "Failed to export attendance";
      });
  },
});

export const { clearAttendanceExportState } = attendanceExportSlice.actions;
export default attendanceExportSlice.reducer;
