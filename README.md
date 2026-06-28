# VLRC - Ứng dụng Học Ngoại Ngữ Đa Nền Tảng (PWA, Android, iOS)

Ứng dụng học ngoại ngữ thế hệ mới, tích hợp các công nghệ tương tác 3D và thuật toán lặp lại ngắt quãng FSRS-AI để tối ưu hóa hiệu quả học tập. Dự án hỗ trợ chạy đa nền tảng nhờ sự kết hợp giữa **Vite + React 19**, **Capacitor** (Mobile Android/iOS) và **vite-plugin-pwa** (PWA).

---

## 🛠️ Công Nghệ Sử Dụng

- **Core**: React 19, TypeScript, Vite
- **Routing & State**: TanStack Router, TanStack Query, Zustand
- **Styling**: Tailwind CSS + Radix UI + shadcn-based UI
- **Native Wrapper**: Capacitor (Core, App, Browser)
- **PWA**: `vite-plugin-pwa`, `workbox-window`
- **Monorepo Management**: Lerna + PNPM Workspaces

---

## 📂 Cấu Trúc Thư Mục Monorepo

```text
vlrc/
├── packages/
│   ├── components/       # Thư viện component dùng chung (@platform-core/components)
│   └── hooks/            # Thư viện hook dùng chung (@platform-core/hooks)
├── src/
│   ├── api/              # Cấu hình API Client (ky) và các request endpoint
│   ├── components/       # Các component UI của ứng dụng
│   ├── pages/            # Các trang chức năng chính (Dashboard, RolePlay, Tutor3D...)
│   └── main.tsx          # Điểm đầu vào (entrypoint) chính của ứng dụng
├── android/              # Dự án Native Android (Capacitor)
├── ios/                  # Dự án Native Xcode (Capacitor)
└── capacitor.config.ts   # Cấu hình Capacitor với tính năng tự động nhận diện IP LAN
```

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. Yêu cầu hệ thống

- **Node.js** >= 22.0.0
- **PNPM** (Quản lý package)
- **Android Studio** & Android SDK (để chạy Android)
- **Xcode** & CocoaPods (chỉ dành cho macOS để chạy iOS)

### 2. Cài đặt thư viện

Tại thư mục gốc của dự án, chạy lệnh:

```bash
pnpm install
```

---

## 💻 Phát Triển & Debug (Development)

### ⚡ Chạy Mobile di động chỉ bằng 1 Lệnh duy nhất (Watch Mode)

Chúng tôi cung cấp script tự động chạy song song Vite dev server và Capacitor, giải quyết tự động việc chuyển đổi IP LAN và hiển thị bảng chọn Emulator/Thiết bị trực quan:

- **Android (Emulator/Device):**
  ```bash
  pnpm start-android-network
  ```
- **iOS (Simulator/Device):**
  ```bash
  pnpm start-ios-network
  ```

_Cơ chế tự động:_

1. Khởi động ngầm Vite dev server lắng nghe ở chế độ LAN (`0.0.0.0:5173`).
2. Tự động lấy IP cục bộ của máy tính của bạn và cập nhật vào cấu hình Capacitor.
3. Kích hoạt `npx cap run` kèm cờ `LIVE_RELOAD=true`.
4. Khi bạn lưu file chỉnh sửa trong IDE, ứng dụng trên thiết bị di động sẽ tự động cập nhật ngay lập tức.
5. Khi nhấn `Ctrl + C`, script tự động kill cả server Vite chạy ngầm.

### 🌐 Chạy Web / PWA Local

Để chạy thử bản PWA hoàn chỉnh trên trình duyệt:

```bash
pnpm build
pnpm preview
```

_Mở Chrome, bạn sẽ thấy biểu tượng tải app (Install App) xuất hiện ở thanh địa chỉ._

---

## 🔑 Xác Thực Đăng Nhập Bằng Google Trên Mobile (OAuth Callback)

Đăng nhập Google trên Mobile được thực hiện an toàn qua **In-App Browser (Chrome Custom Tabs / Safari View Controller)** sử dụng `@capacitor/browser` và **Deep Linking** (`vlrc://` hoặc App Links).

Để luồng đăng nhập tự động đóng trình duyệt và đưa người dùng quay trở lại App, bạn cần cấu hình:

### 1. Cấu hình phía Server API Backend (`english-learning-be`)

Thay đổi biến môi trường trong file `.env` của dịch vụ **Auth** để chuyển hướng thành công về Custom Scheme của App:

```env
GOOGLE_OAUTH_SUCCESS_REDIRECT_URL=vlrc://oauth-callback
```

### 2. Cấu hình App Links (Chuẩn HTTPS - Khuyên dùng)

Để vượt qua bộ lọc bảo mật chặn tự động chuyển hướng của Chrome, bạn nên cấu hình file liên kết ứng dụng:

- Tạo và deploy file sau lên server frontend web chính thức của bạn:
  `https://learn.vulinh2704.id.vn/.well-known/assetlinks.json`
- Nội dung file JSON:
  ```json
  [
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.vlrc.app",
        "sha256_cert_fingerprints": ["<SHA_256_FINGERPRINT_CỦA_DỰ_ÁN>"]
      }
    }
  ]
  ```

---

## 📦 Đóng Gói Ứng Dụng (Production Build)

### 1. Chuẩn bị file `.env.production`

Tạo file `.env.production` tại thư mục gốc và khai báo thông tin domain của bạn:

```env
VITE_BACKEND_API_URL="https://english.vulinh2704.id.vn"
VITE_APP_BASE_URL="https://learn.vulinh2704.id.vn"
VITE_AUTH_GOOGLE_ENABLED="true"
```

### 2. Build & Đồng bộ tài nguyên

```bash
pnpm build
pnpm cap:sync
```

### 3. Xuất file cài đặt cho Android (.APK / .AAB)

- **Tạo bản APK Debug có ký tự động** (Dùng để cài trực tiếp lên điện thoại test nhanh):

  ```bash
  cd android && ./gradlew assembleDebug
  ```

  _File xuất ra tại: `android/app/build/outputs/apk/debug/app-debug.apk`_

- **Tạo bản Release chính thức** (Để ký số keystore hoặc upload lên Google Play):
  ```bash
  npx cap open android
  ```
  _Lệnh này mở dự án trong Android Studio. Tại đây, chọn **Build** > **Generate Signed Bundle / APK**._

---

## 🎙️ Cấp Quyền Thiết Bị (Permissions)

Ứng dụng đã được khai báo sẵn các quyền hệ thống sau:

- **Android (`AndroidManifest.xml`)**:
  - `RECORD_AUDIO`: Sử dụng ghi âm micro trong kịch bản Role-play.
  - `MODIFY_AUDIO_SETTINGS`: Chỉnh sửa cài đặt phát âm thanh qua loa.
  - `INTERNET`: Kết nối tới máy chủ API.
  - `usesCleartextTraffic`: Cho phép tải HTTP trong chế độ dev local.
- **iOS (`Info.plist`)**:
  - `NSMicrophoneUsageDescription`: Mô tả quyền sử dụng Micro cho tính năng đàm thoại luyện nói.
