import { Card, Image, Text, Badge, Button, Group, Container } from '@mantine/core';
import { MantineLogo } from "@mantine/ds";
import BusyBar from './BusyBar';



export default function DisplayEventCard(props) {
    const { event } = props

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
      <Container size="xs" px="xs">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section component="a">
              <Image
                src="https://www.kth.se/polopoly_fs/1.1144231.1645111858!/image/KTH%20Campus_P5M9240%202%20skuren_500_400_72dpi.jpeg"
                height={160}
                alt="Kth"
              />
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
                <Text weight={500}>{event.name}</Text>
                <Text fz="xs" c="dimmed">{new Date(event.startDateTime).toLocaleString()}</Text>
              </div>
              <Badge variant='outline' color={badgeColor}>
                {daysLeftText}
              </Badge>
            </Group>
      
            <Text size="sm">
              {event.description}
            </Text>
            
            {event.showEventBusyness && isEventToday && (
            <div style={{marginBottom: "10px", marginTop: "10px"}}>
              <BusyBar busyLevel={70} />
            </div>)}
            {/**This button should give directions*/}
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Get directions
            </Button>
          </Card>
        </Container>
      );
}


