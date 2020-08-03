function insertModal() {
  whitebox = document.createElement('div');
  whitebox.textContent =
    '広告ブロッカーが検出されました。当サイトは広告費で運営されているため、お手数ですが当サイトを除外のうえリロードをお願いいたします。';
  whitebox.style = `
    background:white;
    border-radius: 0.5rem;
    left:50%;
    padding: 1rem;
    position: fixed;
    top:50%;
    transform: translate(-50%,-50%);
    width: 50%;
    z-index: 10000;
  `;

  backdrop = document.createElement('div');
  backdrop.style = `
    background:black;
    height: 100vh;
    left:0;
    opacity: .5;
    position: fixed;
    top:0;
    width: 100vw;
    z-index: 10000;
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(whitebox);
}

if (typeof window !== 'undefined') {
  fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
    method: 'HEAD',
    mode: 'no-cors',
  }).catch((e) => {
    // Failed, maybe because of an AdBlocker
    insertModal();
  });
}
