from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models


MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024
ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg']


def validate_video_size(file_obj):
    """Validate property video size (max 100MB)."""
    if file_obj and file_obj.size > MAX_VIDEO_SIZE_BYTES:
        raise ValidationError('O vídeo deve ter no máximo 100 MB.')


class Property(models.Model):
    """Model representing a real estate property."""

    PROPERTY_TYPES = [
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
        ('terreno', 'Terreno'),
        ('comercial', 'Comercial'),
        ('rural', 'Rural'),
    ]

    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('vendido', 'Vendido'),
        ('reservado', 'Reservado'),
    ]

    title = models.CharField('Título', max_length=200)
    description = models.TextField('Descrição')
    price = models.DecimalField('Preço', max_digits=12, decimal_places=2)
    address = models.CharField('Endereço', max_length=300)
    city = models.CharField('Cidade', max_length=100)
    state = models.CharField('Estado', max_length=2)
    neighborhood = models.CharField('Bairro', max_length=100, blank=True)

    bedrooms = models.PositiveIntegerField('Quartos', default=0)
    bathrooms = models.PositiveIntegerField('Banheiros', default=0)
    parking_spots = models.PositiveIntegerField('Vagas de garagem', default=0)
    area = models.DecimalField('Área (m²)', max_digits=10, decimal_places=2)

    property_type = models.CharField('Tipo', max_length=20, choices=PROPERTY_TYPES, default='casa')
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='disponivel')

    main_image = models.ImageField('Imagem principal', upload_to='properties/main/')

    is_featured = models.BooleanField('Destaque', default=False)
    is_active = models.BooleanField('Ativo', default=True)

    created_at = models.DateTimeField('Criado em', auto_now_add=True)
    updated_at = models.DateTimeField('Atualizado em', auto_now=True)

    class Meta:
        verbose_name = 'Imóvel'
        verbose_name_plural = 'Imóveis'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.city}/{self.state}'

    @property
    def formatted_price(self):
        return f'R$ {self.price:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')

class PropertyImage(models.Model):
    """Additional images for a property."""

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Imóvel'
    )
    image = models.ImageField('Imagem', upload_to='properties/gallery/')
    caption = models.CharField('Legenda', max_length=200, blank=True)
    order = models.PositiveIntegerField('Ordem', default=0)

    class Meta:
        verbose_name = 'Imagem do imóvel'
        verbose_name_plural = 'Imagens do imóvel'
        ordering = ['order']

    def __str__(self):
        return f'Imagem de {self.property.title}'


class PropertyVideo(models.Model):
    """Videos for a property gallery."""

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='videos',
        verbose_name='Imóvel'
    )
    video = models.FileField(
        'Vídeo',
        upload_to='properties/videos/',
        validators=[
            FileExtensionValidator(allowed_extensions=ALLOWED_VIDEO_EXTENSIONS),
            validate_video_size,
        ],
    )
    caption = models.CharField('Legenda', max_length=200, blank=True)
    order = models.PositiveIntegerField('Ordem', default=0)

    class Meta:
        verbose_name = 'Vídeo do imóvel'
        verbose_name_plural = 'Vídeos do imóvel'
        ordering = ['order', 'id']

    def __str__(self):
        return f'Vídeo de {self.property.title}'


class SiteContact(models.Model):
    """Singleton model for company contact details shown in the frontend."""

    site_name = models.CharField(
        'Nome da aplicação',
        max_length=120,
        default='Abritta Prime',
    )
    hero_title = models.TextField(
        'Título principal da Home',
        default='Imoveis de alto impacto para compras inteligentes.',
    )
    hero_subtitle = models.TextField(
        'Subtítulo principal da Home',
        default=(
            'Da primeira visita a assinatura, conduzimos todo o processo com '
            'estrategia comercial e atencao aos detalhes.'
        ),
    )
    brand_message = models.TextField(
        'Mensagem institucional',
        blank=True,
        default=(
            'Curadoria imobiliaria premium para quem busca decisao segura, '
            'negociacao inteligente e atendimento consultivo.'
        ),
    )
    whatsapp_number = models.CharField('WhatsApp', max_length=20, blank=True, default='')
    phone_number = models.CharField('Telefone', max_length=20, blank=True, default='')
    email = models.EmailField('E-mail', blank=True, default='')
    address = models.CharField('Endereço', max_length=300, blank=True, default='')

    business_hours_weekdays = models.CharField(
        'Horário (Segunda a Sexta)',
        max_length=100,
        default='09:00 - 18:00',
    )
    business_hours_saturday = models.CharField(
        'Horário (Sábado)',
        max_length=100,
        default='09:00 - 13:00',
    )
    business_hours_sunday = models.CharField(
        'Horário (Domingo)',
        max_length=100,
        default='Fechado',
    )
    updated_at = models.DateTimeField('Atualizado em', auto_now=True)

    class Meta:
        verbose_name = 'Contato do site'
        verbose_name_plural = 'Contato do site'

    def save(self, *args, **kwargs):
        # Enforce singleton behavior.
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Contato principal do site ({self.site_name})'
