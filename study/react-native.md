---
pageClass: study-notes-class
---

# React Native

## 基本・セットアップ

### ドキュメント

https://www.udemy.com/react-native-the-practical-guide/learn/v4/t/lecture/8567846?start=0

### 仕組み

UI コンポーネントは、Native コンポーネントにコンパイルされる。
ロジックは独自のスレッドで JS のママで実行される。
JS の実行には Safari の JavascriptCore や Chrome の V8 が使われる。

使用できる Javascript の構文については下記を参照すること。
https://facebook.github.io/react-native/docs/javascript-environment

### Android で動かす

- JDK をインストールする
- 環境変数を設定する
  - JAVA_HOME 　`C:\Program Files\Java\jdk1.8.0_181`
  - ANDROID_HOME `C:\Users\Shota\AppData\Local\Android\Sdk`
  - PATH 　`C:\Users\Shota\AppData\Local\Android\Sdk\platform-tools`
- `adb reverse tcp:8081 tcp:8081`を実行する
- `yarn eject`で Eject する（Eject しないとサードパーティのライブラリは使えない）

### エミュレータで動かす

- Android Studio の Tools – Android – AVD Manager からエミュレータを作成する。
- 必要なバージョンの SDK がインストールされていないとエラーが出るので、適宜追加でインストールする
- `yarn android`を実行すると、React Native のコードが Java にコンパイルされ、エミュレータでアプリが立ち上がる
- `adb not found` というメッセージが出た場合は、adb.exe にパスが通っているか確認すること。

### 実機で動かす

- PC と Android を接続し、USB デバッグを有効にしたうえで、`yarn android`を実行する。

### iPhone で動かす

- 必要になったときにレクチャー２１，２２を参照すること

### Typescript 環境のセットアップ

下記を参考にやったらできた。

https://github.com/Microsoft/TypeScript-React-Native-Starter

## 作成

### StyleSheet

TextInput 等にはスタイルの設定項目が少ない。スタイルを設定するときは、View や ScrollView で囲んで設定する。

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width: 300,
    borderColor: 'gray',
    borderWidth: 0,
  },
});
```

- [Stylesheet API](https://facebook.github.io/react-native/docs/stylesheet)

- [スタイリングチートシート](https://github.com/vhpoet/react-native-styling-cheat-sheet)

- [Flexbox](https://facebook.github.io/react-native/docs/flexbox)

  flex:1 を指定すると、利用可能なすべての範囲を埋め尽くす。指定しなければ、最小限の範囲を占有する。

- 複数のスタイル

  style 属性には複数のスタイルを配列で指定できる

  ```jsx
  <View style={[someStyleObject, { width: 100 }]} />
  ```

### 画面幅の取得

Dimention を使う。

```js
const style = { width: Dimensions.get('window') * 0.7 };
```

### タッチイベント

DOM と異なり、例えば View などのオブジェクトは、デフォルトではタッチできない。タッチできるようにするには`Touchable****`コンポーネントで囲む。タッチ時の反応ごとにいくつかの種類がある。

- **TouchableHighlight** 　タッチ時に暗くする
- **TouchableNativeFeedback** 　タッチ時にネイティブエフェクトをかける（リップルなど）
- **TouchableOpacity** 　タッチ時に明るくする
- **TouchableWithoutFeedback** 　タッチ時に何もしない

```jsx
<TouchableNativeFeedback onPress={props.onPress}>
  <View style={styles.listItem}>some contents</View>
</TouchableNativeFeedback>
```

### スクロールビュー

スクロールが必要な場合は View の替わりに ScrollView コンポーネントを使用する。
ただし、大量のデータを表示する場合は、より効率的な FlatList や SectionList を使うこと。

### FlatList の使い方

- 配列を data に渡す。配列は、key というプロパティを持ったオブジェクトの配列であること。
- renderItem に表示内容を記述する。info.item で個々のオブジェクトにアクセスできる。

```jsx
<FlatList
  style={styles.container}
  data={props.places}
  renderItem={info => (
    <ListItem
      placeName={info.item.name}
      onPress={() => props.onItemDeleted(info.item.key)}
    />
  )}
