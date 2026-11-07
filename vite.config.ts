import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { renderHome, renderYoutubeResume } from './src/render.ts';

// The page is rendered at build time, so all content works without JavaScript.
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                home: resolve(import.meta.dirname, 'index.html'),
                youtubeResume: resolve(import.meta.dirname, 'local-youtube-history/index.html'),
            },
        },
    },
    plugins: [
        {
            name: 'render-home',
            transformIndexHtml: (html, context) =>
                html.replace(
                    '<!--app-->',
                    context.path.startsWith('/local-youtube-history/') ? renderYoutubeResume() : renderHome(),
                ),
        },
    ],
});
