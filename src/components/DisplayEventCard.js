import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import BusyBar from './BusyBar';



export default function DisplayEventCard(props) {
    const { event } = props

    const eventStartDate = new Date(event.startDateTime);
    const eventEndDate = new Date(event.endDateTime);
    const today = new Date();
    const eventInProgress = today >= eventStartDate && today <= eventEndDate;
    const daysLeft = Math.ceil((eventStartDate - today) / (1000 * 60 * 60 * 24));
    const badgeColor =
      daysLeft > 7
        ? "red"
        : eventInProgress
        ? "green"
        : "blue";

    let daysLeftText;
    if (eventInProgress) {
        daysLeftText = "Ongoing";
    } else if (daysLeft < 0) {
        daysLeftText = "Passed";
    } else {
        daysLeftText = `${daysLeft} days left`;
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section component="a">
            <Image
              src="https://www.kth.se/polopoly_fs/1.1144231.1645111858!/image/KTH%20Campus_P5M9240%202%20skuren_500_400_72dpi.jpeg"
              height={160}
              alt="Kth"
            />
          </Card.Section>
    
          <Group position="apart" mt="md" mb="xs">
            <div>
                <Text weight={500}>{event.name}</Text>
                <Text fz="xs" c="dimmed">{new Date(event.startDateTime).toLocaleString()}</Text>
            </div>
            <Badge variant="outline" color={badgeColor}>
                {daysLeftText}
            </Badge>
          </Group>
    
          <Text size="sm" color="dimmed">
            {event.description}
          </Text>
          
    
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Get directions
          </Button>
        </Card>
      );
}


