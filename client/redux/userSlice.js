import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const backend = "https://social-media-mern-backend.vercel.app";
// const backend = "http://localhost:4000";
//async thunk data fetching
export const getUsers = createAsyncThunk("user/getUsers", async () => {
  const res = await fetch(`${backend}/user/getUsers`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.users;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: false,
    users: [],
  },
  reducers: {
    // addPosts: (state, actions) => {
    //   state.data = actions.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });

    builder.addCase(getUsers.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
