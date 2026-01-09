// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeMermaidWrapper from './src/plugins/rehype-mermaid-wrapper.mjs';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      theme: 'github-dark',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [
      rehypeMermaidWrapper, // Must run before rehype-mermaid to capture code
      [rehypeMermaid, {
        strategy: 'inline-svg',
        dark: true,
        launchOptions: {
          args: ['--window-size=1920,1080'],
        },
        mermaidConfig: {
          theme: 'dark',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
          sequence: {
            useMaxWidth: true,
          },
          themeVariables: {
            darkMode: true,
            background: '#1c2029',
            primaryColor: '#6b7280',
            primaryTextColor: 'rgba(255,255,255,0.85)',
            primaryBorderColor: '#374151',
            lineColor: '#6b7280',
            secondaryColor: '#4b5563',
            tertiaryColor: '#13161c',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      }]
    ],
  },
});