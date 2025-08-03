
# Fusion Starter

A modern, production-ready full-stack React application template with an integrated Express backend, SPA routing, TypeScript, Vitest, Zod, and a comprehensive set of UI and development tools.

---

## 🚀 Tech Stack

- **Frontend:** React 18, React Router 6 (SPA), TypeScript, Vite, TailwindCSS 3
- **Backend:** Express.js (integrated with Vite dev server)
- **UI:** Radix UI, Lucide React icons
- **Testing:** Vitest
- **Other:** Zod, MongoDB, Prettier, Netlify/Vercel deploy ready

---

## 📁 Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx               # App entry point and SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types shared between client & server
└── api.ts                # Example: shared api interfaces
```

---

## ✨ Features

- **SPA Routing** with React Router 6 (`client/pages/`)
- **Hot-reload Dev Environment:** Single-port for client + server
- **Type Safety:** TypeScript throughout, shared types via `shared/`
- **Pre-built UI Components:** `client/components/ui/`
- **TailwindCSS 3** with brand color customization
- **API Endpoints:** All API routes prefixed with `/api/`
- **Out-of-the-box Testing:** Vitest ready
- **Easy Deployment:** Netlify/Vercel/cloud/standalone support

---

## 🛠️ Development

### Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test           # Run Vitest tests
```

### Add a New API Route

1. (Optional) Create shared interface in `shared/api.ts`:
    ```ts
    export interface MyRouteResponse {
      message: string;
      // Add other response properties
    }
    ```

2. Create route in `server/routes/my-route.ts`:
    ```ts
    import { RequestHandler } from "express";
    import { MyRouteResponse } from "@shared/api";

    export const handleMyRoute: RequestHandler = (req, res) => {
      const response: MyRouteResponse = { message: "Hello from my endpoint!" };
      res.json(response);
    };
    ```

3. Register in `server/index.ts`:
    ```ts
    import { handleMyRoute } from "./routes/my-route";
    app.get("/api/my-endpoint", handleMyRoute);
    ```

### Add a New Page Route

1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
    ```tsx
    <Route path="/my-page" element={<MyPage />} />
    ```

---

## 🌐 Deployment

- **Standard:** `npm run build` + `npm start`
- **Binary:** Self-contained executables (Linux/macOS/Windows)
- **Cloud:** Works with Netlify or Vercel (see `netlify.toml`)
- **Multiple environments:** Customizable via .env files

---

## 📋 Architecture Notes

- Single-port Vite + Express integration for unified DX
- TypeScript throughout, including shared types for API
- Comprehensive UI component library
- Type-safe API calls in React using shared interfaces
- Out-of-the-box hot-reload, linting, and formatting

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome!

---

## 📄 License

MIT

---
