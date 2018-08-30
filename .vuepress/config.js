module.exports = {
  lang: 'ja-JP', // this will be set as the lang attribute on <html>
  title: 'Yuuniworks Notes',
  description: '📋個人的なメモ帳です✍🏻',
  themeConfig: {
    sidebarDepth: 2,
    sidebar: 'auto',
    docsRepo: 'junkboy0315/markdown-notes',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help me improve this page!',
  },
  markdown: {
    toc: { includeLevel: [1, 2] },
    config: md => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-imsize'));
    },
  },
  ga: 'UA-116967778-5',
};
