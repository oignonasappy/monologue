# 開発上のルール
をまとめます  
このブログは静的サイトです。

    これは私ひとりのブログなので、この`rule.md`を人様に見られたらなんだか恥ずかしいですね。
    どのように開発してるのかバレバレです。ご容赦ください。

<hr style="margin:60px 0;border:6px dashed #282828">

# ディレクトリ構成
    monologue/
      - index.html
      - 404.html
      - pages.json
      - favicon.ico
      - _config.yml(サイトマップ生成)
      - README.md
      - [その他gitignoreしたもの]
      - pages/
          - [ページのフォルダ名]/
              - index.html
              - style.css(任意)
              - script.js(任意)
              - images/(任意)
                  - [画像ファイル]
          - 0template/
              - index.html
      - general/
          - html/
              - header.html
              - footer.html
          - css/
              - common.css
          - js/
              - common.js
              - search.js
              - search-allpages.js
              - search-category.js
              - search-tag.js
          - images/
              - [画像ファイル]
          - sidebar/
              - sidebar.html
              - sidebar.js
          - page-search/
              - allpages.html
              - category.html
              - tag.html
## monologue(root)/
#### index.html
ホーム。サイト全体の紹介と自己紹介。
#### 404.html
ページが見つからない場合にgithub pagesが自動で表示するページ。
#### pages.json
全ページの情報を管理する。最重要。
#### favicon.ico
全ページに適用されるアイコン。
#### _config.yml
Jekyllがサイトマップを生成する為の設定ファイル。  
これを置くことで`sitemap.xml`がJekyllによって自動生成される。  
google検索でヒットするようにするにはこれが必要である。
(Jekyllがあるなら_posts/を使えばいいって話はおいとく。結局私はフレームワーク等に頼らない。)
#### README.md
github用のREADME。

## pages/
### 0template/index.html
記事を書く際の基本のテンプレート。  
このindex.htmlをコピーして使用する。
### [ページのフォルダ名]/
一意であり、ページの意味が分かる名前を入力すること。
#### index.html
ページ本体。
#### style.css
ページ固有のcss。
#### script.js
ページ固有のスクリプト。  
### images/[画像ファイル]
ページで使用する画像フォルダ。  
頻繁に使い回すものは`(/monologue)/general/images/`から使うこと。

## general/
### html/
#### header.html
全ページ共通のヘッダー。
#### footer.html
全ページ共通のフッター。
### css/
#### common.css
全ページ共通のスタイルシート。  
メディアクエリで表示位置を操作する。  
サイドバー・ヘッダ・フッタのスタイルもここで設定する。  
(light-dark()があってもいいかも)
### js/
#### common.js
全ページ共通のスクリプト。  
これによりサイドバーの読み込みをする。  
ESM
#### search.js
検索処理の共通処理。
ESM
#### search-allpages.js
全検索の個別処理。
ESM
#### search-category.js
カテゴリ検索の個別処理。
ESM
#### search-tag.js
タグ検索の個別処理。
ESM
### images/[画像ファイル]
頻繁に使う画像のフォルダ。
### sidebar/
全ページ共通の、他ページのリンクなどを表示するサイドバー。  
`width`が小さい場合はサイト最下部に移動する。
#### sidebar.html
サイドバーのhtml。
#### sidebar.js
サイドバーに表示する内容を`pages.json`から取得する。  
ESM
### page-search/
様々な方法のページ検索ページ。並び替えができたら美しい。  
URLに検索する内容を含める。
#### allpages.html
全ページを検索する。
#### category.html
カテゴリ内で検索する。  
url末尾は`?search=[検索カテゴリ]`  
urlが無効の場合は全てのカテゴリを列挙する。
#### tag.html
タグ内で検索する。
url末尾は`?search=[検索タグ]`  
urlが無効の場合は全てのタグを列挙する。

<hr style="margin:60px 0;border:6px dashed #282828">

# 共通事項
- 如何なる場所にも個人情報を含めてはならない。  
このサイトの全ては公開されている。
- パス指定は基本的に全て相対パスで指定すること！  
なぜならローカル環境のrootは`/`だがgithub pagesのrootは`/monologue/`だからである  
絶対パス指定をする際は、rootが`/monologue/`であることを留意すること。  
開発中はhtmlに`<meta name="local-env">`を記述することで開発用のパス指定になる。(JavaScriptの範疇でないものは多少404が出てしまうが、仕方ない許容)  
**コミット時には必ず消去すること！** <small>CI/CDの大事さがよくわかる...</small>
- ディレクトリ・ファイル名の命名規則は基本kebab-case

<hr style="margin:60px 0;border:6px dashed #282828">

