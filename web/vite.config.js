import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {},
  },
  devServer: {
    proxy: 'http://localhost:3000',
  },
  build: {
    outDir: 'build',
  },
});
