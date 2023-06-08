import React from "react";
import styles from "./Clicker.module.css";
import { Paper, Text } from "@mantine/core";

const Clicker = (props) => {
  const { 
    onIncrease,
    onDecrease,
    selectedEvent,
    clickerValue
   } = props;

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