/>
```

### スタティック画像

jpg 画像等を import 文でインポートする。
すると、ImageURISource というインターフェースを持つオブジェクトが自動的に生成される。
これを Image コンポーネントに渡す。

```jsx
<Image source={importedImage} />
```

表示方法はデフォルトで Cover になっている。

https://facebook.github.io/react-native/docs/image#resizemode

### ダイナミック画像

ネット上の画像等の場合は、下記のように ImageURISource を手動で作成し、Image コンポーネントに渡す。
ダイナミック画像の場合は、`height` と `width` を指定しないと表示されないので注意すること。

```js
{
  uri: 'https://images.fineartamerica.com/some.jpg';
}
```

### Modal

特に特記事項なし。モーダルを表示した状態でリロードすると仮想端末がハングするバグがあるので注意。

https://facebook.github.io/react-native/docs/modal

```jsx
<Modal onRequestClose={() => onClose()} animationType="slide" />
```

### Redux

実装の方法は Web アプリとほぼ同じ。ただし、react-native-navigation など、ナビゲーションのライブラリを使う場合はライブラリ独自の方法で設定する必要がある。

## デバッグ

### ショートカット

| 目的         | Android                   | iPhone                      |
| ------------ | ------------------------- | --------------------------- |
| メニュー表示 | Ctrl + M もしくはシェイク | Ctrl + D 　もしくはシェイク |
| リロード     | R \* 2 回                 | Ctrl + R                    |
| 端末を回転   | Ctrl + ←→                 | Ctrl + ←→                   |

### Console.log

デバッグメニューから Debug JS Remotely を選択する。
Console.log の内容が、Chrome のデベロッパツールに表示される。

接続できなかった場合は下記の設定を行うこと。

- Press Cmd + M on emulator screen
- Go to Dev settings > Debug server host & port for device
- Set localhost:8081

### ブレークポイント

Debug JS Remotely を有効にした状態で、Chrome Dev Tools の Source タブで設定する。

### react-native-debugger

react-native-debugger を使えば、Redux を含めて、あらゆるものをデバッグすることができるようになるので、必ずインストールすること。
セットアップは下記のように行う。RN のバグで、ブレークポイントが現在使えない模様。

```js
import { createStore, compose } from 'redux';
let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = createStore(reducer, composeEnhancers());
```

## サードパーティライブラリ

サードパーティのライブラリを利用するには、npm でのインストール以外に、手動での作業が必要になることがある。Github ページに手順が記載されていることが多いので、よく読むこと。

### 自動でインストールする場合

・npm でライブラリをインストール
・`react-native link`を実行する（うまくいかない場合が多い）

### 手動でインストールする場合の典型的な手順（iPhone）

・npm でライブラリをインストール
・Xcode で ios/\*\*\*.xcodeprpj を開く

（ライブラリをプロジェクトに追加する）
・Libraries フォルダを右クリックし、`add libraries to PROJECT_NAME`をクリックする
・node_modules 内のライブラリのフォルダから、\*\*\*.xcodeproj ファイルを探して選択する。（ios というフォルダもしくはルートフォルダにあることが多い）

（ライブラリをビルドプロセスに追加する）
・Xcode でルートフォルダをクリックし、「Build Phases」タブを選択する
・Link Binary with Libraries を開いて＋ボタンをクリックする
・ライブラリ名を検索して追加する

・Github のドキュメントを確認し、ライブラリ固有の作業を行う。
手動でインストールする場合の典型的な手順（Android）
・npm でライブラリをインストール

settings.gradle に下記の行を追加する。どのライブラリでも記述はおおむね同じ。

```js
include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
```

app/build.gradle に下記の行を追加する

```js
implementation project(':react-native-vector-icons')
```

MainApplication.java に下記の行を追加する

```java
import com.oblador.vectoricons.VectorIconsPackage;

