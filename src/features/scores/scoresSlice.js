import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ref, set, update, onValue, push, get } from "firebase/database";
import { database } from "../../firebase";

export const realtimeDatabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Score"],
  endpoints: (builder) => ({
    fetchHighScoresTables: builder.query({
      queryFn: async () => {
        try {
          const scoresTablesRef = ref(database, "scoresTables");
          const snapshot = await get(scoresTablesRef); 
          let scoresTables = []; 

          snapshot.forEach((childSnap) => {
            console.log(childSnap.key, childSnap.val());
            const obj = { id: childSnap.key, ...childSnap.val() };
            scoresTables.push(obj); 
          });

          return { data: scoresTables };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Score"],
    }),
    setNewHighScore: builder.mutation({
      queryFn: async ({ scoresTableId, newHighScore }) => {
        try {
          const newHighScoreRef = ref(
            database,
            `scoresTables/${scoresTableId}/scores`
          );
          await push(newHighScoreRef, newHighScore);
          return { data: null };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Score"],
    }),
    createScoresTable: builder.mutation({
      queryFn: async ({ tableName }) => {
        try {
          const scoresTablesRef = ref(database, "scoresTables");
          const newScoresTableRef = push(scoresTablesRef);
          await set(newScoresTableRef, {
            name: tableName,
            scores: [],
          });
          return {
            data: { id: newScoresTableRef.key, name: tableName, scores: [] },
          };
        } catch (error) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Score"],
    }),
  }),
});

export const {
  useFetchHighScoresTablesQuery,
  useSetNewHighScoreMutation,
  useCreateScoresTableMutation,
} = realtimeDatabaseApi;
