# BIT Fleet Booking Portal

## Project Overview

**BIT Fleet Booking Portal** is a full‑stack web application for managing faculty official visits and field trips at Bannari Amman Institute of Technology (BIT). It provides:
- A clean, responsive UI for booking, approving, and tracking fleet vehicles.
- Real‑time GPS tracking of vehicles on a map.
- Driver health telemetry (heartbeat, BP, SpO₂, temperature, alertness).
- Automatic emergency‑contact lookup and one‑click SOS broadcast.
- Ratings, remarks, suggestions, and financial calculations (fuel, tolls, driver allowance, extra charges).
- AI assistant for quick queries (ETA, nearby places, weather etc.).

The backend can run **with MongoDB** or **without any external database** using an embedded `DataStore` fallback, making the app zero‑configuration out of the box.

---

## Features

| Feature | Description |
|---|---|
| **Booking wizard** | 4‑step form with conflict detection and vehicle/driver assignment. |
| **Live GPS map** | Shows current vehicle locations and routes on a map (Leaflet/Mapbox). |
| **Driver health cockpit** | Real‑time biometric simulation (HR, BP, SpO₂, temperature, alertness). |
| **Emergency matrix** | Nearby hospitals, hotline contacts, one‑click SOS. |
| **Rating & financials** | Post‑trip rating, remarks, suggestions + automatic distance‑based cost calculation (fuel, tolls, driver BATA). |
| **Weather advisory** | Shows weather at destination when booking a trip. |
| **AI Assistant** | Ask location, ETA, famous places, etc. |
| **Analytics dashboard** | KPI stats for fleet utilisation, bookings, department distribution. |

---

## Prerequisites

- **Node.js** (>= 18) and **npm**
- (Optional) **MongoDB** instance – set `MONGODB_URI` in `server/.env`. If omitted the app uses the in‑memory `DataStore`.
- **Git** (for cloning the repo)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourorg/bit-fleet-portal.git
cd bit-fleet-portal

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## Running the Application (Development)

```bash
# In one terminal – start the backend
cd server
npm run dev   # starts on http://localhost:5000

# In another terminal – start the frontend
cd client
npm run dev   # starts Vite dev server on http://localhost:3000
```

Open `http://localhost:3000` in a browser.

---

## Building for Production

```bash
# Backend
cd server
npm run build   # creates a compiled version in `dist`

# Frontend
cd ../client
npm run build   # creates static assets in `dist`
```
Serve the static files with any HTTP server (e.g., Nginx, Apache, or `serve -s dist`).

---

## API Endpoints (selected)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/bookings/check-availability` | Validate vehicle/driver availability for a time window. |
| `POST` | `/api/bookings` | Create a new booking request. |
| `GET`  | `/api/bookings` | List bookings (filterable). |
| `PUT`  | `/api/bookings/:id/assign` | Admin assigns vehicle & driver (conflict‑checked). |
| `GET`  | `/api/bookings/:id/safety-cockpit` | Returns driver health, GPS, emergency contacts, nearby hospitals. |
| `PUT`  | `/api/bookings/:id/rating` | Submit post‑trip rating, remarks, suggestions and calculates total cost. |
| `POST` | `/api/bookings/:id/trigger-sos` | One‑click SOS broadcast with live GPS coordinates. |
| `GET`  | `/api/vehicles/live-locations` | Live GPS telemetry for all fleet vehicles (used by the map). |
| `GET`  | `/api/analytics/dashboard` | KPI data for the admin dashboard. |

---

## Frontend UI Notes

- The **Live GPS map** component (`MapView.jsx`) currently hides tiles when the container width is too small. A CSS fix is pending (see *Known Issues*).
- The **Health Monitoring** tab displays telemetry for the assigned driver. Faulty‑vehicle health (engine diagnostics) is not yet implemented.
- The **Destination Tracker** for a faulty driver is disabled until the driver’s device reports GPS; a fallback placeholder will be added.
- **Extra charges** (e.g., out‑of‑zone tolls, premium vehicle surcharge) are now part of the rating endpoint (`/api/bookings/:id/rating`) and reflected in `financials.totalTripCost`. The UI should display this value – a small component update is required.

---

## Known Issues & TODOs

| Issue | Description | Planned Fix |
|---|---|---|
| **Map not fully visible** | On small screens the map container overflows and tiles are clipped. | Adjust CSS `height: 100%` and use responsive `vh` units; add `ResizeObserver` to re‑render map on container resize. |
| **Health monitoring for faulty vehicles** | Only driver biometric data is simulated. Vehicle engine health (temperature, oil pressure) is missing. | Extend `computeLiveDriverBiometrics` to `computeLiveVehicleMetrics` and expose via `/api/vehicles/:id/metrics`. |
| **Tracker of destination for faulty driver** | When a driver device is offline, the map shows a static depot marker instead of the destination route. | Implement a fallback that draws a straight line from depot to the booked destination using the destination coordinates. |
| **Extra charges & total charge calculation** | The rating endpoint now adds fuel, tolls, and driver BATA, but UI does not yet show the breakdown. | Add a `TripCostSummary` component on the rating screen that consumes `booking.financials`. |
| **AI Assistant UI** | The copilot widget is present but lacks quick‑action chips for common queries. | Add chips for “ETA to destination”, “Show nearby hospitals”, “Weather at destination”. |
| **Database connection fallback** | Some older controller files still reference models directly without `getIsConnectedToMongo`. | Review remaining controllers (`driverController`, `vehicleController`, `analyticsController`, `tripLogController`) – they already include dual‑mode logic. |

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your‑feature`).
3. Make your changes and ensure `npm test` (if tests exist) passes.
4. Open a Pull Request with a clear description.

---

## License

MIT License – see `LICENSE` file for details.

---

## Quick Start Checklist

- [ ] Verify `server/.env` – set `MONGODB_URI` if you have a MongoDB instance.
- [ ] Run `npm run dev` for both backend and frontend.
- [ ] Open the app and use the **New Booking** wizard.
- [ ] After completing a trip, go to **Rate Trip** – you should now see a cost breakdown (fuel, tolls, driver allowance, extra charges).
- [ ] Test the **Live GPS** map: ensure the vehicle marker moves and the route line is fully visible.
- [ ] Use the **AI Assistant** to ask for ETA or nearby hospitals.

If you encounter any of the items listed under *Known Issues*, refer to the corresponding *Planned Fix* and feel free to contribute a PR.