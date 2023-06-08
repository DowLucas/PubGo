import React, { useEffect } from "react";
import Clicker from "../features/clicker/ClickerView";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateClickerMutation } from "../features/clicker/clickerApi";
import { fetchEvent, selectEvent } from "../features/events/selectedEventSlice";
import { useSetSelectedEvent } from "../features/events/actions/useSelectedEvent";
import Navbar from "../features/navbar/NavBar";
import { database } from "../firebase";
import { setClickerValue } from "../features/clicker/clickerSlice";
import { off, onValue, ref } from "firebase/database";

const ClickerPage = (props) => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const setSelectedEvent = useSetSelectedEvent();

  const clickerValue = useSelector((state) => state.clicker.value);

  const [updateClicker] = useUpdateClickerMutation();
  const onIncrease = () => {
    updateClicker({ eventId, increment: 1 });
  };

  const onDecrease = () => {
    updateClicker({ eventId, increment: -1 });
  };

  useEffect(() => {
    const clickerRef = ref(database, `events/${eventId}/clicker/count`);
    const unsubscribe = onValue(clickerRef, (snapshot) => {
      const newValue = snapshot.val() || 0;
      dispatch(setClickerValue(newValue));
    });

    return () => {
      off(clickerRef, unsubscribe);
    };
  }, [eventId, dispatch]);

  const selectedEvent = useSelector((state) => state.selectedEvent);

  useEffect(() => {
    const fetch = async () => {
      // Find the event with the eventId in the URL
      // Set the event in the redux store
      const event = await fetchEvent(eventId);
      setSelectedEvent(event);
    };
    fetch();
  }, [eventId, setSelectedEvent]);

  return (
    <>
      <Navbar />
      <Clicker onIncrease={onIncrease} onDecrease={onDecrease} selectedEvent={selectedEvent} clickerValue={clickerValue}/>
    </>
  );
};

export default ClickerPage;
