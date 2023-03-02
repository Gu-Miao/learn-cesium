import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(() => ({
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
          dest: ''
        }
      ]
    }),
    vue(),
    createHtmlPlugin({ minify: true })
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
}))
