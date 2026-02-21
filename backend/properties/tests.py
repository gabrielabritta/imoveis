import tempfile
from io import BytesIO
from types import SimpleNamespace

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image
from rest_framework.test import APITestCase

from .models import (
    MAX_VIDEO_SIZE_BYTES,
    Property,
    PropertyImage,
    PropertyVideo,
    SiteContact,
    validate_video_size,
)


def make_image_file(name='test.png', color=(30, 30, 30)):
    buffer = BytesIO()
    image = Image.new('RGB', (10, 10), color=color)
    image.save(buffer, format='PNG')
    buffer.seek(0)
    return SimpleUploadedFile(name, buffer.getvalue(), content_type='image/png')


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class PropertyApiTests(APITestCase):
    def create_property(self, title, price):
        return Property.objects.create(
            title=title,
            description='Descricao teste',
            price=price,
            address='Rua Teste, 123',
            city='Sao Paulo',
            state='SP',
            neighborhood='Centro',
            bedrooms=2,
            bathrooms=2,
            parking_spots=1,
            area='75.00',
            property_type='casa',
            status='disponivel',
            main_image=make_image_file(name=f'{title}.png'),
            is_active=True,
        )

    def test_property_creation_does_not_auto_create_gallery_image(self):
        property_obj = self.create_property('Imovel Sem Auto Galeria', '350000.00')

        self.assertEqual(property_obj.images.count(), 0)

    def test_property_list_sort_price_asc(self):
        self.create_property('Imovel C', '900000.00')
        self.create_property('Imovel A', '300000.00')
        self.create_property('Imovel B', '600000.00')

        response = self.client.get('/api/properties/?sort=price_asc')

        self.assertEqual(response.status_code, 200)
        returned_prices = [item['price'] for item in response.json()]
        self.assertEqual(returned_prices, ['300000.00', '600000.00', '900000.00'])

    def test_property_list_sort_price_desc(self):
        self.create_property('Imovel C', '900000.00')
        self.create_property('Imovel A', '300000.00')
        self.create_property('Imovel B', '600000.00')

        response = self.client.get('/api/properties/?sort=price_desc')

        self.assertEqual(response.status_code, 200)
        returned_prices = [item['price'] for item in response.json()]
        self.assertEqual(returned_prices, ['900000.00', '600000.00', '300000.00'])

    def test_property_detail_returns_media_gallery_with_main_image_and_video(self):
        property_obj = self.create_property('Imovel Midia', '450000.00')
        PropertyImage.objects.create(
            property=property_obj,
            image=make_image_file(name='extra.png', color=(120, 120, 120)),
            caption='Foto extra',
            order=2,
        )
        PropertyVideo.objects.create(
            property=property_obj,
            video=SimpleUploadedFile('tour.mp4', b'video-bytes', content_type='video/mp4'),
            caption='Tour virtual',
            order=1,
        )

        response = self.client.get(f'/api/properties/{property_obj.id}/')
        payload = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('media_gallery', payload)
        self.assertGreaterEqual(len(payload['media_gallery']), 2)
        self.assertEqual(payload['media_gallery'][0]['type'], 'image')
        self.assertTrue(payload['media_gallery'][0]['is_main'])
        self.assertTrue(any(item['type'] == 'video' for item in payload['media_gallery']))

    def test_property_video_rejects_invalid_extension(self):
        property_obj = self.create_property('Imovel Video', '500000.00')
        video = PropertyVideo(
            property=property_obj,
            video=SimpleUploadedFile('tour.avi', b'video-bytes', content_type='video/avi'),
            caption='Formato invalido',
            order=0,
        )

        with self.assertRaises(ValidationError):
            video.full_clean()

    def test_validate_video_size_rejects_over_100mb(self):
        with self.assertRaises(ValidationError):
            validate_video_size(SimpleNamespace(size=MAX_VIDEO_SIZE_BYTES + 1))

    def test_site_contact_fallback_when_missing(self):
        response = self.client.get('/api/site-contact/')
        payload = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload['site_name'], 'Abritta Prime')
        self.assertEqual(payload['hero_title'], 'Imoveis de alto impacto para compras inteligentes.')
        self.assertEqual(
            payload['hero_subtitle'],
            'Da primeira visita a assinatura, conduzimos todo o processo com estrategia comercial e atencao aos detalhes.',
        )
        self.assertEqual(
            payload['brand_message'],
            'Curadoria imobiliaria premium para quem busca decisao segura, negociacao inteligente e atendimento consultivo.',
        )
        self.assertEqual(payload['whatsapp_number'], '')
        self.assertEqual(payload['phone_number'], '')
        self.assertEqual(payload['email'], '')
        self.assertEqual(payload['address'], '')
        self.assertEqual(payload['business_hours_weekdays'], '09:00 - 18:00')
        self.assertEqual(payload['business_hours_saturday'], '09:00 - 13:00')
        self.assertEqual(payload['business_hours_sunday'], 'Fechado')

    def test_site_contact_returns_saved_values(self):
        SiteContact.objects.create(
            site_name='Nova Marca Imoveis',
            hero_title='Titulo editado da home',
            hero_subtitle='Subtitulo editado da home',
            brand_message='Curadoria personalizada para negocios imobiliarios.',
            whatsapp_number='5532999999999',
            phone_number='(32) 3333-4444',
            email='contato@abritta.com.br',
            address='Av. Paulista, 1000 - Sao Paulo/SP',
            business_hours_weekdays='08:30 - 18:30',
            business_hours_saturday='09:00 - 14:00',
            business_hours_sunday='Plantao sob consulta',
        )

        response = self.client.get('/api/site-contact/')
        payload = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload['site_name'], 'Nova Marca Imoveis')
        self.assertEqual(payload['hero_title'], 'Titulo editado da home')
        self.assertEqual(payload['hero_subtitle'], 'Subtitulo editado da home')
        self.assertEqual(payload['brand_message'], 'Curadoria personalizada para negocios imobiliarios.')
        self.assertEqual(payload['whatsapp_number'], '5532999999999')
        self.assertEqual(payload['phone_number'], '(32) 3333-4444')
        self.assertEqual(payload['email'], 'contato@abritta.com.br')
        self.assertEqual(payload['address'], 'Av. Paulista, 1000 - Sao Paulo/SP')
        self.assertEqual(payload['business_hours_weekdays'], '08:30 - 18:30')
        self.assertEqual(payload['business_hours_saturday'], '09:00 - 14:00')
        self.assertEqual(payload['business_hours_sunday'], 'Plantao sob consulta')
