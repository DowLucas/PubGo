import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ref, set, update, onValue, push, get } from "firebase/database";
import { database } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

export const eventApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Event"],
  reducerPath: "eventApi",
  endpoints: (builder) => ({
    fetchEvents: builder.query({
      queryFn: async () => {
        try {
          const eventsRef = ref(database, "events");
          const snapshot = await get(eventsRef);
          let events = [];

          snapshot.forEach((childSnap) => {
            const obj = { id: childSnap.key, ...childSnap.val() };
            events.push(obj);
          });

          return { data: events };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Event"],
    }),
    createEvent: builder.mutation({
      queryFn: async (eventData) => {
        try {
          // Convert the Date object to an ISO string
          const updatedEventData = {
            ...eventData,
            clicker: {
              count: 0,
            },
            startDateTime: eventData.startDateTime.toISOString(),
            endDateTime: eventData.endDateTime.toISOString(),
          };

          const eventsRef = ref(database, "events");
          const newEventRef = push(eventsRef);

          // Only upload the banner if it exists
          if (eventData.banner !== null) {
            // Upload banner to Firebase Storage
            const storage = getStorage(); // Get Firebase Storage instance
            const storagePath = `event_banners/${newEventRef.key}`; // Set the storage path for the banner
            const bannerRef = storageRef(storage, storagePath); // Get a reference to the banner's storage location
            // Upload the banner file bytes
            await uploadBytes(bannerRef, eventData.banner);
            // Set the banner URL in the event data
            const bannerURL = await getDownloadURL(bannerRef);
            updatedEventData.banner = bannerURL;
          } else {
            updatedEventData.banner = null;
          }

          await set(newEventRef, updatedEventData);

          return { data: { id: newEventRef.key, ...updatedEventData } };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Event"],
    }),
    updateEvent: builder.mutation({
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
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useFetchEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventApi;
