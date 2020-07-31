if (typeof window !== 'undefined') {
  fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
    method: 'HEAD',
    mode: 'no-cors',
  }).catch((e) => {
    // Failed, maybe because of an AdBlocker
    window.alert(
      'AdBlockerが検出されました。当サイトは広告により無償運営されているため、除外にご協力いただければ幸いです。',
    );
  });
}
