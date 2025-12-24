# MUGEN ドキュメントJSONテンプレート仕様ガイド (改訂版)

このドキュメントは、`mugen-template-all.json` の各フィールドに入力すべき情報を定義した仕様書です。
LLM（大規模言語モデル）への指示や、ドキュメントデータベース構築時のリファレンスとして利用してください。

## 基本フォーマットルール
*   **HTMLタグ:** `description` や `summary` 等のテキストフィールドでは `<p>`, `<code>`, `<ul>`, `<b>` などのHTMLタグが使用可能です。
*   **配列:** `[]` で囲まれた項目は複数設定可能です。
*   **空データ:** 該当情報がない場合は空文字 `""` または空配列 `[]` とします。

---

## 1. `page` オブジェクト (メタデータ)
ドキュメントページ全体の管理情報です。

| キー | 説明 | 入力例 |
| :--- | :--- | :--- |
| `title` | ページの親タイトル（大分類）。 | `"MUGEN State Controller"`, `"MUGEN Trigger"` |
| `subtitle` | このページの主題（小分類）。 | `"HitDef"`, `"Alive"` |
| `target` | 対象となるオブジェクト（実行者）。 | `"実行者自身"`, `"ステート実行者自身"` |
| `category` | 検索用カテゴリタグ（配列）。 | `["攻撃", "ダメージ"]`, `["ステータス", "生存判定"]` |
| `version` | 実装されたMUGENバージョン。 | `"2002.04.14"` |
| `update` | 文書の最終更新日。 | `"2024.01.01"` |
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
| **`default_parameter`** | 必須・任意引数のサマリ情報。 | |
| └ `required_parameter` | 必須パラメータ名のリスト。 | `["Attr", "HitFlag"]` |
| └ `optional_parameter` | 省略可能なパラメータ名のリスト。 | `["GuardFlag", "Time"]` |
| └ `instead_parameter` | 代替可能なパラメータ（どちらか必須など）。 | `["Time / Value"]` |
| **`load_parameter`** | 読み込み順序に特段の意味がある場合に使用。 | |
| └ `parameter` | 読み込まれるパラメータ順序のリスト。 | `["Attr", "Damage", "Time"]` |

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
```json
"version": [
    {
        "no": "Version1.0以降",
        "content": "MinDistパラメータが追加されました。",
        "blockquote": "http://official.site/update_log"
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

## テンプレート入力時の指示用プロンプト（LLM向け）

> **指示:**
> 1. **HTMLの使用:** `description` 等のテキストは `<p>` や `<code>` を用いて整形すること。
> 2. **パラメータ型:** `type` 配列は引数の数と一致させること（例: `x, y` なら `["int", "int"]`）。
> 3. **必須チェック:** `default_parameter.required_parameter` に記載した項目は、`parameter` 配列内の該当項目でも `parameter_type: "required"` とすること。
> 4. **コード分割:** `code` 配列は行ごとに文字列を分割すること。
> 5. **画像・動画:** `media` や `images` フィールドは、具体的なファイルパスが不明な場合は空配列 `[]` にすること。