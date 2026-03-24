import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { Plants } from './components/Plants';
import { SelectedPlant } from './components/SelectedPlant';
import { CONSTANTS } from './CONSTANTS';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from './types';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { GET_SYSTEM_DETAILS } = ENDPOINTS;

export const App = () => {
  const [plantDetails, setPlantDetails] = useState<PlantState[]>();
  const [selectedPlant, setSelectedPlant] = useState<PlantState>();

  useEffect(() => {
    const source = new EventSource(`${BACKEND_URL}${GET_SYSTEM_DETAILS}`);
    source.onmessage = (event) => {
      setPlantDetails(JSON.parse(event.data) as PlantState[]);
    };
    return () => source.close();
  }, []);

  useEffect(() => {
    if (selectedPlant && plantDetails) {
      setSelectedPlant(plantDetails[selectedPlant.plantIndex]);
    }
  }, [plantDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePlant: UpdatePlantFn = (plant) => {
    setSelectedPlant(plant);
    if (plant && plantDetails) {
      const updated = [...plantDetails];
      updated.splice(plant.plantIndex, 1, plant);
      setPlantDetails(updated);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">My Plants</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {selectedPlant ? (
          <SelectedPlant selectedPlant={selectedPlant} updatePlant={updatePlant} />
        ) : plantDetails ? (
          <Plants plantDetails={plantDetails} updatePlant={updatePlant} />
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            Connecting to plant system...
          </div>
        )}
      </main>
    </div>
  );
};
