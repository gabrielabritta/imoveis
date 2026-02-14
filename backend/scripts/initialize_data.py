"""
Initialize database with sample property data.

Run with: python manage.py runscript initialize_data
"""
from decimal import Decimal
from django.core.files import File
from pathlib import Path
from properties.models import Property


def run():
    """Create initial sample properties."""

    # Check if data already exists
    if Property.objects.exists():
        print("⚠️  Dados já existem no banco. Pulando inicialização.")
        return

    print("🏠 Inicializando dados de exemplo...")

    base_path = Path(__file__).resolve().parent.parent / 'media' / 'properties' / 'main'

    properties_data = [
        {
            'title': 'Casa Moderna no Jardim Europa',
            'description': '''Espetacular casa moderna em condomínio fechado de alto padrão.

Projetada por renomado escritório de arquitetura, esta residência oferece o máximo em conforto e sofisticação. Amplos espaços integrados, pé direito duplo na sala de estar, e acabamentos premium em todos os ambientes.

Destaques:
• Piscina com borda infinita e deck em madeira
• Cozinha gourmet totalmente equipada
• Home theater com isolamento acústico
• Suíte master com closet e hidromassagem
• Jardim paisagístico automatizado
• Sistema de automação residencial completo''',
            'price': Decimal('2850000.00'),
            'address': 'Rua das Palmeiras, 450',
            'neighborhood': 'Jardim Europa',
            'city': 'São Paulo',
            'state': 'SP',
            'bedrooms': 4,
            'bathrooms': 5,
            'parking_spots': 4,
            'area': Decimal('380.00'),
            'property_type': 'casa',
            'is_featured': True,
            'image_file': 'casa_moderna.png',
        },
        {
            'title': 'Apartamento de Luxo com Vista Panorâmica',
            'description': '''Apartamento exclusivo no andar alto de um dos empreendimentos mais sofisticados da cidade.

Vista deslumbrante para o skyline urbano, com acabamentos de altíssimo padrão. Living amplo com varanda gourmet integrada, perfeito para receber.

Destaques:
• Vista permanente e desimpedida
• Varanda gourmet com churrasqueira
• Ar condicionado central
• Piso em porcelanato importado
• Infraestrutura completa de lazer no condomínio
• 3 vagas de garagem cobertas''',
            'price': Decimal('1650000.00'),
            'address': 'Avenida Atlântica, 1200, Apto 1802',
            'neighborhood': 'Beira Mar',
            'city': 'Florianópolis',
            'state': 'SC',
            'bedrooms': 3,
            'bathrooms': 3,
            'parking_spots': 3,
            'area': Decimal('185.00'),
            'property_type': 'apartamento',
            'is_featured': True,
            'image_file': 'apartamento.png',
        },
        {
            'title': 'Refúgio no Campo - Casa de Campo Premium',
            'description': '''Magnífica propriedade rural com vista para as montanhas. Arquitetura que harmoniza rústico e contemporâneo, criando ambientes acolhedores e sofisticados.

Ideal para quem busca qualidade de vida, contato com a natureza e privacidade absoluta.

Destaques:
• Terreno de 5.000m² com mata nativa preservada
• Varanda panorâmica com rede e área de contemplação
• Lareira em pedra natural
• Cozinha rústica com fogão a lenha
• Horta orgânica e pomar
• Apenas 40 min do centro da cidade''',
            'price': Decimal('980000.00'),
            'address': 'Estrada do Vale Verde, Km 12',
            'neighborhood': 'Zona Rural',
            'city': 'Campos do Jordão',
            'state': 'SP',
            'bedrooms': 3,
            'bathrooms': 2,
            'parking_spots': 2,
            'area': Decimal('220.00'),
            'property_type': 'casa',
            'is_featured': False,
            'image_file': 'casa_campo.png',
        },
    ]

    for data in properties_data:
        image_file = data.pop('image_file')
        image_path = base_path / image_file

        prop = Property(**data)

        if image_path.exists():
            with open(image_path, 'rb') as f:
                prop.main_image.save(image_file, File(f), save=False)

        prop.save()
        print(f"  ✅ Criado: {prop.title}")

    print(f"\n🎉 {Property.objects.count()} imóveis criados com sucesso!")
