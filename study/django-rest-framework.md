# Django REST framework

[[toc]]

## Serialization

### Model の作成

ここでは仮に、プログラムのコードスニペットを格納する、`Snippet`というモデルがあるものと想定する。

```py
from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted((item, item) for item in get_all_styles())


class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    code = models.TextField()
    linenos = models.BooleanField(default=False),
    language = models.CharField(choices=LANGUAGE_CHOICES,
                                default='python',
                                max_length=100)
    style = models.CharField(choices=STYLE_CHOICES,
                             default='friendly',
                             max_length=100)

    class Meta:
        ordering = ('created',)
```

### Serializer の作成

- まず最初にやるのは、シリアライズを担うクラス（Serializer）の作成である
- Serializer は、インスタンスを JSON(正確には dict)に変換したり、またはその逆を行うという役割を持つ。
- インスタンスを JSON(正確には dict) に変換することを**シリアライズ**、その逆を**デシリアライズ**という。

```py
from rest_framework import serializers
from snippets.models import Snippet, LANGUAGE_CHOICES, STYLE_CHOICES


class SnippetSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=False,
                                  allow_blank=True,
                                  max_length=100)
    code = serializers.CharField(style={'base_template': 'textarea.html'})
    linenos = serializers.BooleanField(required=False)
    language = serializers.ChoiceField(choices=LANGUAGE_CHOICES,
                                       default='python')
    style = serializers.ChoiceField(choices=STYLE_CHOICES, default='friendly')

    def create(self, validated_data):
        """
        新しいSnippetインスタンスを作成して返す。
        インスタンスは、バリデーション済みのデータを基にして作成する。
        """
        return Snippet.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        既存のSnippetインスタンスを変更して返す。
        インスタンスは、バリデーション済みのデータを基にして変更する。
        """
        instance.title = validated_data.get('title', instance.title)
        instance.code = validated_data.get('code', instance.code)
        instance.linenos = validated_data.get('linenos', instance.linenos)
        instance.language = validated_data.get('language', instance.language)
        instance.style = validated_data.get('style', instance.style)
        instance.save()
        return instance
```

- クラスの最初の部分においてシリアライズ・デシリアライズの対象となるフィールドを指定する。
- `create()`,`update()`メソッドは、`serializer.save()`が呼ばれた時にどのようにインスタンスを作成・変更するかを規定する。
- Serializer は Django の`Form`クラスに似ている。
  - フィールドごとに、`required`,`max_length`,`default`などの検証用フラグを持つ
  - フィールドごとに、`style`などの特定の状況での表示を制御するフラグを持つ

### Serializer を使ってみる

Django shell を起動する。

```bash
python manage.py shell
```

#### シリアライズ

インスタンスを作成又は取得する。

```py
snippet = Snippet(code='print "hello, world"\n')
snippet.save()
# or
snippet = Snippet.objects.get(id=1)

snippet # => <Snippet: Snippet object (2)>
```

**インスタンスを基にして** Serializer を作成する。`serializer.data`で、dict に変換（=シリアライズ）されたインスタンスを取得できる。

```py
serializer = SnippetSerializer(snippet)

serializer.data
# {'id': 2, 'title': u'', 'code': u'print "hello, world"\n', 'linenos': False, 'language': u'python', 'style': u'friendly'}
```

dict を JSON に変換する。これでシリアライズは完了。

```py
content = JSONRenderer().render(serializer.data)
content
# '{"id": 2, "title": "", "code": "print \\"hello, world\\"\\n", "linenos": false, "language": "python", "style": "friendly"}'
```

#### 複数件のシリアライズ

`many=True`を引数に加える。

```py
snippets = Snippet.objects.all()
serializer = SnippetSerializer(snippets, many=True)
serializer.data
# [OrderedDict([('id', 1), ('title', u''), ('code', u'foo = "bar"\n'), ('linenos', False), ('language', 'python'), ('style', 'friendly')]), OrderedDict([('id', 2), ('title', u''), ('code', u'print "hello, world"\n'), ('linenos', False), ('language', 'python'), ('style', 'friendly')]), OrderedDict([('id', 3), ('title', u''), ('code', u'print "hello, world"'), ('linenos', False), ('language', 'python'), ('style', 'friendly')])]
```

#### デシリアライズ

JSON を dict に変換する

```py
stream = io.BytesIO(content) # content === JSON
data = JSONParser().parse(stream)
```

