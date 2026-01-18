import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { tasksApi } from './api/tasksApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [tasksApi.reducerPath]: tasksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(tasksApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
