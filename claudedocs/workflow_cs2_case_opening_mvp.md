# CS2 Case Opening Website - MVP Implementation Workflow

**Project**: CS2 Case Opening Platform
**Type**: Full-Stack Web Application
**Timeline**: 6-8 hours (MVP)
**Status**: Planning Complete → Ready for Implementation

---

## Executive Summary

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + ShadCN UI
- **Admin Panel**: Next.js 14 (separate app) + TypeScript + ShadCN UI
- **Backend**: NestJS + TypeScript + Drizzle ORM
- **Database**: PostgreSQL 16
- **Auth**: JWT (access + refresh tokens)
- **Infrastructure**: Docker Compose + Nginx
- **Security**: Helmet, CORS, Rate Limiting, Input Validation

### Architecture
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

### Security Model
- Frontend: Public access (localhost:3000)
- Admin: Separate subdomain/port (admin.localhost:3001)
- Backend: Internal only, accessed via Nginx
- Database: Backend-only access
- JWT: HttpOnly cookies, 15min access + 7d refresh
- Rate Limiting: 100 req/min per IP
- Input Validation: class-validator on all endpoints
- SQL Injection: Drizzle ORM prepared statements
- XSS: Helmet.js security headers
- CSRF: Tokens for state-changing operations

---

## Database Schema

### Users Table
```typescript
{
  id: serial PRIMARY KEY,
  email: varchar(255) UNIQUE NOT NULL,
  password_hash: varchar(255) NOT NULL,
  username: varchar(50) UNIQUE NOT NULL,
  balance: decimal(10,2) DEFAULT 0,
  is_admin: boolean DEFAULT false,
  created_at: timestamp DEFAULT NOW(),
  updated_at: timestamp DEFAULT NOW()
}
```

### Cases Table
```typescript
{
  id: serial PRIMARY KEY,
  name: varchar(100) NOT NULL,
  slug: varchar(100) UNIQUE NOT NULL,
  description: text,
  image_url: varchar(500),
  price: decimal(10,2) NOT NULL,
  is_active: boolean DEFAULT true,
  created_at: timestamp DEFAULT NOW(),
  updated_at: timestamp DEFAULT NOW()
}
```

### Items Table
```typescript
{
  id: serial PRIMARY KEY,
  name: varchar(100) NOT NULL,
  slug: varchar(100) UNIQUE NOT NULL,
  description: text,
  image_url: varchar(500),
  rarity: varchar(20) NOT NULL, // common, rare, epic, legendary
  price: decimal(10,2) NOT NULL,
  created_at: timestamp DEFAULT NOW()
}
```

### CaseItems Table (Many-to-Many)
```typescript
{
  id: serial PRIMARY KEY,
  case_id: integer REFERENCES cases(id) ON DELETE CASCADE,
  item_id: integer REFERENCES items(id) ON DELETE CASCADE,
  drop_rate: decimal(5,2) NOT NULL, // percentage 0.01-100.00
  created_at: timestamp DEFAULT NOW()
}
```

### UserInventory Table
```typescript
{
  id: serial PRIMARY KEY,
  user_id: integer REFERENCES users(id) ON DELETE CASCADE,
  item_id: integer REFERENCES items(id) ON DELETE CASCADE,
  acquired_at: timestamp DEFAULT NOW(),
  is_sold: boolean DEFAULT false
}
```

### CaseOpenings Table (History)
```typescript
{
  id: serial PRIMARY KEY,
  user_id: integer REFERENCES users(id) ON DELETE CASCADE,
  case_id: integer REFERENCES cases(id) ON DELETE CASCADE,
  item_id: integer REFERENCES items(id) ON DELETE CASCADE,
  created_at: timestamp DEFAULT NOW()
}
```

### Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cases_slug ON cases(slug);
CREATE INDEX idx_items_slug ON items(slug);
CREATE INDEX idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX idx_case_openings_user_id ON case_openings(user_id);
CREATE INDEX idx_case_items_case_id ON case_items(case_id);
```

---

## API Endpoints

### Public Auth Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
```

### Public Cases Endpoints
```
GET    /api/cases              - List all active cases
GET    /api/cases/:slug        - Get case details with items
POST   /api/cases/:slug/open   - Open case (requires auth)
```

### Protected User Endpoints
```
GET    /api/user/profile       - Get user profile
GET    /api/user/inventory     - Get user inventory
GET    /api/user/history       - Get opening history
PATCH  /api/user/profile       - Update profile
```

### Admin Endpoints (Admin Role Required)
```
GET    /api/admin/cases        - List all cases
POST   /api/admin/cases        - Create case
PUT    /api/admin/cases/:id    - Update case
DELETE /api/admin/cases/:id    - Delete case

GET    /api/admin/items        - List all items
POST   /api/admin/items        - Create item
PUT    /api/admin/items/:id    - Update item
DELETE /api/admin/items/:id    - Delete item

POST   /api/admin/cases/:id/items/:itemId  - Add item to case
DELETE /api/admin/cases/:id/items/:itemId  - Remove item from case
```

---

## Frontend Structure (Public Site)

### Pages (App Router)
```
app/
├── page.tsx                    # Home page with featured cases
├── cases/
│   ├── page.tsx               # All cases list
│   └── [slug]/
│       └── page.tsx           # Case opening page with animation
├── profile/
│   └── page.tsx               # User profile
├── inventory/
│   └── page.tsx               # User inventory grid
├── auth/
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── register/
│       └── page.tsx           # Register page
└── layout.tsx                 # Root layout with navbar
```

