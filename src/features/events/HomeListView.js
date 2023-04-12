import { useState, useEffect } from 'react';
import { Table } from '@mantine/core';
import DisplayEventCard from '../../components/DisplayEventCard';

const HomeListView = (props) => {
    const { events } = props;
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const geocoder = new window.google.maps.Geocoder();
        const addresses = [];

        events.forEach((event) => {
            geocoder.geocode({ location: event.location }, (results, status) => {
                if (status === 'OK') {
                    addresses.push(results[0].formatted_address);
                    setAddresses([...addresses]);
                } else {
                    console.error(`Geocoder failed due to: ${status}`);
                }
            });
        });
    }, [events]);

    const filteredEvents = events.filter((event) => new Date(event.startDateTime) > new Date());

    const sortedEvents = [...filteredEvents].sort(
        (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
    );
    
    const rows = sortedEvents.map((event, index) => (
    <tr key={event.name}>
        <DisplayEventCard event={event} />
    </tr>
    ));

    return (
        <Table verticalSpacing="xl" highlightOnHover>
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
}

export default HomeListView;