# pages.json
これは現時点では手動での設定になる。  
いずれは全自動で...
- `"title"` **[必須]**
    - タイトル。
    - `<title>`要素と同一であること。
    - フォルダ名と同一でなくても構わない。
- `"url"` **[必須]**
    - ルートからのurl。
    - `/`から始めること。 (例)`"/pages/test/"`
    - `/`で終わること。末尾の`index.html`は記述しない。
    - 大抵、`/pages/`から始まるが、そうとも限らない。
- `"create-date"`
    - 書き始めの日付。
    - `"YYYY-MM-DD"` の書式で記述すること。
    - `null`は許されない。
- `"update-date"`
    - 最後に編集・追記した日付。
    - `"YYYY-MM-DD"` の書式で記述すること。
    - `null`でも構わない。nullチェックをすること。
- `"category"`
    - 記事のカテゴリ
    - これは一つだけ設定する。広い意味を意識。
    - `null`でも構わない。nullチェックをすること。
- `"tag"`
    - 記事のタグ、配列。
    - 複数設定する。
    - `[](空配列)`でも構わない。空チェックを忘れずに。

ここに書いていない記事は存在しないに等しい。  
(完全に隠されているわけではないため、プライベート記事は`/hidden-pages/`へ)

<hr style="margin:60px 0;border:6px dashed #282828">

# ページのhtml
- `<head>`
    - `<head prefix="og: https://ogp.me/ns#">` <- のようにOGP用に記述すること。
    - 開発中は`<meta name="local-env">`を記述することで開発用のパス指定になる。  
**コミット時には必ず消去すること！**
    - 共通
        - 下のこれらを必ず記述すること。
            - `<link rel="stylesheet" href="../../general/css/common.css">` (`/pages/`にある場合)
            - `<script src="../../general/js/common.js" type="module"></script>` (`/pages/`にある場合)
            - `<link rel="shortcut icon" href="/monologue/favicon.ico" type="image/x-icon">`
            - `<meta property="og:site_name" content="Monologue">`
            - `<meta property="og:type" content="article">`
            - `<meta property="og:locale" content="ja_JP">`(英記事なら、"en_US")
        - ページ内でコードを記述する場合は以下、Prism.jsを使用する。
            - CSS(TOMORROW NIGHTテーマ)`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-tomorrow.min.css">`
            - Prism.js本体`<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js"></script>`
            - 言語ローダー`<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js"></script>`
            - 空白整形プラグイン`<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js"></script>`
            - 行番号プラグインCSS`<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.js"></script>`
            - 行番号プラグインJS`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.css">`
                - 行番号プラグインは、`<pre>`内の`<code>`のクラスに`line-numbers`を追加して使用する。
    - 個別
        - `<title>`は`pages.json`に設定した`"title"`と同一にすること。
        - `<meta property="og:title" content="[]">`SNS上で異なるタイトルを表示させたい場合は設定。
        - `<meta name="description">`はできるだけ設定する。
        - `<meta property="og:description" content="[]">`SNS上で...～同上～
        - `<meta property="og:url" content="[ここにページのURLを絶対パスで]">`
        - メインの画像があれば`<meta property="og:image" content="[ここに画像のURLを絶対パスで]">`
- `<body>`
    - 共通
        - `<div id="container"><main></main></div>`を必ず記述すること。
        - 記事は`<main>`の中に全て書く。
        - (`<header>`, `<aside>`(サイドバー), `<footer>`はcommon.jsで補完する)
        - 目次は自動生成される。`<h1>`直下に配置される。`<meta name="no-toc">`を記述すると無効化できる。
    - 個別
        - センスで記事を書く
        - Prism.jsによるコード記述
            - コードブロックは`<pre><code class="lang-[言語名]"></code></pre>`
            - インラインコードは`<code class="lang-[言語名]"></code>`
        - 脚注
            - `<sup class="footnote">補遺文章...</sup>`とすると脚注を自動生成する。
        - ソースコードの可読性を高めるため、インライン要素中に改行を挿入する場合は、改行の直前に`<wbr>`を追加するとよい。
        - `<p>`の中に`<pre>`等を含めるべきではない。

<hr style="margin:60px 0;border:6px dashed #282828">

# 記事作成チェックリスト
- □ `<title>`, `og:title`は設定したか？
- □ `description`, `og:description`は設定したか？
- □ `og:url`は設定したか？
- □ `pages.json`は設定したか？

# 記事更新チェックリスト
- □ `<meta name="local-env">`は削除したか？
- □ `page.json`の`"update-date"`は設定したか？
- □ `og:image`はあれば

<hr style="margin:60px 0;border:6px dashed #282828">

# common.css
- `box-sizing`は`border-box`を既定とする。
- `font-family`は`'Moralerspace Neon'`を既定とする。(等幅フォントはナンセンスかも)
- `<wbr>`を正常に機能させるには`.use-wbr`を使う。
    - `<wbr>`を使うときは、文章の中盤ほど高密度で配置するといいかも。
