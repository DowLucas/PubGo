import React from "react";
import { Card, Text, Badge, Group, Divider, Spoiler, Button } from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import BusyBar from "./BusyBar";
import { useDispatch, useSelector } from "react-redux";
import { triggerDetailsUpdate, triggerMapUpdate } from '../features/directions/directionsSlice';

export default function DisplayEventInfo(props) {
  const dispatch = useDispatch()

  function triggerShowDirections() {
    dispatch(triggerMapUpdate())
    dispatch(triggerDetailsUpdate())
  }

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


  let eventBusyLevel = 75
  let eventCount = 75
  if(event.clicker) {
    eventBusyLevel = Math.floor(event.clicker.count/event.location.capacity)*100;
    eventCount = event.clicker.count;
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
      
      {event.showEventBusyness && isEventToday && (
      <div style={{marginBottom: "10px", marginTop: "10px"}}>
        <BusyBar busyLevel={eventBusyLevel} />
      </div>)}

      {event.showNumberOfGuests && isEventToday &&(
      <div>
        <Text fz="sm" mt="md">
          Current number of guests:{' '}
          <Text span fw={500}>
            {eventCount}/{event.capacity}
          </Text>
        </Text>
      </div>

      )}

      <Divider mt="md" mb="md" />
      <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={triggerShowDirections}>
        Get directions
      </Button>
    </div>
  );
}
