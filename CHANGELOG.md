# Dokumentasi Lengkap — Shopfinity Enhancement

Dokumen ini menjabarkan semua pekerjaan yang telah dilakukan pada project Shopfinity dari awal hingga akhir. Project ini adalah aplikasi e-commerce full-stack berbasis React Router v7 (SPA mode) untuk tugas kuliah.

---

## Daftar Isi

1. [Fase 1: Fondasi — Responsivitas & Usability](#fase-1-fondasi--responsivitas--usability)
2. [Fase 2: Cart System](#fase-2-cart-system)
3. [Fase 3: Checkout System](#fase-3-checkout-system)
4. [Fase 4: Backend-less Testing](#fase-4-backend-less-testing)
5. [Fase 5: Admin Order Management](#fase-5-admin-order-management)
6. [Fase 6: Backend Specification](#fase-6-backend-specification)
7. [Fase 7: Bug Fixes](#fase-7-bug-fixes)
8. [Fase 8: Final Cleanup & Enhancement](#fase-8-final-cleanup--enhancement)
9. [Ringkasan File](#ringkasan-file)
10. [Arsitektur & Pattern](#arsitektur--pattern)

---

## Fase 1: Fondasi — Responsivitas & Usability

### 1.1 — Hapus Mobile Blocker

**File:** `app/root.tsx`

Aplikasi sebelumnya memblokir seluruh tampilan mobile dengan pesan "tidak mendukung tampilan mobile" ketika lebar layar di bawah 900px. Kode `useResize(900)` yang menggantikan seluruh aplikasi dengan pesan error telah dihapus. Aplikasi sekarang bisa diakses di semua ukuran layar.

### 1.2 — Responsive Navbar

**File:** `app/shared/components/navbar.tsx`

- **Hamburger menu:** Ditambahkan `Sheet` dari shadcn/ui untuk navigasi mobile. Semua nav link (Home, Products, Categories, Brands, Cart) dimasukkan ke dalam sheet untuk layar kecil.
- **Cart badge:** Ditambahkan link Cart dengan badge jumlah item dari `useCartCount()`.
- **Sticky & solid:** Navbar selalu dalam posisi `sticky top-0` dengan background putih solid (`bg-white border-b`). Efek glass/transparan saat scroll telah dihapus.
- **Responsive padding:** `px-4 sm:px-14` untuk menyesuaikan berbagai ukuran layar.
- **Search bar:** Disembunyikan di mobile (`hidden sm:flex`), tidak lagi di tengah (`max-w-sm` tanpa `mx-auto`).
- **Button label:** "Sign In" diubah menjadi "Login", ditambahkan tombol "Sign Up".

### 1.3 — Responsive Footer

**File:** `app/shared/components/footer.tsx`

- Kolom ditumpuk vertikal di mobile (`flex-col`) dan side-by-side di desktop (`md:flex-row`).
- Padding dikurangi untuk mobile.

### 1.4 — Full Card Clickability

**File:** `app/features/product/components/card.tsx`

- Seluruh card product sekarang dibungkus dalam `<Link to={/product/${slug}}>`.
- Link di dalam `<h2>` title dihapus untuk menghindari nested links.
- Hover effects (image zoom, shadow) tetap dipertahankan.

### 1.5 — Responsive Product Detail

**File:** `app/features/product/pages/product-detail.tsx`

- Mobile: gambar di atas, detail di bawah (single column).
- Tablet/Desktop: gambar di kiri, detail di kanan (side-by-side).
- Aspect ratio gambar disesuaikan untuk berbagai layar.

### 1.6 — Responsive Product List

**File:** `app/features/product/pages/product-list.tsx`
**File:** `app/features/product/components/filter-bar/index.tsx`

- Grid menggunakan `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- Hero section: text sizing dan height responsif.
- Filter bar: menggunakan Sheet untuk mobile (collapsible sidebar).

### 1.7 — Auth Guard untuk CTA Buttons

**File:** `app/features/product/pages/product-detail.tsx`

- "Add to Cart" dan "Buy Now" mengecek session user (`getSession()`).
- Jika belum login: `toast.error()` dengan tombol action "Login" yang mengarahkan ke `/login`.
- Jika sudah login: menambahkan item ke cart dan menampilkan toast sukses.

### 1.8 — Responsive Admin Layout

**File:** `app/shared/layouts/admin-layout.tsx`

- Sidebar menggunakan `Sidebar` dari shadcn/ui dengan `collapsible="icon"`.
- Tabel di semua halaman admin memiliki `overflow-x-auto` untuk horizontal scroll di mobile.
- Padding disesuaikan untuk mobile (`p-4 sm:p-6 lg:p-8`).

### 1.9 — Responsive Login & Sign-up

**File:** `app/features/auth/pages/login.tsx`
**File:** `app/features/auth/pages/sign-up.tsx`

- Layout berubah dari `grid-cols-2` (gambar + form side-by-side) menjadi stacked di mobile (`flex-col-reverse md:grid md:grid-cols-2`).
- Ukuran gambar disesuaikan: `h-48 sm:h-64 md:h-full`.
- Padding form disesuaikan: `p-6 sm:p-10 md:p-14`.

---

## Fase 2: Cart System

### 2.1 — Cart Store (Zustand)

**File:** `app/features/cart/store/cart-store.ts` (NEW)

State management untuk keranjang belanja:

```ts
interface CartState {
  items: CartItem[];
}
```

**Actions:**
- `addItem(product)` — menambahkan item; jika sudah ada, quantity +1
- `removeItem(productId)` — menghapus item dari cart
- `updateQuantity(productId, quantity)` — mengubah quantity (min 1)
- `clearCart()` — mengosongkan cart

**Persistensi:** otomatis disimpan ke `localStorage` dengan key `shopfinity-cart`.

### 2.2 — Cart Hooks

**File:** `app/features/cart/hooks/use-cart.ts` (NEW)

Selector hooks untuk komponen:
- `useCart()` — mengembalikan `items: CartItem[]`
- `useCartCount()` — mengembalikan total jumlah item
- `useCartTotal()` — mengembalikan total harga

### 2.3 — Cart Page

**File:** `app/features/cart/pages/cart.tsx` (NEW)

Route: `/cart`

- Daftar item dengan: thumbnail gambar, nama, brand, kategori, harga, quantity controls (+/-), tombol hapus, line total.
- Cart summary: subtotal, tombol "Proceed to Checkout".
- Empty state: ilustrasi dan tombol "Start Shopping".
- Terintegrasi dengan checkout flow.

### 2.4 — Cart Types

**File:** `app/features/cart/types/cart-types.ts` (NEW)

```ts
interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  brand: string;
  category: string;
}
```

### 2.5 — Wire Add to Cart & Cart Link

- **Product Detail:** `handleAddToCart()` dan `handleBuyNow()` memanggil `useCartStore.getState().addItem()`.
- **Navbar:** Link Cart dengan badge `useCartCount()` menggunakan icon `ShoppingCart`.

---

## Fase 3: Checkout System

### 3.1 — Checkout Store (Zustand)

**File:** `app/features/checkout/store/checkout-store.ts` (NEW)

Multi-step checkout state:

```ts
interface CheckoutState {
  step: 'address' | 'shipping' | 'payment' | 'confirmation';
  address: Address | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: PaymentMethod | null;
  paymentProof: File | null;
  paymentProofUrl: string | null;
}
```

Actions: `setAddress`, `setShipping`, `setPayment`, `setPaymentProof`, `setStep`, `reset`.

### 3.2 — Checkout Types

**File:** `app/features/checkout/types/checkout-types.ts` (NEW)

Type definitions:
- `Address` — fullName, phone, street, city, province, postalCode
- `ShippingMethod` — id, courier, service, estimatedDays, cost
- `PaymentMethod` — id, type (qris | bank_transfer), name, accountNumber?, accountName?
- `OrderStatus` — PENDING_PAYMENT | PAID | PROCESSING | SHIPPED | DELIVERED | CANCELLED
- `OrderItem` — productId, name, price, quantity, imageUrl
- `Order` — full order dengan semua field

### 3.3 — Shipping Methods Data

**File:** `app/features/checkout/data/shipping-methods.ts` (NEW)

Static data 5 kurir Indonesia dengan estimasi biaya:
- **JNE:** REG (Rp 15.000), YES (Rp 25.000), OKE (Rp 10.000)
- **J&T Express:** EZ (Rp 14.000), ECO (Rp 9.000)
- **SiCepat:** REG (Rp 13.000), BEST (Rp 22.000)
- **Pos Indonesia:** Pos Reguler (Rp 8.000), Pos Kilat Khusus (Rp 20.000)
- **TIKI:** REG (Rp 16.000), ONS (Rp 28.000)

Biaya bervariasi berdasarkan kota tujuan (Surabaya sebagai origin).

### 3.4 — Payment Methods Data

**File:** `app/features/checkout/data/payment-methods.ts` (MODIFIED)

Metode pembayaran yang tersedia (hanya Indonesia):
- **QRIS** — scan QR code untuk semua e-wallet
- **Bank BCA** — transfer bank
- **Bank Mandiri** — transfer bank
- **Bank BNI** — transfer bank
- **Bank BRI** — transfer bank

### 3.5 — Checkout Page

**File:** `app/features/checkout/pages/checkout.tsx` (NEW)

Route: `/checkout`

**Step 1 — Alamat Pengiriman:**
- Form: Nama Lengkap, Nomor HP, Alamat, Kota, Provinsi, Kode Pos
- Validasi form, tombol "Continue to Shipping"

**Step 2 — Metode Pengiriman:**
- Dropdown pilih kota tujuan
- List kurir dengan: nama layanan, estimasi hari, biaya
- Radio selection

**Step 3 — Metode Pembayaran:**
- Ringkasan pesanan: subtotal + shipping = grand total (tanpa pajak)
- Pilihan pembayaran dengan radio cards

**Step 4 — Konfirmasi & Upload Pembayaran:**

- Ringkasan pesanan lengkap
- **QRIS:** QR code dari `/images/qris.png` bisa diklik untuk memperbesar (Dialog) dan tombol "Download QR" untuk mengunduh, serta panduan langkah demi langkah
- **Bank Transfer:** Panduan lengkap dengan ikon bank, nomor rekening, nama pemilik, dan langkah-langkah transfer
- **Upload bukti pembayaran:** Wajib diupload. Jika tidak upload, tombol "Place Order" akan menolak dengan:
  - Border merah dan background merah pada area upload
  - Toast notification
  - Auto-scroll ke area upload
- Tombol "Place Order" → membuat order, menyimpan ke store, clear cart, navigasi ke `/checkout/success`

### 3.6 — Checkout Success Page

**File:** `app/features/checkout/pages/checkout-success.tsx` (NEW)

Route: `/checkout/success`

Halaman konfirmasi setelah order berhasil dibuat. Menampilkan nomor order dan pesan sukses.

---

## Fase 4: Backend-less Testing

### 4.1 — Local Data Utility

**File:** `app/shared/utils/local-data.ts` (NEW)

Central seed data utility yang menyediakan fallback untuk semua hooks ketika API tidak tersedia:

- 8 produk, 7 kategori, 5 brands (selaras dengan `admin-store.ts` seed data)
- Mendukung filtering, pagination, sorting
- Functions: `getLocalClientProducts()`, `getLocalProduct()`, `getLocalClientCategories()`, `getLocalClientBrands()`, `getLocalAdminProducts()`, `getLocalAdminCategories()`, `getLocalAdminBrands()`, `getLocalCategoriesList()`, `getLocalBrandsList()`, `getLocalDashboard()`

### 4.2 — isApiAvailable() Pattern

**File:** `app/shared/utils/local-data.ts`

```ts
export function isApiAvailable(): boolean {
  return Boolean(import.meta.env.VITE_API_URL);
}
```

Ketika `.env` dengan `VITE_API_URL` ditambahkan, sistem otomatis beralih ke API call sebenarnya tanpa perubahan kode.

### 4.3 — Hooks Migrasi

**10 GET hooks** dimodifikasi untuk fallback ke local data:
- `use-get-client-products.ts`
- `use-get-product.ts`
- `use-get-client-categories.ts`
- `use-get-client-brands.ts`
- `use-get-products.ts` (admin)
- `use-get-categories-list.ts`
- `use-get-brands-list.ts`
- `use-get-dashboard.ts`
- `use-get-categories.ts` (admin)
- `use-get-brands.ts` (admin)

**9 mutation hooks** dimodifikasi untuk operasi langsung ke Zustand store:
- `use-create-product.ts`, `use-update-product.ts`, `use-delete-product.ts`
- `use-create-category.ts`, `use-update-category.ts`, `use-delete-category.ts`
- `use-create-brand.ts`, `use-update-brand.ts`, `use-delete-brand.ts`

### 4.4 — User Hook Fallback

**File:** `app/features/auth/hooks/api/use-user.ts`

Ketika `!isApiAvailable()`, mengembalikan user yang sudah di-cache dari `queryClient` (disimpan saat login via `setSession()`).

### 4.5 — Session Management

**File:** `app/shared/utils/session-management.ts`

- `setSession(token, user)` — menyimpan token di localStorage, user di queryClient cache
- `getSession()` — mengembalikan token dan user
- `clearSession()` — menghapus session

### 4.6 — HTTP Client

**File:** `app/shared/utils/http.ts`

- `VITE_API_URL` sudah optional — menggunakan empty string `prefixUrl` ketika tidak di-set
- JWT auth interceptor dengan auto-refresh pada 401

---

## Fase 5: Admin Order Management

### 5.1 — Admin Order Store

**File:** `app/features/admin/store/order-store.ts` (NEW)

State management untuk pesanan di admin:

- `orders: Order[]` — array semua pesanan
- `placeOrder(params)` — membuat pesanan baru dengan `orderNumber` format `INV/YYMMDD/XXXX`
- `updateOrderStatus(orderId, status)` — mengubah status pesanan
- `setPaymentProof(orderId, proofUrl)` — menyimpan URL bukti pembayaran
- `getOrderById(orderId)` — mencari pesanan by ID
- `getOrdersByStatus(status)` — filter pesanan by status

Persistensi ke `localStorage` dengan key `shopfinity-orders`.

### 5.2 — Order Management Page

**File:** `app/features/admin/pages/order-management.tsx` (NEW)

Route: `/admin/orders`

- Tabel semua pesanan dengan kolom: Order ID, Customer, Date, Total, Status (badge), Actions
- Filter tabs: All, Pending, Paid, Processing, Shipped, Delivered
- Search by order number atau customer name
- Klik row → dialog detail pesanan
- Dialog detail: customer info, item list, subtotal/shipping/total, payment proof preview, update status buttons
- Status update bisa diubah langsung di dialog

### 5.3 — Payment Verification Page

**File:** `app/features/admin/pages/payment-verification.tsx` (NEW)

Route: `/admin/payments`

- Statistik: jumlah pending, verified, rejected
- Tabel pesanan dengan status `PENDING_PAYMENT`
- Kolom: Order ID, Customer, Total, Payment Method, Date, Proof, Actions
- Klik icon zoom → dialog preview bukti pembayaran (gambar full)
- Actions: "Verify & Confirm" (status → PAID) atau "Reject" (status → CANCELLED)
- Toast notifications pada setiap aksi

### 5.4 — Cash Flow Page

**File:** `app/features/admin/pages/cash-flow.tsx` (NEW)

Route: `/admin/cash-flow`

- **Summary Cards:** Total Revenue, Total Orders, Avg Order Value, Pending Payments
- **Revenue Breakdown:** Product Revenue, Total Shipping
- **Transaction Table:** Semua pesanan dengan kolom Order ID, Date, Subtotal, Shipping, Total, Status

### 5.5 — Admin Sidebar Update

**File:** `app/features/admin/components/admin-sidebar.tsx`

Menu baru ditambahkan di bawah "Orders & Finance":
- Orders (`/admin/orders`) — icon `ShoppingBag`
- Payment Verification (`/admin/payments`) — icon `CheckCircle`
- Cash Flow (`/admin/cash-flow`) — icon `Banknote`

### 5.6 — Admin Home Page

**File:** `app/features/admin/pages/admin-home.tsx`

Dashboard dengan:
- 4 stat cards: Total Products, Categories, Brands, Low Stock
- Ringkasan inventory
- Quick action cards: Manage Products, Categories, Brands
- Low stock alert dengan list produk yang stok < 5

---

## Fase 6: Backend Specification

### 6.1 — BACKEND_SPEC.md

**File:** `BACKEND_SPEC.md` (NEW)

Dokumen spesifikasi lengkap untuk backend developer. Mencakup:

- **2 tabel database baru:** `orders` (dengan JSON columns) dan `order_items`
- **5 API endpoints baru:**
  - `POST /orders` — Create order
  - `GET /orders` — List orders (dengan pagination, filter, search)
  - `GET /orders/:id` — Order detail
  - `PUT /orders/:id/status` — Update status
  - `POST /orders/:id/payment-proof` — Upload bukti bayar
- **Type reference:** Address, ShippingMethod, PaymentMethod, OrderItem, OrderStatus
- **Perhitungan otomatis di backend:** total = subtotal + shipping (tanpa tax), orderNumber format, status awal
- **Metode pembayaran:** hanya QRIS dan 4 bank transfer (BCA, Mandiri, BNI, BRI)
- **Checklist untuk backend developer**

Yang TIDAK perlu diubah: Auth, Product CRUD, Category CRUD, Brand CRUD, Dashboard — semua sudah ada.

> **Update 2026-05-16:** Spec disinkronkan dengan perubahan frontend — tax dihapus, PaymentMethod type disederhanakan (hapus ewallet & card).

---

## Fase 7: Bug Fixes

### 7.1 — Infinite Loop "Maximum update depth exceeded"

**Root cause:** Hook `useCartActions()` di `use-cart.ts` mengembalikan object baru `{ addItem, removeItem, updateQuantity, clearCart }` setiap kali Zustand store update. `Object.is()` comparison gagal untuk referensi object baru, memicu cascading re-renders.

**Fix:**
- Menghapus `useCartActions()` entirely
- Mengganti semua pemanggilan dengan individual selector: `useCartStore((s) => s.addItem)`
- 3 file consumer diupdate: `product-detail.tsx`, `cart.tsx`, `checkout.tsx`

### 7.2 — useCartCount Reactivity

Sebelumnya menggunakan `state.getCartCount()` yang mengembalikan referensi fungsi stabil — Zustand tidak mendeteksi perubahan.

**Fix:** Diganti menjadi `state.items.reduce((sum, i) => sum + i.quantity, 0)` yang mengembalikan angka yang berubah.

### 7.3 — Tab Indentation Issues

File-file dalam project menggunakan tab indentation. Read tool menampilkan tab sebagai spasi, menyebabkan exact string matching gagal untuk operasi Edit.

**Fix:** Menggunakan Python scripts via Bash untuk targeted find-and-replace, atau menulis ulang file dengan Write tool untuk perubahan yang ekstensif.

---

## Fase 8: Final Cleanup & Enhancement

### 8.1 — Hapus Demo Login

**File:** `app/features/auth/pages/login.tsx`

- Menghapus semua import terkait demo login (`Shield`, `UserIcon`, `Separator`, `isApiAvailable`, `User`)
- Menghapus `handleDemoLogin()` function
- Menghapus seluruh blok JSX demo login
- Halaman login sekarang hanya berisi form login production

### 8.2 — Hapus E-Wallet & Card Payments

**File:** `app/features/checkout/data/payment-methods.ts`

Metode pembayaran yang dihapus:
- GoPay, OVO, DANA, ShopeePay (e-wallet)
- Visa, Mastercard (debit/credit cards)

Metode yang tersisa:
- QRIS
- Bank BCA, Bank Mandiri, Bank BNI, Bank BRI

### 8.3 — Hapus PPN 11% (Tax)

**File:** `app/features/admin/store/order-store.ts`
**File:** `app/features/checkout/pages/checkout.tsx`

- `TAX_RATE` constant dihapus dari `order-store.ts`
- `tax` selalu `0` di semua perhitungan
- `total = subtotal + shippingCost` (tanpa tax)
- Semua tampilan tax dihapus dari UI (checkout step 3 & 4, admin order detail, cash flow)

### 8.4 — QRIS QR Code Enhancement

**File:** `app/features/checkout/pages/checkout.tsx`

- QR code dari `/images/qris.png` ditampilkan saat user memilih QRIS
- **Click to enlarge:** Klik QR code membuka Dialog dengan gambar ukuran penuh
- **Download button:** Tombol "Download QR" untuk mengunduh gambar QR code
- **Step-by-step instructions:** Panduan lengkap dalam bahasa Indonesia:
  1. Buka aplikasi e-wallet / mobile banking
  2. Pilih menu "Scan QRIS"
  3. Scan kode QR di atas
  4. Masukkan nominal yang sesuai
  5. Konfirmasi pembayaran & simpan bukti

### 8.5 — Bank Transfer Instructions

**File:** `app/features/checkout/pages/checkout.tsx`

- Ikon bank di samping nama bank
- Kartu detail rekening: nama bank, nomor rekening, nama pemilik
- Step-by-step instructions:
  1. Buka aplikasi mobile banking / ATM
  2. Pilih "Transfer" > tujuan bank yang dipilih
  3. Masukkan nomor rekening di bawah ini
  4. Masukkan nominal transfer (total belanja)
  5. Konfirmasi & simpan bukti transfer

### 8.6 — Payment Proof Validation

**File:** `app/features/checkout/pages/checkout.tsx`

- State `missingProof` untuk tracking error
- Ketika user klik "Place Order" tanpa upload bukti:
  - Area upload mendapat border merah + background merah
  - `toast.error('Please upload your payment proof before placing order.')` ditampilkan
  - Auto-scroll ke area upload (`proofSectionRef`)
- User tidak bisa melanjutkan tanpa upload bukti pembayaran

### 8.7 — Hapus Google Sheets Integration

**File:** `app/features/admin/utils/google-sheets.ts` (DELETED)

Integrasi Google Sheets API dihapus karena tidak diperlukan untuk saat ini. File dihapus, import dan pemanggilan di `checkout.tsx` juga dihapus.

### 8.8 — Admin Pages Verify & Fix

Semua 7 halaman admin diverifikasi dan diperbaiki:

- **admin-home.tsx** — Dashboard statistik, low stock alert, quick actions
- **product-management.tsx** — Full CRUD, filter, search, pagination
- **category-management.tsx** — CRUD, guard delete jika ada produk
- **brand-management.tsx** — CRUD, guard delete jika ada produk, logo display
- **order-management.tsx** — Table, filter, search, detail dialog, status update (tax row dihapus)
- **payment-verification.tsx** — Pending orders, verify/reject, proof preview (status fix: PROCESSING → PAID)
- **cash-flow.tsx** — Summary cards, revenue breakdown, transaction table (tax display dihapus)

### 8.9 — BACKEND_SPEC.md Sync

**File:** `BACKEND_SPEC.md`

Disesuaikan dengan semua perubahan frontend:
- Kolom `tax` di tabel orders: diubah dari `INTEGER NOT NULL, -- PPN 11%` menjadi `INTEGER NOT NULL DEFAULT 0,`
- PaymentMethod type: `qris | bank_transfer | ewallet | card` → `qris | bank_transfer`
- Perhitungan backend: baris `tax = Math.ceil(subtotal * 0.11)` dihapus, formula total tanpa tax
- Response contoh: `"tax": 132000` → `"tax": 0`, `"total": 1347000` → `"total": 1215000`
- Catatan: "Tax PPN 11% dihitung dari subtotal" → "Tax selalu 0 (PPN tidak dikenakan)"
- Referensi "GoPay" dihapus dari komentar PaymentMethod

---

## Ringkasan File

### File Baru (20 file)

| File | Deskripsi |
|---|---|
| `BACKEND_SPEC.md` | Spesifikasi backend untuk teman |
| `GITHUB_GUIDE.md` | Panduan push ke GitHub |
| `CHANGELOG.md` | Dokumentasi ini |
| `app/shared/utils/local-data.ts` | Seed data & fallback utility |
| `app/features/cart/store/cart-store.ts` | Cart state (Zustand + localStorage) |
| `app/features/cart/hooks/use-cart.ts` | Cart selector hooks |
| `app/features/cart/pages/cart.tsx` | Halaman keranjang |
| `app/features/cart/types/cart-types.ts` | Type definitions untuk cart |
| `app/features/checkout/store/checkout-store.ts` | Checkout multi-step state |
| `app/features/checkout/pages/checkout.tsx` | Halaman checkout |
| `app/features/checkout/pages/checkout-success.tsx` | Halaman sukses checkout |
| `app/features/checkout/types/checkout-types.ts` | Type definitions untuk checkout |
| `app/features/checkout/data/shipping-methods.ts` | Data kurir & biaya pengiriman |
| `app/features/checkout/data/payment-methods.ts` | Data metode pembayaran |
| `app/features/admin/store/order-store.ts` | Order state (Zustand + localStorage) |
| `app/features/admin/pages/order-management.tsx` | Halaman manajemen pesanan |
| `app/features/admin/pages/payment-verification.tsx` | Halaman verifikasi pembayaran |
| `app/features/admin/pages/cash-flow.tsx` | Halaman arus kas |
| `public/images/qris.png` | Gambar QR code QRIS |

### File Dimodifikasi (34 file)

| File | Perubahan |
|---|---|
| `app/root.tsx` | Hapus mobile blocker |
| `app/routes.ts` | Tambah route: cart, checkout, success, admin orders/payments/cash-flow |
| `app/shared/components/navbar.tsx` | Responsive, hamburger menu, cart badge, solid bg |
| `app/shared/components/footer.tsx` | Responsive layout |
| `app/shared/utils/http.ts` | Optional VITE_API_URL |
| `app/shared/utils/session-management.ts` | Session management utility |
| `app/shared/lib/media-storage.ts` | Media URL handling |
| `app/shared/lib/supabase.ts` | Supabase config |
| `app/shared/layouts/admin-layout.tsx` | Responsive admin layout |
| `app/features/product/components/card.tsx` | Full card link |
| `app/features/product/components/filter-bar/index.tsx` | Responsive filter |
| `app/features/product/components/filter-bar/filter-bar-select.tsx` | Mobile filter |
| `app/features/product/pages/product-detail.tsx` | Responsive + add to cart + auth guard |
| `app/features/product/pages/product-list.tsx` | Responsive hero + filter |
| `app/features/auth/pages/login.tsx` | Responsive + hapus demo login |
| `app/features/auth/pages/sign-up.tsx` | Responsive layout |
| `app/features/auth/hooks/api/use-user.ts` | Fallback ke cached user |
| `app/features/admin/components/admin-sidebar.tsx` | Tambah menu orders, payments, cash-flow |
| `app/features/admin/store/admin-store.ts` | Seed data |
| `app/features/admin/hooks/api/use-get-products.ts` | Local fallback |
| `app/features/admin/hooks/api/use-get-categories.ts` | Local fallback |
| `app/features/admin/hooks/api/use-get-brands.ts` | Local fallback |
| `app/features/admin/hooks/api/use-get-categories-list.ts` | Local fallback |
| `app/features/admin/hooks/api/use-get-brands-list.ts` | Local fallback |
| `app/features/admin/hooks/api/use-get-dashboard.ts` | Local fallback |
| `app/features/admin/hooks/api/use-create-product.ts` | Local mutation |
| `app/features/admin/hooks/api/use-update-product.ts` | Local mutation |
| `app/features/admin/hooks/api/use-delete-product.ts` | Local mutation |
| `app/features/admin/hooks/api/use-create-category.ts` | Local mutation |
| `app/features/admin/hooks/api/use-update-category.ts` | Local mutation |
| `app/features/admin/hooks/api/use-delete-category.ts` | Local mutation |
| `app/features/admin/hooks/api/use-create-brand.ts` | Local mutation |
| `app/features/admin/hooks/api/use-update-brand.ts` | Local mutation |
| `app/features/admin/hooks/api/use-delete-brand.ts` | Local mutation |
| `app/features/product/hooks/api/use-get-client-products.ts` | Local fallback |
| `app/features/product/hooks/api/use-get-product.ts` | Local fallback |
| `app/features/product/hooks/api/use-get-client-categories.ts` | Local fallback |
| `app/features/product/hooks/api/use-get-client-brands.ts` | Local fallback |

### File Dihapus (1 file)

| File | Alasan |
|---|---|
| `app/features/admin/utils/google-sheets.ts` | Tidak diperlukan untuk saat ini |

---

## Arsitektur & Pattern

### Tech Stack
- **Frontend:** React Router v7 (SPA mode, `ssr: false`)
- **State Management:** Zustand v5 (client state), TanStack React Query v5 (server state)
- **Styling:** Tailwind CSS v4, shadcn/ui v3 (New York style, zinc base)
- **HTTP Client:** `ky` dengan JWT auth interceptor
- **Icons:** lucide-react
- **Toasts:** sonner

### Design Patterns
- **`isApiAvailable()` guard:** Setiap hook mengecek `isApiAvailable()` untuk memutuskan antara API call dan local data fallback
- **Zustand selector pattern:** Gunakan individual selector (`useCartStore((s) => s.addItem)`) untuk menghindari infinite re-render
- **LocalStorage persistence:** Cart dan Orders disimpan di localStorage sebagai fallback
- **Multi-step form:** Checkout menggunakan state machine sederhana dengan 4 step
- **Semua harga dalam Rupiah integer:** `250000` = Rp 250.000 (bukan desimal)

### Route Map
```
/ (public layout)
├── /                           Product list (home)
├── /login                      Login page
├── /sign-up                    Sign up page
├── /product/:idOrSlug          Product detail
├── /cart                       Cart page
├── /checkout                   Checkout page
├── /checkout/success           Order success page
└── /*                          Not found

/admin (admin layout)
├── /admin                      Admin dashboard
├── /admin/products             Product management
├── /admin/categories           Category management
├── /admin/brands               Brand management
├── /admin/orders               Order management
├── /admin/payments             Payment verification
└── /admin/cash-flow            Cash flow ledger
```

---

## Changelog

### v2.0.0 — Production Ready Release (2026-05-16)

**Added:**
- Complete cart system (store, hooks, page)
- Multi-step checkout (address → shipping → payment → confirmation)
- QRIS QR code with enlarge dialog + download button
- Bank transfer step-by-step instructions
- Payment proof upload with validation
- Admin order management (table, filter, detail, status update)
- Admin payment verification (preview, verify, reject)
- Admin cash flow ledger (summary, breakdown, transactions)
- Mobile responsive design (all pages)
- Backend specification document (BACKEND_SPEC.md)
- Local data fallback for backend-less testing
- GitHub push guide (GITHUB_GUIDE.md)

**Changed:**
- Navbar: solid background, sticky, hamburger menu, cart badge
- "Sign In" → "Login"
- Auth guard for "Add to Cart" and "Buy Now"
- Payment methods: e-wallet and cards removed
- PPN 11% tax removed from all calculations
- Google Sheets integration removed
- Demo login removed from login page
- BACKEND_SPEC.md synced with latest frontend changes (tax, payment types)

**Fixed:**
- Infinite loop crash ("Maximum update depth exceeded") on cart button
- Zustand selector reactivity (useCartActions removed)
- Admin page verification and cleanup
- Tab indentation matching in Edit tool

**Project status:** Production ready, menunggu backend API dari teman.
