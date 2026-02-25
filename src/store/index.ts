import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import rootReducer from "../reducers";

const SCHEMA_VERSION = 1;

const STORAGE_KEY = `state-${SCHEMA_VERSION}`;

const saveState = (state: RootState) => {
  const json = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, json);
};

const loadState = (): RootState | undefined => {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : undefined;
};

const preloadedState = loadState();

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
