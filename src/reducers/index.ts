import { createReducer } from "@reduxjs/toolkit";
import type { Account } from "../types";
import { addAccount, removeAccount } from "../actions";

interface State {
  accounts: Account[];
}

const initialState: State = {
  accounts: [],
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(addAccount, (state, action) => {
      if (
        state.accounts.find(
          (account) =>
            account.username === action.payload.username &&
            account.domain === action.payload.domain,
        )
      ) {
        return;
      }

      state.accounts.push(action.payload);
    })
    .addCase(removeAccount, (state, action) => {
      state.accounts = state.accounts.filter(
        (account) =>
          account.username !== action.payload.username ||
          account.domain !== action.payload.domain,
      );
    });
});
