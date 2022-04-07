import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/learn-cesium/',
  plugins: [
    copy({
      targets: [
        {
          src: [
            'node_modules/cesium/Build/Cesium/Assets',
            'node_modules/cesium/Build/Cesium/ThirdParty',
            'node_modules/cesium/Build/Cesium/Widgets',
            'node_modules/cesium/Build/Cesium/Workers'
          ],
          dest: '/'
        }
      ]
    }),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsDir: 'static',
    rollupOptions: {
      external: '/Widgets/widgets.css'
    }
  }
})
