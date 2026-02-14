from rest_framework import serializers

from .models import Property, PropertyImage, PropertyVideo, SiteContact


def _file_url(file_field):
    if file_field:
        return file_field.url
    return None


class PropertyImageSerializer(serializers.ModelSerializer):
    """Serializer for property images."""

    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'caption', 'order']

    def get_image(self, obj):
        return _file_url(obj.image)


class PropertyVideoSerializer(serializers.ModelSerializer):
    """Serializer for property videos."""

    video = serializers.SerializerMethodField()

    class Meta:
        model = PropertyVideo
        fields = ['id', 'video', 'caption', 'order']

    def get_video(self, obj):
        return _file_url(obj.video)


class PropertyListSerializer(serializers.ModelSerializer):
    """Serializer for property listing (summary view)."""

    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'price',
            'formatted_price',
            'city',
            'state',
            'neighborhood',
            'bedrooms',
            'bathrooms',
            'parking_spots',
            'area',
            'property_type',
            'property_type_display',
            'status',
            'status_display',
            'main_image',
            'is_featured',
        ]

    def get_main_image(self, obj):
        return _file_url(obj.main_image)


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Serializer for property detail view."""

    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    media_gallery = serializers.SerializerMethodField()
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'description',
            'price',
            'formatted_price',
            'address',
            'city',
            'state',
            'neighborhood',
            'bedrooms',
            'bathrooms',
            'parking_spots',
            'area',
            'property_type',
            'property_type_display',
            'status',
            'status_display',
            'main_image',
            'images',
            'videos',
            'media_gallery',
            'is_featured',
            'created_at',
            'updated_at',
        ]

    def get_main_image(self, obj):
        return _file_url(obj.main_image)

    def get_media_gallery(self, obj):
        gallery = []
        seen_urls = set()

        if obj.main_image:
            seen_urls.add(obj.main_image.url)
            gallery.append(
                {
                    'type': 'image',
                    'url': obj.main_image.url,
                    'caption': obj.title,
                    'order': -1,
                    'is_main': True,
                }
            )

        non_main_items = []
        for image in obj.images.all():
            if image.image:
                image_url = image.image.url
                if image_url in seen_urls:
                    continue
                seen_urls.add(image_url)
                non_main_items.append(
                    {
                        'type': 'image',
                        'url': image_url,
                        'caption': image.caption,
                        'order': image.order,
                        'is_main': False,
                    }
                )

        for video in obj.videos.all():
            if video.video:
                video_url = video.video.url
                if video_url in seen_urls:
                    continue
                seen_urls.add(video_url)
                non_main_items.append(
                    {
                        'type': 'video',
                        'url': video_url,
                        'caption': video.caption,
                        'order': video.order,
                        'is_main': False,
                    }
                )

        non_main_items.sort(key=lambda item: (item['order'], 0 if item['type'] == 'image' else 1))
        gallery.extend(non_main_items)

        return gallery


class SiteContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContact
        fields = [
            'site_name',
            'hero_title',
            'hero_subtitle',
            'brand_message',
            'whatsapp_number',
            'phone_number',
            'email',
            'address',
            'business_hours_weekdays',
            'business_hours_saturday',
            'business_hours_sunday',
        ]
