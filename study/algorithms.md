# Algorithms

[[toc]]

## Sort

### Quick Sort

[https://www.youtube.com/watch?v=Hoixgm4-P4M](https://www.youtube.com/watch?v=Hoixgm4-P4M)

ランダムなデータの並び替えに使われる、インメモリでのソート方法。

- pivot は、各ループが回り終わったあとに、ソート完了後の正しい位置にいる
- pivot の左側は pivot より小さく、右側は大きい

JavaScriptは末尾再帰最適化に対応していない。このため、再帰処理を使うとstack overflowになりがち。下記のようにwhileで実装するのが安心。

```js
function quicksort(array) {
  // タスクを積んでいくスタック
  // [{minPos, maxPos}, .....]
  let task = [];

  task.push({ minPos: 0, maxPos: array.length - 1 });

  while (task.length) {
    const { minPos, maxPos } = task.pop();

    // Base Case　これ以上の処理が必要ない場合は終了する
    if (minPos >= maxPos) continue;

    // 最後の要素をpivotにする
    let pivot = array[maxPos];

    // クイックソートでは、pivotよりも小さい値を左側から詰めていく。
    // そのために、詰めるポジションを保持しておく変数。
    let leftWall = minPos;

    for (i = minPos; i < maxPos; i++) {
      if (array[i] <= pivot) {
        // pivotより小さい数字を見つけたら左から詰めていく
        swap(array, leftWall, i);

        // 数字を詰めたら、次回に詰めるポジションを一つずらしておく
        leftWall += 1;
      }
    }

    // 最後に、pivotとleftWallを入れ替えれば一巡が完了する
    // この時点で、このpivotは正しい位置にいる（左側は小さく、右側は大きい）
    swap(array, leftWall, maxPos);

    // leftWall = pivotのポジション
    task.push({ minPos, maxPos: leftWall - 1 });
    task.push({ minPos: leftWall + 1, maxPos });
  }
}

quicksort([3, 6, 2, 4, 1, 5]); // => [1,2,3,4,5,6]
```

### Minimum Heap Tree

[https://www.youtube.com/watch?v=NCuaebwQLKU](https://www.youtube.com/watch?v=NCuaebwQLKU)

親が子より必ず小さくなるツリー。

- 要素の追加時
  - 最後に追加する。親が自分より大きい場合は、再帰的に入れ替える。
- シフト時（一番小さい値を取得して取り除いた時）
  - 最後の要素をトップに移動する。子が自分より小さい場合は再帰的に入れ替える。

### External Merge Sort

[https://en.wikipedia.org/wiki/External_sorting#External_merge_sort](https://en.wikipedia.org/wiki/External_sorting#External_merge_sort)

メモリに入り切らない大きなデータを並び替える方法。2 つのフェーズがある。

1. Sort Phase
   - ファイルをいくつかに分割する
   - 分割したファイルごとに、クイックソートなどを使ってインメモリで並び替える
2. Marge Phase
   ソート済みの分割ファイル群を [k-way merge](https://www.youtube.com/watch?v=wTAVwbvjiac) (マージソート、Minimun Heapなどの組み合わせ)を使って一つのファイルに統合する
