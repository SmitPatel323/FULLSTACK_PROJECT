from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['Admin', 'Staff'])

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Client')

class IsDeliveryAgent(BasePermission):
     def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Delivery Agent')

# --- THIS IS THE FIX ---
# This new permission class allows read-only access for any authenticated user,
# but restricts write access (POST, PUT, DELETE) to Admins and Staff.
class IsAdminOrStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return bool(request.user and request.user.is_authenticated and request.user.role in ['Admin', 'Staff'])
# --- END OF FIX ---

class IsAdminOrIsSelf(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    def has_object_permission(self, request, view, obj):
        return bool(request.user.role == 'Admin' or obj == request.user)