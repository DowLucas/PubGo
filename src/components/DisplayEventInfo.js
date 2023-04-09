import React from "react";
import { Card, Text, Badge, Group, Divider } from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import BusyBar from "./BusyBar";

export default function DisplayEventInfo(props) {
  const event = props.event;

  return (
    <Card withBorder padding="lg" radius="md">
      <Group position="apart">
        <MantineLogo type="mark" size="2rem" />
        <Badge>12 days left</Badge>
      </Group>

      <Text fz="lg" fw={500} mt="md">
        {event.name || "Event Name"}
      </Text>
      <Text fz="sm" c="dimmed" mt={5}>
        {event.description}
      </Text>

      {/* Date display */}
      <Text fz="sm" c="dimmed" mt={5}>
        {new Date(event.startDateTime).toLocaleString()}
      </Text>

      <Divider mt="md" mb="md" />

      <BusyBar busyLevel={51} />
    </Card>
  );
}