- 新規作成の場合は、**dict を基にして** Serializer を作成する。
- 更新の場合は、**インスタンスと dict を基にして** Serializer を作成する。

```py
# 新規にインスタンスを作成する場合
serializer = SnippetSerializer(data=data)

# 既存のインスタンスを更新する場合
snippet = Snippet.objects.get(id=1)
serializer = SnippetSerializer(snippet, data=data)
```

検証を行う。保存前に必ず検証を行う必要がある。

```py
serializer.is_valid() # True
serializer.validated_data
# OrderedDict([('title', ''), ('code', 'print "hello, world"\n'), ('linenos', False), ('language', 'python'), ('style', 'friendly')])
```

保存するとインスタンスを取得することができる。

```py
snippet = serializer.save()
snippet
# <Snippet: Snippet object>
```

#### Serializer の定義確認

Serializer の定義を確認するには、Django shell で下記のようにする。

```py
from snippets.serializers import SnippetSerializer
serializer = SnippetSerializer()
print(repr(serializer))
# SnippetSerializer():
#    id = IntegerField(label='ID', read_only=True)
#    title = CharField(allow_blank=True, max_length=100, required=False)
#    code = CharField(style={'base_template': 'textarea.html'})
#    ........
```

### ModelSerializers

- 前述の`SnippetSerializer`クラスは、多くの情報が`Snippet`モデルと重複しており、よろしくない。
- Django の`Form`に`ModelForm`が用意されているように、`Serializer`には`ModelSerializer`が用意されている。
- `ModelSrializer`は下記のことを自動的にやってくれる
  - モデル定義を基に、シリアライズに関するフィールドの情報を自動的に設定してくれる（`required`, `allow_blank`, `max_length`, `read_only`など）
  - 何も書かなくても、簡易的な`create()`や`update()`を実装してくれる

