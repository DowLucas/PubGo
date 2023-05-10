import { Card, Button, Container, Title, Text, Group, Badge} from '@mantine/core';

export default function DisplayEventBox(props) {
    const { event } = props
    return (
        <Card shadow="sm" pt="xs" pb="xs" radius="md" withBorder pl="xl" pr="xl" w={300}>
            <Group position="apart">
                <Text weight={600}>{event.name}</Text>
                <Badge variant='outline' color="blue">
                    17 days left
                </Badge>
            </Group>
            <Group mt="md" position="apart">
                <Button>Edit event</Button>           
                <Button color='green'>Open clicker</Button>
            </Group>

        </Card>
      );
}


