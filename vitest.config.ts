import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: 'app',
		globals: false,
		environment: 'node',

		include: ['./src/test/**/*.{js,ts,jsx,tsx,mjs,cjs}'],
		exclude: ['./src/test/data/**/*', 'node_modules', 'dist', '.idea', '.git', '.cache','declarations'],

		coverage: { provider: 'v8' },
	},
});