このため、[前述の Serializer](#serializer-の作成) を、下記の通り劇的にシンプルにすることができる。

```py
class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = ('id', 'title', 'code',
                  'linenos', 'language', 'style')
```

ただし、魔法のように全てを処理してくれるわけではない点に注意する。自動生成された定義が気になる場合は、[Serializer の定義確認](#serializer-の定義確認)に記載の方法で確認すること。

### view をセットアップ

ひとまず、Django の機能のみで view をセットアップしてみる方法は、以下の通り。

```py
# view.py
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

from snippets.models import Snippet
from snippets.serializers import SnippetSerializer


@csrf_exempt # postman等にはcsrfは無いので無効化
def snippet_list(request):
    """
    - snippet の一覧を取得する
    - snippet を作成する
    """
    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SnippetSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
        serializer.save()
        return JsonResponse(serializer.data, status=201)


@csrf_exempt
def snippet_detail(request, pk):
    """
    単一のスニペットの、取得・更新・削除を行う。
    """
    try:
        snippet = Snippet.objects.get(pk=pk)
    except Snippet.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SnippetSerializer(snippet)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = SnippetSerializer(snippet, data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
        serializer.save()
        return JsonResponse(serializer.data)

    elif request.method == 'DELETE':
        snippet.delete()
        return HttpResponse(status=204)
```

```py
#urls.py
urlpatterns = [
    path('snippets/', views.snippet_list),
    path('snippets/<int:pk>/', views.snippet_detail),
]
```

## API view

### Request オブジェクト

- `HttpRequest`の拡張版として、rest framework では`Request`オブジェクトが用意されている。
- 主な特徴
  - view において`request.data`を使うことで、リクエストのデータを dict として取り出せること。
  - view において`request.query_params`を使うことで、クエリストリングを dict として取り出せること。
- `request.POST`はフォームデータしか取り出せないのに対して、`request.data`はどんな形式でデータでも受け取れる。

### Response オブジェクト

`Response`オブジェクトは、ユーザに投げ返すデータを、クライアントが要求している content type に変換してくれる機能を持つ。

```py
# ユーザが求めているcontent-typeで投げ返す
return Response(data)
```

### Status code

ステータスコードは間違えやすい。`status`というモジュールの中に`status.HTTP_400_BAD_REQUEST`のように明示的な定数を用意したから、これを使え。

### API view の作り方

API view は、前述の Request, Response などの機能に加え、次のような機能を提供する view である。

- 正しくないメソッドでリクエストされた場合に、`405 Method Not Allowed`を返す
- `request.data`のパース失敗時に、`ParseError`例外を投げる

#### ラッパー

API view を作るには、ラッパーを使う。

- `@api_vew`デコレータ --- 関数ベースで作る場合に使う
- `APIView`クラス --- クラスベースで作る場合に使う

#### 実装方法

[こちらの diff](https://github.com/junkboy0315/django-rest-framework/commit/86b1b87abb5967064feb7eaa12911beca388b244?diff=unified)を参照

```py
@api_view(['GET', 'POST'])
def snippet_list(request):
    """
    - 全ての snippets を表示する。
    - 新しい snippet を作成する
    """
    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SnippetSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def snippet_detail(request, pk):
    """
    単一のスニペットの、取得・更新・削除を行う。
    """
    try:
        snippet = Snippet.objects.get(pk=pk)
    except Snippet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SnippetSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SnippetSerializer(snippet, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)

    elif request.method == 'DELETE':
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

Django のみで実装した場合と比べて、コードが簡単になっている。

この状態で既に、リクエストヘッダに`Accept:application/json`や`Accept:text/html`をつけることで、レスポンス形式を指定して受け取ることができる。
（`localhost:8000/snippets`にブラウザでアクセスできる！）

### サフィックスでデータ形式を指定できるようにする

下記のように、データ形式をサフィックスで指定して取得できるようにする方法。

- `http://example.com/api/items/4.json`
- `http://example.com/api/items/4.api`

view の引数に`format`を追加する

```py
def snippet_list(request, format=None):
#....
def snippet_detail(request, pk, format=None):
```

urlpatterns をラッパで囲む

```py
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
  # 設定....
]
urlpatterns = format_suffix_patterns(urlpatterns)
```

### Context

APIView からシリアライザに対して「コンテキスト」というものが渡されている。コンテキストはリクエスト情報などを含んでいる。

任意の情報をコンテキストとしてシリアライザに渡したいときは、APIView において下記のようにする。

```py
def get_serializer_context(self, *args, **kwargs):
    context = super().get_serializer_context(*args, **kwargs)
    context = {
        **context,
        'some_additional_key': 'some_value'
    }
    return context
```

シリアライザ側では、下記のようにコンテキストにアクセスできる

```py
def some_method(self, obj):
    value_from_context = self.context['some_additional_key']
```

### 自動で追記するフィールド

`create_date`や`update_user`など、サーバサイドで付加する情報を自動で処理する方法

#### シリアライザで対処する方法

`ModelSerializer#create()`や`#update()`を上書きする。ほとんど場合において、この方法が最適。

```py
def create(self, validated_data):
    user_id = self.context['request'].user.get('user_id')
    validated_data = {
        **validated_data,
        'create_user': user_id,
        'update_user': user_id,
    }
    return super().create(validated_data)
```

#### APIView で対処する方法

`CreateAPIView#perform_create()`や`UpdateAPIView#perform_update()`などを上書きする。作成・一覧・変更・削除の処理ごとに、処理を個別に用意したい時に最適。

```py
def perform_create(self, serializer):
    user_id = self.request.user.get('user_id')
    serializer.save(
        create_user=user_id,
        update_user=user_id,
    )
```

## Class-based views

前述の view は function-based で実装した。これを class-based な view で実装しなおすには、[こちら](https://github.com/junkboy0315/django-rest-framework/commit/0c9f2846250543dd7ce69caa52e73240809a43fb?diff=split)や[こちら](https://github.com/junkboy0315/django-rest-framework/commit/4585bb6229fddb875337ced280689abba1b2093b?diff=split)の diff のようにする。

`APIView`クラスを継承し、`get`,`post`,`put`,`delete`などのメソッドをオーバーライドして使う。書き方が若干変わるだけで、処理内容自体は function-based のときと何も変わらない。

### Mixins

mixin を使うと、view においてよく使われる定型的な処理をトッピングできる。

mixin で view をリファクタした結果が[こちらの diff](https://github.com/junkboy0315/django-rest-framework/commit/32e625bbdc70e0935bd2cc60e62466ab76a6cebb?diff=unified)である。

ほとんどの処理が消えている。消えた部分が、mixin が提供してくれている処理ということである。

- `mixins.ListModelMixin` --- `list`メソッドを提供する
- `mixins.CreateModelMixin` --- `create`メソッドを提供する
- `mixins.RetrieveModelMixin` --- `retrieve`メソッドを提供する
- `mixins.UpdateModelMixin` --- `update`メソッドを提供する
- `mixins.DestroyModelMixin` --- `destroy`メソッドを提供する

```py
class SnippetList(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    """
    - 全ての snippets を表示する。
    - 新しい snippet を作成する
    """
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class SnippetDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    """
    単一のスニペットの、取得・更新・削除を行う。
    """
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

    def get(self, request, *args, **kwargs):  # なお、pkはkwargsとして渡ってくる
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
```

### Generic views

[Generic views](https://github.com/encode/django-rest-framework/blob/0e10d32fb122619a7977909536b642d09603192a/rest_framework/generics.py#L276) を使うと、`get`や`post`などのメソッドと、ミックスインで提供される`retrieve`,`update`などの対応付けを一括して行ってくれるため、view のコードを[単純化](https://github.com/junkboy0315/django-rest-framework/commit/ea640baa9ca36d8724ae0c5c9da08899f4109204)できる。

```py
class SnippetList(generics.ListCreateAPIView):
    """
    - 全ての snippets を表示する。
    - 新しい snippet を作成する
    """
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer


class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    単一のスニペットの、取得・更新・削除を行う。
    """
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
```

### PUT と PATCH の違い

view の PUT メソッドを使うと、最終的に serializer が`partial=False`で設定される。これにより、必須フィールドが揃っていないとバリデーションエラーになる。

view の patch メソッドを使うと、最終的に serializer が`partial=True`で設定される。これにより、必須フィールドが揃っていなくても更新可能になる

原則として PUT を使って、更新時には全項目を BODY として投げるほうが良いかも。
そうしないと、フロント側で更新が不要な項目を明示的に削る必要があり、面倒だから。
この場合、必須とすべき項目は新規登録時と同じになるはず。
（null である項目は更新しない、という方法も考えられるが、基本的に API 側では、
null を null として記録すべきなのか、あるいは無視すべきなのかを判断できない）

## Authentication & Permissions

本項では下記の機能を実装する

- Snippet に作者の情報を保存する
- 未認証ユーザは閲覧のみ行える
- オブジェクトレベルの認証（オブジェクト作者のみ更新や削除が可能）

最低限必要なコードは以下の通り

- [ユーザ情報の保存](https://github.com/junkboy0315/django-rest-framework/commit/c437c2d953ac638167c4d7983926309a16dd80f1)
- [未認証ユーザは閲覧のみ](https://github.com/junkboy0315/django-rest-framework/commit/b4bf18f7124ed7cac509851a41b6f4a83ee0614d)
- [オブジェクトレベルの認証](https://github.com/junkboy0315/django-rest-framework/commit/4d345d0063baa692a526ea69466b412fdf61bf08)

### Snippet

作者の情報を保存するフィールドを、Snippet モデルに追加する。

```py
# models.py
class Snippet(models.Model):
    owner = models.ForeignKey('auth.User',
                              related_name='snippets',
                              on_delete=models.CASCADE)
```

```bash
python manage.py makemigrations snippets
python manage.py migrate
```

### User

※この項は全て省略可能。

User モデルのシリアライザを作成する。

```py
# serializer.py
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    # UserからSnippetをリバースリレーションシップで参照するには
    # 下記のように明示的に指定する必要がある。
    # 使わないならば以下の項目は消してもOK。
    snippets = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Snippet.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'snippets')
```

User モデルの view を作成する

```py
# view.py
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

ルーティングを設定する

```py
# urls.py
path('users/', views.UserList.as_view()),
path('users/<int:pk>/', views.UserDetail.as_view()),
```

### ユーザ情報の取り出し

- ユーザ情報はリクエストに含まれている。このため、リクエストからユーザ情報を取り出してシリアライザに渡す必要がある。
- これは、view において`CreateModelMixin`の`perform_create`メソッドをオーバーライドすることで実現する。`create`メソッド全体をオーバーライドする必要はない。
- これにより、インスタンスの保存時に、`validated_data`に加えて`owner`が一緒に保存されるようになる。なお、この場合は`owner`は`is_valid()`での検証対象とはならない。

```py
# view.py
class SnippetList(generics.ListCreateAPIView):
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

### 読取時のみの処理

- untyped な`ReadOnlyField`クラスを使うことで、シリアライズ時（読取時）のみデータの形を変えることができる。
- 下記の例では、読み取り時のみ`owner`フィールドの値をテキストとして取り出している。
- 書込時は、なんの処理も行わず、そのまま書き込む。

```py
class SnippetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    # 下記でも同じ効果が得られる
    owner = serializers.CharField(read_only=True)

    class Meta:
        model = Snippet
        fields = ('id', 'title', 'code', 'linenos',
                  'language', 'style', 'owner')
```

### view の権限設定

認証済みユーザ以外の編集を禁止するため、下記のように view を設定する

```py
from rest_framework import permissions

class SnippetList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
```

### ブラウザからのログイン

ブラウザからログインできるようにするには下記の行を`url.py`に追加する

```py
urlpatterns [
    path('api-auth/', include('rest_framework.urls')),
]
```

### オブジェクト単位での権限設定

作者なら編集可能、それ以外は閲覧可能と言った具合に、オブジェクトごとに権限を設定したいときは、カスタム権限を使う。

```py
# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    オーナーのみ編集を可能にするカスタム権限
    """
    def has_object_permission(self, request, view, obj):
        # GET等は常に許可
        if request.method in permissions.SAFE_METHODS:
            return True
        # 作者のみ編集可
        return obj.owner == request.user
```

```py
# view.py
class SnippetList(generics.ListCreateAPIView):
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
```

### (おまけ)モデル保存時にデータを操作する

モデルの`save()`メソッドをオーバライドすることで、保存時にデータを操作することができる。

```py
class Snippet(models.Model):
    created =#...
    title = #...
    code =#...
    linenos =#...
    language = #...
    style =#...
    owner =#...
    highlighted =#...

    def save(self, *args, **kwargs):
        """
        `pygmanets`を使ってハイライトされたHTMLを生成する
        """
        lexer = get_lexer_by_name(self.language)
        linenos = 'table' if self.linenos else False
        options = {'title': self.title} if self.title else {}
        formatter = HtmlFormatter(style=self.style,
                                  linenos=linenos,
                                  full=True,
                                  **options)
        self.highlighted = highlight(self.code, lexer, formatter)
        super(Snippet, self).save(*args, **kwargs)
```

## Relationships & Hyperlinked APIs

### API の一覧を表示する API

rest framework の`reverse`に view の名前を与えることで、URL を取得することができる。

```py
# view.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'snippets': reverse('snippet-list', request=request, format=format)
    })

# urls.py
urlpatterns = [
    path('', views.api_root),
]
```

### 特定のフィールドを返す API

インスタンスではなく、インスタンスの特定のプロパティを返す API を作りたいときは、`GenericAPIView`を使って手動で作る。

下記は、Snippet モデルの highlight プロパティを HTML で返す例。

```py
# serializer.py
from rest_framework import renderers
from rest_framework.response import Response

class SnippetHighlight(generics.GenericAPIView):
    queryset = Snippet.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)
```

```py
# snippets/urls.py
path('snippets/<int:pk>/highlight/',
     views.SnippetHighlight.as_view()),
```

### API をハイパーリンクでつなぐ

エンティティ間の関係性を表す方法は以下の通り。Rest framework はこれら全てをサポートしている。

- primary key
- hyperlink
- slug
- string representation
- nesting ...など

ハイパーリンクを使うには、`HyperlinkedModelSerializer`を使う。`ModelSerializer`との違いは：

- デフォルトでは`id`を含まず、`url`フィールドを含む
- `PrimaryKeyRelatedField`の代わりに`HyperlinkedRelatedField`を使う

### URL パターン名

ハイパーリンクを使うときは、原則として下記のルールで名前をつけること。

- `{model_name}-detail`
- `{model_name}-list`
- `{model_name}-{fieldname}`

```py
urlpatterns = [
    path('', views.api_root),

    path('snippets/',
         views.SnippetList.as_view(),
         name='snippet-list'),

    path('snippets/<int:pk>/',
         views.SnippetDetail.as_view(),
         name='snippet-detail'),

    path('snippets/<int:pk>/highlight/',
         views.SnippetHighlight.as_view(),
         name='snippet-highlight'),

    path('users/',
         views.UserList.as_view(),
         name='user-list'),

    path('users/<int:pk>/',
         views.UserDetail.as_view(),
         name='user-detail'),
]
```

### ページネーション

ページネーションを追加するには`tutorial/settings.py`に下記を記載する

```py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

## ModelSerializer Advanced

### リレーション項目のマッピング

モデルのフィールド定義が、Foreign Key を保持する「参照」のフィールドや、その逆方向である「逆参照」のフィールドである場合は、デフォルトではシリアライザの`PrimaryKeyRelatedField()`にマップされる。

なお、書き込みもできてしまうので、必要なければ`(read_only=True)`とするのをお忘れなく。

```py
# 参照はデフォルトで下記のようにマップされる（明示的に書かなくてもよい）
class TrackSerializer(serializers.ModelSerializer):
    album = serializers.PrimaryKeyRelatedField()

# 逆参照はデフォルトで下記のようにマップされる（明示的に書かなくてもよい）
class AlbumSerializer(serializers.ModelSerializer):
    tracks = serializers.PrimaryKeyRelatedField(many=True)
```

#### 逆参照

逆参照を使う際は、参照元モデルにおいて`models.ForeignKey（related_name='tracks')`のように逆参照用のキーを設定しておくこと。`***_set`での逆参照はうまく動かない場合があるので注意。

### depth

デプスを設定すれば勝手に Foreign フィールドを展開してくれる。この場合、シリアライザーを指定する必要もない。

```py
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'account_name', 'users', 'created')
        depth = 1 # 規定は0
```

### フィールドの追加、名前付け替え

明示的にフィールドを追加したり、名前を付け替えることができる。フィールドでは、モデルの「プロパティ」および「メソッド」にアクセスできる

```py
class AccountSerializer(serializers.ModelSerializer):
    url1 = serializers.CharField(source='get_some_url')
    url2 = serializers.CharField(source='foreign_field.url')
```

### read_only_fields

`read_only=True`などをたくさん書くのが面倒なら`read_only_fields`をつかう。

```py
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'account_name', 'users', 'created')
        read_only_fields = ('account_name',)
```

または extra_kwargs を使ってもよい。

```py
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}
```

### 計算による値の算出

- たとえば tracks というフィールドを計算で算出する方法は下記の通り
- 下記の場合は単に逆参照を使えばいいので、本来は計算で算出する必要はないことに留意する

```py
# シリアライザでやる場合
class AlbumSerializer(serializers.ModelSerializer):
    tracks = serializers.SerializerMethodField()

    # `get_***`の法則で名前をつける必要がある
    def get_tracks(self, album): # 第二引数がインスタンスを表す
        tracks = album.tracks.all()
        return [_['id'] for _ in tracks]

# モデルでやる場合
class Album(models.Model):
    @property
    def tracks(self): # `self`がインスタンスを表す
        tracks = self.tracks.all()
        return [_['id'] for _ in tracks]
```

### ネストしたモデルの値を取得したい時

MethodSerializer ではなく sources=``の文法を使うとよい。

```py
class AlbumSerializer(serializers.ModelSerializer):
    artist_age = serializers.IntegerField(sources='artist.age')
```

### ネストした複数の子要素のうち特定の 1 件を 1 つ上の階層に引っ張り上げる方法

- 複数件の子要素が必ず 1 件に定まる場合に、配列だと使い勝手が悪いので単件で取得したい、というときに使える方法
- 手順
  - ビューの `get_queryset()`において、子要素を Prefetch を用いてフィルタする
  - シリアライザでその先頭を抽出する
- 下記の例は、車メーカー(Brand)+製造年の情報でクエリしたときに、単一の車種情報(Car)を取得したい場合の例である。
  - 車メーカーは、1 年に最大で 1 台しか車種を作らないものとする
  - つまり、製造年が判明しているならば車は 1 台または 0 台に定まる

```py
class BrandAPIView(ListAPIView):
    def get_queryset(self):
        release_year = self.request.query_params['release_year']
        return self.queryset \
            .prefetch_related(
                Prefetch(
                    # 逆参照フィールド(多側)
                    "cars",
                    queryset=Cars.objects.filter(
                        release_year=release_year,
                    )
                )
            )


class _BrandSerializer(serializers.ModelSerializer):
    # carsではない点に注意
    car = serializers.SerializerMethodField(read_only=True)

    def get_car(self, brand):
        # その年に車が製造されていない場合は何も返さない
        qs = brand.cars.all()
        if not qs.exists():
            return None

        # 1件目の車を返す
        return _CarSerializer(qs.first()).data

    class Meta:
        model = Brand
        fields = (
            'id',
            'name',
            'car',
            # 'cars',
        )
```

### extra_kwargs 雛形

- 読込のみ：`{'read_only': True}`
- 書込&必須：`{'allow_blank': False, 'allow_null': False,'required': True}`
- 書込&非必須：`{'allow_blank': True, 'allow_null': True, 'required': False}`

extra_kwargs はもともとモデルに含まれるフィールドにのみ効くらしい。
`serializers.CharField()`などの記述で明示的に手動作成したフィールドには効果がないみたい。
