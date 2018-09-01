# RxJS

[[toc]]

[参考](https://chrisnoring.gitbooks.io/rxjs-5-ultimate/)

## create observable

```js
// create
const stream$ = Observable.create(observer => {
  observer.next(1);
  observer.error('error message');
  observer.complete();

  return function() {
    someCleanUp();
  };
});

// producer
class Producer {
  i = 0;
  nextValue() {
    return this.i++;
  }
}

// range
let stream$ = range(1, 3);

// from
let stream$ = from(/* Array, Promise */);

// of
let stream$ = of(1, 2, 3, 4);
```

## observe

```js
// subscribe
const subscription = stream$.subscribe(onSuccess, onError, onComplete);

// unsubscribe
subscription.unsubscribe();

// cold observable => 1,2,3,1,2,3
let stream$ = of(1, 2, 3);
stream$.subscribe(data => console.log(data));
stream$.subscribe(data => console.log(data));

// hot observable => 0,1,2,2,3,3,4,4
let stream$ = interval(1000).pipe(
  take(5),
  publish(), // important
);
stream$.subscribe(
  data => console.log(`subscriber from first minute: ${data}`),
  err => console.log(err),
  () => console.log('completed'),
);
setTimeout(() => {
  stream$.subscribe(
    data => console.log(`subscriber from 2nd minute: ${data}`),
    err => console.log(err),
    () => console.log('completed'),
  );
}, 2100);
stream$.connect(); // important

// warm observable => 0,1,2,3,3,4,4
// (wait until a subscriber comes at least 1)
let stream$ = interval(1000).pipe(
  take(5),
  publish(),
  refCount(), // important
);
setTimeout(() => {
  stream$.subscribe(data => console.log(data));
}, 2000);
setTimeout(() => {
  stream$.subscribe(data => console.log(data));
}, 5100);
```

## Operators

```js
// of
const stream$ = of(1, 2, 3, 4, 5);

// tap
tap(value => console.log(value));

// filter
filter(value => value % 2 == 0);

// creating observable in observable
const stream$ = of(1, 2, 3).pipe(
  // we need to make it 'flat' because 'map' returns array of observable
  flatMap(val =>
    of(val)
      .pipe(ajax({ url: url + val }))
      .pipe(map(e => e.response)),
  ),
);

// fetch
from(fetch('https://jsonplaceholder.typicode.com/posts/1/'))
  .pipe(flatMap(res => from(res.json())))
  .subscribe(console.log);

// to promise
const promise = of(1, 2, 3).toPromise();
```

## combination

```js
// return the array of the latest values  (1,2,3) (1,2) => [3,2]
let stream$ = combineLatest(source1, source2);

// run each source sequentially  (1,2,3) (1,2) => (1,2,3,1,2)
let stream$ = concat(source1, source2);

// merge: run each source at a time  (1,2,3) (1,2) => (1,1,2,2,3)
let stream$ = merge(source1, source2);

// zip: joins values on column basis.  (1,2,3) (1,2) => ([1,1], [2,2])
let stream$ = zip(source1, source2);
```

## math

```js
max();
min();
sum();
```

## time

```js
// reating observer
interval(100); // each 100ms
timer(1000); // after 1sec
timer(5000, 1000); // wait 5sec, then each 1sec

// operator
delay(100); // delay 1sec
debounceTime(500); // wait 0.5s and pass to next. timer and values is throw away if new event comes.
```

## grouping

```js
// buffer (0,1,2,3,4,5,6,7,8,9) => ([0,1,2,3,4],[5,6,7,8,9])
let breakWhen$ = interval(500);
let stream$ = interval(100).pipe(buffer(breakWhen$));
stream$.subscribe(data => console.log('values', data));

// buffertime
bufferTime(500);
// is equal to...
buffer(interval(500));
```

## error handling

```js
// retry
// retry all th stream from the beginning
// (1, 2) => (1,1,1,1,1,1,2(error))
let stream$ = of(1, 2).pipe(
  map(value => {
    if (value > 1) throw 'error';
    return value;
  }),
  retry(5),
);

// retryWhen
retryWhen(stream => stream.delay(200));

// catchError(エラーを正常系に変換して流す)
let error$ = throwError('crash').pipe(catchError(err => of('patched', err)));
error$.subscribe(
  data => console.log(data),
  err => console.error(err),
  () => console.log('complete'),
);
// ('patched', 'crash', 'complete')　すべて正常系
```
