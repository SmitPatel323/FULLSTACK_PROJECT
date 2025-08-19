from rest_framework import serializers
from .models import User, Product, Vehicle, DeliveryAgent, Shipment

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password', 'avatar']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             username=validated_data['username'],
#             password=validated_data['password']
#         )
#         return user

#-----------------------------
class UserSerializer(serializers.ModelSerializer):
    # This new field will build the full URL for the avatar
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        # Add avatar_url to the fields list
        fields = ['id', 'username', 'email', 'password', 'avatar', 'avatar_url']
        extra_kwargs = {
            'password': {'write_only': True},
            'avatar': {'read_only': True} # The avatar path is set by the server
        }

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            # --- THIS IS THE FIX ---
            # If the avatar is a full URL, return it directly.
            if obj.avatar.startswith('http'):
                return obj.avatar
            # Otherwise, build the full local URL.
            if request:
                return request.build_absolute_uri(f'/media/{obj.avatar}')
        return None # Return None if no avatar is set

    def create(self, validated_data):
        # We handle avatar assignment in the view, so just create the user here
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
#-----------------------------
class ProductSerializer(serializers.ModelSerializer):
    # is_low_stock = serializers.SerializerMethodField()

    # class Meta:
    #     model = Product
    #     fields = '__all__'
        
    # def get_is_low_stock(self, obj):
    #     return obj.stock < obj.low_stock_threshold
    #--------------------------------------------------------
    # --- KEY CHANGE: Replace the boolean field with a status string ---
    stock_status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        # Add the new field to the list
        fields = ['id', 'name', 'sku', 'stock', 'description', 'low_stock_threshold', 'stock_status']
        
    def get_stock_status(self, obj):
        """
        Returns a string representing the stock status based on the threshold.
        """
        if obj.stock == 0:
            return "Out of Stock"
        if obj.stock < obj.low_stock_threshold:
            return "Low Stock"
        return "In Stock"
    #--------------------------------------------------------

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class DeliveryAgentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = DeliveryAgent
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    # Make related fields readable for GET requests
    client = UserSerializer(read_only=True)
    agent = DeliveryAgentSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    
    # Make foreign key fields writeable for POST/PUT requests
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Shipment
        fields = [
            'id', 'client', 'product', 'product_id', 'quantity', 'agent',
            'vehicle', 'status', 'created_at', 'delivered_at', 'start_address', 
            'end_address', 'start_location_lat', 'start_location_lng', 
            'end_location_lat', 'end_location_lng', 'route_polyline',
            'distance_km', 'predicted_duration' # <-- ADD NEW FIELDS HERE,
            , 'weather_forecast' # <-- ADD NEW FIELD
        ]
        read_only_fields = ('client', 'agent', 'vehicle', 'status', 'created_at', 'delivered_at', 'start_location_lat', 'start_location_lng', 'end_location_lat', 'end_location_lng', 'route_polyline',
                            'distance_km', 'predicted_duration',
            'weather_forecast' # <-- ADD NEW FIELD
            )

