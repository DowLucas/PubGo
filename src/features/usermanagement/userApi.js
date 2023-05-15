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
      providesTags: (result, error, arg) => {
        console.log("result", result);
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: "userData", id })),
            { type: "userData", id: "LIST" },
          ];
        } else {
          return ["User"];
        }
      },
    }),
    fetchSingleUser: builder.query({
      queryFn: async (userInfo) => {
        try {

          const eventsRef = ref(database, `users/${userInfo.id}/userData`);
          const snapshot = await get(eventsRef);
          let userData = [];

          snapshot.forEach((childSnap) => {
            const obj = { id: childSnap.key, ...childSnap.val() };
            userData.push(obj);
          });

          console.log(userData);

          return { data: userData };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      queryFn: async (userData, { getState }) => {
        try {
          // Convert the Date object to an ISO string
          const user = getState().auth.user;
          if (!user) return { data: [] };

          console.log(user,"bla");

          const userRef = ref(database, `users/${user.uid}/userData`);
          // Concat the location to the end of the array of the savedLocations in the database
          let existingUserData = [];

          const snapshot = await get(userRef);
          
          snapshot.forEach((childSnap) => {
            const obj = { id: childSnap.key, ...childSnap.val() };
            existingUserData.push(obj);
          });

          const emailToFind = user.email;
          const emailCheck = existingUserData.find(user => user.email === emailToFind);
          if (emailCheck) {return { error: 'Email already exists' };}

          const updates = {
            email: user.email,
            name: user.displayName,
            kmMember: null,
            kmAdmin: null
          };

          await set(userRef, updates);

          return { data: { id: userRef.key, ...updates } };
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

          const updatedUserData = {
            name: userData.displayName,
            email: userData.email,
          };

          const userRef = ref(database, `users/${userData.uid}`);
          await update(userRef, updatedUserData);
          return { data: updatedUserData };
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
  useFetchSingleUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userApi;
