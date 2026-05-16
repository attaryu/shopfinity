# Backend Spec — Shopfinity Order System

Dokumen ini berisi semua endpoint dan tabel database yang perlu **ditambahkan** ke backend untuk sistem transaksi (checkout, order, payment verification, cash flow). Endpoint yang sudah ada (produk, kategori, brand, auth, dashboard) **tidak perlu diubah**.

---

## 1. Database — Tabel Baru

### orders

```sql
CREATE TABLE orders (
  id                VARCHAR(36) PRIMARY KEY,
  order_number      VARCHAR(20) NOT NULL UNIQUE,       -- format: INV/YYMMDD/XXXX
  customer_name     VARCHAR(255) NOT NULL,
  customer_email    VARCHAR(255) NOT NULL DEFAULT '',
  address           JSON NOT NULL,                      -- lihat Address type di bawah
  subtotal          INTEGER NOT NULL,                   -- dalam Rupiah
  shipping_cost     INTEGER NOT NULL,
  tax               INTEGER NOT NULL DEFAULT 0,
  total             INTEGER NOT NULL,
  shipping_method   JSON NOT NULL,                      -- lihat ShippingMethod type
  payment_method    JSON NOT NULL,                      -- lihat PaymentMethod type
  payment_proof_url VARCHAR(500),
  status            VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### order_items

```sql
CREATE TABLE order_items (
  id            VARCHAR(36) PRIMARY KEY,
  order_id      VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    VARCHAR(36) NOT NULL,
  product_name  VARCHAR(255) NOT NULL,
  price         INTEGER NOT NULL,
  quantity      INTEGER NOT NULL,
  image_url     VARCHAR(500)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

---

## 2. Type Reference (JSON fields)

Digunakan di kolom JSON pada tabel `orders`.

### Address
```json
{
  "fullName": "string",
  "phone": "string",
  "street": "string",
  "city": "string",
  "province": "string",
  "postalCode": "string"
}
```

### ShippingMethod
```json
{
  "id": "string",
  "courier": "string",        // JNE, J&T Express, SiCepat, Pos Indonesia, TIKI
  "service": "string",        // REG, YES, OKE, EZ, ECO, dll
  "estimatedDays": "string",  // "1-2 days"
  "cost": 15000               // integer, Rupiah
}
```

### PaymentMethod
```json
{
  "id": "string",
  "type": "qris | bank_transfer",
  "name": "string",           // "Bank BCA", "QRIS", dll
  "accountNumber": "string | null",
  "accountName": "string | null"
}
```

### OrderItem
```json
{
  "productId": "string",
  "name": "string",
  "price": 250000,
  "quantity": 2,
  "imageUrl": "string"
}
```

### OrderStatus (enum string)
```
PENDING_PAYMENT  →  PAID  →  PROCESSING  →  SHIPPED  →  DELIVERED
                                                   ↘  CANCELLED
```

---

## 3. API Endpoints Baru

### Response wrapper (seluruh API menggunakan format ini)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "string",
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-05-16T...",
    "totalItems": 50,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

---

### 3.1 Create Order

```
POST /orders
Auth: Bearer token (opsional — guest checkout diperbolehkan)
```

**Request body:**
```json
{
  "customerName": "Ibnu Habib",
  "customerEmail": "ibnu@example.com",
  "address": {
    "fullName": "Ibnu Habib",
    "phone": "08123456789",
    "street": "Jl. Keputih No. 5",
    "city": "Surabaya",
    "province": "Jawa Timur",
    "postalCode": "60111"
  },
  "items": [
    {
      "productId": "prod-1",
      "name": "Erigo Hoodie Barnet Black Unisex",
      "price": 600000,
      "quantity": 2,
      "imageUrl": "https://..."
    }
  ],
  "subtotal": 1200000,
  "shippingMethod": {
    "id": "jne-reg",
    "courier": "JNE",
    "service": "REG",
    "estimatedDays": "2-3 days",
    "cost": 15000
  },
  "paymentMethod": {
    "id": "bca",
    "type": "bank_transfer",
    "name": "Bank BCA",
    "accountNumber": "1234567890",
    "accountName": "Shopfinity"
  }
}
```

**Perhitungan di backend (server-side validation):**
```
total = subtotal + shippingMethod.cost
orderNumber = "INV/" + YYMMDD + "/" + random4digit
status awal = "PENDING_PAYMENT"
```

**Response 201:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "id": "uuid",
    "orderNumber": "INV/240516/3847",
    "customerName": "Ibnu Habib",
    "customerEmail": "ibnu@example.com",
    "address": { ... },
    "items": [ ... ],
    "subtotal": 1200000,
    "shippingCost": 15000,
    "tax": 0,
    "total": 1215000,
    "shippingMethod": { ... },
    "paymentMethod": { ... },
    "status": "PENDING_PAYMENT",
    "createdAt": "2026-05-16T...",
    "updatedAt": "2026-05-16T..."
  }
}
```

---

### 3.2 List Orders (Admin)

```
GET /orders?page=1&limit=10&status=PENDING_PAYMENT&search=INV
Auth: Bearer token (ADMIN only)
```

**Query params:**
| Param | Type | Default | Keterangan |
|---|---|---|---|
| `page` | int | 1 | |
| `limit` | int | 10 | |
| `status` | string | - | Filter by OrderStatus |
| `search` | string | - | Search orderNumber / customerName |
| `sortBy` | string | `createdAt` | |
| `sortOrder` | `asc` / `desc` | `desc` | |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "orders": [ /* array of Order */ ]
  },
  "meta": {
    "totalItems": 25,
    "totalPages": 3,
    "page": 1,
    "limit": 10
  }
}
```

