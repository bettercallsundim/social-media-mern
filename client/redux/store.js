import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./appSlice";
import postsReducer from "./postsSlice";
import userReducer from "./userSlice";

// const store = configureStore({
//   name: "donors",
//   reducer: donorReducer,
// });
//  const backend = "https://social-media-mern-backend.vercel.app";
//  const backend = "http://localhost:4000";
const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  posts: postsReducer,
  app: appReducer,
  user: userReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});
export default store;
export const persistor = persistStore(store);
