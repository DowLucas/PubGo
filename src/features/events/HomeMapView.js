import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { LoadingOverlay, createStyles } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";
import { KTHCenter, mapStyles } from "../../utils/const";
import { useDispatch } from "react-redux";
import { directionsCurrentLocation } from "../directions/directionsSlice";

const useStyles = createStyles((theme) => ({
  mapWrapper: {
    width: "100vw",
    height: "60vh",
  },
}));

const HomeMapView = (props) => {
  const { classes } = useStyles();
  const { events } = props;

  const dispatch = useDispatch()

  const setSelectedEvent = useSetSelectedEvent();
  // const setCurrentLocation = useSetCurrentLocation();

  //const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Directions state
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState({ lat: 59.346415, lng: 18.067729 });
  const [endLocation, setEndLocation] = useState({ lat: 59.346707, lng: 18.072127 });
  const [showRoute, setShowRoute] = useState(false);


  function openDrawer() {
    props.openDrawer();
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
    //libraries: ['places'],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(directionsCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        () => console.error("Could not fetch location, check permissions.")
      );
    } else {
      alert("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      loadMarkers();
    }
  }, [isLoaded, events]);

  if (!isLoaded) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  const loadMarkers = () => {
    if (!events) return null;
    let markers = [];

    events.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      markers.push(
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => setSelectedEvent(event)}
        />
      );
    });

    setMarkers(markers);
  };

  async function calculateRoute() {
    const directionsService = new google.maps.DirectionsService() // eslint-disable-line
    const results = await directionsService.route({
      origin: startLocation,
      destination: endLocation,
      travelMode: google.maps.TravelMode.DRIVING // eslint-disable-line
    })
    setDirections(results)
  }

  // const directionsCallback = (response) => {
  //   console.log("respons " + response)
  //   if (response !== null) {
  //     setDirections(response);
  //   }
  // }

//   // define your event handler to set origin and destination
// const handleDirections = () => {
//   // set origin and destination
//   console.log("before " + startLocation)

//   //setStartLocation({ lat: 59.346415, lng: 18.067729 });
//   //setEndLocation({ lat: 59.346707, lng: 18.072127 });
//   setShowRoute(true);
//   console.log("after " + showRoute)
//   console.log("after " + directions)
// }

// const directionsService = new google.maps.DirectionsService(); // eslint-disable-line

// const origin = { lat: 40.756795, lng: -73.954298 };
// const destination = { lat: 41.756795, lng: -78.954298 };

// directionsService.route(
//   {
//     origin: origin,
//     destination: destination,
//     travelMode: google.maps.TravelMode.DRIVING // eslint-disable-line
//   },
//   (result, status) => {
//     if (status === google.maps.DirectionsStatus.OK) { // eslint-disable-line
//       setDirections(result)
//     } else {
//       console.error(`error fetching directions ${result}`);
//     }
//   }   
// );

  return (
    <>
      <div className={classes.mapWrapper}>
        <GoogleMap
          options={{
            styles: mapStyles,
            fullscreenControl: false,
            streetViewControl: false,
          }}
          center={KTHCenter}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          {/* {showRoute && startLocation && endLocation && (
          <DirectionsService
            options={{
              endLocation,
              startLocation,
              travelMode: window.google.maps.TravelMode.WALKING
            }}
            callback={directionsCallback}
          />
        )}
        {showRoute && directions && (
          <DirectionsRenderer
            directions={directions}
          />
        )} */}
          {directions && <DirectionsRenderer directions={directions}/>}

          {markers}
        </GoogleMap>
      </div>
      <button onClick={calculateRoute}>Get Directions</button>
    </>
  );
};

export default HomeMapView;
