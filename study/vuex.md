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
      // ローカルStateと組み合わせる場合はノーマル関数を使う
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

ローカルの computed と一緒に使う場合は下記のようにする。

```js
computed: {
  ...mapState({})
  localComputed () { /* ... */ },
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

`store.commit()`には、string ではなくオブジェクトを渡すこともできる。
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

構造は Mutation とほぼ同じであるものの、下記の点が異なる。

- Action は非同期処理を行える
- Action は Store にアクセスできる。Mutation は state にしかアクセスできない。

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

`context`は`store`インスタンスとほぼ同じなので、たとえば下記が使える。

- `context.commit`
- `context.state`
- `context.getters`
- `context.dispatch`　など

下記のように destructuring を使うことが多い。

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

## Modules

Vuex の Store は、モジュール単位に分けることができる。

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

### Module Local State

モジュールの中で、Local State（モジュール自身の State）と Root State（親の State）にアクセスする方法は次の通り。

```js
const moduleA = {
  getters: {
    someGetter(state, getters, rootState, rootGetters) {},
  },
  actions: {
    someAction({ state, getters, rootState, rootGetters }) {},
  },
  mutations: {
    someMutation(state) {}, // mutationsはローカルStateにしかアクセスできない！
  },
};
```

`getters`や`actions`は Root State にアクセスできるものの、`mutations`はローカル State にしかアクセスできない。モジュールの State の変更は、あくまでそのモジュールの Mutation でのみで行う。

### Name Spacing

- デフォルトでは、モジュール内の`getters`,`mutations`,`actions`はグローバルな Namespace にそのまま登録される（他のモジュールから容易にアクセスできる）。一方、`namespaced`キーを true にすると、`モジュール名/ファンクション名`の形で登録される。
- Namespace が有効なモジュール内の getter と actions は、ローカライズされた`getters`,`dispatch`,`commit`を受け取る。これは、モジュール内の他のアセットに Prefix なしでアクセスできることを意味する。

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: { ... }, // module state is already nested and not affected by namespace option
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // nested modules
      modules: {
        // inherits the namespace from parent module
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // further nest the namespace
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

#### Namespaced Modules 内からグローバル Assets にアクセスする

- 親の state と getters にアクセスしたいときは、`rootState`,`rootGetters`を使う。
- 親の`dispatch`と`commit`を使いたいときは、`{root: true}`オプションを指定する。

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      someAction ({ state, getters, rootState, rootGetters, dispatch, commit }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### Namespaced モジュール内でグローバルな Action を登録する。

Namespaced 内で Prefix なしのアクションを登録する方法。混乱を招くだけの機能のような気がする。

```js
modules: {
  foo: {
    namespaced: true,

    actions: {
      someAction: {
        root: true,
        handler (namespacedContext, payload) { ... } // -> 'someAction'
      }
    }
  }
}
```

#### Namespaced モジュールをコンポーネントにマップする

- `mapState`、`mapActions`の第一引数にモジュール Prefix を与えることで、簡潔に記載できる。
- 又は`createNamespacedHelpers`を使うことでも同じことが可能。

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ]),
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}

// もしくは

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // look up in `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // look up in `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

### Dynamic Module Registration

store を作成した後に、動的にモジュールを追加・削除できる。
`vuex-router-sync`など、サードパーティライブラリを使う際に必要となる構文。

```js
// 登録
store.registerModule('myModule', {});
store.registerModule(['nested', 'myModule'], {});

// 以前の状態を保持しておきたい場合？TODO: ちょっと意味が分からない
store.registerModule('a', module, { preserveState: true });

// 削除
store.unregisterModule('myModule');
```

### Module Reuse

モジュールを再利用したい場合は、コンポーネントを作るときと同じように、各プロパティをファンクションとして定義する。

```js
const MyReusableModule = {
  state() {
    return {
      foo: 'bar',
    };
  },
  // mutations, actions, getters...
};
```

## Application Structure

下記のルールさえ守っていれば、アプリケーションの構成に制約はない。

- アプリケーションレベルの State は Store に集約する
- state を変更する方法は mutations のみ
- 非同期処理は actions で行う

store ファイルは単一で管理してもいいし、もし大きくなりすぎたら actions や mutations を別ファイルに切り出したら良い。例えば、下記のような構成がおすすめ。

```txt
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # where we assemble modules and export the store
    ├── actions.js        # root actions
    ├── mutations.js      # root mutations
    └── modules
        ├── cart.js       # cart module
        └── products.js   # products module
```

## Plugins

### 作り方とセットアップ方法

```js
const myPlugin = store => {
  // called when the store is initialized

  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
  });
};

const store = new Vuex.Store({
  // ...
  plugins: [myPlugin],
});
```

### state のスナップショットを取るプラグイン例

```js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state);

  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state);

    // compare `prevState` and `nextState`...

    // save state for next mutation
    prevState = nextState;
  });
};

// 開発環境でのみ有効化する方法
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production' ? [myPluginWithSnapshot] : [],
});
```

## Strict Mode

Strict モードを有効にすると、state が mutation 以外で更新された時にエラーを投げるようになる。
処理が重いのでプロダクション環境では無効にすること

```js
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
});
```

Strict モードでは、v-model に vuex の state をセットするとエラーになる（直接、値を変更しているから）。これを避けるには下記のような工夫が必要。

```html
<input v-model="message">
```

```js
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

## Testing

[公式に書いてある方法](https://vuex.vuejs.org/guide/testing.html)よりも、Jest を使ったほうがはるかに簡単にできそう。
