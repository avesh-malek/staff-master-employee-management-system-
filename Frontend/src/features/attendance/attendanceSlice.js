// features/attendance/attendanceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [
    {
      date: "2024-02-01",
      checkIn: "09:05",
      checkOut: "18:00",
      status: "Present",
    },
    {
      date: "2024-02-02",
      status: "Absent",
    },
  ],
  summary: {
    present: 22,
    absent: 2,
  },
};


const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
});

export default attendanceSlice.reducer;
