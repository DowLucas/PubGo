import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ref, set, update, onValue, push, get } from "firebase/database";
import { database } from "../../firebase";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

export const userApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  reducerPath: "userApi",
  endpoints: (builder) => ({
    fetchUser: builder.query({
      queryFn: async () => {
        try {
          const eventsRef = ref(database, "users");
          const snapshot = await get(eventsRef);
          let users = [];

          snapshot.forEach((childSnap) => {
            const obj = { id: childSnap.key, ...childSnap.val() };
            users.push(obj);
          });

          return { data: users };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      queryFn: async (userData) => {
        try {
          // Convert the Date object to an ISO string
          const updatedUserData = {
            ...userData,
            clicker: {
              count: 0,
            },
            startDateTime: userData.startDateTime.toISOString(),
            endDateTime: userData.endDateTime.toISOString(),
          };

          const eventsRef = ref(database, "users");
          const newEventRef = push(eventsRef);

          // Upload banner to Firebase Storage
          const storage = getStorage(); // Get Firebase Storage instance
          const storagePath = `event_banners/${newEventRef.key}`; // Set the storage path for the banner
          const bannerRef = storageRef(storage, storagePath); // Get a reference to the banner's storage location

          // Upload the banner file bytes
          await uploadBytes(bannerRef, userData.banner);

          // Set the banner URL in the event data
          const bannerURL = await getDownloadURL(bannerRef);
          updatedUserData.banner = bannerURL;

          await set(newEventRef, updatedUserData);

          return { data: { id: newEventRef.key, ...updatedUserData } };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      queryFn: async (userData) => {
        try {
          const eventRef = ref(database, `events/${userData.id}`);
          await update(eventRef, userData);
          return { data: userData };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useFetchUserQuery,
  //useCreateEventMutation,
  //useUpdateEventMutation,
} = userApi;
