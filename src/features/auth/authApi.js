// authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    // omitted
  }),
});
