// features/employees/employeeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: "EMP001",
      name: "Avesh Malek",
      email: "avesh@example.com",
      phone: "9876543210",
      department: "IT",
      designation: "Developer",
      role: "Employee",
      salary: 50000,
      joiningDate: "2023-06-15",
      address: "Mumbai, Maharashtra",
      profilePic: "/assets/default-user.png",
      status: "Active",
      createdAt: "2023-06-01",
    },
    {
      id: "EMP002",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876501234",
      department: "HR",
      designation: "HR Manager",
      role: "HR",
      salary: 65000,
      joiningDate: "2022-04-10",
      address: "Delhi, India",
      profilePic: "/assets/default-user.png",
      status: "Active",
      createdAt: "2022-04-01",
    },
  ],
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.list.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.list.findIndex(
        emp => emp.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...action.payload,
        };
      }
    },
    deleteEmployee: (state, action) => {
      state.list = state.list.filter(
        emp => emp.id !== action.payload
      );
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
