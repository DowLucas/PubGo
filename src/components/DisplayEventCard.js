import { Card, Image, Text, Badge, Button, Group, Container, Spoiler, Divider, Progress} from '@mantine/core';
import { MantineLogo } from "@mantine/ds";
import BusyBar from './BusyBar';
import { useDispatch, useSelector } from "react-redux";
import { triggerDetailsUpdate, triggerMapUpdate } from '../features/directions/directionsSlice';
import { act } from 'react-dom/test-utils';
import { useSetSelectedEvent } from "../features/events/actions/useSelectedEvent";

export default function DisplayEventCard(props) {
  const dispatch = useDispatch()
  const setSelectedEvent = useSetSelectedEvent();

  const { event, setActiveTab } = props

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  function triggerShowDirections() {
    console.log("ping")
    handleTabChange("map")
    console.log("ping")
    dispatch(triggerMapUpdate())
    setSelectedEvent(event)
  }  
  
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
      <Container size="xs" px="xs">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section component="a">
            {event.banner ? (
              <Image
                src={event.banner}
                height={160}
                alt="Event Banner"
              />
            ) : (
              <Image
                src="https://www.kth.se/polopoly_fs/1.1144231.1645111858!/image/KTH%20Campus_P5M9240%202%20skuren_500_400_72dpi.jpeg"
                height={160}
                alt="KTH"
              />
            )}
            </Card.Section>
      
            {/*commented code is to display logo next to event name and date*/}
            <Group position="apart" mt="md" mb="xs">
              {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                <MantineLogo type="mark" size="2rem" style={{ marginRight: '8px' }} />
                <div>
                  <Text weight={500}>{event.name}</Text>
                  <Text fz="xs" c="dimmed">{new Date(event.startDateTime).toLocaleString()}</Text>
                </div>
              </div> */}
              <div>
                <Text weight={600}>{event.name}</Text>
                <Text fz="xs" c="dimmed">{new Date(event.startDateTime).toLocaleString()}</Text>
              </div>
              <Badge variant='outline' color={badgeColor}>
                {daysLeftText}
              </Badge>
            </Group>
      
            <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
              {event.description}
            </Spoiler>
            
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
            {/**This button should give directions*/}
            <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={triggerShowDirections}>
              Get directions
            </Button>
          </Card>
        </Container>
      );
}


