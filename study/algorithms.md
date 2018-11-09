# Algorithms

[[toc]]

## Sort

### Quick Sort

[https://www.youtube.com/watch?v=Hoixgm4-P4M](https://www.youtube.com/watch?v=Hoixgm4-P4M)

ランダムなデータの並び替えに使われる、インメモリでのソート方法。

- pivot は、各ループが回り終わったあとに、ソート完了後の正しい位置にいる
- pivot の左側は pivot より小さく、右側は大きい

```js
const swap = (array, posA, posB) => {
  const temp = array[posA];
  array[posA] = array[posB];
  array[posB] = temp;
};

/**
 * 与えられた配列を昇順に並べ替える
 *
 * @param {array} array ソートしたい配列
 * @param {number} low 再帰処理時に使用する。手動での指定は不要。
 * @param {number} high 再帰処理時に使用する。手動での指定は不要。
 */
function quicksort(array, minPos = 0, maxPos = array.length - 1) {
  // Base Case　これ以上の処理が必要ない場合は終了する
  if (minPos >= maxPos) return;

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
  quicksort(array, minPos, leftWall - 1);
  quicksort(array, leftWall + 1, maxPos);
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

### External Sorting

[https://en.wikipedia.org/wiki/External_sorting](https://en.wikipedia.org/wiki/External_sorting)

メモリに入り切らない大きなデータを並び替える方法。2 つのフェーズがある。

1. Sort Phase
   - ファイルをいくつかに分割する
   - 分割したファイルごとに、クイックソートなどを使ってインメモリで並び替える
2. Marge Phase
   ソート済みの分割ファイル群を [k-way merge](https://www.youtube.com/watch?v=wTAVwbvjiac) (マージソート、Minimun Heapなどの組み合わせ)を使って一つのファイルに統合する
