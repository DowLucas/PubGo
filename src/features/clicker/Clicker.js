import { Center, Container } from "@mantine/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Clicker.module.css";
import { Paper, Text } from "@mantine/core";
import Loader from "../../components/loader";
import { useUpdateClickerMutation } from "./clickerApi";
import { setClickerValue } from "./clickerSlice";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const Clicker = (props) => {
  const { eventId } = props;
  const dispatch = useDispatch();
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

  if (!selectedEvent) {
    // return <Loader />;
    return <div></div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <div className={styles.counter}>
        <Text align="center" size="xl" className={styles.title}>
          {selectedEvent.name}
        </Text>
        <Paper
          padding="xl"
          className={`${styles.counterSection} ${styles.increase}`}
          onClick={onIncrease}
        >
          <Text align="center" size="xl" className={styles.textSection}>
            +1
          </Text>
        </Paper>
        <Text align="center" size="xxl" className={styles.countTextSection}>
          {clickerValue}
        </Text>
        <Paper
          padding="xl"
          className={`${styles.counterSection} ${styles.decrease}`}
          onClick={onDecrease}
        >
          <Text align="center" size="xl" className={styles.textSection}>
            -1
          </Text>
        </Paper>
      </div>
    </div>
  );
};

export default Clicker;
