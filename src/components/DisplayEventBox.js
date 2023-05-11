import { Card, Button, Text, Group, Badge, Progress} from '@mantine/core';
import { useNavigate } from "react-router";


export default function DisplayEventBox({ event }) {
    const navigate = useNavigate();

    const handlePageChange = () => {
        navigate(`/events/${event.id}/clicker`);    
    };

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

    let eventCount = 0
    if(event.clicker) eventCount = event.clicker.count

    return (
        <Card shadow="sm" pt="xs" pb="xs" radius="md" withBorder pl="xl" pr="xl" w={350}>
            <Group position="apart">
                <Text weight={600}>{event.name}</Text>
                <Badge variant='outline' color={badgeColor}>
                    {daysLeftText}
                </Badge>
            </Group>
            <Text c="dimmed" fz="sm" mt="md">
                Number of guests:{' '}
                <Text
                span
                fw={500}
                sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
                >
                {eventCount}/{event.location.capacity}
                </Text>
                <Progress value={(eventCount / event.location.capacity) * 100} mt={5} />
            </Text>
            <Group mt="sm" position="apart" grow>
                <Button>Edit event</Button>           
                <Button color="green" onClick={() => navigate(`/events/${event.id}/clicker`)}>Open clicker</Button>
            </Group>
        </Card>
      );
}


