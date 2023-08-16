import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import appReducer from "./appSlice";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// const store = configureStore({
//   name: "donors",
//   reducer: donorReducer,
// });

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
