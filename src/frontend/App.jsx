import React, {useState, useEffect} from 'react';
import {Plants} from './components/Plants';
import {fetchPlantsDetails} from './actions/fetchPlantsDetails';
import {SelectedPlant} from './components/SelectedPlant';

export const App = () => {
    const [plantDetails, setPlantDetails] = useState();
    const [selectedPlant, setSelectedPlant] = useState();

    useEffect(() => {
        fetchPlantsDetails().then(response => {
            setPlantDetails(response);
        }).catch(error => {
            setPlantDetails({error})
        });
    }, [])

    return <>
        {selectedPlant ?
            <SelectedPlant {...{selectedPlant, setSelectedPlant}}/> :
            plantDetails ? <Plants {...{
                plantDetails,
                setSelectedPlant
            }}/> : null}
    </>;
};
