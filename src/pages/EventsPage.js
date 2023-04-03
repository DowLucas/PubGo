import React, { useState } from "react";
import HomeMapView from "../features/events/HomeMapView";
import { Box, Center, Drawer } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
  IconEye,
} from "@tabler/icons-react";

const EventsPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div>
      <SegmentedControl
        data={[
          {
            value: 0,
            label: (
              <Center>
                <IconEye size="1rem" />
                <Box ml={10}>Preview</Box>
              </Center>
            ),
            icon: <IconPhoto size="0.8rem" />,
          },
          {
            value: 1,
            label: "List View",
            icon: <IconMessageCircle size="0.8rem" />,
          },
        ]}
        color="pink"
        radius={0}
        transitionDuration={500}
        transitionTimingFunction="ease"
        value={activeTab}
        onChange={handleTabChange}
        fullWidth
      />
      {activeTab === 0 && (
        <>
          <HomeMapView openDrawer={toggleInfo} />
          <Drawer
            opened={showInfo}
            onClose={toggleInfo}
            size="xs"
            padding="md"
            zIndex={1}
            withOverlay={false}
            position="bottom"
            title="Information about the place and event"
          >
            {/* ... */}
          </Drawer>
        </>
      )}
      {activeTab === 1 && <div>Messages tab content</div>}
    </div>
  );
};

export default EventsPage;
