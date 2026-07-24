// @ts-check
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import { remarkModifiedTime } from './remark-modified-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://fullstuck.net',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkModifiedTime],
    }),
  },
});
