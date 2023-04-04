import { useDispatch } from "react-redux";
import { selectEvent } from "../selectedEventSlice";

export const useSetSelectedEvent = () => {
  const dispatch = useDispatch();

  const setSelectedEvent = (event) => {
    dispatch(selectEvent(event));
  };

  return setSelectedEvent;
};