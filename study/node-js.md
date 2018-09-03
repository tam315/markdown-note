# Node.js

[[toc]]

## File System (fs)

### readFile

- [ドキュメント](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)
- データをファイルから読み込む。

```js
fs.readFile('some.txt', 'utf-8', callback);
```

### writeFile

- [ドキュメント](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
- データをファイルに書き込む。

```js
fs.writeFile('/tmp/uploaded-image.jpg', request.body.image, 'base64', callback);
```

### createWriteStream

- [ドキュメント](https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options)
- 書込可能なストリームを用意する。

```js
const writeStream = fs.createWriteStream('some.txt', 'utf-8');
writeStream.write('some data');
```

### existsSync

ファイルの存在を確かめる

```js
fs.existsSync('some.txt');
```

### unlinkSync

ファイルを削除する

```js
fs.unlinkSync('some.txt');
```

## Child Process (child_process)

### spawn

- [ドキュメント](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
- 子プロセスをストリームとして扱う
- デフォルトでは shell を使わない

```js
const process = spawn('ls', ['-la']);

// 標準出力のハンドリング
process.stdout.on('data', data => {});

// 標準エラーのハンドリング
process.stderr.on('data', data => {});

// 終了のハンドリング
// codeが0でなければエラーが発生したことを意味する
process.on('close', code => {});
```
