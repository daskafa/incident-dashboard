# Incident Management Dashboard

Gerçek zamanlı incident yönetim sistemi. Backend NestJS, Frontend Next.js ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ CRUD operasyonları (Create, Read, Update, Delete)
- ✅ Real-time WebSocket güncellemeleri
- ✅ Filtreleme ve pagination
- ✅ Modern ve responsive UI (shadcn/ui)
- ✅ Docker ile kolay kurulum
- ✅ TypeORM ile PostgreSQL entegrasyonu
- ✅ Validation ve error handling

## 🛠 Teknolojiler

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Socket.IO
- class-validator

### Frontend
- Next.js 16
- React 19
- shadcn/ui
- Tailwind CSS v4
- Socket.IO Client

## 📦 Kurulum ve Çalıştırma

### Gereksinimler
- Docker
- Docker Compose

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repo-url>
cd incident-dashboard
```

2. Tüm servisleri başlatın:
```bash
docker compose up -d
```

3. Servislerin durumunu kontrol edin:
```bash
docker compose ps
```

4. Uygulamaya erişin:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Logları İzleme

```bash
# Tüm servislerin logları
docker compose logs -f

# Sadece backend
docker compose logs -f backend

# Sadece frontend
docker compose logs -f frontend
```

### Servisleri Durdurma

```bash
docker compose down
```

## 📡 API Endpoints

### POST /incidents
Yeni incident oluşturur.

```json
{
  "title": "Database timeout on payment service",
  "description": "Users are receiving timeout errors during checkout.",
  "service": "Payment API",
  "severity": "high"
}
```

### GET /incidents
Incident listesini döndürür. Query parametreleri:
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına kayıt (default: 10)
- `status`: open | investigating | resolved
- `severity`: low | medium | high | critical
- `service`: Servis adı

Örnek: `GET /incidents?page=1&limit=10&status=open&severity=high`

### GET /incidents/:id
Tek bir incident'ın detaylarını döndürür.

### PATCH /incidents/:id
Incident günceller.

```json
{
  "status": "resolved",
  "severity": "medium"
}
```

### DELETE /incidents/:id
Incident siler.

## 🔄 Real-time Events

WebSocket üzerinden aşağıdaki eventler yayınlanır:

- `incident:created` - Yeni incident oluşturulduğunda
- `incident:updated` - Incident güncellendiğinde
- `incident:deleted` - Incident silindiğinde

## 🏗 Proje Yapısı

```
.
├── backend/
│   ├── src/
│   │   ├── incidents/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── incidents.controller.ts
│   │   │   ├── incidents.service.ts
│   │   │   ├── incidents.gateway.ts
│   │   │   └── incidents.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── incident-card.tsx
│   │   └── create-incident-form.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🎨 UI/UX Özellikleri

- Severity ve status için renkli badge'ler
- Hover animasyonları
- Loading states
- Empty states
- Error handling
- Responsive tasarım
- Real-time güncellemeler için smooth transitions

## 🔐 Validation

Backend'de class-validator kullanılarak:
- `title` boş olamaz
- `severity` ve `status` sadece belirli enum değerlerini kabul eder
- Hatalı payload'lar 400 Bad Request döner
- Bulunamayan kayıtlar 404 Not Found döner

## 📝 Varsayımlar

1. Süre kısıtı nedeniyle authentication/authorization eklenmedi
2. Soft delete yerine hard delete kullanıldı
3. Audit log özelliği eklenmedi
4. Unit/Integration testler yazılmadı
5. Swagger dokümantasyonu eklenmedi
6. AI entegrasyonu eklenmedi

## 🚀 Daha Fazla Zaman Olsaydı

- [ ] JWT authentication
- [ ] Role-based access control
- [ ] Unit ve integration testler
- [ ] Swagger/OpenAPI dokümantasyonu
- [ ] Soft delete ve audit log
- [ ] AI destekli otomatik sınıflandırma
- [ ] Email/Slack bildirimleri
- [ ] Advanced filtreleme ve arama
- [ ] Export (CSV, PDF)
- [ ] Dashboard analytics ve grafikler
- [ ] Incident history ve timeline
- [ ] Comment sistemi
- [ ] File upload desteği

## 👨‍💻 Geliştirici

Yılmaz Daşkafa

## 📄 Lisans

MIT
