import checker from 'vite-plugin-checker'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default  defineConfig ({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        qrgenerator: resolve(__dirname, 'qr-generator.html'),
        qrreader: resolve(__dirname, 'qr-reader.html')
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
  ],
    base: "./",
    define: {
        "global": "window"
    }
})

