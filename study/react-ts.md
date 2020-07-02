# React - TypeScript

[[toc]]

[こちらの記事](https://blog.bitsrc.io/react-typescript-cheetsheet-2b6fa2cecfe2)のまとめ

## props の型を定義する

`React.Component`か`React.FC`を使う

```tsx
interface IButtonProps {
  text: string;
  disabled?: boolean; // 任意項目
  action: () => void;
}

// クラスコンポーネントの場合
class MyButton extends React.Component<IButtonProps, void> {}

// 関数コンポーネントの場合
const MyButton: React.FC<IButtonProps> = ({ text, action }) => {};
```

## hook の型を定義する

`useState`等にジェネリックを渡す

```tsx
const [isOk, setIsOk] = React.useState<bool>(false);
```

## nullable な型にする

```tsx
const [isOk, setIsOk] = React.useState<bool | null>(null);
```

## Generic を使って型を作る

```tsx
interface Props<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>(props: Props<T>) {
  const { items, renderItem } = props;
  return <div>{items.map(renderItem)}</div>;
}

// 利用側
const App = () => {
  return (
    <List<number>
      items={[1, 2, 3, 4]}
      renderItem={(item) => <li key={item}>{item.toPrecision(3)}</li>}
    />
  );
};
```

## Enum

下記の場合、Enum は最終的にテキストになる

```tsx
enum SelectableButtonTypes {
  Important = 'important',
  Optional = 'optional',
  Irrelevant = 'irrelevant',
}

interface IButtonProps {
  buttonType: SelectableButtonTypes;
}

const MyButton = (props: IButtonProps) => {};

// 使い方
const App = () => {
  return <MyButton buttonType={SelectableButtonTypes.Important} />;
};
```

## interface か type か

どちらでもほぼ同じことができるが、[公式ドキュメント](https://www.typescriptlang.org/docs/handbook/advanced-types.html#interfaces-vs-type-aliases)ではなるべく interface を使うべきとの記載あり。

## HTML 要素を拡張する

`React.HTMLAttributes`を使う

```tsx
interface IBorderedBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const BorderedBox: React.FC<IBorderedBoxProps> = (props) => {
  const { children, title, ...divAttributes } = props;

  return (
    <div {...divAttributes} style={{ border: '1px solid red' }}>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

## イベントタイプ

`React.MouseEvent`を使う

```tsx
function eventHandler(event: React.MouseEvent<HTMLAnchorElement>) {
  console.log('TEST!');
}

const MyButton = () => {
  return <button onClick={eventHandler}></button>;
};
```
