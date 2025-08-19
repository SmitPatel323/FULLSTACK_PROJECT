# import random
# import requests
# from django.conf import settings
# from django.db import models 
# from django.utils import timezone
# from rest_framework import viewsets, status, generics
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# # Import the new utility functions
# from . import utils

# # --- Helper Function to get route from Google Maps ---
# def get_google_maps_route(origin_address, destination_address):
#     """
#     Fetches route information from Google Maps Directions API.
#     Returns a dictionary with coordinates, polyline, and distance.
#     """
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = {
#         "origin": origin_address,
#         "destination": destination_address,
#         "key": settings.GOOGLE_MAPS_API_KEY,
#     }
#     response = requests.get(base_url, params=params)
#     if response.status_code == 200:
#         data = response.json()
#         if data['status'] == 'OK' and data['routes']:
#             route = data['routes'][0]
#             legs = route['legs'][0]
#             start_location = legs['start_location']
#             end_location = legs['end_location']
#             route_polyline = route['overview_polyline']['points']
#             distance_meters = legs['distance']['value']
            
#             return {
#                 "start_lat": start_location['lat'],
#                 "start_lng": start_location['lng'],
#                 "end_lat": end_location['lat'],
#                 "end_lng": end_location['lng'],
#                 "polyline": route_polyline,
#                 "distance_km": distance_meters / 1000.0
#             }
#     return None


# # --- Authentication Views ---
# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user


# # --- Model ViewSets (for CRUD operations) ---
# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer

#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))

#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")

#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
        
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')

#         route_data = get_google_maps_route(start_address, end_address)
#         if not route_data:
#             raise serializers.ValidationError("Could not calculate route. Please check addresses.")

#         shipment = serializer.save(
#             client=self.request.user,
#             agent=agent,
#             vehicle=vehicle,
#             status='In Transit',
#             start_location_lat=route_data['start_lat'],
#             start_location_lng=route_data['start_lng'],
#             end_location_lat=route_data['end_lat'],
#             end_location_lng=route_data['end_lng'],
#             route_polyline=route_data['polyline']
#         )
        
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # --- Analytics & Dashboard View ---
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()

#         # --- ML PREDICTIONS ---
#         # Predict delivery time for a sample 75km trip
#         predicted_time_hours = utils.predict_delivery_time(75)
        
#         # Predict maintenance for a sample 2-year-old vehicle with 50,000 km
#         predicted_maint_cost = utils.predict_maintenance_cost(2, 50000)

#         # Chart data
#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)

#         data = {
#             'stats': {
#                 'totalShipments': total_shipments,
#                 'inTransit': in_transit_count,
#                 'delivered': delivered_count,
#                 'lowStockAlerts': low_stock_products,
#             },
#             'charts': {
#                 'monthlyVolume': {
#                     'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
#                     'data': monthly_volume,
#                 },
#                 'deliveryPerformance': {
#                     'labels': ['On-Time', 'Delayed'],
#                     'data': [on_time_percentage, 100 - on_time_percentage]
#                 }
#             },
#             'predictions': {
#                 'deliveryTime': f"{predicted_time_hours:.1f} hours",
#                 'maintenanceCost': f"${predicted_maint_cost:.2f}"
#             }
#         }
#         return Response(data, status=status.HTTP_200_OK)








# import random
# import requests
# from django.conf import settings
# from django.db import models # <--- THIS IS THE FIX
# from rest_framework import viewsets, status, generics, serializers # <--- THIS IS THE FIX
# from rest_framework import viewsets, status, generics
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # --- Helper Function to get route from Google Maps ---
# def get_google_maps_route(origin_address, destination_address):
#     """
#     Fetches route information from Google Maps Directions API.
#     Returns a dictionary with coordinates, polyline, and distance.
#     """
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = {
#         "origin": origin_address,
#         "destination": destination_address,
#         "key": settings.GOOGLE_MAPS_API_KEY,
#     }
#     response = requests.get(base_url, params=params)
#     if response.status_code == 200:
#         data = response.json()
#         if data['status'] == 'OK' and data['routes']:
#             route = data['routes'][0]
#             legs = route['legs'][0]
#             start_location = legs['start_location']
#             end_location = legs['end_location']
#             route_polyline = route['overview_polyline']['points']
#             distance_meters = legs['distance']['value']
            
#             return {
#                 "start_lat": start_location['lat'],
#                 "start_lng": start_location['lng'],
#                 "end_lat": end_location['lat'],
#                 "end_lng": end_location['lng'],
#                 "polyline": route_polyline,
#                 "distance_km": distance_meters / 1000.0
#             }
#     return None


# # --- Authentication Views ---
# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user


# # --- Model ViewSets (for CRUD operations) ---
# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer

#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))

#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")

#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
        
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')

#         route_data = get_google_maps_route(start_address, end_address)
#         if not route_data:
#             raise serializers.ValidationError("Could not calculate route. Please check addresses.")

#         shipment = serializer.save(
#             client=self.request.user,
#             agent=agent,
#             vehicle=vehicle,
#             status='In Transit',
#             start_location_lat=route_data['start_lat'],
#             start_location_lng=route_data['start_lng'],
#             end_location_lat=route_data['end_lat'],
#             end_location_lng=route_data['end_lng'],
#             route_polyline=route_data['polyline']
#         )
        
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # --- Analytics & Dashboard View ---
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()

#         # --- ML PREDICTIONS ---
#         predicted_time_hours = utils.predict_delivery_time(75)
#         predicted_maint_cost = utils.predict_maintenance_cost(2, 50000)

#         # Chart data
#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)

#         data = {
#             'stats': {
#                 'totalShipments': total_shipments,
#                 'inTransit': in_transit_count,
#                 'delivered': delivered_count,
#                 'lowStockAlerts': low_stock_products,
#             },
#             'charts': {
#                 'monthlyVolume': {
#                     'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
#                     'data': monthly_volume,
#                 },
#                 'deliveryPerformance': {
#                     'labels': ['On-Time', 'Delayed'],
#                     'data': [on_time_percentage, 100 - on_time_percentage]
#                 }
#             },
#             'predictions': {
#                 'deliveryTime': f"{predicted_time_hours:.1f} hours",
#                 'maintenanceCost': f"${predicted_maint_cost:.2f}"
#             }
#         }
#         return Response(data, status=status.HTTP_200_OK)


#BASIC ONE-----------------------------VERY ESSENTIAL---------------------------------------------------------------------


# import random
# import requests
# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from rest_framework import viewsets, status, generics, serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # --- Helper Function to get route from Google Maps ---
# def get_google_maps_route(origin_address, destination_address):
#     """
#     Fetches route information from Google Maps Directions API.
#     Returns the full JSON response from Google.
#     """
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = {
#         "origin": origin_address,
#         "destination": destination_address,
#         "key": settings.GOOGLE_MAPS_API_KEY,
#     }
#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status() # Will raise an exception for 4xx/5xx errors
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling Google Maps API: {e}")
#         return None


# # --- Authentication Views ---
# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user


# # --- Model ViewSets (for CRUD operations) ---
# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer

#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))

#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")

#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
        
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')

#         # Get the full JSON response from Google
#         google_response = get_google_maps_route(start_address, end_address)

#         # --- THIS IS THE KEY CHANGE ---
#         # Check the status from the Google response directly
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             raise serializers.ValidationError(status_message)
        
#         # If status is OK, extract the data
#         route = google_response['routes'][0]
#         legs = route['legs'][0]
#         route_data = {
#             "start_lat": legs['start_location']['lat'],
#             "start_lng": legs['start_location']['lng'],
#             "end_lat": legs['end_location']['lat'],
#             "end_lng": legs['end_location']['lng'],
#             "polyline": route['overview_polyline']['points']
#         }

#         shipment = serializer.save(
#             client=self.request.user,
#             agent=agent,
#             vehicle=vehicle,
#             status='In Transit',
#             start_location_lat=route_data['start_lat'],
#             start_location_lng=route_data['start_lng'],
#             end_location_lat=route_data['end_lat'],
#             end_location_lng=route_data['end_lng'],
#             route_polyline=route_data['polyline']
#         )
        
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # --- Analytics & Dashboard View ---
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()

#         # --- ML PREDICTIONS ---
#         predicted_time_hours = utils.predict_delivery_time(75)
#         predicted_maint_cost = utils.predict_maintenance_cost(2, 50000)

#         # Chart data
#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)

#         data = {
#             'stats': {
#                 'totalShipments': total_shipments,
#                 'inTransit': in_transit_count,
#                 'delivered': delivered_count,
#                 'lowStockAlerts': low_stock_products,
#             },
#             'charts': {
#                 'monthlyVolume': {
#                     'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
#                     'data': monthly_volume,
#                 },
#                 'deliveryPerformance': {
#                     'labels': ['On-Time', 'Delayed'],
#                     'data': [on_time_percentage, 100 - on_time_percentage]
#                 }
#             },
#             'predictions': {
#                 'deliveryTime': f"{predicted_time_hours:.1f} hours",
#                 'maintenanceCost': f"${predicted_maint_cost:.2f}"
#             }
#         }
#         return Response(data, status=status.HTTP_200_OK)


# class MarkAsDeliveredView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         try:
#             shipment = Shipment.objects.get(pk=pk, client=request.user)
#         except Shipment.DoesNotExist:
#             return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)

#         # Update shipment status
#         shipment.status = 'Delivered'
#         shipment.delivered_at = timezone.now()
#         shipment.save()

#         # Make the agent available again
#         if shipment.agent:
#             shipment.agent.is_available = True
#             shipment.agent.save()

#         # Make the vehicle available again
#         if shipment.vehicle:
#             shipment.vehicle.is_available = True
#             shipment.vehicle.save()
            
#         return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)




#------------------------------------TILL HERE-----------------------------------------------






#------------------------New one latest----------------------------------------

# import random
# import requests
# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from rest_framework import viewsets, status, generics, serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # --- Helper Function to get route from Google Maps ---
# def get_google_maps_route(origin_address, destination_address):
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = {
#         "origin": origin_address,
#         "destination": destination_address,
#         "key": settings.GOOGLE_MAPS_API_KEY,
#     }
#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling Google Maps API: {e}")
#         return None

# # --- A NEW VIEW specifically for getting directions ---
# class GetDirectionsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         start_address = request.data.get('start_address')
#         end_address = request.data.get('end_address')

#         if not start_address or not end_address:
#             return Response({'error': 'Start and end addresses are required.'}, status=status.HTTP_400_BAD_REQUEST)

#         google_response = get_google_maps_route(start_address, end_address)

#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             return Response({'error': status_message}, status=status.HTTP_400_BAD_REQUEST)
        
#         legs = google_response['routes'][0]['legs'][0]
#         directions_data = {
#             'distance': legs['distance']['text'],
#             'duration': legs['duration']['text'],
#         }
#         return Response(directions_data, status=status.HTTP_200_OK)


# # --- Authentication Views ---
# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#     def get_object(self):
#         return self.request.user

# # --- Model ViewSets (for CRUD operations) ---
# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer
#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))
#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")
#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             raise serializers.ValidationError(status_message)
#         route = google_response['routes'][0]
#         legs = route['legs'][0]
#         route_data = {
#             "start_lat": legs['start_location']['lat'], "start_lng": legs['start_location']['lng'],
#             "end_lat": legs['end_location']['lat'], "end_lng": legs['end_location']['lng'],
#             "polyline": route['overview_polyline']['points']
#         }
#         shipment = serializer.save(
#             client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
#             start_location_lat=route_data['start_lat'], start_location_lng=route_data['start_lng'],
#             end_location_lat=route_data['end_lat'], end_location_lng=route_data['end_lng'],
#             route_polyline=route_data['polyline']
#         )
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # --- Analytics & Dashboard View ---
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()
#         predicted_time_hours = utils.predict_delivery_time(75)
#         predicted_maint_cost = utils.predict_maintenance_cost(2, 50000)
#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)
#         data = {
#             'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 'lowStockAlerts': low_stock_products },
#             'charts': {
#                 'monthlyVolume': { 'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 'data': monthly_volume },
#                 'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
#             },
#             'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
#         }
#         return Response(data, status=status.HTTP_200_OK)

# # --- VIEW TO HANDLE DELIVERY COMPLETION ---
# class MarkAsDeliveredView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         try:
#             shipment = Shipment.objects.get(pk=pk, client=request.user)
#         except Shipment.DoesNotExist:
#             return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)

#         # Update shipment status
#         shipment.status = 'Delivered'
#         shipment.delivered_at = timezone.now()
#         shipment.save()

#         # Make the agent available again
#         if shipment.agent:
#             shipment.agent.is_available = True
#             shipment.agent.save()

#         # Make the vehicle available again
#         if shipment.vehicle:
#             shipment.vehicle.is_available = True
#             shipment.vehicle.save()
            
#         return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)


#------------------------Till here latest----------------------------------------





# # ... (all imports and other views remain the same) ...
# import random
# import requests
# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from rest_framework import viewsets, status, generics, serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # ... (get_google_maps_route, GetDirectionsView, Auth Views, other ViewSets are unchanged) ...
# def get_google_maps_route(origin_address, destination_address):
#     # ...
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = { "origin": origin_address, "destination": destination_address, "key": settings.GOOGLE_MAPS_API_KEY }
#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling Google Maps API: {e}")
#         return None

# class GetDirectionsView(APIView):
#     # ...
#     permission_classes = [IsAuthenticated]
#     def post(self, request):
#         start_address = request.data.get('start_address')
#         end_address = request.data.get('end_address')
#         if not start_address or not end_address:
#             return Response({'error': 'Start and end addresses are required.'}, status=status.HTTP_400_BAD_REQUEST)
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             return Response({'error': status_message}, status=status.HTTP_400_BAD_REQUEST)
#         legs = google_response['routes'][0]['legs'][0]
#         return Response({'distance': legs['distance']['text'], 'duration': legs['duration']['text']}, status=status.HTTP_200_OK)

# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#     def get_object(self): return self.request.user

# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer


# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer
#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))
#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")
        
#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')
        
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             raise serializers.ValidationError(status_message)
        
#         route = google_response['routes'][0]
#         legs = route['legs'][0]
        
#         # --- KEY CHANGES START HERE ---
        
#         # 1. Extract the distance in kilometers
#         distance_km = legs['distance']['value'] / 1000.0
        
#         # 2. Use the actual distance to get the prediction
#         predicted_duration_hours = utils.predict_delivery_time(distance_km)
#         predicted_duration_text = f"{predicted_duration_hours:.1f} hours"

#         # 3. Save everything to the database
#         shipment = serializer.save(
#             client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
#             start_location_lat=legs['start_location']['lat'],
#             start_location_lng=legs['start_location']['lng'],
#             end_location_lat=legs['end_location']['lat'],
#             end_location_lng=legs['end_location']['lng'],
#             route_polyline=route['overview_polyline']['points'],
#             distance_km=distance_km, # Save the distance
#             predicted_duration=predicted_duration_text # Save the prediction
#         )
        
#         # --- KEY CHANGES END HERE ---
        
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # ... (DashboardAnalyticsView and MarkAsDeliveredView are unchanged) ...
# class DashboardAnalyticsView(APIView):
#     # ...
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()
#         predicted_time_hours = utils.predict_delivery_time(75)
#         predicted_maint_cost = utils.predict_maintenance_cost(2, 50000)
#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)
#         data = {
#             'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 'lowStockAlerts': low_stock_products },
#             'charts': {
#                 'monthlyVolume': { 'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 'data': monthly_volume },
#                 'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
#             },
#             'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
#         }
#         return Response(data, status=status.HTTP_200_OK)

# class MarkAsDeliveredView(APIView):
#     # ...
#     permission_classes = [IsAuthenticated]
#     def post(self, request, pk):
#         try:
#             shipment = Shipment.objects.get(pk=pk, client=request.user)
#         except Shipment.DoesNotExist:
#             return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)
#         shipment.status = 'Delivered'
#         shipment.delivered_at = timezone.now()
#         shipment.save()
#         if shipment.agent:
#             shipment.agent.is_available = True
#             shipment.agent.save()
#         if shipment.vehicle:
#             shipment.vehicle.is_available = True
#             shipment.vehicle.save()
#         return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)







#---------------latest one-----------------------------------


# import random
# import requests
# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from django.db.models import Avg # <-- Import the Avg function
# from rest_framework import viewsets, status, generics, serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # ... (get_google_maps_route, GetDirectionsView, Auth Views, other ViewSets are unchanged) ...
# def get_google_maps_route(origin_address, destination_address):
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = { "origin": origin_address, "destination": destination_address, "key": settings.GOOGLE_MAPS_API_KEY }
#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling Google Maps API: {e}")
#         return None

# class GetDirectionsView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request):
#         start_address = request.data.get('start_address')
#         end_address = request.data.get('end_address')
#         if not start_address or not end_address:
#             return Response({'error': 'Start and end addresses are required.'}, status=status.HTTP_400_BAD_REQUEST)
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             return Response({'error': status_message}, status=status.HTTP_400_BAD_REQUEST)
#         legs = google_response['routes'][0]['legs'][0]
#         return Response({'distance': legs['distance']['text'], 'duration': legs['duration']['text']}, status=status.HTTP_200_OK)

# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#     def get_object(self): return self.request.user

# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer
#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))
#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")
#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             raise serializers.ValidationError(status_message)
#         route = google_response['routes'][0]
#         legs = route['legs'][0]
#         distance_km = legs['distance']['value'] / 1000.0
#         predicted_duration_hours = utils.predict_delivery_time(distance_km)
#         predicted_duration_text = f"{predicted_duration_hours:.1f} hours"
#         shipment = serializer.save(
#             client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
#             start_location_lat=legs['start_location']['lat'], start_location_lng=legs['start_location']['lng'],
#             end_location_lat=legs['end_location']['lat'], end_location_lng=legs['end_location']['lng'],
#             route_polyline=route['overview_polyline']['points'],
#             distance_km=distance_km, predicted_duration=predicted_duration_text
#         )
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # --- Analytics & Dashboard View ---
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()

#         # --- KEY CHANGES START HERE ---
        
#         # 1. Calculate the average distance of the user's shipments
#         user_shipments = Shipment.objects.filter(client=user)
#         average_distance_agg = user_shipments.aggregate(Avg('distance_km'))
#         average_distance = average_distance_agg['distance_km__avg'] or 75 # Default to 75km if no shipments

#         # 2. Use the average distance for the prediction
#         predicted_time_hours = utils.predict_delivery_time(average_distance)
        
#         # --- KEY CHANGES END HERE ---
        
#         predicted_maint_cost = utils.predict_maintenance_cost(2, 50000)
#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)
#         data = {
#             'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 'lowStockAlerts': low_stock_products },
#             'charts': {
#                 'monthlyVolume': { 'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 'data': monthly_volume },
#                 'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
#             },
#             'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
#         }
#         return Response(data, status=status.HTTP_200_OK)

# class MarkAsDeliveredView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request, pk):
#         try:
#             shipment = Shipment.objects.get(pk=pk, client=request.user)
#         except Shipment.DoesNotExist:
#             return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)
#         shipment.status = 'Delivered'
#         shipment.delivered_at = timezone.now()
#         shipment.save()
#         if shipment.agent:
#             shipment.agent.is_available = True
#             shipment.agent.save()
#         if shipment.vehicle:
#             shipment.vehicle.is_available = True
#             shipment.vehicle.save()
#         return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)



#----------till here latest------------------------------------



















#----------start here latest------------------------------------


# import random
# import requests
# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from django.db.models import Avg
# from datetime import date
# from rest_framework import viewsets, status, generics, serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # ... (get_google_maps_route, GetDirectionsView, Auth Views, other ViewSets are unchanged) ...
# def get_google_maps_route(origin_address, destination_address):
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = { "origin": origin_address, "destination": destination_address, "key": settings.GOOGLE_MAPS_API_KEY }
#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling Google Maps API: {e}")
#         return None

# class GetDirectionsView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request):
#         start_address = request.data.get('start_address')
#         end_address = request.data.get('end_address')
#         if not start_address or not end_address:
#             return Response({'error': 'Start and end addresses are required.'}, status=status.HTTP_400_BAD_REQUEST)
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             return Response({'error': status_message}, status=status.HTTP_400_BAD_REQUEST)
#         legs = google_response['routes'][0]['legs'][0]
#         return Response({'distance': legs['distance']['text'], 'duration': legs['duration']['text']}, status=status.HTTP_200_OK)

# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#     def get_object(self): return self.request.user

# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer
#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))
#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")
#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             raise serializers.ValidationError(status_message)
#         route = google_response['routes'][0]
#         legs = route['legs'][0]
#         distance_km = legs['distance']['value'] / 1000.0
#         predicted_duration_hours = utils.predict_delivery_time(distance_km)
#         predicted_duration_text = f"{predicted_duration_hours:.1f} hours"
#         shipment = serializer.save(
#             client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
#             start_location_lat=legs['start_location']['lat'], start_location_lng=legs['start_location']['lng'],
#             end_location_lat=legs['end_location']['lat'], end_location_lng=legs['end_location']['lng'],
#             route_polyline=route['overview_polyline']['points'],
#             distance_km=distance_km, predicted_duration=predicted_duration_text
#         )
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# # --- Analytics & Dashboard View ---
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()
        
#         user_shipments = Shipment.objects.filter(client=user)
#         average_distance_agg = user_shipments.aggregate(Avg('distance_km'))
#         average_distance = average_distance_agg['distance_km__avg'] or 75
#         predicted_time_hours = utils.predict_delivery_time(average_distance)

#         # --- KEY CHANGES FOR MAINTENANCE PREDICTION ---
        
#         all_vehicles = Vehicle.objects.filter(purchase_date__isnull=False)
#         total_age_days = 0
#         for vehicle in all_vehicles:
#             age_in_days = (date.today() - vehicle.purchase_date).days
#             total_age_days += max(0, age_in_days)
        
#         average_age_years = (total_age_days / 365.25) / all_vehicles.count() if all_vehicles.count() > 0 else 2

#         average_mileage_agg = all_vehicles.aggregate(Avg('total_km_driven'))
#         average_mileage = average_mileage_agg['total_km_driven__avg'] or 50000

#         predicted_maint_cost = utils.predict_maintenance_cost(average_age_years, average_mileage)
        
#         # This is the new "common sense" check to prevent negative costs
#         if predicted_maint_cost < 50:
#             predicted_maint_cost = 50.0 # Set a minimum base cost of $50
        
#         # --- END OF KEY CHANGES ---

#         monthly_volume = [random.randint(50, 300) for _ in range(12)]
#         on_time_percentage = random.randint(85, 98)
#         data = {
#             'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 'lowStockAlerts': low_stock_products },
#             'charts': {
#                 'monthlyVolume': { 'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 'data': monthly_volume },
#                 'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
#             },
#             'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
#         }
#         return Response(data, status=status.HTTP_200_OK)

# class MarkAsDeliveredView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         try:
#             shipment = Shipment.objects.get(pk=pk, client=request.user)
#         except Shipment.DoesNotExist:
#             return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)

#         shipment.status = 'Delivered'
#         shipment.delivered_at = timezone.now()
#         shipment.save()

#         if shipment.agent:
#             shipment.agent.is_available = True
#             shipment.agent.save()

#         if shipment.vehicle:
#             if shipment.distance_km:
#                 shipment.vehicle.total_km_driven += shipment.distance_km
#             shipment.vehicle.is_available = True
#             shipment.vehicle.save()
            
#         return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)


#----------start here latest------------------------------------



# from calendar import calendar
# import calendar as cal 
# from collections import defaultdict
# import random
# import requests
# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from django.db.models import Avg
# from datetime import date
# from django.db.models.functions import TruncMonth 
# from django.db.models import Avg, Sum
# from rest_framework import viewsets, status, generics, serializers
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import User, Product, Vehicle, Shipment, DeliveryAgent
# from .serializers import (
#     UserSerializer, ProductSerializer, VehicleSerializer,
#     ShipmentSerializer, DeliveryAgentSerializer
# )
# from . import utils

# # ... (All other views like GetDirectionsView, ShipmentViewSet, etc., remain unchanged) ...
# def get_google_maps_route(origin_address, destination_address):
#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = { "origin": origin_address, "destination": destination_address, "key": settings.GOOGLE_MAPS_API_KEY }
#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling Google Maps API: {e}")
#         return None

# class GetDirectionsView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request):
#         start_address = request.data.get('start_address')
#         end_address = request.data.get('end_address')
#         if not start_address or not end_address:
#             return Response({'error': 'Start and end addresses are required.'}, status=status.HTTP_400_BAD_REQUEST)
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             return Response({'error': status_message}, status=status.HTTP_400_BAD_REQUEST)
#         legs = google_response['routes'][0]['legs'][0]
#         return Response({'distance': legs['distance']['text'], 'duration': legs['duration']['text']}, status=status.HTTP_200_OK)

# # class SignupView(generics.CreateAPIView):
# #     queryset = User.objects.all()
# #     permission_classes = [AllowAny]
# #     serializer_class = UserSerializer
# #----------------------------------------
# class SignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

#     def perform_create(self, serializer):
#         """
#         This method is called when a new user is being created.
#         It overrides the default behavior to add our custom avatar logic.
#         """
        
#         # 1. Define the available avatar image paths
#         # These must match the paths inside your 'media' folder.
#         available_avatars = [
#             'IMAGES/img1.png',
#             'IMAGES/img2.png',
#             'IMAGES/img3.png',
#             'IMAGES/img4.png',
#         ]

#         # 2. Find which avatars are already in use by querying the database
#         used_avatars = set(User.objects.exclude(avatar__isnull=True).values_list('avatar', flat=True))

#         # 3. Find the first available avatar from your list
#         chosen_avatar = None
#         for avatar_path in available_avatars:
#             if avatar_path not in used_avatars:
#                 chosen_avatar = avatar_path
#                 break
        
#         # 4. If all avatars are already used, pick one at random to reuse
#         # This ensures the app doesn't crash if you have more users than images.
#         if not chosen_avatar:
#             chosen_avatar = random.choice(available_avatars)

#         # 5. Create the user first, then assign the chosen avatar and save again
#         user = serializer.save()
#         user.avatar = chosen_avatar
#         user.save()
# #---------------------------------------

# class ProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#     def get_object(self): return self.request.user

# class ProductViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Vehicle.objects.all()
#     serializer_class = VehicleSerializer

# class ShipmentViewSet(viewsets.ModelViewSet):
#     serializer_class = ShipmentSerializer
#     def get_queryset(self):
#         return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

#     def perform_create(self, serializer):
#         # --- KEY CHANGE: STOCK VALIDATION ---
        
#         # 1. Get the product and requested quantity from the incoming data
#         product = serializer.validated_data.get('product')
#         quantity = serializer.validated_data.get('quantity')

#         # 2. Check if the stock is sufficient
#         if product.stock < quantity:
#             # 3. If not, raise an error that the frontend will display
#             raise serializers.ValidationError(
#                 f"Out of stock. Only {product.stock} units available for {product.name}."
#             )
            
#         # --- END OF KEY CHANGE ---

#         available_agents = list(DeliveryAgent.objects.filter(is_available=True))
#         available_vehicles = list(Vehicle.objects.filter(is_available=True))
#         if not available_agents or not available_vehicles:
#             raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")
#         agent = random.choice(available_agents)
#         vehicle = random.choice(available_vehicles)
#         start_address = serializer.validated_data.get('start_address')
#         end_address = serializer.validated_data.get('end_address')
#         google_response = get_google_maps_route(start_address, end_address)
#         if not google_response or google_response['status'] != 'OK':
#             error_message = google_response.get('error_message', 'Could not calculate route.')
#             status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
#             raise serializers.ValidationError(status_message)
#         route = google_response['routes'][0]
#         legs = route['legs'][0]
#         distance_km = legs['distance']['value'] / 1000.0
#         predicted_duration_hours = utils.predict_delivery_time(distance_km)
#         predicted_duration_text = f"{predicted_duration_hours:.1f} hours"

#         # shipment = serializer.save(
#         #     client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
#         #     start_location_lat=legs['start_location']['lat'], start_location_lng=legs['start_location']['lng'],
#         #     end_location_lat=legs['end_location']['lat'], end_location_lng=legs['end_location']['lng'],
#         #     route_polyline=route['overview_polyline']['points'],
#         #     distance_km=distance_km, predicted_duration=predicted_duration_text
#         # )
#         #------------------------------------------
#         # --- KEY CHANGE: IMPROVED CITY PARSING ---
#         # This is more reliable for different address formats
#         destination_city = end_address.split(',')[0].strip()
        
#         weather_forecast = utils.scrape_weather_forecast(destination_city)
#         print(f"DEBUG: Scraped weather for {destination_city}: '{weather_forecast}'")
#         # # --- KEY CHANGE: SCRAPE AND SAVE WEATHER ---
        
#         # # 1. Extract the destination city from the address
#         # destination_city = end_address.split(',')[-2].strip() if ',' in end_address else end_address
        
#         # # 2. Call the scraper function
#         # weather_forecast = utils.scrape_weather_forecast(destination_city)
        
#         # 3. Save the forecast along with other shipment data
#         shipment = serializer.save(
#             client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
#             start_location_lat=legs['start_location']['lat'],
#             start_location_lng=legs['start_location']['lng'],
#             end_location_lat=legs['end_location']['lat'],
#             end_location_lng=legs['end_location']['lng'],
#             route_polyline=route['overview_polyline']['points'],
#             distance_km=distance_km,
#             predicted_duration=predicted_duration_text,
#             weather_forecast=weather_forecast # Save the scraped data
#         )
        
#         # --- END OF KEY CHANGE ---
#         #------------------------------------------
#         agent.is_available = False
#         vehicle.is_available = False
#         agent.save()
#         vehicle.save()

# #----------------------------------------------
# class DashboardAnalyticsView(APIView):
#     def get(self, request):
#         user = request.user
#         total_shipments = Shipment.objects.filter(client=user).count()
#         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
#         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
#         low_stock_products = Product.objects.filter(stock__gt=0, stock__lt=models.F('low_stock_threshold')).count()
#         out_of_stock_products = Product.objects.filter(stock=0).count()
#         total_alerts = low_stock_products + out_of_stock_products
        
#         user_shipments = Shipment.objects.filter(client=user)
#         average_distance_agg = user_shipments.aggregate(Avg('distance_km'))
#         average_distance = average_distance_agg['distance_km__avg'] or 75
#         predicted_time_hours = utils.predict_delivery_time(average_distance)
#         all_vehicles = Vehicle.objects.filter(purchase_date__isnull=False)
#         total_age_days = 0
#         for vehicle in all_vehicles:
#             age_in_days = (date.today() - vehicle.purchase_date).days
#             total_age_days += max(0, age_in_days)
#         average_age_years = (total_age_days / 365.25) / all_vehicles.count() if all_vehicles.count() > 0 else 2
#         average_mileage_agg = all_vehicles.aggregate(Avg('total_km_driven'))
#         average_mileage = average_mileage_agg['total_km_driven__avg'] or 50000
#         predicted_maint_cost = utils.predict_maintenance_cost(average_age_years, average_mileage)
#         if predicted_maint_cost < 50:
#             predicted_maint_cost = 50.0
        
#         # --- KEY CHANGES FOR DYNAMIC MONTHLY VOLUME ---
        
#         delivered_shipments = Shipment.objects.filter(client=request.user, status='Delivered')
#         monthly_totals = delivered_shipments.annotate(month=TruncMonth('created_at')).values('month').annotate(total_quantity=Sum('quantity')).values('month', 'total_quantity')
        
#         product_details_by_month = defaultdict(list)
#         for shipment in delivered_shipments:
#             month_key = shipment.created_at.month
#             product_details_by_month[month_key].append({
#                 'name': shipment.product.name,
#                 'quantity': shipment.quantity
#             })

#         monthly_volume_data = []
#         month_map = {item['month'].month: item['total_quantity'] for item in monthly_totals if item['month']}

#         for i in range(1, 13):
#             month_name = cal.month_abbr[i]
#             total_volume = month_map.get(i, 0)
#             products = product_details_by_month.get(i, [])
            
#             monthly_volume_data.append({
#                 "month": month_name,
#                 "totalVolume": total_volume,
#                 "products": products
#             })
        
#         on_time_percentage = random.randint(85, 98)
#         data = {
#             'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 'lowStockAlerts': total_alerts },
#             'charts': {
#                 'monthlyVolume': monthly_volume_data, # Use the new dynamic data
#                 'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
#             },
#             'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
#         }
#         return Response(data, status=status.HTTP_200_OK)

# #---------------------------------------------
# # class DashboardAnalyticsView(APIView):
# #     def get(self, request):
# #         user = request.user
# #         total_shipments = Shipment.objects.filter(client=user).count()
# #         in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
# #         delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()

# #         # --- KEY CHANGE: CALCULATE LOW STOCK AND OUT OF STOCK SEPARATELY ---
# #         # Find products that are low on stock but not completely out
# #         low_stock_products = Product.objects.filter(stock__gt=0, stock__lt=models.F('low_stock_threshold')).count()
# #         # Find products that are completely out of stock
# #         out_of_stock_products = Product.objects.filter(stock=0).count()
# #         # The total number of alerts is the sum of both
# #         total_alerts = low_stock_products + out_of_stock_products
        
# #         user_shipments = Shipment.objects.filter(client=user)
# #         average_distance_agg = user_shipments.aggregate(Avg('distance_km'))
# #         average_distance = average_distance_agg['distance_km__avg'] or 75
# #         predicted_time_hours = utils.predict_delivery_time(average_distance)
# #         all_vehicles = Vehicle.objects.filter(purchase_date__isnull=False)
# #         total_age_days = 0
# #   #------------------------------------------  
# #         # low_stock_products = Product.objects.filter(stock__lt=models.F('low_stock_threshold')).count()
# #         # user_shipments = Shipment.objects.filter(client=user)
# #         # average_distance_agg = user_shipments.aggregate(Avg('distance_km'))
# #         # average_distance = average_distance_agg['distance_km__avg'] or 75
# #         # predicted_time_hours = utils.predict_delivery_time(average_distance)
# #         # all_vehicles = Vehicle.objects.filter(purchase_date__isnull=False)
# #         # total_age_days = 0
# #         for vehicle in all_vehicles:
# #             age_in_days = (date.today() - vehicle.purchase_date).days
# #             total_age_days += max(0, age_in_days)
# #         average_age_years = (total_age_days / 365.25) / all_vehicles.count() if all_vehicles.count() > 0 else 2
# #         average_mileage_agg = all_vehicles.aggregate(Avg('total_km_driven'))
# #         average_mileage = average_mileage_agg['total_km_driven__avg'] or 50000
# #         predicted_maint_cost = utils.predict_maintenance_cost(average_age_years, average_mileage)
# #         if predicted_maint_cost < 50:
# #             predicted_maint_cost = 50.0
# #         monthly_volume = [random.randint(50, 300) for _ in range(12)]
# #         on_time_percentage = random.randint(85, 98)
# #         data = {
# #             'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 
# #                     #   'lowStockAlerts': low_stock_products },
# #                     'lowStockAlerts': total_alerts},
# #             'charts': {
# #                 'monthlyVolume': { 'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 'data': monthly_volume },
# #                 'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
# #             },
# #             'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
# #         }
# #         return Response(data, status=status.HTTP_200_OK)

# class MarkAsDeliveredView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         try:
#             shipment = Shipment.objects.get(pk=pk, client=request.user)
#         except Shipment.DoesNotExist:
#             return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)

#         # --- KEY CHANGES START HERE ---

#         # 1. Update Inventory Stock
#         product = shipment.product
#         if product.stock >= shipment.quantity:
#             product.stock -= shipment.quantity
#             product.save()
#         else:
#             # Handle case where stock is insufficient (optional)
#             print(f"Warning: Stock for {product.name} is insufficient.")

#         # 2. Update shipment status
#         shipment.status = 'Delivered'
#         shipment.delivered_at = timezone.now()
#         shipment.save()

#         # 3. Make the agent available again
#         if shipment.agent:
#             shipment.agent.is_available = True
#             shipment.agent.save()

#         # 4. Make the vehicle available again and update mileage
#         if shipment.vehicle:
#             if shipment.distance_km:
#                 shipment.vehicle.total_km_driven += shipment.distance_km
#             shipment.vehicle.is_available = True
#             shipment.vehicle.save()
            
#         # --- KEY CHANGES END HERE ---
            
#         return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)

#-----------------------latest end here-------------------------


















import random
import requests
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.db.models import Avg, Sum
from django.db.models.functions import TruncMonth
from datetime import date
from collections import defaultdict
import calendar as cal
from rest_framework import viewsets, status, generics, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, Product, Vehicle, Shipment, DeliveryAgent
from .serializers import (
    UserSerializer, ProductSerializer, VehicleSerializer,
    ShipmentSerializer, DeliveryAgentSerializer
)
from . import utils

# --- Helper Function to get route from Google Maps ---
def get_google_maps_route(origin_address, destination_address):
    base_url = "https://maps.googleapis.com/maps/api/directions/json"
    params = { "origin": origin_address, "destination": destination_address, "key": settings.GOOGLE_MAPS_API_KEY }
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling Google Maps API: {e}")
        return None

# --- View for getting directions in the modal ---
class GetDirectionsView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        start_address = request.data.get('start_address')
        end_address = request.data.get('end_address')
        if not start_address or not end_address:
            return Response({'error': 'Start and end addresses are required.'}, status=status.HTTP_400_BAD_REQUEST)
        google_response = get_google_maps_route(start_address, end_address)
        if not google_response or google_response['status'] != 'OK':
            error_message = google_response.get('error_message', 'Could not calculate route.')
            status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
            return Response({'error': status_message}, status=status.HTTP_400_BAD_REQUEST)
        legs = google_response['routes'][0]['legs'][0]
        return Response({'distance': legs['distance']['text'], 'duration': legs['duration']['text']}, status=status.HTTP_200_OK)

# --- Authentication Views ---
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        available_avatars = ['IMAGES/img1.png', 'IMAGES/img2.png', 'IMAGES/img3.png', 'IMAGES/img4.png']
        used_avatars = set(User.objects.exclude(avatar__isnull=True).values_list('avatar', flat=True))
        chosen_avatar = None
        for avatar_path in available_avatars:
            if avatar_path not in used_avatars:
                chosen_avatar = avatar_path
                break
        if not chosen_avatar:
            chosen_avatar = random.choice(available_avatars)
        user = serializer.save()
        user.avatar = chosen_avatar
        user.save()

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self): return self.request.user

# --- Read-Only Data Views ---
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

# --- Main Shipment Logic ---
class ShipmentViewSet(viewsets.ModelViewSet):
    serializer_class = ShipmentSerializer
    def get_queryset(self):
        return Shipment.objects.filter(client=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        product = serializer.validated_data.get('product')
        quantity = serializer.validated_data.get('quantity')
        if product.stock < quantity:
            raise serializers.ValidationError(f"Out of stock. Only {product.stock} units available for {product.name}.")
        
        available_agents = list(DeliveryAgent.objects.filter(is_available=True))
        available_vehicles = list(Vehicle.objects.filter(is_available=True))
        if not available_agents or not available_vehicles:
            raise serializers.ValidationError("No available delivery agents or vehicles at the moment.")
        
        agent = random.choice(available_agents)
        vehicle = random.choice(available_vehicles)
        start_address = serializer.validated_data.get('start_address')
        end_address = serializer.validated_data.get('end_address')
        
        google_response = get_google_maps_route(start_address, end_address)
        if not google_response or google_response['status'] != 'OK':
            error_message = google_response.get('error_message', 'Could not calculate route.')
            status_message = f"Google Maps Error: {google_response['status']}. {error_message}"
            raise serializers.ValidationError(status_message)
        
        route = google_response['routes'][0]
        legs = route['legs'][0]
        distance_km = legs['distance']['value'] / 1000.0
        predicted_duration_hours = utils.predict_delivery_time(distance_km)
        predicted_duration_text = f"{predicted_duration_hours:.1f} hours"
        
        # --- KEY CHANGE: IMPROVED CITY PARSING AND DEBUGGING ---
        
        print(f"DEBUG: Full address received: '{end_address}'")
        
        # This logic is more robust for different address formats
        address_parts = [part.strip() for part in end_address.split(',')]
        if len(address_parts) >= 2:
            # Assumes the city is the second to last part (e.g., "Surat, Gujarat")
            destination_city = address_parts[-2]
        else:
            destination_city = address_parts[0]

        print(f"DEBUG: Parsed city for weather: '{destination_city}'")
        weather_forecast = utils.get_weather_forecast(destination_city)
        print(f"DEBUG: Fetched weather result: '{weather_forecast}'")
        
        shipment = serializer.save(
            client=self.request.user, agent=agent, vehicle=vehicle, status='In Transit',
            start_location_lat=legs['start_location']['lat'],
            start_location_lng=legs['start_location']['lng'],
            end_location_lat=legs['end_location']['lat'],
            end_location_lng=legs['end_location']['lng'],
            route_polyline=route['overview_polyline']['points'],
            distance_km=distance_km,
            predicted_duration=predicted_duration_text,
            weather_forecast=weather_forecast
        )
        
        agent.is_available = False
        vehicle.is_available = False
        agent.save()
        vehicle.save()
        
# --- Analytics View ---
class DashboardAnalyticsView(APIView):
    def get(self, request):
        user = request.user
        total_shipments = Shipment.objects.filter(client=user).count()
        in_transit_count = Shipment.objects.filter(client=user, status='In Transit').count()
        delivered_count = Shipment.objects.filter(client=user, status='Delivered').count()
        low_stock_products = Product.objects.filter(stock__gt=0, stock__lt=models.F('low_stock_threshold')).count()
        out_of_stock_products = Product.objects.filter(stock=0).count()
        total_alerts = low_stock_products + out_of_stock_products
        
        user_shipments = Shipment.objects.filter(client=user)
        average_distance_agg = user_shipments.aggregate(Avg('distance_km'))
        average_distance = average_distance_agg['distance_km__avg'] or 75
        predicted_time_hours = utils.predict_delivery_time(average_distance)
        
        all_vehicles = Vehicle.objects.filter(purchase_date__isnull=False)
        total_age_days = 0
        for vehicle in all_vehicles:
            age_in_days = (date.today() - vehicle.purchase_date).days
            total_age_days += max(0, age_in_days)
        average_age_years = (total_age_days / 365.25) / all_vehicles.count() if all_vehicles.count() > 0 else 2
        average_mileage_agg = all_vehicles.aggregate(Avg('total_km_driven'))
        average_mileage = average_mileage_agg['total_km_driven__avg'] or 50000
        predicted_maint_cost = utils.predict_maintenance_cost(average_age_years, average_mileage)
        if predicted_maint_cost < 50:
            predicted_maint_cost = 50.0
        
        delivered_shipments = Shipment.objects.filter(client=request.user, status='Delivered')
        monthly_totals = delivered_shipments.annotate(month=TruncMonth('created_at')).values('month').annotate(total_quantity=Sum('quantity')).values('month', 'total_quantity')
        
        product_details_by_month = defaultdict(list)
        for shipment in delivered_shipments:
            month_key = shipment.created_at.month
            product_details_by_month[month_key].append({
                'name': shipment.product.name,
                'quantity': shipment.quantity
            })

        monthly_volume_data = []
        month_map = {item['month'].month: item['total_quantity'] for item in monthly_totals if item['month']}
        for i in range(1, 13):
            month_name = cal.month_abbr[i]
            total_volume = month_map.get(i, 0)
            products = product_details_by_month.get(i, [])
            monthly_volume_data.append({
                "month": month_name,
                "totalVolume": total_volume,
                "products": products
            })
        
        on_time_percentage = random.randint(85, 98)
        data = {
            'stats': { 'totalShipments': total_shipments, 'inTransit': in_transit_count, 'delivered': delivered_count, 'lowStockAlerts': total_alerts },
            'charts': {
                'monthlyVolume': monthly_volume_data,
                'deliveryPerformance': { 'labels': ['On-Time', 'Delayed'], 'data': [on_time_percentage, 100 - on_time_percentage] }
            },
            'predictions': { 'deliveryTime': f"{predicted_time_hours:.1f} hours", 'maintenanceCost': f"${predicted_maint_cost:.2f}" }
        }
        return Response(data, status=status.HTTP_200_OK)

# --- Delivery Completion View ---
class MarkAsDeliveredView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            shipment = Shipment.objects.get(pk=pk, client=request.user)
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        product = shipment.product
        if product.stock >= shipment.quantity:
            product.stock -= shipment.quantity
            product.save()
        else:
            print(f"Warning: Stock for {product.name} was insufficient at time of delivery.")

        shipment.status = 'Delivered'
        shipment.delivered_at = timezone.now()
        shipment.save()

        if shipment.agent:
            shipment.agent.is_available = True
            shipment.agent.save()

        if shipment.vehicle:
            if shipment.distance_km:
                shipment.vehicle.total_km_driven += shipment.distance_km
            shipment.vehicle.is_available = True
            shipment.vehicle.save()
            
        return Response({'status': 'Shipment marked as delivered'}, status=status.HTTP_200_OK)
