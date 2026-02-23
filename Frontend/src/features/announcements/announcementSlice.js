// features/announcements/announcementSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: "A001",
      title: "Office Holiday",
      message: "Office will remain closed on Friday",
      date: "2026-02-05",
    },
  ],
};

const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    addAnnouncement: {
      reducer: (state, action) => {
        state.list.unshift(action.payload);
      },
      prepare: (title, message) => ({
        payload: {
          id: nanoid(),
          title,
          message,
          date: new Date().toISOString().split("T")[0],
        },
      }),
    },

    deleteAnnouncement: (state, action) => {
      state.list = state.list.filter(
        (a) => a.id !== action.payload
      );
    },
  },
});

export const {
  addAnnouncement,
  deleteAnnouncement,
} = announcementSlice.actions;

export default announcementSlice.reducer;
