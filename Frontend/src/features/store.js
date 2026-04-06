import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import employeeReducer from "./employees/employeeSlice";
import attendanceReducer from "./attendance/attendanceSlice";
import attendanceExportReducer from "./attendanceExport/attendanceExportSlice";
import leaveReducer from "./leave/leaveSlice";
import announcementReducer from "./announcements/announcementSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    attendance: attendanceReducer,
    attendanceExport: attendanceExportReducer,
    leave: leaveReducer,
    announcements: announcementReducer,
  
  },
});

export default store;
