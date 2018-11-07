# Algorithms

[[toc]]

## Sort

### External Sorting

[https://en.wikipedia.org/wiki/External_sorting](https://en.wikipedia.org/wiki/External_sorting)

メモリに入り切らない大きなデータの並び替える方法。2 つのフェーズがある。

1. Sort Phase 　ファイルを分割して読み込み、クイックソートなどを使ってインメモリで並び替え、一時ファイルに書き出す
2. Marge Phase 　一時ファイル群を、[マージソート（の結合パート）](https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/searching-and-sorting-algorithm-exercise-2.php)や k-way merge などを使って一つのファイルに統合する

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

function partition(array, left, right) {
  // 特にこだわりがなければ、最後の要素をpivotにする
  let pivot = array[right];

  // クイックソートでは、pivotよりも小さい値を左側から詰めていく。
  // そのための、詰めるべきポジションを保持しておく変数。
  let leftWall = left;

  for (i = left; i < right; i++) {
    if (array[i] <= pivot) {
      // pivotより小さい数字を見つけたら左から詰めていく
      swap(array, i, leftWall);

      // 数字を詰めたら、詰めるべきポジションを一つずらしておく
      leftWall += 1;
    }
  }

  // 最後に、pivotとleftWallを入れ替えれば一巡が完了する
  // この時点で、pivotは正しい位置にいる（左側は小さく、右側は大きい）
  swap(array, leftWall, right);

  // ピボットの位置を返す
  return leftWall;
}

function quicksort(array, low = 0, high = array.length) {
  // Base Case これ以上計算の必要がない場合は終了
  if (low >= high) return;

  pivotLocation = partition(array, low, high);

  // 再帰処理
  quicksort(array, low, pivotLocation - 1);
  quicksort(array, pivotLocation + 1, high);
}

quicksort([3, 6, 2, 4, 1, 5]); // => [1,2,3,4,5,6]
```
