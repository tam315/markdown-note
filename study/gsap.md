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

### stagger を複数の子 react コンポーネントに適用する

```jsx
import gsap from 'gsap';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';

const Title = forwardRef<HTMLDivElement, { name: string }>((props, ref) => {
  const { name } = props;
  return (
    <div>
      <div>
        <div ref={ref}>name is: {name}</div>
      </div>
    </div>
  );
});

const AnimatedTitles = ({ names }: { names: Array<string> }) => {
  const nameRefs = useRef<Array<HTMLDivElement>>([]);

  const onRefUpdate = useCallback((el: any, index: number) => {
    nameRefs.current[index] = el;
  }, []);

  useEffect(() => {
    gsap.from(nameRefs.current, 1, {
      x: 100,
      stagger: 0.2,
    });
  }, []);

  return (
    <div>
      {names.map((name, index) => {
        return <Title name={name} ref={(el) => onRefUpdate(el, index)} />;
      })}
    </div>
  );
};

function App() {
  const names = ['dog', 'cat', 'bird'];

  return <AnimatedTitles names={names} />;
}

export default App;
```
