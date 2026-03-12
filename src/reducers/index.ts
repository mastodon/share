import { createReducer } from "@reduxjs/toolkit";
import type { Domain } from "../types";
import { addDomain, clickDomain, removeDomain } from "../actions";

interface State {
  domains: Domain[];
}

const initialState: State = {
  domains: [],
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(addDomain, (state, action) => {
      const index = state.domains.findIndex(
        (domain) => domain.domain === action.payload.domain,
      );

      if (index !== -1) {
        state.domains[index].used += 1;
        state.domains[index].lastUsed = new Date().toString();
        return;
      }

      state.domains.push({
        domain: action.payload.domain,
        template: action.payload.template,
        used: 1,
        lastUsed: new Date().toString(),
      });
    })
    .addCase(clickDomain, (state, action) => {
      const index = state.domains.findIndex(
        (domain) => domain.domain === action.payload,
      );

      if (index !== -1) {
        state.domains[index].used += 1;
        state.domains[index].lastUsed = new Date().toString();
      }
    })
    .addCase(removeDomain, (state, action) => {
      state.domains = state.domains.filter(
        (domain) => domain.domain !== action.payload,
      );
    });
});
