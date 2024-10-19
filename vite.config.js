import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import laravelTranslator from 'laravel-translator/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true
        }),
        react(),
        laravelTranslator()
    ],
    server: {
        host: '0.0.0.0',
        hmr: {
            clientPort: 5173,
            host: 'localhost',
        },
    }
});
