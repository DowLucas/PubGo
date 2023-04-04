import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createEvent, fetchEvents, updateEvent } from "./eventSlice";

// define a thunk action that will be dispatched on marker click
export const onMarkerClick = createAsyncThunk(
  "events/onMarkerClick",
  (markerData, thunkAPI) => {
    const { dispatch } = thunkAPI;
    // you can now dispatch any other actions or call any API functions here
    // for example, you can fetch the details of the selected pub and update your state
    // dispatch(fetchPubDetails(markerData.pubId));
  }
);

const selectedEventSlice = createSlice({
  name: "selectedEvent",
  initialState: null,
  reducers: {
    selectEvent: (state, action) => {
      return action.payload;
    },
    clearSelectedEvent: () => {
      return null;
    },
  },
});

export const { selectEvent, clearSelectedEvent } = selectedEventSlice.actions;
export default selectedEventSlice.reducer;
