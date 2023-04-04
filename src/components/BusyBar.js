import { Progress } from '@mantine/core';

export default function BusyBar({ busyLevel }) {
  let color;
  let label;

  if (busyLevel < 25) {
    color = 'green';
    label = 'Quite Busy';
  } else if (busyLevel < 50) {
    color = 'yellow';
    label = 'Busy';
  } else if (busyLevel < 75) {
    color = 'orange';
    label = 'Moderately Busy';
  } else {
    color = 'red';
    label = 'Very Busy';
  }

  return (
    <Progress
      size={20}
      radius="xl"
      sections={[{ value: busyLevel, color, label }]}
      aria-label={`Busy level: ${label}`}
    />
  );
}