import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // A PDF held open by a viewer makes chokidar's watch() throw EBUSY on
    // Windows, and the unhandled error takes the whole dev server down.
    // Nothing here imports one, so there is no reason to watch them.
    watch: { ignored: ['**/*.pdf'] },
  },
})