@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
    new MainReactPackage(),
    new VectorIconsPackage()
  );
}
```

・Github のドキュメントを確認し、ライブラリ固有の作業を行う。

## ナビゲーション

ネイティブアプリでは URL によるルーティングは行えない。
代わりに、タブやスタックを用いたナビゲーションを行う。
https://facebook.github.io/react-native/docs/navigation

react-navigation（バグが多い）
native-navigation（Airbnb が作っている）
react-native-navigation.（Wix が作っている、これがおすすめ）

### react-native-navigation のインストール

iOS
https://wix.github.io/react-native-navigation/#/installation-ios
お決まりの手順に加え、2 つほど作業が必要。

Android
https://wix.github.io/react-native-navigation/#/installation-android
お決まりの手順に加え、いくつかの作業が必要。

### ナビゲーションの基本

https://wix.github.io/react-native-navigation/#/top-level-api

react-native-navigation を使用する場合は、コンポーネントの初期表示の方法が変わる。
下記の 2 つをプログラマティックに行う必要がある。

- スクリーン（コンポーネント）の登録
- スクリーンの表示

react-native の AppRegistry は使用しない。
screens フォルダにコンポーネントを配置する。ここに配置するコンポーネントは通常のコンポーネントだが、ナビゲーションによって表示されるという点で、通常のコンポーネントとは異なる。

### スクリーンの登録

アプリで使用する全てのスクリーン（コンポーネント）を、App.tsx 内であらかじめ登録しておく。

```jsx
// App.tsx
Navigation.registerComponent('myproject.AuthScreen', () => AuthScreen);
```

### startSingleScreenApp

ナビゲーションイベントの発生時に、startTabBasedApp か startSingleScreenApp を発火させる。
ただし、起動時のデフォルト画面については、App.tsx 内などで、直接発火させる。

```jsx
// App.jsx
Navigation.startSingleScreenApp({
  screen: {
    screen: 'myproject.AuthScreen',
    title: 'login',
  },
});

// index.js;
import App from './src/App';
```

### startTabBasedApp

startSingleScreenApp と考え方は同じ。

```js
const mapIcon = await Icon.getImageSource('map', 30);
const shareIcon = await Icon.getImageSource('share', 30);

Navigation.startTabBasedApp({
  tabs: [
    {
      screen: 'myproject.FindPlaceScreen',
      label: 'Find Place', // タブに表示される
      title: 'Find Place', // Navbarに表示される
      icon: mapIcon, // Androidでは必須
    },
    {
      screen: 'myproject.SharePlaceScreen',
      label: 'Share Place', // タブに表示される
      title: 'Share Place', // Navbarに表示される
      icon: shareIcon,
    },
  ],
});
```

### Stack

スタック（カレントスクリーンの上にページを乗せていく方法）を使いたい場合は、下記のようにする。
なお、navigator API は、全ての screen において、props.navigator で取得できる。
passProps を指定することで、任意の props をスタックされるスクリーンに渡すことができる。

```js
// 作成時
this.props.navigator.push({
  screen: 'myproject.PlaceDetailScreen',
  title: place.name,
  animationType: 'slide-horizontal',
  passProps: {
    place,
  },
});

// 削除時
this.props.navigator.pop();
```

### Drawer

startTabBasedApp もしくは startSingleScreenApp で、drawer オプションを指定する。
また、ドロワーを開閉するための navigatorButtons を各スクリーンに表示する。

```js
import Icon from 'react-native-vector-icons/FontAwesome';
const barsIcon = await Icon.getImageSource('bars', 30);

