# Abritta Imóveis

Site de venda de imóveis com painel administrativo completo.

## 🏗️ Stack Tecnológica

- **Backend**: Django 5.0 + Django REST Framework + SQLite
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Deploy**: Docker Compose + Nginx + Certbot (SSL)

## 📁 Estrutura de Pastas

```
imoveis/
├── docker-compose.yml        # Ambiente de desenvolvimento
├── docker-compose.prod.yml   # Ambiente de produção
├── README.md                 # Este arquivo
│
├── backend/                  # API Django
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── core/                 # Configurações Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── properties/           # App de imóveis
│   │   ├── models.py         # Modelos Property e PropertyImage
│   │   ├── admin.py          # Configuração do admin
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # JSON serializers
│   │   └── urls.py           # Rotas da API
│   └── scripts/
│       └── initialize_data.py # Script de dados iniciais
│
├── frontend/                 # React SPA
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       │   ├── ui/           # Componentes base (Button, Card, etc)
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   └── PropertyCard.jsx
│       ├── pages/
│       │   ├── Home.jsx      # Listagem de imóveis
│       │   └── PropertyDetail.jsx # Detalhes do imóvel
│       └── lib/
│           └── utils.js      # Utilitários
│
└── nginx/
    └── conf.d/
        └── default.conf      # Configuração do reverse proxy
```

## 🚀 Quick Start (Desenvolvimento Local)

### Pré-requisitos
- Python 3.12+
- Node.js 20+
- Docker & Docker Compose (opcional)

### Opção 1: Rodando com Docker

```bash
# Clone o repositório
cd imoveis

# Subir todos os containers
docker compose up --build

# Em outro terminal, rodar migrações e criar dados iniciais
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py runscript initialize_data

# Acessar
# Frontend: http://localhost
# Admin: http://localhost/admin
```

### Opção 2: Rodando manualmente

#### Backend
```bash
cd backend

# Criar ambiente virtual
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Rodar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Carregar dados de exemplo
python manage.py runscript initialize_data

# Rodar servidor
python manage.py runserver
```

#### Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

## 📋 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/properties/` | Lista todos os imóveis ativos |
| GET | `/api/properties/{id}/` | Detalhes de um imóvel |

### Filtros disponíveis (query params)
- `type`: Tipo de imóvel (casa, apartamento, terreno, etc)
- `city`: Filtrar por cidade
- `min_price` / `max_price`: Faixa de preço
- `bedrooms`: Mínimo de quartos

Exemplo: `/api/properties/?city=São Paulo&min_price=500000`

## 🔐 Painel Administrativo

Acesse `/admin/` com as credenciais do superusuário.

**Funcionalidades:**
- CRUD completo de imóveis
- Upload de múltiplas imagens
- Filtros por cidade, tipo, status
- Preview de imagens inline
- Marcar imóveis como destaque


## 🔎 SEO e Indexação (Google/Bing)

Arquivos básicos para indexação já incluídos no frontend:
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`
- Meta tags principais no `frontend/index.html` (`description`, `robots`, Open Graph, canonical, JSON-LD)

> **Importante:** substitua `https://seu-dominio.com` pelos URLs reais do seu domínio em `robots.txt`, `sitemap.xml` e JSON-LD antes de publicar em produção.

## 🌐 Deploy em Produção

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 2. Gerar certificado SSL

```bash
# Primeiro, edite nginx/conf.d/default.conf com seu domínio
# Depois rode:
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d seu-dominio.com
```

### 3. Subir em produção

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 🛠️ Comandos Úteis

```bash
# Ver logs
docker compose logs -f

# Acessar shell do backend
docker compose exec backend python manage.py shell

# Criar nova migração após alterar models
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Rebuild após mudanças no código
docker compose up --build

# Parar containers
docker compose down
```

## 📝 Comandos Executados Durante Setup

```bash
# Criação do projeto Django
django-admin startproject core .
python manage.py startapp properties

# Migrações
python manage.py makemigrations properties
python manage.py migrate

# Dados iniciais
python manage.py runscript initialize_data
# Output: 3 imóveis criados com sucesso!

# Criação do superusuário
# admin / admin@abritta.com / admin123
```

## 📄 Licença

Projeto desenvolvido para Abritta Imóveis.
