import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const backend = "https://social-media-mern-backend.vercel.app";
// const backend = "http://localhost:4000";
//async thunk data fetching
export const getPosts = createAsyncThunk("posts/getPosts", async (uid) => {
  const res = await fetch(
    `${backend}/post/getPosts/${uid}`,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.posts;
});
export const getFeedPosts = createAsyncThunk(
  "posts/getFeedPosts",
  async (uid) => {
    const res = await fetch(`${backend}/post/getFeedPosts/${uid}`, {
      credentials: "include",
    });
    const data = await res.json();
    return data.posts;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    loading: false,
    error: false,
    posts: [],
    feedPosts: [],
  },
  reducers: {
    // addPosts: (state, actions) => {
    //   state.data = actions.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.loading = false;
      action.payload.reverse();
      state.posts = action.payload;
      // console.log(state.posts);
    });

    builder.addCase(getPosts.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(getFeedPosts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getFeedPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.feedPosts = action.payload;
    });

    builder.addCase(getFeedPosts.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const {} = postsSlice.actions;
export default postsSlice.reducer;