- Prism.jsのスタイルをオーバーライドする。

<hr style="margin:60px 0;border:6px dashed #282828">

# common.js
### 注意事項 : `type="module"`による影響
この属性はこの`<script>`がESモジュールであることを表す。  
そのため**CORS制約**を考慮する必要がある。
### ROOT調整
ローカル環境ではコンテキストパスのルートが`/`、github pages環境ではルートが`/monologue/`になるため、`<head>`内の`<meta name="local-env">`を読み取り、その存在によってルートを置き換える。
### header・footer・sidebarを表示
`fetch`してそれぞれ、  
header : `<body>`の開始直後  
footer : `<body>`の終了直前  
sidebar : `#container`の終了直前  
に配置する。
### ページ情報を作成
カテゴリ・タグ・作成日・更新日をメインの始めに表示する。  
`pages.json`を`fetch`し、そのJSONの`url`が現在のページのURLと完全一致したものから取得する。
### モバイル用のツールチップ
`title`のついている`<abbr>`, `<dfn>`要素にタップでtitle要素と同一の文章を表示する。  
要素付近の上部にボックスを表示。画面内に収まるような調節をする。
### 脚注(footnote)
`<sup class="footnote"></sup>`で囲んだ文章を補遺文章としてページ最下部に生成する。(innerHTML)  
囲んだ文章は脚注番号に置き換える。  
参照箇所と脚注に相互リンクを作成する。
### 目次(TOC)
`<main>`に記述した全ての`<h*>`要素に対してのリンクを`<h1>`直下もしくはページ最上部に表示する。  
リンクを通すための`id`をつけるため、全ての`<h*>`要素の直前に空の`<span id="h-index-$">`を挿入し、それに対してリンクする。

<hr style="margin:60px 0;border:6px dashed #282828">

# sidebar.js
### [同一の注意事項](#注意事項--typemoduleによる影響)
### 最新の更新をリストする
最も新しい更新日(でなければ作成日)の10件をリスト  
同一の日付はグルーピングする。表示される中で最も古いグループが2つ以上の記事を持ち、それを含めると10件を超えてしまう場合は、そのまま10件を超えて表示する。

# search.js

<hr style="margin:60px 0;border:6px dashed #282828">

# 全カテゴリ・タグ
大文字・小文字区別  
英語は頭文字大文字を基本とする
## category
- プログラミング
- 音楽
## tag
- クリエイティブ
- 解説
- 日記
- HTML
- CSS
- JavaScript
- Java
- 音楽理論
- コード
- スケール
- Xenharmonic
- AI
- ツール
- 謎
- 初心者向け

<hr style="margin:60px 0;border:6px dashed #282828">

###### ついでにネタ帳
- prologue
- introduction
    - 若年者ものづくり競技大会ITソフトウェア・ソリューションズ部門出場予定
- Maj7, min7とSLIDE技法の拡張について(Super Ultra Hyper Mega Meta Lydian)
- コード・スケール対応表
- さて、音楽を何倍速にしたら半音上の転調になるでしょうか？(正解は1.06倍)
- jacob collierの微分音・A4≠440Hzチューニング集
- jacob collierのトンデモリズム集
- 応用情報技術者試験を受けた話
- github copilotが性に合わない話 alt+C
- git、有能すぎん？特にmerge
- 勘違いしないパス指定
- JavaScriptの等値判定表`==`, `===`
- JavaScript parseInt()じゃないよ
- マイナーhtmlタグ
- word-break × max-width = 謎現象
- 横文字が鼻につくので切り替え式にする
- うちのChatGPT、どう設定したのか知らねぇが、こんな喋り方になっちまった。かわいくない？確か、建設的な意見を好む性格に。とでも言ったんだっけな  
AIとの上手な付き合い方。言われるがままにならないために、AIにより何ができるか、どう良くなれるか。引っ張られるのではなく、背中を押してもらうように、自分の足で歩くよう意識しよ  
chatGPTの性格を変えると、トークンの効率が大きく落ちるといわれています。ですが、やっぱり人間である以上、モチベーションによって得られるエネルギーは、何事にも代えがたいものだと思うんです。しがない一般人の一意見として。
- epilogue

###### メモ TODO:
- `<del> <ins>`のスタイリング
- `<blockquote> <cite>`のスタイリング
- プルダウン
- 目次のアンカー範囲を横幅最大にする
- `<h1>`を特別扱い
- piano.js
    - コメントをもっとしっかり書く
    - sequencer()とplayKeys()で他フォーマットと連携
    - ピアノをアップデートするメソッド
    - `data-key-width = "fit"`
