import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools(),
    // Bundle visualizer — genera dist/stats.html con un treemap del bundle.
    // Solo corre si se ejecuta `npm run build:analyze`.
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],
  // Build target: 'modules' (es2020+) por defecto en Vite 8, pero lo
  // declaramos explícitamente para evitar polyfills innecesarios.
  build: {
    target: 'es2020',
    cssTarget: 'chrome108',
  },
  server: {
    fs: {
      // Este proyecto se ejecuta frecuentemente desde git worktrees
      // (.claude/worktrees/*), que no tienen su propio node_modules y
      // resuelven paquetes vía symlink al repo principal. Sin esto, Vite
      // devuelve 403 al servir archivos fuera del worktree (p. ej. las
      // fuentes de @tabler/icons-webfont), y los íconos se ven como □.
      allow: ['..', '/Users/victorhoyos/Documents/Tai chi/Quiz Taichi'],
    },
  },
})
