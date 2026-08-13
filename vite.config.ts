import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools(),
  ],
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
