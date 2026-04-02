# Incident Management Dashboard

Gerçek zamanlı incident yönetim sistemi. Backend NestJS, Frontend Next.js ile geliştirilmiştir.

## Kurulum ve Çalıştırma

### Gereksinimler
- Docker

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/daskafa/incident-dashboard.git
cd incident-dashboard
```

2. Tüm servisleri başlatın:
```bash
docker compose up -d
```

3. Uygulamaya erişin:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### API Test

Proje ana dizininde `postman_collection.json` dosyası bulunmaktadır. Postman'e import ederek tüm API endpoint'lerini test edebilirsiniz.

### Servisleri Durdurma
```bash
docker compose down
```

## Mimari Yaklaşım

### Backend Architecture

```
Controller → Service → Repository (Interface) → Repository (Implementation) → Database
                ↓
            Gateway (WebSocket)
```

**Katmanlar:**
- **Controller Layer**: HTTP request handling, validation
- **Service Layer**: Business logic
- **Repository Layer**: Data access abstraction (Repository Pattern)
- **Gateway Layer**: WebSocket real-time communication
- **Entity Layer**: Database models

**Design Patterns:**
- Repository Pattern (Interface-based)
- Dependency Injection
- DTO Pattern
- Observer Pattern (WebSocket events)

### Frontend Architecture

```
Pages → Components → API Client → Backend
         ↓
    WebSocket Hook
```

