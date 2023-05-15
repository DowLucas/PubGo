import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, set, update, onValue, push, get } from "firebase/database";
import { database } from "../../firebase";

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

export const fetchEvent = async (eventId) => {
  try {
    const eventRef = ref(database, `events/${eventId}`);
    const snapshot = await get(eventRef);
    if (!snapshot.exists()) {
      throw new Error(`Event with id ${eventId} does not exist`);
    }
    const event = { id: snapshot.key, ...snapshot.val() };

    return event;
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
};

const selectedEventSlice = createSlice({
  name: "selectedEvent",
  initialState: null,
  reducers: {
    selectEvent: (state, action) => {
      console.log("action", action);
      return action.payload;
    },
    clearSelectedEvent: () => {
      return null;
    },
  },
});

export const { selectEvent, clearSelectedEvent } = selectedEventSlice.actions;
export default selectedEventSlice.reducer;
