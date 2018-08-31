# Firebase

[[toc]]

## Functions

### cors を有効にする

```js
const cors = require('cors')(); // invokeを忘れずに

exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // do something
  });
});
```
