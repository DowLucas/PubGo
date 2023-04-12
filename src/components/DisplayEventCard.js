import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import BusyBar from './BusyBar';



export default function DisplayEventCard(props) {
    const { event } = props
    console.log(event)
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
            <Text weight={500}>{event.name}</Text>
            {event.showEventBusyness && (
                <Badge color="red" variant="light">
                    Busy
                </Badge>
            )}
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


