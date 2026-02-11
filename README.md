# CS2 Case Opening Website

Full-stack CS2 case opening platform with Next.js, NestJS, and PostgreSQL.

## Features

- 🎮 Case opening with realistic animations
- 👤 User authentication and profiles
- 📦 Inventory management
- 🔐 Secure admin panel
- 🚀 High performance (< 100ms API response)
- 🛡️ Security-first architecture

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- ShadCN UI
- TailwindCSS
- Zustand

### Backend
- NestJS
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT Authentication

### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy + rate limiting)

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Installation

1. Clone repository:
```bash
git clone https://github.com/Chumbayoumba/cs2-case-opening.git
cd cs2-case-opening
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start services:
```bash
docker-compose up -d
```

4. Run migrations:
```bash
cd apps/backend
npm run migration:run
```

5. Seed test data:
```bash
npm run seed
```

### Access

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://admin.localhost:3001
- **API**: http://localhost/api
- **Database**: localhost:5432

### Test Accounts

**Regular User**:
- Email: test@test.com
- Password: password

**Admin User**:
- Email: admin@test.com
- Password: password

## Development

### Backend
```bash
cd apps/backend
npm install
npm run start:dev
```

### Frontend
```bash
cd apps/frontend
npm install
npm run dev
```

### Admin Panel
```bash
cd apps/admin
npm install
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx (Port 80)                      │
│  Rate Limiting | Security Headers | Gzip Compression        │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │    │   Backend    │    │  Admin Panel │
│  (Port 3000) │    │  (Port 4000) │    │  (Port 3001) │
│  Next.js 14  │───▶│   NestJS     │◀───│  Next.js 14  │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │  (Port 5432) │
                    └──────────────┘
```

## Security

- JWT authentication with refresh tokens
- Rate limiting (100 req/min per IP)
- Input validation on all endpoints
- SQL injection protection (Drizzle ORM)
- XSS protection (Helmet.js)
- CORS configuration
- Separate admin subdomain

## API Documentation

See [API.md](./docs/API.md) for detailed endpoint documentation.

## License

MIT
