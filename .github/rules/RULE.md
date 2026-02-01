## 🔧 Reusable Prompt – Frontend Architecture Rules

### 🧱 Tech Stack (BẮT BUỘC)

- **React 19** (sử dụng `babel-react-compiler` - Không sử dụng useMemo, memo, useCallback. Hãy để react compiler tự lo)
- **shadcn/ui**
- **TailwindCSS**
- **GSAP** với `@gsap/react` (`useGSAP`)
- **TanStack** ecosystem:
  - TanStack Query
  - TanStack Router
  - TanStack Table

- **Zustand** (client-only shared state)
- **Node.js >= 25**

⚠️ Không đề xuất, không sử dụng thư viện ngoài stack này nếu không được yêu cầu rõ ràng.

---

**Luôn tuân thủ toàn bộ các quy tắc sau khi phân tích, thiết kế hoặc viết code. Không tự ý phá vỡ hoặc đề xuất cách khác nếu không được yêu cầu.**

---

### 1. Type & Typing Convention

- **KHÔNG import type**
- Tất cả type **bắt buộc dùng `declare namespace`**
- Truy cập type theo dạng:

  ```ts
  Namespace.TypeName;
  ```

- Types được đặt trong:

  ```
  src/types
  ```

- Seed data có type riêng cũng dùng namespace tương ứng.

---

### 2. Form / Form Field / Form Item

- **KHÔNG dùng trực tiếp** `react-hook-form` hoặc `shadcn/ui Form`
- **BẮT BUỘC dùng Form Item wrapper** đã được xây sẵn trong:

  ```
  components/Form
  ```

- Form Item đã:
  - Wrapper `shadcn Form`
  - Tích hợp sẵn `react-hook-form`

- Khi sử dụng **chỉ truyền**:

  ```tsx
  control;
  name;
  ```

- Không được tự tạo FormItem mới nếu đã tồn tại.

---

### 3. Modal Architecture (BẮT BUỘC)

- **TẤT CẢ Modal**:
  - Phải đặt trong:

    ```
    src/Modal
    ```

- **KHÔNG import modal trực tiếp**
- Modal **BẮT BUỘC**:
  - `lazyLoad`
  - `useModalState`

- Usage pattern:

  ```tsx
  const XxxModal = lazyLoad(() => import('@/Modal/XxxModal'));
  ```

- Không render modal nếu chưa mở.

---

### 4. Pages & Page-level Components

- Pages đặt trong:

  ```
  src/pages
  ```

- Mỗi page:
  - Có **folder riêng**
  - Có `index.tsx` export default

- Component:
  - **Chỉ dùng cho page đó**
  - **KHÔNG reuse**
    → đặt **trong cùng folder page**

- Component reusable **KHÔNG được đặt trong page folder**.

---

### 5. Shared Layer (`src/shared`)

`src/shared` là **public API của frontend app**

Chứa:

- `index.ts` export:
  - Hook dùng chung (re-export từ `src/hooks`)
  - Component dùng chung
  - Utils chung (`lazyLoad`, `ConfirmModal`, …)

⚠️ **Unplugin Auto Import đã cấu hình**

- Import từ `src/shared` **KHÔNG cần import thủ công**
- Khi dùng:

  ```ts
  lazyLoad();
  useConfirm();
  ```

---

### 6. Auto Import Rules

- Toàn bộ component của **shadcn/ui** (`@/components/ui`) đã được **auto import**
- Toàn bộ **utils / libs nội bộ** cũng đã được **auto import**
- **KHÔNG import thủ công** các component / util đã nằm trong auto-import scope

#### Icon Naming Convention (BẮT BUỘC)

- Tất cả icon đến từ thư viện ngoài như:
  - `react`
  - `@tanstack/*`
  - `zustand`
  - `ahooks`
  - `lodash-es`
  - `lucide-react`

➡️ **BẮT BUỘC có hậu tố `Icon` khi sử dụng**

Ví dụ:

```tsx
SearchIcon;
UserIcon;
PlusIcon;
```

- `lucide-react` đã hỗ trợ sẵn hậu tố `Icon`
- Các icon khác **cũng phải đặt alias có hậu tố `Icon` nếu cần**

---

### 7. Assets & SVG

- **Toàn bộ SVG**:

  ```
  src/assets
  ```

- SVG **export như React Component**
- KHÔNG inline SVG trong component
- KHÔNG để SVG trong page folder

---

### 8. Seed Data & Mock Data

- Toàn bộ seed / mock data:

  ```
  Data
  ```

- Nếu có type:
  - Dùng `namespace`
  - Type đặt trong `src/types`

- KHÔNG hardcode data trong component.

---

### 9. State & Data Management

#### 🔹 Server / API Data

- **BẮT BUỘC dùng TanStack Query**
- Không lưu API data vào Zustand
- Không fetch trực tiếp trong component nếu có thể dùng query

#### 🔹 Client-only Logic / Shared Logic

- Dùng **Zustand**
- Áp dụng khi:
  - Tránh prop drilling
  - Logic client dùng nhiều nơi

- Không lạm dụng Zustand cho state cục bộ nhỏ.

---

### 10. Routing

- Routes được khai báo tập trung
- KHÔNG hardcode route string rải rác
- Sử dụng file routes chuyên biệt để quản lý.

---

### 11. Nguyên tắc chung

- Ưu tiên:
  - Clear separation
  - Predictable structure
  - Dễ scale

- Không tự ý:
  - Thay pattern
  - Đề xuất thư viện khác
  - Đơn giản hóa bằng cách phá kiến trúc

---

### 📌 Khi phản hồi, hãy:

- Tuân thủ **đúng folder structure**
- Viết code theo **pattern đã nêu**
- Nếu thiếu thông tin → **giả định theo kiến trúc này**, không hỏi lại trừ khi bắt buộc
- **Max-line 1 file 300 line không tính phần import**, không được nhiều hơn
