import React, { useState, useEffect } from "react";
import HomeMapView from "../features/events/HomeMapView";
import HomeListView from "../features/events/HomeListView";
import {
  Box,
  Center,
  Drawer,
  LoadingOverlay,
} from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconEye } from "@tabler/icons-react";
import { useFetchEventsQuery } from "../features/events/eventSlice";
import {
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { directionsCurrentLocation } from "../features/directions/directionsSlice";
import NavBar from "../features/navbar/NavBar";
import { useSelector, useDispatch } from "react-redux";
import DisplayEventInfo from "../components/DisplayEventInfo";
import { useSetSelectedEvent } from "../features/events/actions/useSelectedEvent";
import { triggerDetailsUpdate } from "../features/directions/directionsSlice";

const EventsPage = () => {
  const [markers, setMarkers] = useState([]);
  const [markerClicked, setMarkerClicked] = useState(false);
  const [endLocation, setEndLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const { data: events, error, isLoading } = useFetchEventsQuery();
  const [opened, setDrawer] = useState(false);
  const setSelectedEvent = useSetSelectedEvent();
  const selectedEvent = useSelector((state) => state.selectedEvent);
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [directionsService, setDirectionsService] = useState(null);
  const currentLocation = useSelector(
    (state) => state.directions.currentLocation
  );
  const triggerDrawerState = useSelector(
    (state) => state.directions.triggerDetailsAction
  );
  const { isLoaded } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
    //libraries: ['places'],
  });
  const dispatch = useDispatch();
  const triggerState = useSelector(
    (state) => state.directions.triggerMapAction
  );

  const [localTriggerDrawerState, setLocalTriggerDrawerState] = useState(triggerDrawerState);
  const [localTriggerState, setLocalTriggerState] = useState(triggerState);


  useEffect(() => {
    if (triggerDrawerState != localTriggerDrawerState) {
      if (opened) {
        setDrawer(false);
      } else {
        setDrawer(true);
      }
      setLocalTriggerDrawerState(triggerDrawerState);
    }
  }, [triggerDrawerState]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleCloseDrawer = () => {
    setDrawer(false);
  };

  function triggerDrawerOpen() {
    console.log("ping3");
    dispatch(triggerDetailsUpdate());
  }

  const loadMarkers = () => {
    if (!events) return null;
    let markers = [];

    const filteredEvents = events.filter(
      (event) => new Date(event.endDateTime) > new Date()
    );

    filteredEvents.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      markers.push(
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => {
            setSelectedEvent(event);
            triggerDrawerOpen();
            setMarkerClicked(true);
            setEndLocation({ lat: latitude, lng: longitude });
          }}
        />
      );
    });
    setMarkers(markers);
  };

  function handleNearestPub() {
    triggerDrawerOpen();
    clearRoute();
    const nearestMarker = findNearestMarker(currentLocation);
    if (nearestMarker) {
      const latitude = parseFloat(nearestMarker.location.lat);
      const longitude = parseFloat(nearestMarker.location.lng);
      const markerLocation = { lat: latitude, lng: longitude };

      setEndLocation(markerLocation);
      setSelectedEvent(nearestMarker);
    }
  }

  async function calculateRoute(endLocation) {
    if (!directionsService) return;

    const results = await directionsService.route({
      origin: currentLocation,
      destination: endLocation,
      travelMode: google.maps.TravelMode.WALKING, // eslint-disable-line
    });
    setDirections(results); 
    setStartLocation(currentLocation); 
    return results.routes[0].legs[0].distance.value;
  }

  function clearRoute() {
    setDirections(null);
    setEndLocation(null);
    setShowRoute(false);
  }

  function findNearestMarker(currentLocation) {
    if (!events) return null;

    const filteredEvents = events.filter(
      (event) => new Date(event.endDateTime) > new Date()
    );

    let nearestMarker = null;
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    filteredEvents.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);
      const markerLocation = { lat: latitude, lng: longitude };
      const R = 6371; // Radius of the earth in km
      const dLat = ((markerLocation.lat - currentLocation.lat) * Math.PI) / 180;
      const dLon = ((markerLocation.lng - currentLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((currentLocation.lat * Math.PI) / 180) *
          Math.cos((markerLocation.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Distance in meters

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestMarker = event;
      }
    });

    return nearestMarker;
  }

  useEffect(() => {
    if (isLoaded) {
      loadMarkers();
      console.log("Google Maps API loaded"); // add this line
    }
  }, [isLoaded, events]);

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            directionsCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
        },
        () => console.error("Could not fetch location, check permissions.")
      );
    };

    const handleError = (error) => {
      console.error(error);
    };

    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (permissionStatus) {
        if (permissionStatus.state === "granted") {
          // Geolocation permission has been granted
          fetchLocation();
        } else if (permissionStatus.state === "prompt") {
          // The user will be prompted for geolocation permission
          navigator.geolocation.getCurrentPosition(fetchLocation, handleError);
        } else {
          // Geolocation permission has been denied
          console.error("Geolocation permission denied");
        }
      });

    const intervalId = setInterval(fetchLocation, 5000); // Run fetchLocation every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [directions, dispatch]);

  useEffect(() => {
    if (selectedEvent !== null) {
      setSelectedEvent(selectedEvent);
      const latitude = parseFloat(selectedEvent.location.lat);
      const longitude = parseFloat(selectedEvent.location.lng);
      setEndLocation({ lat: latitude, lng: longitude });
      console.log(endLocation);
      console.log({ lat: latitude, lng: longitude });
      clearRoute();
      calculateRoute({ lat: latitude, lng: longitude });
      setShowRoute(true);
    }

    setLocalTriggerState(triggerState);

    console.log("Try to show directions");
  }, [triggerState]);

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line
      setDirectionsService(new google.maps.DirectionsService());
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  return (
    <div>
      <NavBar />
      <SegmentedControl
        style={{
          position: "fixed",
          top: "0px",
          left: "0",
          right: "0",
          zIndex: "999",
        }}
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
          <HomeMapView
            markers={markers}
            markerClicked={markerClicked}
            setMarkerClicked={setMarkerClicked}
            clearRoute={clearRoute}
            directions={directions}
            showRoute={showRoute}
            handleNearestPub={handleNearestPub}
          />
          <Drawer
            opened={selectedEvent !== null && opened}
            onClose={handleCloseDrawer}
            size="md"
            position="bottom"
            withCloseButton={true}
          >
            <DisplayEventInfo event={selectedEvent} />
          </Drawer>
        </>
      )}
      {activeTab === "list" && (
        <HomeListView events={events} setActiveTab={setActiveTab} />
      )}
    </div>
  );
};

export default EventsPage;
