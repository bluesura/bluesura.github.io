# MUGEN ドキュメントJSONテンプレート仕様ガイド (改訂版)

> 2026-09-06: 旧形式を維持したまま v2 の任意フィールドを段階導入しています。新しい入力規則・新旧の優先順位は [v2 採用仕様](../../docs/mugen-document-schema/ADOPTION.md)、移行状況は [STATUS.md](../../docs/mugen-document-schema/STATUS.md) を参照してください。以下の旧フィールドは引き続き有効です。

このドキュメントは、`mugen-template-all.json` の各フィールドに入力すべき情報を定義した仕様書です。
LLM（大規模言語モデル）への指示や、ドキュメントデータベース構築時のリファレンスとして利用してください。

## 基本フォーマットルール
*   **HTMLタグ:** `description` や `summary` 等のテキストフィールドでは `<p>`, `<code>`, `<ul>`, `<b>` などのHTMLタグが使用可能です。
*   **配列:** `[]` で囲まれた項目は複数設定可能です。
*   **空データ:** 該当情報がない場合は空文字 `""` または空配列 `[]` とします。
*   **単語:** tickはフレームという言葉に置き換えます。

---

## 1. `page` オブジェクト (メタデータ)
ドキュメントページ全体の管理情報です。

| キー | 説明 | 入力例 |
| :--- | :--- | :--- |
| `title` | ページの親タイトル（大分類）。 | `"MUGEN State Controller"`, `"MUGEN Trigger"` |
| `subtitle` | このページの主題（小分類）。 | `"HitDef"`, `"Alive"` |
| `target` | 対象となるオブジェクト（実行者）。 | `"実行者自身"`, `"ステート実行者自身"` |
| `category` | 検索用カテゴリタグ（配列）。 | `["攻撃", "ダメージ"]`, `["ステータス", "生存判定"]` |
| `version` | 実装されたMUGENバージョン（YYYY.MM.DD形式推奨）。 | `"2002.04.14"`, `"1.0"`, `"1.1"` |
| `update` | 文書の最終更新日。 | `"2025.01.01"` |
| `type` | ドキュメントの種類。通常は `"document"`。 | `"document"` |
| `level` | ドキュメントの深度レベル（1:基礎 ～ 5:詳細）。 | `"3"` |
| `contributor` | **[追記]** ドキュメントの貢献者・作成者（配列）。 | `["AuthorName"]` |

---

## 2. 基本識別子・概要
ドキュメントの核となる識別情報と説明です。

| キー | 説明 | 入力例 |
| :--- | :--- | :--- |
| `title` | 項目名（ファイル名や機能名）。 | `"HitDef"`, `"AfterImage"` |
| `group` | **[非推奨]** 旧仕様のプロパティ。 | `"HitDef"` |
| `category` | 機能分類。`state`, `trigger` など。 | `"state"`, `"trigger"` |
| `state` | ステートコン名（ステコンの場合のみ）。 | `"HitDef"` |
| `trigger` | トリガー名（トリガーの場合のみ）。 | `"Const"` |
| `summary` | **[非推奨]** 簡潔な要約（1行程度）。 | `"<p>指定した番号が存在するか判定します。</p>"` |
| `description` | 詳細な説明文。HTMLタグ使用推奨。 | `"<p><code>AIR</code>ファイルで設定されている...</p>"` |
| `htm` | **[追記]** 補足用の生HTMLデータが必要な場合に使用。 | `"<div class='note'>...</div>"` |

### 画像・構文定義

| キー | 説明 | 構造・例 |
| :--- | :--- | :--- |
| `images` | **[追記]** 解説用のトップレベル画像（フロー図など）。 | `[{"src": "path.png", "width": "100", "height": "100", "alt": "図解"}]` |
| `syntax` | 使用構文。トリガーの場合に特に重要。 | `["Const(Data.Life)", "Const(Data.Attack)"]` |

---

## 3. パラメータ構成 (`parameter` 関連)

ステートコントローラー等の引数定義です。全体の構成定義と、詳細定義に分かれます。

