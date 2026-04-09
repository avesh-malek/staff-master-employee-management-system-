import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const buildPeriodParams = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.month) params.set("month", filters.month);
  if (filters.year) params.set("year", filters.year);
  if (filters.status) params.set("status", filters.status);
  if (filters.employeeId) params.set("employeeId", filters.employeeId);
  if (filters.search) params.set("search", filters.search);

  return params;
};

const parseFilename = (headerValue, fallback) => {
  if (!headerValue) return fallback;

  const match = headerValue.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
};

const downloadFile = async ({ path, token, method = "GET", body, fallbackName }) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = "Download failed";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      message = payload?.message || message;
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const fileName = parseFilename(
    response.headers.get("content-disposition"),
    fallbackName,
  );
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

export const fetchAdminPayroll = createAsyncThunk(
  "payroll/fetchAdminPayroll",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const params = buildPeriodParams(filters);

      params.set("page", filters.page || 1);
      params.set("limit", filters.limit || 10);

      return await apiRequest({
        path: `/api/payroll?${params.toString()}`,
        token,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchMyPayroll = createAsyncThunk(
  "payroll/fetchMyPayroll",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const params = buildPeriodParams(filters);

      params.set("page", filters.page || 1);
      params.set("limit", filters.limit || 10);

      return await apiRequest({
        path: `/api/payroll/my?${params.toString()}`,
        token,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const generatePayroll = createAsyncThunk(
  "payroll/generatePayroll",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/payroll/generate",
        method: "POST",
        token,
        body: payload,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const payPayroll = createAsyncThunk(
  "payroll/payPayroll",
  async ({ id, payload }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: `/api/payroll/${id}/pay`,
        method: "PATCH",
        token,
        body: payload,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const downloadPayrollPayslip = createAsyncThunk(
  "payroll/downloadPayrollPayslip",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      await downloadFile({
        path: `/api/payroll/${id}/payslip`,
        token,
        fallbackName: "payslip.pdf",
      });

      return id;
    } catch (error) {
      return rejectWithValue({
        id,
        message: error.message || "Failed to download payslip",
      });
    }
  },
);

export const bulkDownloadPayslips = createAsyncThunk(
  "payroll/bulkDownloadPayslips",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      await downloadFile({
        path: "/api/payroll/payslips",
        token,
        method: "POST",
        body: filters,
        fallbackName: "payslips.zip",
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to download payslips");
    }
  },
);

const initialState = {
  adminRecords: [],
  adminPage: 1,
  adminLimit: 10,
  adminTotal: 0,
  adminTotalPages: 1,
  myRecords: [],
  myPage: 1,
  myLimit: 10,
  myTotal: 0,
  myTotalPages: 1,
  loading: false,
  myLoading: false,
  actionLoading: false,
  downloadLoadingId: null,
  bulkDownloading: false,
  error: null,
  successMessage: null,
  summary: {
  totalSalary: 0,
  paid: 0,
  pending: 0,
  draft: 0,
},
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    clearPayrollState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.actionLoading = false;
      state.downloadLoadingId = null;
      state.bulkDownloading = false;
    },
    clearPayrollMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.adminRecords = action.payload.data;
        state.adminPage = action.payload.page;
        state.adminLimit = action.payload.limit;
        state.adminTotal = action.payload.total;
        state.adminTotalPages = action.payload.totalPages;
        state.summary = action.payload.summary;  
      })
      .addCase(fetchAdminPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch payroll";
      })
      .addCase(fetchMyPayroll.pending, (state) => {
        state.myLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPayroll.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myRecords = action.payload.data;
        state.myPage = action.payload.page;
        state.myLimit = action.payload.limit;
        state.myTotal = action.payload.total;
        state.myTotalPages = action.payload.totalPages;
      })
      .addCase(fetchMyPayroll.rejected, (state, action) => {
        state.myLoading = false;
        state.error = action.payload?.message || "Failed to fetch salary records";
      })
      .addCase(generatePayroll.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to generate payroll";
      })
      .addCase(payPayroll.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(payPayroll.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = "Payroll marked as paid";

        const adminIndex = state.adminRecords.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (adminIndex >= 0) {
          state.adminRecords[adminIndex] = action.payload;
        }

        const myIndex = state.myRecords.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (myIndex >= 0) {
          state.myRecords[myIndex] = action.payload;
        }
      })
      .addCase(payPayroll.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to update payroll";
      })
      .addCase(downloadPayrollPayslip.pending, (state, action) => {
        state.downloadLoadingId = action.meta.arg;
        state.error = null;
      })
      .addCase(downloadPayrollPayslip.fulfilled, (state) => {
        state.downloadLoadingId = null;
      })
      .addCase(downloadPayrollPayslip.rejected, (state, action) => {
        state.downloadLoadingId = null;
        state.error = action.payload?.message || "Failed to download payslip";
      })
      .addCase(bulkDownloadPayslips.pending, (state) => {
        state.bulkDownloading = true;
        state.error = null;
      })
      .addCase(bulkDownloadPayslips.fulfilled, (state) => {
        state.bulkDownloading = false;
      })
      .addCase(bulkDownloadPayslips.rejected, (state, action) => {
        state.bulkDownloading = false;
        state.error = action.payload || "Failed to download payslips";
      });
  },
});

export const { clearPayrollState, clearPayrollMessage } = payrollSlice.actions;
export default payrollSlice.reducer;
