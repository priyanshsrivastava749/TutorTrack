from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserViewSet, AssignmentViewSet, ResourceQueryViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'queries', ResourceQueryViewSet, basename='query')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', AuthViewSet.as_view({'post': 'login'})),
    path('auth/register/', AuthViewSet.as_view({'post': 'register'})),
    path('link-student/', UserViewSet.as_view({'post': 'link_student'})),
]
