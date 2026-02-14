from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Property, SiteContact
from .serializers import PropertyListSerializer, PropertyDetailSerializer, SiteContactSerializer


class PropertyListAPIView(generics.ListAPIView):
    """API endpoint for listing active properties."""

    serializer_class = PropertyListSerializer

    def get_queryset(self):
        queryset = Property.objects.filter(is_active=True)

        property_type = self.request.query_params.get('type')
        if property_type:
            queryset = queryset.filter(property_type=property_type)

        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        bedrooms = self.request.query_params.get('bedrooms')
        if bedrooms:
            queryset = queryset.filter(bedrooms__gte=bedrooms)

        sort = self.request.query_params.get('sort')
        if sort == 'price_asc':
            return queryset.order_by('price', '-is_featured', '-created_at')
        if sort == 'price_desc':
            return queryset.order_by('-price', '-is_featured', '-created_at')

        return queryset.order_by('-is_featured', '-created_at')


class PropertyDetailAPIView(generics.RetrieveAPIView):
    """API endpoint for property detail."""

    serializer_class = PropertyDetailSerializer
    queryset = Property.objects.filter(is_active=True)


class SiteContactAPIView(APIView):
    """Read-only endpoint for site contact data."""

    def get(self, request):
        contact = SiteContact.objects.first() or SiteContact()
        serializer = SiteContactSerializer(contact)
        return Response(serializer.data)
