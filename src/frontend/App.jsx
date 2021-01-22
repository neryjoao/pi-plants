import React, { useState, useEffect } from 'react';
import { Plants } from './components/Plants';
import {fetchPlantsDetails} from './actions/fetchPlantsDetails';

export const App = () => {
  const [plantDetails, setPlantDetails] = useState();

  useEffect(() => {
    fetchPlantsDetails().then(response => {
      setPlantDetails(response);
    }).catch(error => {
      setPlantDetails({error})
    });
  }, [])

  return <>
    {plantDetails ? <Plants {...{plantDetails}}/> : null}
  </>;
};
