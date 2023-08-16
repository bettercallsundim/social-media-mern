import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    dark: false,
    user: null,
    buttonClicked: 0,
  },
  reducers: {
    toggleDark: (state, actions) => {
      state.dark = !state.dark;
    },
    setUser: (state, actions) => {
      state.user = actions.payload;
      console.log(state.user);
    },
    removeUser: (state) => {
      state.user = null;
      state.buttonClicked = 0;
    },
    incButton: (state) => {
      state.buttonClicked += 1;
    },
  },
});

export const { toggleDark, setUser, removeUser, incButton } = appSlice.actions;
export default appSlice.reducer;
