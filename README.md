# GameGate — Ticketera POS

Punto de venta para taquillas de estadio: login, venta de tickets, mapa 3D de
secciones y eventos.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- TanStack Query, Three.js (mapa 3D), lucide-react

## Scripts
```bash
npm run dev      # servidor de desarrollo
npm run build    # tsc --noEmit && vite build -> dist/
npm run preview  # previsualizar el build
```

## Assets
- `tools/make_favicon.py` regenera los iconos de `public/` a partir de
  `assets/icon.png`.

## Deploy (Vercel)
1. Importa este repositorio en Vercel (detecta Vite automáticamente).
2. Build `npm run build` · Output `dist` (ya configurado en `vercel.json`).
