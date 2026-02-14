from django.contrib import admin
from django.utils.html import format_html

from .models import Property, PropertyImage, PropertyVideo, SiteContact


class PropertyImageInline(admin.TabularInline):
    """Inline admin for property images."""

    model = PropertyImage
    extra = 1
    fields = ['image', 'caption', 'order', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; max-width: 120px; object-fit: cover;"/>',
                obj.image.url,
            )
        return '-'

    image_preview.short_description = 'Preview'


class PropertyVideoInline(admin.TabularInline):
    """Inline admin for property videos."""

    model = PropertyVideo
    extra = 1
    fields = ['video', 'caption', 'order', 'video_preview']
    readonly_fields = ['video_preview']

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video src="{}" style="max-height: 80px; max-width: 140px;" muted preload="metadata"></video>',
                obj.video.url,
            )
        return '-'

    video_preview.short_description = 'Preview'


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Admin configuration for Property model."""

    list_display = [
        'title',
        'city',
        'property_type',
        'formatted_price_display',
        'bedrooms',
        'status',
        'is_featured',
        'is_active',
        'main_image_preview',
    ]
    list_filter = ['property_type', 'status', 'city', 'state', 'is_active', 'is_featured']
    search_fields = ['title', 'description', 'address', 'city', 'neighborhood']
    list_editable = ['status', 'is_featured', 'is_active']
    actions = ['mark_as_featured', 'unmark_as_featured']

    fieldsets = [
        ('Informacoes Basicas', {'fields': ['title', 'description', 'property_type', 'status']}),
        ('Localizacao', {'fields': ['address', 'neighborhood', 'city', 'state']}),
        ('Caracteristicas', {'fields': ['price', 'area', 'bedrooms', 'bathrooms', 'parking_spots']}),
        ('Imagem Principal', {'fields': ['main_image', 'main_image_preview_large']}),
        ('Opcoes', {'fields': ['is_featured', 'is_active']}),
    ]

    readonly_fields = ['main_image_preview_large']
    inlines = [PropertyImageInline, PropertyVideoInline]

    def formatted_price_display(self, obj):
        return obj.formatted_price

    formatted_price_display.short_description = 'Preco'
    formatted_price_display.admin_order_field = 'price'

    def main_image_preview(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 80px; object-fit: cover; border-radius: 4px;"/>',
                obj.main_image.url,
            )
        return '-'

    main_image_preview.short_description = 'Imagem'

    def main_image_preview_large(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 300px; object-fit: cover; border-radius: 8px;"/>',
                obj.main_image.url,
            )
        return 'Nenhuma imagem'

    main_image_preview_large.short_description = 'Preview'

    @admin.action(description='Marcar selecionados como destaque')
    def mark_as_featured(self, request, queryset):
        queryset.update(is_featured=True)

    @admin.action(description='Remover destaque dos selecionados')
    def unmark_as_featured(self, request, queryset):
        queryset.update(is_featured=False)


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """Admin for PropertyImage (for bulk management)."""

    list_display = ['property', 'caption', 'order', 'image_preview']
    list_filter = ['property']
    search_fields = ['property__title', 'caption']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 80px; object-fit: cover;"/>',
                obj.image.url,
            )
        return '-'

    image_preview.short_description = 'Preview'


@admin.register(PropertyVideo)
class PropertyVideoAdmin(admin.ModelAdmin):
    """Admin for PropertyVideo (for bulk management)."""

    list_display = ['property', 'caption', 'order', 'video_preview']
    list_filter = ['property']
    search_fields = ['property__title', 'caption']

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video src="{}" style="max-height: 60px; max-width: 100px;" muted preload="metadata"></video>',
                obj.video.url,
            )
        return '-'

    video_preview.short_description = 'Preview'


@admin.register(SiteContact)
class SiteContactAdmin(admin.ModelAdmin):
    """Singleton admin for site contact settings."""

    fieldsets = [
        ('Marca', {'fields': ['site_name', 'hero_title', 'hero_subtitle', 'brand_message']}),
        ('Canais de Contato', {'fields': ['whatsapp_number', 'phone_number', 'email', 'address']}),
        (
            'Horarios',
            {
                'fields': [
                    'business_hours_weekdays',
                    'business_hours_saturday',
                    'business_hours_sunday',
                ]
            },
        ),
    ]
    list_display = ['site_name', 'whatsapp_number', 'phone_number', 'email', 'updated_at']

    def has_add_permission(self, request):
        if SiteContact.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


admin.site.site_header = 'Abritta Imoveis - Administracao'
admin.site.site_title = 'Abritta Imoveis Admin'
admin.site.index_title = 'Painel de Controle'
