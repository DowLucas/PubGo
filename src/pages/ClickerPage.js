import React, { useEffect } from "react";
import Clicker from "../features/clicker/Clicker";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, selectEvent } from "../features/events/selectedEventSlice";
import { useSetSelectedEvent } from "../features/events/actions/useSelectedEvent";
import Navbar from "../features/navbar/NavBar";

const ClickerPage = (props) => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const setSelectedEvent = useSetSelectedEvent();

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
      <Clicker eventId={eventId} />
    </>
  );
};

export default ClickerPage;
