import { Button, Paper } from '@mantine/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DisplayEventInfo from '../../components/DisplayEventInfo';
import { triggerMapUpdate } from '../directions/directionsSlice';

const SelectedEventMapView = () => {
    const dispatch = useDispatch()
    const selectedEvent = useSelector((state) => state.selectedEvent);


    function triggerShowDirections() {
        console.log("ping")
        dispatch(triggerMapUpdate())
    }

    if (!selectedEvent) {
        return null;
    }

    return (
        <Paper>
            <DisplayEventInfo event={selectedEvent} />
            <Button onClick={triggerShowDirections}>Get Directions</Button>
        </Paper>
    );
};

export default SelectedEventMapView;