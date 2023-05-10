import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ref, set, onValue, runTransaction } from "firebase/database";
import { database } from "../../firebase";

export const clickerApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Clicker"],
  reducerPath: "clickerApi",
  endpoints: (builder) => ({
    fetchClicker: builder.query({
      queryFn: (eventId, { signal }) => {
        try {
          const clickerRef = ref(database, `events/${eventId}/clicker/count`);
          let clickerValue = 0;
          const unsubscribe = onValue(clickerRef, (snapshot) => {
            clickerValue = snapshot.val() || 0;
          });

          // Listen for the abort event and stop listening for data updates when it occurs
          signal.addEventListener("abort", unsubscribe);

          return { data: clickerValue };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Clicker"],
    }),
    updateClicker: builder.mutation({
      queryFn: async ({ eventId, increment }) => {
        try {
          const clickerRef = ref(database, `events/${eventId}/clicker/count`);
          let newValue;
          await runTransaction(clickerRef, (currentValue) => {
            newValue = (currentValue || 0) + increment;
            return newValue;
          });
          return { data: newValue };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Clicker"],
    }),
  }),
});

export const { useFetchClickerQuery, useUpdateClickerMutation } = clickerApi;
