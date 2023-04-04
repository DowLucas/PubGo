import { Paper } from '@mantine/core';
import React from 'react';
import { useSelector } from 'react-redux';
import DisplayEventInfo from '../../components/DisplayEventInfo';

const SelectedEventMapView = () => {
    const selectedEvent = useSelector((state) => state.selectedEvent);

    if (!selectedEvent) {
        return null;
    }

    return (
        <Paper>
            <DisplayEventInfo event={selectedEvent} />
        </Paper>
    );
};

export default SelectedEventMapView;