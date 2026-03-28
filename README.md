# Pi Plants

An automated plant watering system built with Arduino and Raspberry Pi. Monitors soil moisture levels across multiple plants in real time and can automatically trigger watering when moisture drops below a configurable threshold.

## Overview

- **Backend** — Express.js server that communicates with an Arduino over Firmata, persists readings to SQLite, and streams live plant state via Server-Sent Events
- **Frontend** — React + Vite dashboard for monitoring and controlling plants in real time
- **Shared** — TypeScript types shared between the two packages

## Hardware Requirements

- Raspberry Pi (any model with USB)
- Arduino Mega flashed with [ConfigurableFirmata](https://github.com/firmata/ConfigurableFirmata) (with DHT module enabled)
- Soil moisture sensors (one per plant, connected to analog pins A0–A7)
- Water pumps with relay modules (one per plant, connected to digital pins 2–9)
- DHT22 (or DHT11) temperature/humidity sensor module (3-pin, connected to a digital pin)

Plant-to-pin mapping is configured in `packages/backend/src/data/plantsDetails.json`.

## Circuit

### System Overview

```
                          USB (Firmata)
  ┌─────────────────┐    ─────────────   ┌──────────────────────┐
  │  Raspberry Pi   │◄──────────────────►│    Arduino           │
  │  (Node.js app)  │                    │ (ConfigurableFirmata)│
  └─────────────────┘                    └──────────┬───────────┘
                                                    │
                              ┌─────────────────────┴─────────────────────┐
                              │                         │                 │
                    Digital pins 2–9        A8 / pin 62        Analog pins A0–A7
                    (one per pump)          (DHT sensor)        (one per sensor)
```

### DHT Temperature/Humidity Sensor Wiring

Use a **3-pin DHT module** (not a bare 4-pin sensor) — the module has the pull-up resistor built in.

```
DHT module          Arduino Mega
──────────          ────────────
VCC        ──────►  5V
DATA       ──────►  Digital pin 62 / A8 (or any free digital pin)
GND        ──────►  GND
```

> Any free digital pin works, including analog pins used as digital (e.g. A8 = pin 62 on the Mega).

### Per-Plant Wiring

Each plant uses one relay module and one capacitive/resistive moisture sensor.

```
                    ┌─────────────────────────────────────────┐
                    │             Arduino                     │
                    │                                         │
                    │  5V ──────────────────────────┐         │
                    │                               │         │
                    │  GND ─────────────────────────┼────┐    │
                    │                               │    │    │
                    │  Digital Pin (2–9) ───┐       │    │    │
                    │                       │       │    │    │
                    │  Analog Pin (A0–A7) ◄─┼───────┼────┼──► │◄── Moisture Sensor
                    │                       │       │    │    │
                    └───────────────────────┼───────┼────┼────┘
                                            │       │    │
                                            ▼       │    │
                                     ┌─────────┐    │    │
                                     │  Relay  │◄───┘    │
                                     │ Module  │◄────────┘
                                     └────┬────┘
                                     IN   COM  NO
                                          │    │
                              ┌───────────┘    │
                              │                │
                         [External 5V+]   [Pump +]
                              │                │
                              └──── Pump ──────┘
                                       │
                                  [External GND / Pump –]
```

### Pin Mapping (default `plantsDetails.json`)

| Plant   | Relay (Digital) | Moisture Sensor (Analog) |
|---------|-----------------|--------------------------|
| Plant 1 | Pin 2           | A0                       |
| Plant 2 | Pin 3           | A1                       |
| Plant 3 | Pin 4           | A2                       |
| Plant 4 | Pin 5           | A3                       |
| Plant 5 | Pin 6           | A4                       |
| Plant 6 | Pin 7           | A5                       |
| Plant 7 | Pin 8           | A6                       |
| Plant 8 | Pin 9           | A7                       |

> The relay module needs its own power source for the pump circuit. The Arduino only provides the control signal (HIGH/LOW) on the digital pin. Use an appropriate voltage for your pump (typically 5V or 12V from an external supply).

## Getting Started

### 0. Flash the Arduino

The Arduino must be running **ConfigurableFirmata** with the DHT module enabled.

1. Open Arduino IDE and install the **ConfigurableFirmata** library via `Sketch > Include Library > Manage Libraries`
2. Open `File > Examples > ConfigurableFirmata > ConfigurableFirmata`
3. Ensure `#define ENABLE_DHT` is uncommented in the sketch
4. Upload to your Arduino Mega

### 1. Install dependencies

```bash
npm install
```

On a development machine you can skip native module compilation with:
```bash
npm run install:dev
```

### 2. Configure environment

Create `packages/backend/.env`:
```
ARDUINO_PORT=/dev/ttyUSB0   # Serial port of the Arduino (COM3, COM7, etc. on Windows)
PORT=3001
DHT_PIN=62                  # Digital pin the DHT sensor DATA wire is connected to (default: 62 = A8 on Mega)
DHT_TYPE=2                  # 0 = DHT11, 1 = DHT21, 2 = DHT22 (default: 0)
```

`ARDUINO_PORT` is required — the server will not start without it. `DHT_PIN` and `DHT_TYPE` are optional and default to pin 22 and DHT11 respectively.

### 3. Run

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 3000) in parallel.

| Script | Description |
|---|---|
| `npm run dev` | Run frontend + backend together |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |

The frontend dev server proxies API requests to the backend automatically.

## How It Works

- Each plant is represented by a `Pot` — a moisture sensor + pump pair
- Moisture readings are sampled every 2 seconds and recorded to SQLite every 5 minutes
- Readings older than 30 days are pruned daily
- When automatic mode is enabled, the pump turns on when moisture falls at or below the threshold and turns off when it recovers
- The frontend receives live updates via a Server-Sent Events stream at `/plantsDetails`
