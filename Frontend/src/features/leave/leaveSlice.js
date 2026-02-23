// features/leave/leaveSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [
    {
      id: "L001",
      employeeId: "EMP001",
      name: "Avesh Malek",
      leaveType: "Sick",
      fromDate: "2026-02-01",
      toDate: "2026-02-03",
      description: "Fever and cold",
      status: "Pending",
    },
  ],
    summary: {
    taken: 5,
    remaining: 7,
  },
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    updateLeaveStatus: (state, action) => {
      const { id, status } = action.payload;
      const leave = state.requests.find(l => l.id === id);
      if (leave) leave.status = status;
    },

    approveAllLeaves: (state) => {
      state.requests.forEach(leave => {
        if (leave.status === "Pending") {
          leave.status = "Approved";
        }
      });
    },
  },
});

export const { updateLeaveStatus, approveAllLeaves } = leaveSlice.actions;
export default leaveSlice.reducer;
