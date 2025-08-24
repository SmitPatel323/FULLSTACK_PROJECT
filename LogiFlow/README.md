# LogiFlow - Intelligent Logistics Management System

LogiFlow is a full-stack web application designed to simulate a modern, data-driven logistics and fleet management platform. It provides a comprehensive suite of tools for clients to manage shipments, track fleet status, monitor inventory, and gain intelligent insights through predictive analytics and real-time data integration.

---

## Features

- **Full User Authentication**: Secure user registration and login system.
- **Personalized Profiles**: Automatically assigns unique avatars to new users.
- **Dynamic Dashboard**: At-a-glance view of key logistics metrics, including total shipments, in-transit status, and stock alerts.
- **Shipment Management**:
    - Create new shipments with real origin and destination addresses.
    - View a complete history of all shipments.
    - **Live Map Tracking**: Watch shipments move in real-time on a Google Map from start to finish.
    - **Automatic Status Updates**: Shipments are automatically marked as "Delivered" upon arrival.
- **Fleet & Inventory Management**:
    - View the real-time availability status of all vehicles in the fleet.
    - Monitor product stock levels with automatic "Low Stock" and "Out of Stock" statuses.
    - **Stock Validation**: Prevents the creation of shipments for out-of-stock products.
- **Intelligent Predictions & Integrations**:
    - **Dynamic Delivery Time Prediction**: Estimates the travel time for each shipment based on its actual route distance.
    - **Dynamic Maintenance Cost Prediction**: Forecasts vehicle maintenance costs based on the fleet's average age and mileage.
    - **Live Weather Forecast**: Automatically fetches and displays the weather for the shipment's destination using a reliable API.
- **Reporting & Analytics**:
    - **Dynamic Monthly Volume Chart**: Visualizes the total quantity of products delivered each month.
    - **Data Export**: Download reports in both PDF and CSV formats.

---

## Tech Stack

### Backend
- **Framework**: Django & Django REST Framework
- **Database**: SQLite3
- **Authentication**: Simple JWT (JSON Web Tokens)
- **Machine Learning**: Scikit-learn (for simulated regression models)
- **APIs**:
    - OpenWeatherMap API (for reliable weather data)
    - Google Maps Directions API

### Frontend
- **Framework**: React (with Vite)
- **Styling**: Standard CSS with a modular, responsive approach.
- **Routing**: React Router v6
- **Data Fetching**: Axios
- **Charting**: Recharts
- **Mapping**: `@react-google-maps/api`
- **Smooth Scrolling**: Lenis

---

## Project Structure

### Backend Structure
```
LogiFlow/
└── backend/
    ├── api/
    │   ├── migrations/
    │   ├── ml_models/
    │   │   ├── delivery_time_model.pkl
    │   │   └── maintenance_cost_model.pkl
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── urls.py
    │   ├── utils.py
    │   └── views.py
    ├── logiflow_backend/
    │   ├── __init__.py
    │   ├── asgi.py
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── media/
    │   └── IMAGES/
    │       ├── img1.png
    │       ├── img2.png
    │       ├── img3.png
    │       └── img4.png
    ├── venv/
    ├── .env
    ├── db.sqlite3
    └── manage.py
```

### Frontend Structure
```
LogiFlow/
└── frontend/
    ├── public/
    |   └── truck-front.svg
    │   └── truck.svg
    ├── src/
    │   ├── components/
    │   │   ├── CreateShipmentModal.css
    │   │   ├── CreateShipmentModal.jsx
    │   │   ├── Layout.css
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.css
    │   │   ├── Navbar.jsx
    │   │   └── ShipmentTrackerMap.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── FleetPage.jsx
    │   │   ├── InventoryPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── ReportsPage.jsx
    │   │   ├── ShipmentPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   └── TrackShipmentPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.local
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

## 🔑 Environment Variables

Before running the project, you must configure API keys.

### Backend (Django)
Create a `.env` file in your **backend root**:

```bash
WEATHER_API_KEY=your_weather_api_key_here

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate
# On Windows:
py -m venv venv
venv\Scripts\activate

# Install all required packages
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt scikit-learn pickle requests beautifulsoup4 os

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser to access the admin panel
python manage.py createsuperuser

# Run the backend server
python manage.py runserver
```
**Important**: After starting the server, go to `http://127.0.0.1:8000/admin/` and add initial data for Products, Vehicles, and Delivery Agents.

### 2. Frontend Setup

## 🔑 Environment Variables

Before running the project, you must configure API keys.

### Frontend 
Create a `.env.local` file in your **frontend root**:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install all dependencies
npm install

# Run the frontend development server
npm run dev
```

Your application will be available at `http://localhost:5173/`.

---

## Usage

1.  **Sign Up**: Create a new user account. A unique profile picture will be assigned automatically.
2.  **Create a Shipment**: Navigate to the "Shipments" page, enter valid origin and destination addresses, and click "Get Directions" to preview the route and estimated time/distance.
3.  **Track a Shipment**: Click the "eye" icon to view the live tracking page, where you can see the vehicle move and the weather at the destination.
4.  **Review Reports**: Visit the "Dashboard" and "Reports" pages to see your dynamic analytics update based on completed shipments.

---

## Author

**Smit Patel**
- **Email**: smitpatel0405@gmail.com
- **GitHub**: [github.com/SmitPatel323](https://github.com/SmitPatel323)
