# Vuex

[[toc]]

## What is Vuex

- State を予見可能な形で集中管理する
- 中規模・大規模なアプリに最適
- 小規模であれば[store パターン](https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch)で事足りるかも

## はじめに

### Vuex を使うのと、グローバルオブジェクトを使う場合との違い

- Vuex の store から取得した値はリアクティブになる
- Vuex の値は mutation を commit することによってのみ変更できる。これにより値の変更が追跡可能になる。

### 基本的な使い方

```js
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

// mutationをコミットする
store.commit('increment');

// storeの値を取得する
console.log(store.state.count); // => 1
```

## State

### Single State Tree

Vuex の State は単一のオブジェクトで管理される。

### コンポーネントで store を使う

```js
// let's create a Counter component
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      return store.state.count;
    },
  },
};
```

computed プロパティとすることで、store の更新を検知し、コンポーネントをアップデートできるようになる。

上記のやり方はスケールしないので、通常は下記のようにする。

```js
// root Vue インスタンス
const app = new Vue({
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  /* ... */
});

// コンポーネント
const Counter = {
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
```

### mapState

react-redux の mapStateToProps と同じ機能。
`this.$store.state` 配下の各値をコンポーネントの`computed`に手早くマップするときに使う。

```js
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      // ファンクションを使う方法
      count: state => state.count,
      // storeのキー名を使う方法
      countAlias: 'count',
      // ローカルStateと組み合わせる場合はアロー関数は使えない
      countPlusLocalState(state) {
        return state.count + this.localCount;
      },
    }),
  },

  // もしくは、キー名を配列で渡す方法もある
  computed: {
    ...mapState([
      // map this.count to store.state.count
      'count',
    ]),
  },
};
```

ローカルの computed と一緒に使うときは`...`オペレータを使うと良い。

```js
computed: {
  localComputed () { /* ... */ },
  ...mapState({})
}
```

## Getters

- state の getter を設定することができる。computed の store 版と思えば OK。
- getter の再計算は、依存する値が変更された時のみ行われる（computed と一緒の挙動）

```js
const store = new Vuex.Store({
  state: {
    count: 1,
  },
  getters: {
    bigCount: state => state.count * 10,
    // 第2引数に他のgetterを取ることもできる
    moreBigCount: (state, getters) => getters.bigCount * 10,
  },
});
```

### Getter へのアクセス

コンポーネントからは`this.$store.getters`で取得できる。

```js
computed: {
  bigCount () {
    return this.$store.getters.bigCount
  }
}
```

### 応用編（メソッドスタイル）

getter がファンクションを返すようにすることで、コンポーネント側からクエリを投げることができる。

```js
// store側
getters: {
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id);
  };
}

// コンポーネント側
store.getters.getTodoById(2); // -> { id: 2, text: '...', done: false }
```

### mapGetters

state と同じく、`this.$store.getters` 配下の各値を手早くコンポーネントの`computed`にマップする時に使う。

```js
import { mapGetters } from 'vuex'

export default {
  computed: {
    // 名前を変更せずにそのままマップする時
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
    ])
    // 名前を変更してマップしたいとき
    ...mapGetters({
      doneCount: 'doneTodosCount'
    })
  }
}
```

## Mutations

各 mutation は**type**と**handler**を持つ。handler は第一引数に`state`をとる。

```js
const store = new Vuex.Store({
  mutations: {
    // ファンクション名をstringにしたものがtypeである => 'increment'
    // ファンクション自身が、handlerである
    increment(state) {
      // mutate state
      state.count++;
    },
  },
});
```

mutation は直接実行することはできない。実行するときは下記のようにする。これが`mutation`を`commit`するということ。

```js
// 'increment' typeのmutationを実行してくださいよー
store.commit('increment');
```

### payload

mutation を commit する時に、引数を渡すことができる。これが`payload`である。

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}

store.commit('increment', {
  amount: 10
})
```

### Object-Style Commit

`store.commit()`には、string の他にオブジェクトを渡すこともできる。
この場合、このオブジェクトが全て payload として handler に渡される。

```js
store.commit({
  type: 'increment',
  amount: 10,
});
```

### ハンドラを作成するときの注意点

Vuex の state に関する注意点は、[Vue の data に関する注意点](/study/vuejs.html#object-の変更検知)と同じ。

- 必要な State は、はじめから**全て**セットしておく（少なくとも初期値は）。
  **後から追加しないこと**。
- やむなく新しいプロパティをオブジェクトに追加するときは、下記のいずれかの手段を取る。
  - `Vue.set(obj, 'newProp', 123)`を使う
  - `state.obj = { ...state.obj, newProp: 123 }`などし、新しいオブジェクトに置き換える

### type に定数を使う

redux の慣習と同じように、vuex でも mutation types に定数を指定する慣習がある。

```js
// store.js
import Vuex from 'vuex';
import { SOME_MUTATION } from './mutation-types';

const store = new Vuex.Store({
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION](state) {},
  },
});
```

### mutations で非同期処理はできない

- なぜか？devtool がキャプチャする時にややこしいから。
- mutation は、redux の reducers と同じ立ち位置にいる。

### mapMutations

`this.$store.commit('***')`でアクセスできるものの、通常は、`mapMutations`を使ってコンポーネントの`methods`にマップしてつかう。

```js
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations([
      // map `this.increment()` to `this.$store.commit('increment')`
      'increment',
      // `mapMutations` also supports payloads:
      // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
      'incrementBy',
    ]),
    ...mapMutations({
      add: 'increment', // map `this.add()` to `this.$store.commit('increment')`
    }),
  },
};
```

## Action

構造は Mutation とほぼ同じ。非同期処理を行えるという点において異なる。

```js
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
  },
});
```

`context`は`store`インスタンスとほぼ同じなので、下記が使える。

- `context.commit`
- `context.state`
- `context.getters`

下記のように destructur を使うことが多い。

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### action の dispatch

基本的に mutation と同じ。`commit`が`dispatch`になっただけ。

```js
// simple dispatch
store.dispatch('increment');

// dispatch with a payload
store.dispatch('incrementAsync', {
  amount: 10,
});

// Object-Style
store.dispatch({
  type: 'incrementAsync',
  amount: 10,
});
```

payload を渡した場合は下記のように受け取れる。これも mutation とおなじ。

```js
actions: {
  increment (context, payload) {},
}
```

### mapActions

これも mutation と同じ。`this.$store.dispatch('***')`をコンポーネントの methods に手早くマップするために使う。

```js
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions([
      // map `this.increment()` to `this.$store.dispatch('increment')`
      'increment',
      // `mapActions` also supports payloads:
      // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
      'incrementBy',
    ]),
    ...mapActions({
      add: 'increment', // map `this.add()` to `this.$store.dispatch('increment')`
    }),
  },
};
```

### 複数の action を組み合わせて使う

```js
// assuming `getData()` and `getOtherData()` return Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for `actionA` to finish
    commit('gotOtherData', await getOtherData())
  }
}
```
