import {
  createApi,
  fakeBaseQuery,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { ref, set, update, onValue, push, get } from "firebase/database";
import { database, auth } from "../../firebase";

// const customBaseQuery = fetchBaseQuery({
//   prepareHeaders(headers, { getState }) {
//     const userId = getState().auth.user.uid;

//     if (userId) {
//       headers.set("X-User-Id", userId);
//     }

//     return headers;
//   },
// });

export const savedLocationsApi = createApi({
  baseQuery: fetchBaseQuery,
  tagTypes: ["SaveLocations"],
  reducerPath: "savedLocationsApi",
  endpoints: (builder) => ({
    fetchSavedLocations: builder.query({
      queryFn: async (_, { getState }) => {
        try {
          // Get headers from the baseQuery
          const user = getState().auth.user;
          if (!user) return { data: [] };

          const eventsRef = ref(database, `users/${user.uid}/savedLocations`);
          const snapshot = await get(eventsRef);

          let savedLocations = [];

          snapshot.forEach((childSnap) => {
            const obj = { id: childSnap.key, ...childSnap.val() };
            savedLocations.push(obj);
          });

          return { data: savedLocations };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: (result, error, arg) => {
        console.log("result", result);
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: "SavedLocations", id })),
            { type: "SavedLocations", id: "LIST" },
          ];
        } else {
          return ["SaveLocations"];
        }
      },
    }),
    createSavedLocation: builder.mutation({
      queryFn: async (locationData, { getState }) => {
        try {
          // Convert the Date object to an ISO string
          console.log("locationData", locationData);
          const user = getState().auth.user;
          if (!user) return { data: [] };

          const locationRef = ref(database, `users/${user.uid}/savedLocations`);
          // Concat the location to the end of the array of the savedLocations in the database

          const newEventRef = push(locationRef);

          await set(newEventRef, locationData.payload);

          return { data: { id: newEventRef.key, ...locationData.payload } };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["SavedLocations"],
    }),
    deleteSavedLocation: builder.mutation({
      queryFn: async (eventData) => {
        try {
          const eventRef = ref(database, `events/${eventData.id}`);
          await update(eventRef, eventData);
          return { data: eventData };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["SavedLocations"],
    }),
  }),
});

export const {
  useFetchSavedLocationsQuery,
  useCreateSavedLocationMutation,
  useDeleteSavedLocationMutation,
} = savedLocationsApi;
