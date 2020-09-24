# Google Apps Script

## Introduction

### 用語

- SpreadSheetApp --- Google Spreadsheet アプリ
- SpreadSheet --- 個々のファイル
- Sheet --- タブ、ワークシート
- Range --- 選択範囲

アクティブとは

- active sheet --- 表示中のシート
- active range --- 表示中のシートの中で、ハイライトされている箇所
- active cell --- 表示中のシートの中で、フォーカスされている単一のセル

### カスタムファンクション

```js
/**
 * ドルを日本円に変換する
 *
 * @param {number} dollars ドル
 * @return {number} 日本円
 * @customfunction
 */
function USDTOJPY(dollars) {
  const rate = 0.99;
  const swissFrancs = dollars * rate;
  return 'JPY' + swissFrancs;
}
```

以上をスクリプトとして記述した後、セルに`=USDTOJPY(123)`とするだけで使える。

### SpreadSheet と Sheet で共用されているメソッドの動作の違い

```js
// アクティブなシートにおいて、列を削除する
Spreadsheet.deleteColumn();
// これは下記と等価
Spreadsheet.getActiveSheet().deleteColumn();

// 特定のシートにおいて、列を削除する
Sheet.deleteColumn();
```

### 基本操作

SpreadSheet

```js
// 取得
const mySS = SpreadsheetApp.getActiveSpreadsheet();
// リネーム
mySS.rename('2017 Avocado Prices in Portland, Seattle');
```

Sheet

```js
// 取得
var mySS = SpreadsheetApp.getActiveSpreadsheet();
// 複製
var duplicateSheet = mySS.duplicateActiveSheet();
// リネーム
duplicateSheet.setName('MySheet');
// リサイズ
duplicateSheet.autoResizeColumns(1, 5);
// 固定行の設定
duplicateSheet.setFrozenRows(2);
// id取得
duplicateSheet.getSheetId();
```

Range

```js
// F2より下にあるすべての値を、C2の位置に移動する
const myRange = duplicateSheet.getRange("F2:F");
myRange.moveTo(duplicateSheet.getRange('C2'));

// 指定した範囲の値について、3番目の列の値で並べ替える
const myRange2 = duplicateSheet.getRange('A3:D55')
myRange2.sort(3)
}

// 範囲をずらしたり広げたりする
var titleAuthorRange = activeRange.offset(
  0, // 行方向のオフセット
  0, // 列方向のオフセット
  activeRange.getHeight(), // 高さ
  activeRange.getWidth(), // 幅
);
```

### メニューを作る

`onOpen()`という特殊な関数を使う。

```js
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('メニュー名')
    .addItem('メニュー項目名', 'functionNameYouWantToExec')
    .addSeparator()
    .addItem('...', '...')
    .addSeparator()
    .addToUi();
}
```

### 他のスプレッドシートからデータを持ってくる

```js
// コピー
var sourceSS = SpreadsheetApp.openById(
  '1c0GvbVUDeBmhTpq_A3vJh2xsebtLuwGwpBYqcOBqGvo',
);
var sourceSheet = sourceSS.getSheetByName('target-sheet-name');
var sourceRange = sourceSheet.getDataRange();
var sourceValues = sourceRange.getValues();

// ペースト
var destSheet = SpreadsheetApp.getActiveSheet();
destSheet
  .getRange(1, 1, sourceRange.getHeight(), sourceRange.getWidth())
  .setValues(sourceValues);
```

### 範囲内の値に一括処理をする

```js
const range = SpreadsheetApp.getActiveRange();

// 2次元配列として値を取得
const values = range.getValues();

const updatedValues = values.map((row) => {
  const [col1, col2, ...rest] = row;
  return [col1, 'updated col2', ...rest];
});
range.setValues(updatedValues);
```

### API からのデータ取得

`UrlFetchApp`を使う

```js
function fetchBookInfo(ISBN) {
  const url =
    'https://openlibrary.org/api/books?bibkeys=ISBN:' +
    ISBN +
    '&jscmd=details&format=json';
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const json = response.getContentText();
  const bookInfos = JSON.parse(json);
  const bookInfo = bookInfos['ISBN:' + ISBN];

  return bookInfo;
}
```
