# Django

[[toc]]

## インストール

python の仮想環境を作成

```bash
python -m venv .venv
```

`requirements.txt`の作成とインストール

```txt
Django~=2.1.5
```

```bash
pip install -r requirements.txt
```

Django の初期ファイル群を作成

```bash
django-admin.exe startproject mysite .
```

`mysite/settings.py`の内容を必要に応じて修正する

```py
# DEBUG=Trueかつ以下が空の場合、自動的にlocalhost等が設定される
ALLOWED_HOSTS = []

LANGUAGE_CODE = 'ja'
TIME_ZONE = 'Asia/Tokyo'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
```

マイグレーションを実行(デフォルトでは sqlite3 がすぐに使えるよう設定されている)

```bash
python manage.py migrate
```

サーバを起動

```bash
python manage.py runserver
```

## モデル

`blog`という名前のアプリケーションを作成

```bash
python manage.py startapp blog
```

`mysite/settings.py`にアプリケーションを追加しておく

```py
INSTALLED_APPS = [
    # ....other apps
    'blog',
]
```

`blog/models.py`にモデルを定義する（[フィールドタイプの一覧](https://docs.djangoproject.com/ja/2.0/ref/models/fields/#field-types)）

```py
from django.db import models
from django.utils import timezone


class Post(models.Model):
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title

    # 計算で算出したいプロパティは下記のように定義する
    @property
    def author_name_and_title(self):
      return self.author.name + self.title
```

マイグレーションを行う

```bash
# モデルの変更を検出し、マイグレーションファイルを作成
python manage.py makemigrations blog

# マイグレーションファイルをDBに適用
python manage.py migrate blog
```

Django admin で Post を管理できるよう、`blog/admin.py`に Post を追加する。

```py
from .models import Post
admin.site.register(Post)
```

管理者を作成する

```bash
python manage.py createsuperuser
```

`http://localhost:8000/admin`で管理画面にログインすると、ブラウザ上から DB を編集できる。

## ルーティング

`urls.py`は、ルーティングの設定ファイルである。ルートと、それに対応する処理（一般的には view）を設定する。

`mysite/urls.py`で、`/blog`に来たリクエストを`blog/urls.py`に委任する

```py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls'))
]
```

`blog/urls.py`では、全ての処理を`view.post_list`に任せる。

```py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
]
```

※ `name`とは？

- ビューを識別するために使われる URL の名前
- ビューと同じ名前にすることもできるし、別の名前にすることもできる
- ユニークで覚えやすいものにしておくこと

## ビュー

ややこしいが、

- Django の View は、MVC でいうところの Controller を指している。
- Django の template が、MVC でいうところの View を指している。

```py
# blog/views.py
from django.shortcuts import render

def post_list(request):
    return render(request, 'blog/post_list.html', {})
```

テンプレートは、`アプリケーションフォルダ/templates/アプリケーション名`の中に配置すること。
アプリケーション名が重複しているのは、あとでより複雑な構成にする時に楽にするためらしい。

`request`でリクエスト情報を取得できる。

`blog/templates/blog/post_list.html`

```html
<div>hello world</div>
```

## Django shell

Django shell の起動 (python shell に見えるが、Django も動いてるよ)

```bash
python manage.py shell
```

shell では、Model を使って様々な操作を行える。

## Django ORM の基本

### 基本操作

#### 一覧の取得

`model.objects.all()`

一覧（クエリセット）を取得できる。クエリセット＝モデルのインスタンスのリストのこと。

```py
from blog.models import Post
Post.objects.all()
# <QuerySet [<Post: Hello1>, <Post: Hello2>]> => これがクエリセット
```

#### 条件を指定して 1 件取得

`model.objects.get()`

```py
# django標準のユーザ管理機能から、Userモデルを呼び出す
from django.contrib.auth.models import User

me = User.objects.get(username='ola') # => 単品のオブジェクトが返る
```

条件にあうインスタンス（オブジェクト）が見つからなかったときは、`ObjectDoesNotExist`を raise する。これは不都合なことが多いので、`get_object_or_404` 関数と組み合わせて使うことも多い。

```py
from django.shortcuts import get_object_or_404
get_object_or_404(Person, id=20)
```

#### DB から情報を再取得

`model_instance.refresh_from_db()`

#### 作成

2 種類のインスタンス作成方法がある。

```py
# こちらは`save()`は不要
MODEL_NAME.objects.create(kwargs)

# こちらは`save()`が必要
obj = MODEL_NAME(kwargs)
obj.save()
```

#### 条件を指定して複数件取得

`model.objects.filter()`

```py
Post.objects.filter(author=me) # => クエリセットが返る
```

「含む」などの条件を指定したい場合は、`フィールド名__contains`等の形式で指定する。

```py
Post.objects.filter(title__contains='sample')
Post.objects.filter(published_date__lte=timezone.now())
```

#### 並べ替え

`model.objects.order_by()`

```py
Post.objects.order_by('created_date')
Post.objects.order_by('-created_date')
```

#### チェーン

```py
Post.objects.\
  filter(title__contains='sample').\
  order_by('created_date').\
  all()
```

### クエリの確認

`queryset.query` で発行されるクエリを確認できる!

## 参照・逆参照先のデータの取得

後続の処理で何度もアクセスされるオブジェクトを先に取得しておきたいときには、`select_related`や`prefetch_related`を使う。

[参考](https://akiyoko.hatenablog.jp/entry/2016/08/03/080941)

### select_related

one 側のオブジェクト（Foreign Key など）を見に行くときにつかう。
INNER JOIN または LEFT OUTER JOIN されるのでクエリの回数を減らせる。

```py
# many->one
BlogPost.objects.filter(pk=1).select_related('user')
```

### prefetch_related

many 側のオブジェクト群を取得することができる（one 側のオブジェクト取得にも使えるが、あまり利用しない）。複数回のクエリを発行して Python 側で結合するので、select_related よりはクエリ回数は増える。

```py
# one->many (reverse relationship)
User.objects.filter(pk=1).prefetch_related('blogposts')

# many->many
BlogPost.objects.filter(pk=1).prefetch_related('categories')
```

### 内部結合

`filter`は内部結合(INNER JOIN)で動作する。

下記の例では、Blog(many)から Author(one)へ参照が設定されているものとする。Author から Blog を逆参照している。

```py
# 少なくとも 1 つ以上の`hello`というタイトルのブログを持っている作者らの情報をクエリする
Author.objects\
  .filter(blog__title='hello') \
  .all()
```

### 外部結合

many 側のデータ「を」フィルタしたいときは、`prefetch_related`と`django.db.models.Prefetch`を組み合わせる。外部結合と同じような動作になる。

1. 全てのユーザを取得
2. 各ユーザに紐づく、タイトルが'hello'であるブログを取得（1 とは独立したクエリが発行され、Python 側でマージされる）

```py
Author.objects \
  .prefetch_related(
    Prefetch(
      "blog",
      queryset=Blogposts.objects.filter(title='hello')
    )
  )
```

### filter と Prefetch の違い

`filter`は many 側のデータ「で」フィルタしているだけなので、後段の`prefetch_related`には何ら影響を与えない点に注意する。

1. 少なくとも 1 つ以上の`hello`というタイトルのブログを持っている作者らの情報をクエリする（INNER JOIN による）
2. その作者らの子となる**全ての`blog`をクエリ**する（上記とは独立したクエリが発行され、Python 側でマージされる）

```py
Author.objects\
  .filter(blog__title='hello') \
  .prefetch_related('blog') \
  .all()
```

結論：many 側のデータ「で」フィルタしたいときは`filter`を、many 側のデータ「を」フィルタしたいときは`Prefetch`を使う。

## Aggregation, Annottion, Groupby

- `aggregate()` レコードセット全体に対して集計を行い、単一のデータとして返す。
- `annotate()` レコードセットの各レコード単位で集計等を行い、複数のデータとして返す。`values()`を組み合わせることで、Group By したうえで集計を行うこともできる。
- [参考](http://note.crohaco.net/2014/django-aggregate/)
- [条件つきで集計](https://docs.djangoproject.com/en/2.2/topics/db/aggregation/)

## Query Expressions

[https://docs.djangoproject.com/en/2.2/ref/models/expressions/](https://docs.djangoproject.com/en/2.2/ref/models/expressions/)

### `F()` expression

- 列の値を使った様々な計算ができる。
- `filter`や`annotate`の中で使える。インスタンスの値を更新するときにも使える。
- Race Condition 時に値を失うことがない

```py
from django.db.models import Count, F, Value
from django.db.models.functions import Length, Upper

# 椅子の数よりも従業員数が多い会社
Company.objects.filter(num_employees__gt=F('num_chairs'))

# 椅子の数よりも従業員数が2倍以上多い会社
Company.objects.filter(num_employees__gt=F('num_chairs') * 2)
Company.objects.filter(num_employees__gt=F('num_chairs') + F('num_chairs'))

# 全ての従業員が座るには椅子がいくつ必要なのかを、それぞれの会社ごとに算出
company = Company.objects \
  .filter(num_employees__gt=F('num_chairs'))
  .annotate(chairs_needed=F('num_employees') - F('num_chairs'))

# 個別更新
# - Bad メモリ効率が悪く、Race Condition時にデータを失う
some_instance.some_field += 1
# - Good　メモリ効率がよく、Race Condition時にもデータを失わない
some_instance.some_field = F('stories_filed') + 1

# 一括更新
some_instance.update(some_field=F('stories_filed') + 1)
```

#### 注意事項

重複して更新されるため、`F()`を使った更新を設定したあとに`save()`を 2 回以上呼んではダメ。
2 回以上保存したい場合は、間で必ず`refresh_from_db()`すること。

```py
some_instance.some_field = F('stories_filed') + 1
some_instance.save() # +1される
some_instance.save() # もう一度+1される
```

#### 型が異なるフィールドの計算

異なるタイプの列を使って計算する場合は、`ExpressionWrapper`で明示的に出力フィールドの型を設定する必要がある。

```py
from django.db.models import DateTimeField, ExpressionWrapper, F

Ticket.objects.annotate(
    expires=ExpressionWrapper(
        F('active_at') + F('duration'), output_field=DateTimeField()))
```

### `Func()` expressions

データベースに備わっている`LOWER`などの関数や、`SUM`などの集計関数を利用するときに使う。

```py
from django.db.models import F, Func

queryset.annotate(field_lower=Func(F('field'), function='LOWER'))
# => `SELECT LOWER("db_table"."field") as "field_lower"`
```

### `Aggregate()` expressions

- `Sum()`や`Count()`など、[`Aggregate()`](https://docs.djangoproject.com/en/2.2/ref/models/expressions/#django.db.models.Aggregate)を継承している関数のこと（`モデル.objects.aggregate()`とは異なるものなので注意）
- `Func()`の特殊バージョンであり、`GROUP BY`句が必要であることをクエリに知らせるという特徴がある？
  - `aggregate()`内で使う場合は、集計対象としてクエリセットのトップレベルのフィールドを指定する。
  - `annotate()`内で使う場合は、集計対象としてクエリセットの外部テーブル自体や外部テーブルのフィールドを指定する。たぶん。

```py
from django.db.models import Avg, Count Sum

# aggregate()で使う
Company.objects.aggregate(total_company_count=Count('id'))

# annotate()で使う　下記はどちらも同じ。
Company.objects.annotate(num_products=Count('products'))
Company.objects.annotate(num_products=Count(F('products')))

# aggregate expressionは複雑な計算を含むことができるdock
Company.objects.annotate(num_offerings=Count(F('products') + F('services')))
```

### `Value()` expression

単純に「値」を表す。

```py
# Create a new company using expressions.
company = Company.objects.create(name='Google', ticker=Upper(Value('goog')))
# Be sure to refresh it if you need to access the field.
company.refresh_from_db()
company.ticker
# => 'GOOG'
```

### `Subquery()` expressions

- `Subquery`と`OuterRef`を組み合わせることで、サブクエリ側から親クエリの値を参照できる。
- 結果を単一列に絞り込むには`values`を使う
- 結果を単一行に絞り込むにはスライス表記を使う

```py
from django.db.models import OuterRef, Subquery

newest = Comment.objects \
  .filter(post=OuterRef('pk')) \
  .order_by('-created_at') \
  .values('email')[:1]
Post.objects.annotate(newest_commenter_email=Subquery(newest))
```

#### Exists()

- `Subquery()`の亜種。存在を確かめるだけなら、こちらを使ったほうが効率が良い。
- `values`を使って単一列に絞り込む必要はない
- `~Exists()`とすれば NOT にできる

```py
recent_comments = Comment.objects.filter(
  post=OuterRef('pk'),
  created_at__gte=one_day_ago)
Post.objects.annotate(recent_comment=Exists(recent_comments))
```

#### サブクエリの結果でフィルタする

サブクエリの結果でフィルタしたい場合は、`annotate`の後段で行う。

```py
Post.objects.annotate(
    recent_comment=Exists(recent_comments),
).filter(recent_comment=True)
```

### Raw SQL expressions

- クエリセットに生クエリをトッピングしたい時に使う。
- なるべく使わない
- SQL インジェクションに注意する

```py
from django.db.models.expressions import RawSQL
queryset.annotate(
  val=RawSQL("SELECT col FROM sometable WHERE othercol = %s",
  (someparam,)))
```

## 動的データを表示する

view.py において、Model と Template をバインドする。

`blog/views.py`

```py
from django.shortcuts import render
from django.utils import timezone
from .models import Post

def post_list(request):
    posts = Post.objects.\
        filter(published_date__lte=timezone.now()).\
        order_by('published_date')
    return render(request, 'blog/post_list.html', {'posts': posts})
```

`blog/templates/blog/post_list.html`

```html
{% for post in posts %}
<div>
  {% if post.published_date %}
  <div class="date">{{ post.published_date }}</div>
  {% endif %}

  <h1>{{ post.title }}</h1>
  <p>{{ post.text | linebreaksbr }}</p>
</div>
{% endfor %}
```

- `{% %}`はテンプレートタグといい、構文を使うことができる
- `{ { some_key } }`で、view から渡された値を参照できる
- `linebreaksbr`は改行を段落に変換するフィルタ

## static files

`blog/static/***.css`など、アプリケーション内の`static`フォルダに置いた全てのファイルが、`/static`以下にサーブされる。

テンプレートから呼び出す場合は以下のようにする。アプリ内の`static`フォルダからの相対パスになるので注意する。

```html
{% load static %}

<link rel="stylesheet" href="{% static 'blog.css' %}" />
```

## テンプレート拡張

他のテンプレートを親として読み込むことができる

親側テンプレート(`base.html`)

```xml
<head><link rel="stylesheet" href="{% static 'blog.css' %}"></head>

<h1><a href="/">Django Girls Blog</a></h1>

{% block content %}
{% endblock %}
```

子側テンプレート（`post_list.html`）

```xml
{% extends 'blog/base.html' %}

{% block content %}
  {% for post in posts %}
    <div>
      <p>{{ post.published_date }}</p>
      <h1>{{ post.title }}</h1>
      <p>{{ post.text | linebreaksbr }}</p>
    </div>
  {% endfor %}
{% endblock %}
```

## url params の利用

`blog/urls.py`

```py
urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('<int:pk>/', views.post_detail, name='post_detail'), # 追加
]
```

`blog/views.py`

```py
def post_detail(request, pk): # ここにparamsがインジェクトされる
    post = Post.objects.get(pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
```

### リンクの動的な作成

```html
<a href="{% url 'post_detail' pk=post.pk %}"></a>
```

- `post_detail`は urlpatterns の name で指定する。これにより、実際のパスマッピングが変更されたとしても、テンプレートを修正しなくてよくなる。
- `pk=**`の部分は、本来は url param として渡るものの代わりに、値を明示的に指定している

### エラーではなく 404

オブジェクトが見つからなかった場合に、エラーページではなく 404 ページを表示する方法。

```py
# 見つからなかった場合に、エラーページが表示される
Post.objects.get(pk=pk)

# 見つからなかった場合に、404ページが表示される
from django.shortcuts import get_object_or_404
get_object_or_404(Post, pk=pk)
```

## Forms

### ModelForm の作成

モデルを基にしてフォームを作成するための仕組み＝ ModelForm

`blog/forms.py`

```py
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        # どのモデルを使うか
        model = Post
        # どの項目をフォームとして表示するか
        fields = ('title', 'text')
```

### ルーティング

`blog/urls.py`

```py
urlpatterns = [
    path('<int:pk>/', views.post_detail, name='post_detail'), # データを閲覧
    path('<int:pk>/edit', views.post_edit, name='post_edit'), # 既存のデータを編集
    path('new/', views.post_new, name='post_new'), # 新規にデータを追加
]
```

`blog/views.py`

```py
from django.shortcuts import redirect

from .forms import PostForm

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})

def post_new(request):
    # フォームデータを受け取った時
    if request.method == "POST":
        # POSTされたデータをオブジェクトに変換
        form = PostForm(request.POST)

        if form.is_valid():
            # ユーザを追加したいのでコミットはまだしない
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()

        # 成功したら個別ページにリダイレクトする
        return redirect('post_detail', pk=post.pk)

    # 単にGETで表示された時
    else:
        form = PostForm()
        return render(request, 'blog/post_edit.html', {'form': form})

def post_edit(request, pk):
    # 編集対象のデータを取得しておく
    post = Post.objects.get(pk=pk)

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        # ...ここの処理はpost_newと同じ...
    else:
        form = PostForm(instance=post)
        # ...以降の処理はpost_newと同じ...
```

### フォームの表示

`blog/templates/blog/post_edit.html`

view から受け取った`form`を使ってフォームを表示する

```xml
<h1>New post</h1>
  <form method="POST">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Save</button>
</form>
```

### ハイパーリンクの作成

```xml
<!-- 新規投稿 -->
<a href="{% url 'post_new' %}">add new post</a>

<!-- 編集 -->
<a href="{% url 'post_edit' pk=*** %}">edit post</a>
```
