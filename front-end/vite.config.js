import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
    plugins: [react()],
    build: {
        outDir: '/var/www/html', // Specify your output directory here
    },
});