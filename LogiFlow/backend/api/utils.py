import os
import joblib
import numpy as np
import requests
from bs4 import BeautifulSoup
from django.conf import settings
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline

# Define file paths for the saved models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'ml_models')
TIME_MODEL_PATH = os.path.join(MODEL_DIR, 'delivery_time_model.joblib')
COST_MODEL_PATH = os.path.join(MODEL_DIR, 'maintenance_cost_model.joblib')

def ensure_model_dir_exists():
    """Ensures the directory for storing ML models exists."""
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

def train_and_save_models():
    """
    Simulates training and saves the ML models if they don't exist.
    In a real-world scenario, this would be a separate script run by a data scientist.
    """
    ensure_model_dir_exists()

    # --- 1. Train Delivery Time Prediction Model (Polynomial Regression) ---
    if not os.path.exists(TIME_MODEL_PATH):
        print("Training Delivery Time model...")
        # Simulate data: distance (km) vs. time (hours)
        X_time = np.array([10, 25, 50, 80, 100, 150, 200]).reshape(-1, 1)
        y_time = np.array([0.5, 1.1, 2.0, 3.5, 4.2, 6.8, 9.0])

        # Create a pipeline with Polynomial Features and Linear Regression
        time_model_pipeline = Pipeline([
            ("poly_features", PolynomialFeatures(degree=2, include_bias=False)),
            ("lin_reg", LinearRegression()),
        ])
        
        time_model_pipeline.fit(X_time, y_time)
        joblib.dump(time_model_pipeline, TIME_MODEL_PATH)
        print("Delivery Time model trained and saved.")

    # --- 2. Train Maintenance Cost Prediction Model (Linear Regression) ---
    if not os.path.exists(COST_MODEL_PATH):
        print("Training Maintenance Cost model...")
        # Simulate data: [age (years), distance_covered (km)] vs. cost ($)
        X_cost = np.array([[1, 20000], [2, 45000], [3, 60000], [4, 85000], [5, 110000]])
        y_cost = np.array([150, 320, 480, 700, 950])

        cost_model = LinearRegression()
        cost_model.fit(X_cost, y_cost)
        joblib.dump(cost_model, COST_MODEL_PATH)
        print("Maintenance Cost model trained and saved.")

def predict_delivery_time(distance_km):
    """Loads the time prediction model and predicts delivery time."""
    if not os.path.exists(TIME_MODEL_PATH):
        # Fallback if model not trained
        return (distance_km / 40.0) # Assume average 40 km/h

    model = joblib.load(TIME_MODEL_PATH)
    predicted_time = model.predict(np.array([[distance_km]]))
    return predicted_time[0]

def predict_maintenance_cost(vehicle_age_years, distance_covered_km):
    """Loads the cost prediction model and predicts maintenance cost."""
    if not os.path.exists(COST_MODEL_PATH):
        # Fallback if model not trained
        return 100 + (vehicle_age_years * 50)

    model = joblib.load(COST_MODEL_PATH)
    predicted_cost = model.predict(np.array([[vehicle_age_years, distance_covered_km]]))
    return predicted_cost[0]



# --- FINAL, API-BASED WEATHER FUNCTION ---
def get_weather_forecast(city):
    if not city:
        return "N/A"
    
    api_key = settings.WEATHER_API_KEY
    if not api_key:
        print("ERROR: WEATHER_API_KEY not set in settings.py")
        return "API key missing"

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)
        response.raise_for_status() 
        data = response.json()

        if data.get("weather"):
            temp = data['main']['temp']
            description = data['weather'][0]['description'].title()
            return f"{temp}°C, {description}"
        else:
            return "Forecast unavailable"

    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather from API: {e}")
        return "Forecast unavailable"
