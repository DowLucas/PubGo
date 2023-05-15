import React, { useState, useEffect } from "react";
import HomeMapView from "../features/events/HomeMapView";
import HomeListView from "../features/events/HomeListView"
import { Box, Button, Center, Drawer, Space} from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconEye } from "@tabler/icons-react";
import SelectedEventMapView from "../features/events/SelectedEventMapView";
import {
  useCreateEventMutation,
  useFetchEventsQuery,
} from "../features/events/eventSlice";
import NavBar from "../features/navbar/NavBar";
import { useSelector } from "react-redux";
import { useDisclosure } from '@mantine/hooks';
import DisplayEventInfo from "../components/DisplayEventInfo";
import { useSetSelectedEvent } from "../features/events/actions/useSelectedEvent";





const EventsPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  // const { data: highScoresTables, error, isLoading } = useFetchHighScoresTablesQuery();
  const { data: events, error, isLoading } = useFetchEventsQuery();
  const [createEvent, { isSuccess: createEventSuccess }] =
    useCreateEventMutation();
  const [opened, setDrawer] = useState(false);

  const setSelectedEvent = useSetSelectedEvent();
  const selectedEvent = useSelector((state) => state.selectedEvent);

  useEffect(() => {
    if (selectedEvent) {
      open();
    } else {
      close();
    }
  }, [selectedEvent, open, close]);


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

  const handleCloseDrawer = () => {
    setDrawer(false)
  };

  return (
    <div>
      <NavBar />
      <SegmentedControl
      style={{ position: "fixed", top: "0px", left: "0", right: "0", zIndex: "999" }}
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

          <HomeMapView openDrawer={toggleInfo} events={events}/>
          <Drawer opened={selectedEvent !== null && opened} onClose={handleCloseDrawer} size="md" position="bottom" withCloseButton={true}>
            <DisplayEventInfo event={selectedEvent} />
          </Drawer>

        </>
      )}
      {activeTab === "list" && <HomeListView events={events} />}
    </div>
  );
};

export default EventsPage;
