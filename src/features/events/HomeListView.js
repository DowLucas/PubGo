import { useState, useEffect } from 'react';
import { Table, Loader, SimpleGrid } from '@mantine/core';
import DisplayEventCard from '../../components/DisplayEventCard';

const HomeListView = (props) => {
    const { events, setActiveTab } = props;

        
    // THIS CODE CAN BE USED TO FETCH ADRESS
    //const [addresses, setAddresses] = useState([]);
    // useEffect(() => {
    //     const geocoder = new window.google.maps.Geocoder();
    //     const addresses = [];

    //     events.forEach((event) => {
    //         geocoder.geocode({ location: event.location }, (results, status) => {
    //             if (status === 'OK') {
    //                 addresses.push(results[0].formatted_address);
    //                 setAddresses([...addresses]);
    //             } else {
    //                 console.error(`Geocoder failed due to: ${status}`);
    //             }
    //         });
    //     });
    // }, [events]);

    if (!events || events.length === 0) {
      return <Loader />;
    }

    const filteredEvents = events.filter((event) => new Date(event.endDateTime) > new Date());

    const sortedEvents = [...filteredEvents].sort(
        (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
    );

    const rows = sortedEvents.map((event, index) => (
      <div key={event.name}>
        <DisplayEventCard event={event} setActiveTab={setActiveTab}/>
      </div>
    ));

    return (
      <SimpleGrid
      cols={1}
      spacing="md"
      mt={50}
      mb={60}
      >
        {rows}
      </SimpleGrid>
    );
}

export default HomeListView;