#!/bin/bash

echo "🔄 Aguardando banco de dados..."
sleep 2

echo "📦 Executando migrações..."
python manage.py migrate --noinput

echo "👤 Criando superusuário admin..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser('admin', 'admin@abritta.com', 'admin123')
    print('✅ Superusuário criado: admin / admin123')
else:
    print('ℹ️  Superusuário admin já existe')
"

echo "🏠 Carregando dados iniciais..."
python manage.py runscript initialize_data || echo "ℹ️  Dados já existem ou script falhou"

echo "📁 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🔐 Ajustando permissões de mídia..."
chmod -R 755 /app/media

echo "🚀 Iniciando servidor..."
exec gunicorn --bind 0.0.0.0:8000 --workers 2 core.wsgi:application
