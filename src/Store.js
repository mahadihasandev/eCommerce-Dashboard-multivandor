import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './Slices/AuthSlices';
import { apiSlice } from './Slices/apiSlice';

export default configureStore({
  reducer: {
    activeUser: AuthSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});