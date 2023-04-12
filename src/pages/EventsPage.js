import React, { useState } from "react";
import HomeMapView from "../features/events/HomeMapView";
import { Box, Button, Center } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconEye } from "@tabler/icons-react";
import SelectedEventMapView from "../features/events/SelectedEventMapView";
import {
  useCreateEventMutation,
  useFetchEventsQuery,
} from "../features/events/eventSlice";
import NavBar from "../features/navbar/NavBar";

const EventsPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  // const { data: highScoresTables, error, isLoading } = useFetchHighScoresTablesQuery();
  const { data: events, error, isLoading } = useFetchEventsQuery();
  const [createEvent, { isSuccess: createEventSuccess }] =
    useCreateEventMutation();

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const createRandomEvent = () => {
    const randomLat = Math.random() * (90 - -90) + -90;
    const randomLng = Math.random() * (180 - -180) + -180;
    const randomDate = new Date(
      Math.random() * (new Date().getTime() - new Date(2020, 0, 1).getTime()) +
        new Date(2020, 0, 1).getTime()
    );

    const newEvent = {
      name: "Random Event",
      description: "This is a random event",
      location: {
        latitude: randomLat.toString(),
        longitude: randomLng.toString(),
      },
      startDateTime: randomDate,
      endDateTime: randomDate,
    };
    createEvent(newEvent);
  };

  return (
    <div>
      <NavBar />
      <SegmentedControl
        data={[
          {
            value: "map",
            label: (
              <Center>
                <IconEye size="1rem" />
                <Box ml={10}>Map</Box>
              </Center>
            ),
            icon: <IconPhoto size="0.8rem" />,
          },
          {
            value: "list",
            label: "List View",
            icon: <IconMessageCircle size="0.8rem" />,
          },
        ]}
        color="pink"
        size="sm"
        radius={0}
        transitionDuration={220}
        transitionTimingFunction="ease"
        value={activeTab}
        onChange={handleTabChange}
        fullWidth
      />
      {activeTab === "map" && (
        <>
          <HomeMapView openDrawer={toggleInfo} events={events} />
          <SelectedEventMapView />
        </>
      )}
      {activeTab === "list" && <div>Messages tab content</div>}
    </div>
  );
};

export default EventsPage;
