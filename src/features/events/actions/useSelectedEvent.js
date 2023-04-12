import { useDispatch } from "react-redux";
import { selectEvent } from "../selectedEventSlice";
import { directionsArrivalDestination } from "../../directions/directionsSlice";

export const useSetSelectedEvent = () => {
  const dispatch = useDispatch();

  const setSelectedEvent = (event) => {
    dispatch(selectEvent(event))
    dispatch(directionsArrivalDestination({lat: event.location.lat, lng: event.location.lng,}))
    console.log(event)
  };

  return setSelectedEvent;
};