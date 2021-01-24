import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './frontend/App'
import _set from 'lodash/set'

const MOCK_PLANT_DETAILS = true,
    mockedDetails = [
        {
            name: 'First mock',
            isAutomatic: 'true',
            waterThreshold: 400,
            moistureLevel: 500,
            isOn: false
        },
        {
            name: 'Second mock',
            isAutomatic: 'false',
            waterThreshold: 400,
            moistureLevel: 300,
            isOn: false
        }]

if (MOCK_PLANT_DETAILS) {
    _set(window, `plants.details`, mockedDetails);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

