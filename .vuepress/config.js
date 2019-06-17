module.exports = {
  lang: 'ja-JP', // this will be set as the lang attribute on <html>
  title: 'Yuuniworks Notes',
  description: '📋個人的なメモ帳です✍🏻',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#2E6BE6' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/katex@0.6.0/dist/katex.min.css',
      },
    ],
  ],
  themeConfig: {
    sidebar: 'auto',
    docsRepo: 'junkboy0315/markdown-notes',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help me improve this page!',
    algolia: {
      apiKey: '74244ba9a848241cee21adac30d63d03',
      indexName: 'yuuniworks',
    },
    serviceWorker: {
      updatePopup: true,
    },
  },
  markdown: {
    toc: { includeLevel: [2] },
  },
  extendMarkdown(md) {
    md.use(require('markdown-it-katex'));
    md.use(require('markdown-it-imsize'));
  },
  plugins: {
    '@vuepress/google-analytics': {
      ga: 'UA-116967778-5',
    },
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true,
    },
  },
  serviceWorker: true,
};
