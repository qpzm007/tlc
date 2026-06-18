import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/tlc/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        equipment: resolve(__dirname, 'equipment.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
