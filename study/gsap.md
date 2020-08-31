# GSAP

## Get Started

- [Cheet sheet](https://greensock.com/cheatsheet/)
- [Get Started](https://greensock.com/get-started/)

以下、チートシートに記載がないもののみ抜粋

### Getter, Setter

下記は、引数なしで呼ぶとゲッターとして、引数を渡すとセッターとして使用できる

- `time()`
- `progress()`
- `duration()`
- `delay()`

## Tips

### スクロールと連動するアニメーション

```jsx
import gsap from 'gsap';

gsap.timeline({
  scrollTrigger: {
    trigger: boxRef.current!,
    start: 'center 70%',
    end: 'center 30%',
    markers: true,
    scrub: true,
  },
}).fromTo(
  boxRef.current,
  { opacity: 0, y: -200, x: 500 },
  { opacity: 1, y: 0, x: 400, rotate: 75 },
);
```

### コンポーネント化

複雑なアニメーションはコンポーネント化し、`.add()`でタイムラインに追加していくと良い。

[参考](https://css-tricks.com/writing-smarter-animation-code/)
