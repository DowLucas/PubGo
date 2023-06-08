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

          if (!userInfo) {
            return { data: null };
          }

          const eventsRef = ref(database, `users/${userInfo.uid}/userData`);
          const snapshot = await get(eventsRef);
          const userObj = {uid: userInfo.uid};

          snapshot.forEach((childSnap) => {
            userObj[childSnap.key] = childSnap.val();
          });

          return { data: userObj };
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
          
          const user = getState().auth.user;
          if (!user) return { data: [] };

          const userRef = ref(database, `users/${user.uid}/userData`);
          
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
      queryFn: async ({ userData, newData }) => {
        try {

          if (!userData || !userData.id) {
            throw new Error('User does not exist');
          }
          const userRef = ref(database, `users/${userData.id}`);
          await update(userRef, newData);

          const eventsRef = ref(database, `users/${userData.id}/userData`);
          const snapshot = await get(eventsRef);
          const userObj = {};

          snapshot.forEach((childSnap) => {
            userObj[childSnap.key] = childSnap.val();
          });

          return { data: {uid: userData.id, userData: userObj} };
        } catch (error) {
          console.error(error);
          return { error: error };
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
