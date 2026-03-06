import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/employees", token });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: `/api/employees/${id}`, token });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchMyEmployee = createAsyncThunk(
  "employees/fetchMyEmployee",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({ path: "/api/employees/me", token });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: "/api/employees",
        method: "POST",
        token,
        body: payload,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, payload }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await apiRequest({
        path: `/api/employees/${id}`,
        method: "PATCH",
        token,
        body: payload,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest({
        path: `/api/employees/${id}`,
        method: "DELETE",
        token,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const uploadMyProfilePicture = createAsyncThunk(
  "employees/uploadMyProfilePicture",
  async (file, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const body = new FormData();
      body.append("profilePic", file);

      return await apiRequest({
        path: "/api/employees/me/profile-picture",
        method: "PATCH",
        token,
        body,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  list: [],
  selected: null,
  myProfile: null,
  loading: false,
  actionLoading: false,
  error: null,
  validationErrors: {},
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployeeState: (state) => {
      state.list = [];
      state.selected = null;
      state.myProfile = null;
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
      state.validationErrors = {};
    },
    clearFieldError: (state, action) => {
      if (state.validationErrors) {
        delete state.validationErrors[action.payload];

        state.error = null;
      }
    },
    clearEmployeeErrors: (state) => {
      state.error = null;
      state.validationErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch employees";
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
        const idx = state.list.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (idx >= 0) state.list[idx] = action.payload;
        else state.list.unshift(action.payload);
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employee";
      })
      .addCase(uploadMyProfilePicture.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(fetchMyEmployee.fulfilled, (state, action) => {
        state.myProfile = action.payload;
      })
      .addCase(uploadMyProfilePicture.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Upload failed";
        state.validationErrors = action.payload?.errors || {};
      })
      .addCase(createEmployee.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to create employee";
        state.validationErrors = action.payload?.errors || {};
      })
      .addCase(updateEmployee.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selected = action.payload;
        const idx = state.list.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to update employee";
        state.validationErrors = action.payload?.errors || {};
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);
        if (state.selected?._id === action.payload) state.selected = null;
      })
      .addCase(uploadMyProfilePicture.fulfilled, (state, action) => {
        state.myProfile = action.payload;
      });
  },
});

export const { clearEmployeeState, clearFieldError ,clearEmployeeErrors} = employeeSlice.actions;
export default employeeSlice.reducer;
