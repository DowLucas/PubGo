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
            const obj = { uid: childSnap.key, ...childSnap.val() };
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
            ...result.map(({ uid }) => ({ type: "userData", uid })),
            { type: "userData", uid: "LIST" },
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
    // createUser: builder.mutation({
    //   queryFn: async (user) => {
    //     try {

    //       console.log(user)

    //       const userRef = ref(database, `users/${user.uid}/userData`);

    //       await set(userRef, user);

    //       return { data: { uid: userRef.key, ...user } };
    //     } catch (error) {
    //       console.error(error.message);
    //       return { error: error.message };
    //     }
    //   },
    //   invalidatesTags: ["User"],
    // }),
    updateUser: builder.mutation({
      queryFn: async ({ userData, newData }) => {
        try {
          if (!userData || !userData.uid) {
            throw new Error('Cannot update non-existen user');
          }
          const userRef = ref(database, `users/${userData.uid}`);
          await update(userRef, newData);

          const eventsRef = ref(database, `users/${userData.uid}/userData`);
          const snapshot = await get(eventsRef);
          const userObj = {};

          snapshot.forEach((childSnap) => {
            userObj[childSnap.key] = childSnap.val();
          });

          return { data: {uid: userData.uid, userData: userObj} };
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
  createUser,
} = userApi;
