import { createAction } from "@reduxjs/toolkit";
import type { Domain } from "../types";

export const addDomain =
  createAction<Pick<Domain, "domain" | "template">>("accounts/add");

export const clickDomain = createAction<string>("accounts/use");

export const removeDomain = createAction<string>("accounts/remove");
