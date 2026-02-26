import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import employeeReducer from "./employees/employeeSlice";
import attendanceReducer from "./attendance/attendanceSlice";
import leaveReducer from "./leave/leaveSlice";
import announcementReducer from "./announcements/announcementSlice";
import adminNotificationReducer from "./notifications/adminNotificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    announcements: announcementReducer,
    adminNotifications: adminNotificationReducer,
  },
});

export default store;