### Components
```
components/
├── ui/                        # ShadCN UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── table.tsx
│   └── toast.tsx
├── case-card.tsx              # Case display card
├── item-card.tsx              # Item display card
├── opening-animation.tsx      # Case opening animation
├── inventory-grid.tsx         # Inventory items grid
├── navbar.tsx                 # Navigation bar
└── auth-guard.tsx             # Protected route wrapper
```

### State Management
```
lib/
├── api-client.ts              # Axios instance with interceptors
├── auth-context.tsx           # Auth state management
└── hooks/
    ├── use-auth.ts            # Auth hook
    ├── use-cases.ts           # Cases data hook
    └── use-inventory.ts       # Inventory data hook
```

---

## Admin Panel Structure

### Pages
```
app/
├── page.tsx                   # Dashboard with stats
├── cases/
│   ├── page.tsx              # Cases management table
│   ├── new/
│   │   └── page.tsx          # Create case form
│   └── [id]/
│       └── edit/
│           └── page.tsx      # Edit case form
├── items/
│   ├── page.tsx              # Items management table
│   ├── new/
│   │   └── page.tsx          # Create item form
│   └── [id]/
│       └── edit/
│           └── page.tsx      # Edit item form
├── login/
│   └── page.tsx              # Admin login
└── layout.tsx                # Admin layout
```

---

## Implementation Phases


### Phase 1: Infrastructure Setup (30 minutes)

**Goal**: Create project structure and Docker infrastructure

**Tasks**:
1. Create monorepo structure
   ```
   steambattlev2/
   ├── apps/
   │   ├── backend/          # NestJS API
   │   ├── frontend/         # Next.js public site
   │   └── admin/            # Next.js admin panel
   ├── docker-compose.yml
   ├── nginx/
   │   └── nginx.conf
   └── .env.example
   ```

2. Create docker-compose.yml
   - PostgreSQL service with volume
   - Backend service with health check
   - Frontend service
   - Admin service
   - Nginx service with rate limiting

3. Create Nginx configuration
   - Reverse proxy rules
   - Rate limiting (100 req/min)
   - Security headers
   - Gzip compression

4. Create .env files
   - Database credentials
   - JWT secrets
   - API URLs

**Validation**:
- [ ] docker-compose up starts all services
- [ ] PostgreSQL accessible from backend
- [ ] Nginx routes requests correctly

**Time**: 30 minutes

---

### Phase 2: Backend Foundation (60 minutes)

**Goal**: Setup NestJS with auth, database, and security

**Tasks**:
1. Initialize NestJS project
2. Install dependencies (JWT, Drizzle, security packages)
3. Setup Drizzle ORM with schema
4. Create database migrations
5. Setup Auth Module with JWT
6. Setup Security Middleware
7. Create base modules structure

**Validation**:
- [ ] Database migrations run successfully
- [ ] POST /api/auth/register creates user
- [ ] POST /api/auth/login returns JWT
- [ ] Protected endpoints require valid JWT
- [ ] Rate limiting works

**Time**: 60 minutes

---

### Phase 3: Backend Features (90 minutes)

**Goal**: Implement all business logic

**Tasks**:
- Cases Module (30 min)
- User Module (20 min)
- Admin Module (40 min)

**Validation**:
- [ ] Can fetch all cases
- [ ] Can open case and receive random item
- [ ] Balance deducted correctly
- [ ] Admin can manage cases/items

**Time**: 90 minutes

---

### Phase 4: Frontend Foundation (45 minutes)

**Goal**: Setup Next.js with ShadCN UI and auth

**Tasks**:
1. Initialize Next.js project
2. Install ShadCN UI
3. Create API client
4. Create Auth Context
5. Create Layout Components
6. Create Auth Pages

**Validation**:
- [ ] Next.js app runs
- [ ] Can register/login
- [ ] JWT stored correctly

**Time**: 45 minutes

---

### Phase 5: Frontend Features (120 minutes)

**Goal**: Implement all user-facing pages

**Tasks**:
- Home Page (20 min)
- Cases List Page (20 min)
- Case Opening Page with animation (40 min)
- Profile Page (15 min)
- Inventory Page (25 min)

**Validation**:
- [ ] All pages render correctly
- [ ] Case opening animation works
- [ ] Inventory updates after opening

**Time**: 120 minutes

---

### Phase 6: Admin Panel (90 minutes)

**Goal**: Create admin interface

**Tasks**:
- Admin Setup (20 min)
- Cases Management (35 min)
- Items Management (35 min)

**Validation**:
- [ ] Admin can login
- [ ] Can manage cases/items
- [ ] Changes reflect on frontend

**Time**: 90 minutes

---

### Phase 7: Testing & Seed Data (45 minutes)

**Goal**: Create test data and verify

**Tasks**:
- Seed Data Script (20 min)
- Integration Testing (25 min)

**Validation**:
- [ ] Seed script works
- [ ] Full user journey works
- [ ] Security measures active
- [ ] Performance targets met

**Time**: 45 minutes

---

## Execution Order

Sequential Dependencies:
Phase 1 → Phase 2 → Phase 3 → (Phase 4 + Phase 6) → (Phase 5 + Phase 6) → Phase 7

Total Time: 6-8 hours

---

## Ready for Implementation

Use /sc:implement to start phase by phase.

