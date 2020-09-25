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

### 基本

#### SpreadSheet

```js
// 取得
const spreadsheet =
  SpreadsheetApp.getActiveSpreadsheet() || spreadsheet.getSheetByName('name');
// リネーム
spreadsheet.rename('2017 Avocado Prices in Portland, Seattle');
// シートの追加
spreadsheet.insertSheet(name);
```

#### Sheet

```js
// 取得
const sheet = SpreadsheetApp.getActiveSpreadsheet();
// 複製
sheet.duplicateActiveSheet();
// リネーム
sheet.setName('MySheet');
// リサイズ
sheet.autoResizeColumns(1, 5);
// 固定行の設定
sheet.setFrozenRows(2);
// id取得
sheet.getSheetId();
// 最終行を取得
sheet.getLastRow();
// アクティブにする
sheet.activate();
```

#### Range

```js
// F2より下にあるすべての値を、C2の位置に移動する
const range = sheet.getRange('F2:F');
range.moveTo(sheet.getRange('C2'));

// 指定した範囲の値について、3番目の列の値で並べ替える
const range = sheet.getRange('A3:D55');
range.sort(3);

// 範囲をずらしたり広げたりする
range.offset(
  0, // 行方向のオフセット
  0, // 列方向のオフセット
  range.getHeight(), // 高さ
  range.getWidth(), // 幅
);

// 列数、行数を取得する
range.getNumRows();
range.getNumColumns();

// - バンディング（配色の組み合わせ）を設定する
// - 例えば行ごとに交互に色をつけるなど
// - すでにバンディングがあるとエラーになるので、チェックしてから設定する
if (!range.getBandings()[0]) {
  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
}

// スタイル
range
  .setFontWeight('bold')
  .setFontStyle('italic')
  .setFontColor('#ffffff')
  .setBackgroundColor('#007272')
  .setNumberFormat('mmmm dd, yyyy (dddd)')
  .setBorder(
    true,
    true,
    true,
    true,
    null,
    null,
    null,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM,
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

### Utils

#### 列名を元に列番号を取得する

```js
function columnIndexOf(findingColumnName) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var columnHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var [columnNames] = columnHeaders.getValues();
  const index =
    columnNames.findIndex((columnName) => columnName === findingColumnName) + 1;
  return index;
}
```

### SpreadSheet と Sheet で共用されているメソッドの動作の違い

```js
// 特定のシートにおいて、3つめの列を削除する
Sheet.deleteColumn(3);

// アクティブなシートにおいて、3つめの列を削除する
Spreadsheet.deleteColumn(3);
// これは下記と等価
Spreadsheet.getActiveSheet().deleteColumn(3);
```

### モーダル

```js
const htmlOutput = HtmlService.createHtmlOutput('<p>HTMLで記述できます</p>')
    .setHeight(120)
    .setWidth(350),
SpreadsheetApp.getUi().showModalDialog(
  htmlOutput,
  'Created a presentation!',
);
```

### チャートの作成

```js
const sheet = SpreadsheetApp.getActiveSheet();
const chartDataRange = sheet.getRange('A2:F102');
const lineChartBuilder = sheet.newChart().asLineChart();
const chart = lineChartBuilder
  .addRange(chartDataRange)
  .setPosition(5, 8, 0, 0)
  .setTitle('USD Exchange rates')
  .setNumHeaders(1)
  .setLegendPosition(Charts.Position.RIGHT)
  .setOption('hAxis', {
    slantedText: true,
    slantedTextAngle: 60,
    gridlines: {
      count: 12,
    },
  })
  .build();

sheet.insertChart(chart);
```

### チャートをスライドに貼り付け

```js
const slides = SlidesApp.create('slide-title');
slides.getSlides()[0].remove(); // デフォルトページを削除
sheet.getCharts().forEach((chart) => {
  var newSlide = slides.appendSlide();
  newSlide.insertSheetsChart(chart);
});
```
