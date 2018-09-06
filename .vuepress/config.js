module.exports = {
  lang: 'ja-JP', // this will be set as the lang attribute on <html>
  title: 'Yuuniworks Notes',
  description: '📋個人的なメモ帳です✍🏻',
  head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]],
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
  },
  markdown: {
    toc: { includeLevel: [2] },
    config: md => {
      md.use(require('markdown-it-imsize'));
    },
  },
  ga: 'UA-116967778-5',
};
