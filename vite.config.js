import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: '/LEIC-Tierlist/', // This should match your repository name
	build: {
		outDir: 'dist'
	}
})
