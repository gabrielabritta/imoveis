from django.urls import path
from .views import PropertyListAPIView, PropertyDetailAPIView

app_name = 'properties'

urlpatterns = [
    path('', PropertyListAPIView.as_view(), name='property-list'),
    path('<int:pk>/', PropertyDetailAPIView.as_view(), name='property-detail'),
]
