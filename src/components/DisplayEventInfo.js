import React from "react";
import { Card, Text, Badge, Group, Divider, Spoiler, Button } from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import BusyBar from "./BusyBar";

export default function DisplayEventInfo(props) {
  const event = props.event;
  if(!event) return;

  const eventStartDate = new Date(event.startDateTime);
  const eventEndDate = new Date(event.endDateTime);
  const today = new Date();

  const isEventToday =
        eventStartDate.getDate() === today.getDate() &&
        eventStartDate.getMonth() === today.getMonth() &&
        eventStartDate.getFullYear() === today.getFullYear();
  const eventInProgress = today >= eventStartDate && today <= eventEndDate;
  const daysLeft = Math.ceil((eventStartDate - today) / (1000 * 60 * 60 * 24));
  const badgeColor =
    daysLeft > 7
      ? "red"
      : eventInProgress
      ? "green"
      : isEventToday
      ? "teal"
      : "blue";

  let daysLeftText;
  const timeDiff = eventStartDate - today;
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  if (eventInProgress) {
      daysLeftText = "Ongoing";
  } else if (timeDiff <= 0) {
      daysLeftText = "Passed";
  } else if (timeDiff < 60 * 60 * 1000) {
      const minutesLeft = Math.floor(timeDiff / (1000 * 60));
      daysLeftText = `${minutesLeft} minutes left`;
  } else if (timeDiff < 24 * 60 * 60 * 1000) {
      daysLeftText = `${hoursLeft} hours left`;
  } else {
      daysLeftText = `${daysLeft} days left`;
  }

  return (
    <div>
      <Group position="apart" mb="xs">
        <div style={{display: 'flex', alignItems: 'center'}}>
          <MantineLogo type="mark" size="2rem" />
          <div>
            <Text fz="lg" ml="xs" fw={500}>
              {event.name || "Event Name"}
            </Text>
            <Text fz="xs" ml="xs" c="dimmed">
              {new Date(event.startDateTime).toLocaleString()}
            </Text>
          </div>
        </div>
        <Badge variant='outline' color={badgeColor}>
            {daysLeftText}
        </Badge>
      </Group>
      <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
              {event.description}
      </Spoiler>
      <Divider mt="md" mb="md" />
      <BusyBar busyLevel={51} />
      <Divider mt="md" mb="md" />
      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Get directions
      </Button>
    </div>
  );
}