Navigation.startTabBasedApp({
  tabs: [
    {
      navigatorButtons: {
        leftButtons: [
          {
            id: 'sidebar-toggle-button',
            icon: barsIcon,
          },
        ],
      },
    },
  ],
  drawer: {
    left: {
      screen: 'myproject.SidebarScreen',
    },
  },
});
```

トグルの操作は、navigatorButtons を渡した各スクリーンで、setOnNavigatorEvent を使って行う。

```js
constructor(props: Props) {
  super(props);

  this.props.navigator.setOnNavigatorEvent(this.handleNavigatorEvent);
}

handleNavigatorEvent = (e: NavigatorEvent) => {
  if (e.type === 'NavBarButtonPress' && e.id === 'sidebar-toggle-button') {
    this.props.navigator.toggleDrawer({ side: 'left' });
  }
};
```

## スタイリング

### Stylesheet.create を使う意味

- Validation が行われる
- 効率的なネイティブコードに変換される

### スタイルを適用できるコンポーネント

Image、ScrollView、Text、View の４つだけ

### 再利用可能性の高い width の指定

内部コンテンツは width100%にして、container(View など)に width80%などを指定すると、移植が楽になる。

### カスタムコンポーネントとスタイルの継承

よく使うコンポーネントはカスタムコンポーネントとして用意しておくと良い(components/UI フォルダを参照)。下記は、あらかじめスタイルが設定された TextInput を作成する場合の例。

```jsx
const DefaultInput = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        // コンポーネントの外側から一部のスタイルを変更できるようにする
        props.style,
      ]}
      underlineColorAndroid="transparent"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 4,
    marginTop: 8,
    marginBottom: 8,
  },
});
```

### Text コンポーネントのスタイル継承

Text コンポーネントを入れ子にすると、上位の Text のスタイルが配下の全ての Text に継承される。
たとえば BlackText というコンポーネントを作っておけば、これで囲むだけで配下の全ての Text が黒になる。

### 背景に画像を表示する

ImageBackground を使う。

https://facebook.github.io/react-native/docs/images#background-image-via-nesting

### カスタムボタン

Touchable,View,Text を組み合わせて作る。

```jsx
<TouchableOpacity onPress={props.onPress}>
  <View {...props} style={[styles.button, { backgroundColor: props.color }]}>
    <Text>{props.children}</Text>
  </View>
</TouchableOpacity>
```

### Platform API

OS の種類等によって描写を変更する際に使用する。

```jsx
if (Platform.OS === 'ios') {
  return (
    <TouchableOpacity onPress={props.onPress}>{content} </TouchableOpacity>
  );
}
return (
  <TouchableNativeFeedback onPress={props.onPress}>
    {content}
  </TouchableNativeFeedback>
);
```

### クロスプラットフォームな UI ライブラリ

NativeBase などを使うとよいかも。

### Dimensions API

画面サイズを取得したり、ローテーションの検知をしたりする際に使用する

画面の高さや幅によってスタイルを変更する
画面の高さによって State を更新するイベントリスナーを、Dimensions に登録する。

```jsx
componentDidMount = () => {
  this.checkWindowHeight();
  Dimensions.addEventListener('change', this.checkWindowHeight);
};

componentWillUnmount = () => {
  Dimensions.removeEventListener('change', this.checkWindowHeight);
};