### 3.1 パラメータ構成概略 (`default_parameter`, `load_parameter`) **[追記]**

| キー | 説明 | 入力例 |
| :--- | :--- | :--- |
| `default_parameter` | **[非推奨]** 必須・任意引数のサマリ情報。 | |
| └ `required_parameter` | **[非推奨]** 必須パラメータ名のリスト。 | `["Attr", "HitFlag"]` |
| └ `optional_parameter` | **[非推奨]** 省略可能なパラメータ名のリスト。 | `["GuardFlag", "Time"]` |
| └ `instead_parameter` | **[非推奨]** 代替可能なパラメータ（どちらか必須など）。 | `["Time / Value"]` |
| **`load_parameter`** | **[非推奨]** 読み込み順序に特段の意味がある場合に使用。 | |
| └ `parameter` | **[非推奨]** 読み込まれるパラメータ順序のリスト。 | `["Attr", "Damage", "Time"]` |

### 3.2 パラメータ詳細 (`parameter` 配列)

個々のパラメータの詳細仕様です。

| キー | 説明 | 入力例 |
| :--- | :--- | :--- |
| `parameter` | パラメータ名。 | `"Attr"`, `"Damage"` |
| `value` | 値の意味（ラベル）。 | `["ヒットダメージ", "ガードダメージ"]` |
| `type` | データの型（int, float, string, boolean）。 | `["int", "int"]` |
| `description` | 詳細説明。HTML可。 | `"<p>ヒット時のダメージを指定します。</p>"` |
| `min_value` / `max_value` | 数値の最小・最大制限。 | `["0"]`, `["255"]` |
| `parameter_type` | 必須か任意か。 | `"required"`, `"optional"` |
| `default_value` | 省略時の既定値。 | `["0, 0"]` |
| `possible_value` | 選択肢リスト（`[値, 説明]` の配列）。 | `[["S", "立ち"], ["C", "屈み"]]` |
| `load_priority` | 読み込み・処理の優先度。 | `["1"]` |
| `associated_trigger` | **[追記]** このパラメータに関連するトリガー。 | `["GetHitVar(damage)"]` |
| `media` | 解説用の画像・動画情報オブジェクト。 | (下記参照) |

**`media` オブジェクト構造:**
```json
"media": {
    "image": [ {"title": "図解", "file": "fig.png", "width": "...", "height": "..."} ],
    "video": [ {"title": "例", "file": "video.mp4"} ],
    "youtube": [ {"title": "挙動例", "file": "YoutubeID"} ]
}
```

---

## 4. 関連・履歴情報

| キー | 説明 | 入力例 |
| :--- | :--- | :--- |
| `associated_trigger` | 関連するトリガー名ID。 | `["MoveContact", "InGuardDist"]` |
| `associated_state` | 関連するステートコン名ID。 | `["ReversalDef"]` |
| `quote` | 出典・参考文献（Wikiなど）。 | `[{"title": "Wiki", "url": "http://..."}]` |

### バージョン管理 (`version`)
機能の実装や仕様変更が行われたバージョンを記録します。

```json
"version": [
    {
        "no": "MUGEN 1.0",
        "content": "AILevelトリガーが正常に機能するよう修正されました。",
        "blockquote": "http://official.site/update_log"
    },
    {
        "no": "MUGEN 1.1 Beta 1",
        "content": "Zoom機能（Camera設定）に関わるパラメータが追加されました。",
        "blockquote": ""
    }
]
```

---

## 5. サンプルコード・FAQ

### コード記述 (`sample_code` vs `code_sample`)

*   **`sample_code` [追記]:** 最も標準的な構文の「ひな形」を記述します。
    ```json
    "sample_code": {
        "code": [
            "[State 100, HitDef]",
            "Type = HitDef",
            "Trigger1 = !Time",
            "Attr = S, NA"
        ]
    }
    ```

