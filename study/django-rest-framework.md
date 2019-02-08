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

インスタンスを渡すことで、シリアライズ用の Serializer を作成する。`serializer.data`に、dict に変換（=シリアライズ）されたインスタンスが入る。

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

`data`キーに、パースした dict を渡すことで、デシリアライズ用の Serializer を作成する。

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

このため、前述の Serializer を、下記の通り劇的にシンプルにすることができる。

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
