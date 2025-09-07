import { createAction } from "@reduxjs/toolkit";
import type { Account } from "../types";

export const addAccount = createAction<Account>("accounts/add");

export const removeAccount =
  createAction<Pick<Account, "username" | "domain">>("accounts/remove");