*   **`code_sample`:** 具体的な使用例（ユースケース）を複数記述します。
    ```json
    "code_sample": [
        {
            "title": "喰らい状態の時に残像を消す",
            "description": "ステートが自動で移行しても消去されます。",
            "code": [
                "[State -2, 残像消去]",
                "Type = AfterImage",
                "Trigger1 = MoveType = H",
                "Time = 0"
            ],
            "media": { ... }
        }
    ]
    ```

### FAQ (`qanda`) **[改訂]**
質問 (`q`)、回答 (`a`) に加え、補足 (`c`) や参照 (`r`) が設定可能です。

```json
"qanda": [
    {
        "q": "他のキャラクターの残像が表示されない。",
        "c": "設定ミスが原因の場合が多いです。",
        "a": "<p>mugen.cfgのAfterImageMaxの数値を増やしてください。</p>",
        "r": [
            {"title": "Config設定", "url": "http://..."}
        ]
    }
]
```

---

## 付録: MUGEN・IKEMEN バージョン年表

ドキュメント作成時に `version` フィールドへ記入する際の参考資料です。

| 公開時期 (年月日) | バージョン名 | 区分 | 概要・主な特徴 |
| :--- | :--- | :--- | :--- |
| 1999-07-27 | **DOS MUGEN**<br>(初期公開) | 公式 | 初期の一般公開。MUGENの歴史的起点。 |
| 2001-05-02 | **DOS 最終**<br>(v2001.04.14 Beta) | 公式 | DOS系の最終版扱いとして整理されることが多い。 |
| 2001-11-04 | **Linux版 初期**<br>(v2001.11.01 Beta) | 公式 | Linux移行の最初期バージョン。 |
| 2002-04-21 | **Linux版 最終公開**<br>(v2002.04.14 Beta) | 公式 | Elecbyteが一般公開した最後のLinuxベータ版。 |
| 2002年ごろ | **WinMUGEN**<br>(v2002.04.14) | 公式 | 当初は寄付者向け非公開配布。後に広く流通し、非公式パッチ文化の土台となった**「無印」**版。 |
| 2004年 | **No Limit Patch**<br>(WinMUGENハック) | 非公式 | WinMUGENの制限（登録人数等）を解除するハックが普及した時期。 |
| 2007年 | **WinMUGEN Plus**<br>(WinMUGENハック) | 非公式 | 高解像度化や制限解除を含んだハック版。長らく事実上の標準として使われた。 |
| 2003年〜2009年 | (公式活動停止期間) | — | 公式の沈黙により、コミュニティ主導の制作・改造が加速した期間。 |
| 2009-09-21 | **MUGEN 1.0 RC1** | 公式 | **Elecbyte復活**。以降RCを重ねてHD画質対応などの機能拡張が行われた。 |
| 2011-01-18 | **MUGEN 1.0**<br>(安定版) | 公式 | 1.0系列の正式版。「最後の安定版」として現在も参照される。 |
| 2013-05 | **MUGEN 1.1 alpha**<br>(流出ビルド) | 公式 | 正式公開前にalpha 4などが流出した時期。 |
| 2013-08-07 | **MUGEN 1.1 Beta 1** | 公式 | **Zoom機能**やPNG透過など描画周りが強化されたバージョン。 |
| 2013-08-11 | **MUGEN 1.1 Beta 1 Patch 1** | 公式 | **公的に入手できる最後の公式リリース**。以降、Elecbyteは再び沈黙。 |
| 2010-07-10 | **IKEMEN**<br>(旧版/Vanilla) | 派生 | MUGEN互換の別実装エンジン。**ネット対戦**機能を備え、新時代の起点となった。 |
| 2016年ごろ〜 | **IKEMEN GO** | 派生 | プログラミング言語Goで**完全に書き直された**現代版IKEMEN。 |
| 2023-01-20 | **IKEMEN GO Rollback** | 派生 | 快適なネット対戦を実現するRollback netcodeのオープンαが話題化。 |
| 2023-10-28 | **IKEMEN GO v0.99.0** | 派生 | GitHub上のリリースタグ。現在はNightlyビルド等で開発が継続中。 |
