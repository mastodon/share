import { createAction } from "@reduxjs/toolkit";

export const addDomain = createAction<string>("accounts/add");

export const removeDomain = createAction<string>("accounts/remove");