checkWindowHeight = () => {
  if (Dimensions.get('window').height > 500) {
    this.setState({ hasEnoughHeight: true });
  } else {
    this.setState({ hasEnoughHeight: false });
  }
};
```

コンポーネントのスタイルは、render メソッドの中で、State の状態によって動的に変更する。

```jsx
const passwordsContainerStyle = {
  flexDirection: hasEnoughHeight ? 'column' : 'row',
};
```

### react-native-navigation のタブのスタイル

startTabBasedApp で設定する

https://wix.github.io/react-native-navigation/#/top-level-api?id=starttabbasedappparams

```js
Navigation.startTabBasedApp({
  tabsStyle: {
    tabBarSelectedButtonColor: 'orange',
  },
  appStyle: {
    // for android
    tabBarSelectedButtonColor: 'orange',
  },
});
```

### react-native-navigation のナビゲーションのスタイル

各スクリーンで static navigatorStyle を定義して行う。

https://wix.github.io/react-native-navigation/#/styling-the-navigator

```js
class FindPlaceScreen extends React.Component<Props> {
  static navigatorStyle = {
    navBarButtonColor: 'orange',
  };
}
```

### TextInput の諸設定

TextInput の挙動については、autoCapitalize, autoCorrect, keyboardType, secureTextEntry など、便利な設定項目がいろいろあるので、ドキュメントをよく参照すること。

https://facebook.github.io/react-native/docs/textinput

### KeyboardAvoidingView

View の代わりに KeyboardAvoidingView を使うと、キーボードで要素が隠れることがなくなる。
Keyboard が画面上にかぶさるのではなく、Keyboard の高さを除外した範囲で View がレンダリングされる。ScrollView に対しては基本的に使う必要がない。

### Keyboard API

キーボードを消したいなど、キーボードを操作したいときは Keyboard API を使う。
例えば、下記のコードで要素を囲めば、要素の範囲外をタップした時にキーボードが自動的に隠されるようになる。

```jsx
<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
```

## アニメーション

### 基本設定

詳細はドキュメントを読むこと。

https://facebook.github.io/react-native/docs/animations

1. アニメーションしたい要素を Animated.View で囲む。
2. Animated.View の style に state を設定する。

   ```jsx
   <Animated.View
   style={{
       opacity: this.state.fadeAnim,
     }}
   >
   ```

3. state は、`new Animated.Value()`で設定する。これが初期値になる。

   ```js
   state = {
     fadeAnim: new Animated.Value(1),
   };
   ```

4. アニメーションを開始したいタイミングで、`Animated.timing().start()`などを発火する。state の値はアニメーション終了後も維持される。

   ```js
   Animated.timing(this.state.fadeAnim, {
     toValue: 0, // この値はアニメーション終了後も保持される
     duration: 200,
     useNativeDriver: true, // for performance
   }).start();
   ```

### Interpolation

Animated.value の値を、別の形に変更したいときは、interpolate を使う。
下記の例では、value が 0 のときに 100、1 の時に 200 を出力する。

```js
const width = fadeAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [100, 200],
}),
```

## React Native Maps

### インストール

- SDK Manager から Google Play Service をインストールする。
- com.google.android.gms:play-services-base|maps のダウンロードに失敗するので、ルートレベルの build.grade の、allProjects.repositories に’google()’を追加しておく。
- play-services のバージョンは下記を参考にする。10.2.6 以上では動かなかった。
  https://developers.google.com/android/guides/releases
- 公式サイトを参考にインストールする。react-native link は使えない。

### 使い方

公式サイトに全て書いてある。

### ズーム（Delta）の設定

意味がよくわからないが、下記のようにしておけば OK みたい。

```js
const region = {
  latitude: 35.0,
  longitude: 135.0,
  latitudeDelta: 0.0122,
  longitudeDelta:
    0.0122 * (Dimensions.get('window').width / Dimensions.get('window').height),
};
```

### メソッド

下記のようにしたうえで、this.map.\*\*\* の形で呼び出せる。

```jsx
<MapView ref={ref => (this.map = ref)} />
```

MapView のメソッド例：
https://github.com/react-community/react-native-maps/blob/master/docs/mapview.md#methods

### 位置情報の取得

まず権限を設定する

#### Android

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

#### iPhone

Info.plist => add row => Privacy – Location Usage Descriptor を追加する。値には、位置情報取得時にユーザに表示するメッセージを入力しておく。

その後、navigator オブジェクトを使って位置を取得する。web と同じ navigator オブジェクトが使えるのは、ReactNative がエミュレートしているから。

`navigator.geolocation.getCurrentPosition`
