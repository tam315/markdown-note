module.exports = {
  lang: 'ja-JP', // this will be set as the lang attribute on <html>
  title: 'Markdown Notes',
  description: '個人的なメモ',
  themeConfig: {
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Study', link: '/study/react-native' },
    ],
    sidebar: ['/study/react-native'],
  },
};