---

### 3.3 Get Order Detail

```
GET /orders/:id
Auth: Bearer token
```

**Response 200:** Single Order object (lihat response Create Order)

---

### 3.4 Update Order Status

```
PUT /orders/:id/status
Auth: Bearer token (ADMIN only)
```

**Request body:**
```json
{
  "status": "PAID"
}
```

**Valid status transitions:**
```
PENDING_PAYMENT → PAID, CANCELLED
PAID → PROCESSING, CANCELLED
PROCESSING → SHIPPED
SHIPPED → DELIVERED
```

**Response 200:** Updated Order object

---

### 3.5 Upload Payment Proof

```
POST /orders/:id/payment-proof
Content-Type: multipart/form-data
Auth: Bearer token
```

**Form fields:**
| Field | Type | Keterangan |
|---|---|---|
| `file` | File (image) | PNG, JPG, max 5MB |

**Logic:**
- Upload file ke storage (Supabase / lokal)
- Set `payment_proof_url` di order
- Status tetap `PENDING_PAYMENT` (admin yang verifikasi)

**Response 200:** Updated Order object dengan `paymentProofUrl`

---

## 4. Ringkasan Checklist untuk Teman

### Database
- [ ] Buat tabel `orders`
- [ ] Buat tabel `order_items`
- [ ] Run migration

### API baru
- [ ] `POST /orders` — Create order
- [ ] `GET /orders` — List orders (admin, dengan filter + pagination)
- [ ] `GET /orders/:id` — Order detail
- [ ] `PUT /orders/:id/status` — Update status (admin)
- [ ] `POST /orders/:id/payment-proof` — Upload bukti bayar

### Yang TIDAK perlu diubah
- Auth (login, register, refresh, logout) — sudah ada
- Produk CRUD — sudah ada
- Kategori CRUD — sudah ada
- Brand CRUD — sudah ada
- Dashboard — sudah ada

---

## 5. Catatan

- **Semua harga dalam Rupiah (integer)**, bukan desimal. `250000` = Rp 250.000.
- **Tax** selalu 0 (PPN tidak dikenakan).
- **Order number format:** `INV/YYMMDD/XXXX` — YYMMDD dari `createdAt`, XXXX random 4 digit.
- Guest checkout diperbolehkan (`customerEmail` bisa kosong).
- Payment proof di-upload customer, lalu admin verifikasi manual via `/admin/payments`.
- Frontend sudah handle semua UI, backend hanya perlu API + database.
