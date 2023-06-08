import {
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { KTHCenter, mapStyles } from "../../utils/const";
import styles from "./MapView.module.css";
import { Button, Space} from "@mantine/core";

const HomeMapView = (props) => {
  const { 
  markers,
  markerClicked,
  setMarkerClicked,
  clearRoute,
  handleNearestPub,
  showRoute,
  directions } = props;


  return (
    <>
      <div
        className={`${styles.mapWrapper} ${
          markerClicked ? styles.mapWrapperMarkerClicked : ""
        }`}
      >
        <Space h="5.5vh" />
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
          onClick={() => {
            setMarkerClicked(false);
          }}
        >
          <div
            style={{ position: "absolute", top: "0", right: "0px", zIndex: "1" }}
          >
            <Button onClick={handleNearestPub}>
              Nearest Pub
            </Button>
            <Button color="orange" onClick={clearRoute}>
              x
            </Button>
          </div>

          {showRoute && directions && (
            <DirectionsRenderer directions={directions} />
          )}
          {markers}
        </GoogleMap>
        <Space h="5vh" />
      </div>
    </>
  );
};

export default HomeMapView;
