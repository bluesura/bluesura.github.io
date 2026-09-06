# MUGEN document schema v2 — design draft

> **Status: design draft.** This document is not automatically loaded as Codex instructions and is not the active repository schema until an implementation task explicitly adopts it. The root `AGENTS.md` points agents here when MUGEN schema work is relevant.
> The current active format reference remains `src/data/about_mugen-template-all.md` until migration is approved.


> この文書は、現行 `about_mugen-template-all.md` を破壊せず段階的に移行するための v2 設計案です。
> 主対象は Elecbyte MUGEN。IKEMEN GO は現時点では記述対象外としてよいものの、将来同じデータモデルへ追加できるように識別軸だけ予約します。

## 0. 設計目的

この JSON は単なる表示用 CMS データではなく、次の用途を同時に満たすことを目標とします。

1. 人間が読む MUGEN 仕様書の原本
2. 静的 HTML の生成元
3. 将来の CNS/CMD Linter の仕様データ
4. LLM / Codex 等が MUGEN の仕様を判断するための機械可読な知識ベース
5. 公式文書・コミュニティ文書・実機検証・解析情報が消失しても、出典と検証状況を残せるアーカイブ

### 0.1 基本原則

- **公式文書は重要な一次資料だが、実装そのものと同一視しない。** Elecbyte 文書の未記載・誤記・古い記述を許容できるデータモデルにする。
- **「公式 / 非公式」と「仕様が正しい / 間違っている」を同じ軸にしない。** 出典の種類と、実機での再現・検証状況を別々に記録する。
- **MUGEN のバグ・未文書化仕様・処理順は資料価値が高い。** 正常系だけに正規化して消さない。
- **既存 JSON を一括変換しない。** まず代表 10 ページで v2 を通し、表現不能な仕様がないことを確認してから全体へ展開する。
- **HTML の大分類は増やしすぎない。** JSON は構造化しても、表示上は既存の読みやすさを保つ。
- **コピペ可能な CNS 記述を維持する。** MUGEN 制作環境には一般的な IDE の補完がないことを前提とする。

---

# 1. バージョン管理の基本設計

## 1.1 `version` という 1 文字列だけで仕様を表さない

現行の `page.version` は「その機能が実装されたバージョン」を表していますが、MUGEN では少なくとも次の 2 軸を分離する必要があります。

### A. 実際に動かしている実行ファイル / ビルド

例:

- DOS MUGEN
- Linux 2002.04.14
- WinMUGEN 系
- MUGEN 1.0 RC4
- MUGEN 1.0 RC6
- MUGEN 1.0
- MUGEN 1.1 Alpha 4
- MUGEN 1.1 Beta 1

これを **runtime build** と呼びます。

### B. キャラクター側の互換モード

MUGEN 1.0 以降では、キャラクターの `[Info] mugenversion` 等によって旧バージョン互換挙動が発生します。

したがって「MUGEN 1.0 の exe で動かしている」ことと「MUGEN 1.0 用キャラクターとして評価される」ことは同義ではありません。

これを **compatibility profile** と呼びます。

### 1.2 canonical ID

表示名ではなく、機械処理用の ID を固定します。

推奨例:

```text
mugen-dos-2001.04.14
mugen-linux-2002.04.14
winmugen-2002.04.14
mugen-1.0-rc2
mugen-1.0-rc4
mugen-1.0-rc6
mugen-1.0
mugen-1.1-a1
mugen-1.1-a4
mugen-1.1-b1
mugen-1.1-b1-p1
```

将来 IKEMEN GO を扱う場合は MUGEN と同じ番号空間へ混ぜず、別 engine ID を使います。

```text
ikemen-go-v1.0.0
ikemen-go-v1.0.1
ikemen-go-git-<commit-sha>
```

Nightly を固定名 `nightly` だけで保存すると内容が変化するため、検証記録ではコミット SHA を併記します。

## 1.3 バージョン情報は共通レジストリへ分離

個々の State Controller / Trigger JSON に年月日や正式名称を重複記述しません。

推奨配置:

```text
src/data/engine-versions.json
```

各ページは canonical ID を参照します。

## 1.4 build date と public date を分ける

MUGEN 1.1 Alpha / Beta のように「ビルド日」と「一般に流通した日」が一致しないケースがあるため、共通レジストリでは最低限以下を分離します。

```json
{
  "id": "mugen-1.1-b1",
  "engine": "mugen",
  "line": "mugen-1.1",
  "label": "MUGEN 1.1 Beta 1",
  "build_date": "2013-07-28",
  "public_date": null,
  "release_kind": "beta"
}
```

日付が確定できない場合は推測値を入れず `null` とし、`notes` / `sources` で補足します。

## 1.5 page メタデータ

### v2 推奨

```json
"page": {
  "title": "MUGEN State Controller",
  "subtitle": "Helper",
  "engine": "mugen",
  "introduced_in": "mugen-linux-2002.04.14",
  "target": "召喚",
  "category": ["Helper"],
  "update": "2026.09.06",
  "type": "document",
  "level": "3"
}
```

### `page.version`

既存 JSON 互換のため当面は読み込み可能にしますが、**新規データでは `introduced_in` を正とし `version` は非推奨**とします。

`introduced_in` 自体が不明な未文書化機能では、無理に 2002.04.14 等を入れず `null` または省略します。その場合、後述する evidence 付き `notes` で「WinMUGEN で存在確認」等を記録します。

---

# 2. 適用環境 (`environment`)

バージョン差分を記録する各要素で共通利用します。

```json
"environment": {
  "engine": "mugen",
  "runtime": ["mugen-1.0"],
  "compatibility_profile": ["mugen-compat-2002"]
}
```

## 2.1 `runtime`

`engine-versions.json` の build ID または family ID を指定します。

例:

```json
"runtime": ["winmugen-2002.04.14"]
```

```json
"runtime": ["mugen-1.0", "mugen-1.1"]
```

family ID を指定した場合は、その family に属する全ビルドを意味します。

## 2.2 `compatibility_profile`

キャラクター / コンテンツ側の互換モードです。

推奨 canonical ID:

```text
mugen-compat-2002
mugen-compat-1.0
mugen-compat-1.1
```

この ID は DEF に実際に書く文字列そのものではありません。表記揺れや日付形式を正規化するための内部 ID です。

## 2.3 省略時

`environment` がない情報は、そのページが対象とする MUGEN 全般に共通する説明として扱います。

バージョン差が判明した時点で該当情報に `environment` を付加します。

---

# 3. 出典 (`quote`) と evidence

## 3.1 `quote` は残す

既存サイトの「引用記事」一覧は、過去の MUGEN 資料を発見できる導線・出典表示・文化的アーカイブとして意味があるため削除しません。

ただし、各資料に ID と種別を追加できるようにします。

```json
"quote": [
  {
    "id": "elecbyte-1.1-helper",
    "title": "Helper - State Controller Reference (MUGEN 1.1)",
    "url": "...",
    "source_type": "official_document"
  },
  {
    "id": "chaos-helper",
    "title": "SC-/Helper - MUGEN CNS WIKI CHAOS@予定",
    "url": "...",
    "source_type": "community_documentation"
  }
]
```

### source_type 推奨値

```text
official_document
official_history
community_documentation
forum_or_log
personal_research
source_code
archive
other
```

`source_type` は「信頼度」ではありません。

## 3.2 evidence は別軸

仕様記述ごとに必要な場合だけ evidence を持たせます。

```json
"evidence": {
  "status": "confirmed",
  "basis": ["runtime_test", "community_documentation"],
  "tested_on": ["winmugen-2002.04.14"],
  "source_refs": ["chaos-helper"]
}
```

### evidence.status

```text
confirmed
probable
unverified
conflicting
```

### evidence.basis

```text
official_document
official_history
runtime_test
community_documentation
reverse_engineering
source_code
cross_version_test
```

重要: `official_document` が `runtime_test` より自動的に優先される、というルールは設けません。

公式文書と実機結果が食い違う場合は `conflicting` とし、両方を残します。

---

# 4. 基本識別子・概要

現行フィールドは基本的に維持します。

| キー | 方針 |
| --- | --- |
| `title` | 維持 |
| `category` | 維持 |
| `state` | State Controller の場合に使用 |
| `trigger` | Trigger の場合に使用 |
| `description` | 維持 |
| `images` | 維持 |
| `syntax` | 維持 |
| `group` | 非推奨 |
| `summary` | 非推奨 |
| `htm` | 必要時のみ。構造化可能な仕様を生 HTML へ逃がさない |

---

# 5. State Controller パラメーター

## 5.1 現行フィールド

以下は維持します。

```text
parameter
value
type
description
min_value
max_value
parameter_type
default_value
possible_value
load_priority
associated_trigger
media
```

## 5.2 `expression_policy` を追加

`type` と「式を使用可能か」は別概念です。

```json
"expression_policy": "expression"
```

推奨値:

```text
expression        通常の式を指定可能
constant_only     定数のみ
string_literal    文字列・属性等。通常の算術式としては扱わない
special_syntax    通常式とは異なる専用構文
unknown           未確認
```

`IgnoreHitPause` / `Persistent` のような共通パラメーターは `constant_only` とします。

## 5.3 `constraints` を追加

required / optional だけでは表せない条件を記録します。

```json
"constraints": [
  {
    "kind": "one_of",
    "parameters": ["Value", "Value2"]
  }
]
```

推奨 kind:

```text
one_of             いずれか一つ以上が必要
mutually_exclusive 同時指定不可
requires           他パラメーターが必要
effective_when     特定条件でのみ意味を持つ
alias               同義・代替構文
```

複雑な意味論を DSL 化しすぎないこと。Lint で機械判定できる条件だけ構造化し、それ以外は `notes` に置きます。

## 5.4 `variants` を追加

型・デフォルト・意味・有効値がバージョンで変わる場合だけ使用します。

```json
"variants": [
  {
    "environment": {
      "engine": "mugen",
      "runtime": ["mugen-1.0"]
    },
    "type": ["int", "int"],
    "evidence": {
      "status": "confirmed",
      "basis": ["official_document"],
      "source_refs": ["elecbyte-1.0-helper"]
    }
  },
  {
    "environment": {
      "engine": "mugen",
      "runtime": ["mugen-1.1"]
    },
    "type": ["float", "float"]
  }
]
```

共通仕様を `variants` に重複コピーしません。

---

# 6. デフォルト値と「コピペ用パラメーター一覧」

## 6.1 表示上の方針

「省略した時のデフォルト値」に相当する一覧は **残します**。

理由:

- MUGEN 制作はプレーンテキスト編集が中心である
- パラメーターを一覧でコピーし、必要箇所だけ書き換える用途がある
- ページ内の個別パラメーター説明を往復せず利用できる

ただし表示名は、用途を明確にするため次を推奨します。

```text
コピペ用パラメーター一覧（省略時の挙動）
```

既存 URL / HTML の互換を重視する場合は見出し名を据え置いても構いません。

## 6.2 MUGEN に存在しない疑似パラメーターを書かない

`Parent.Size.XScale` のように MUGEN に存在するパラメーターと誤解できる記法を **コード表示には使用しません**。

継承・派生値は意味情報として JSON 内に持ち、コード側ではコメントとして表示します。

## 6.3 v2 `default`

```json
"default": [
  {
    "kind": "inherit",
    "display": "親から継承"
  }
]
```

推奨 kind:

```text
literal    固定値
inherit    親・Root 等から継承
derived    他設定等から算出・連動
required   省略不可
none       デフォルトという概念がない
unknown    未確認
```

`inherit` / `derived` の `display` は自然文にします。MUGEN の実在構文らしく見える文字列を捏造しません。

### literal 例

```json
"default": [
  {"kind": "literal", "value": 0}
]
```

### derived 例

```json
"default": [
  {"kind": "derived", "display": "AnimType と同じ"}
]
```

## 6.4 `default_value` の扱い

既存データとの互換のため当面残します。

移行後は `default` を正とし、`default_value` は renderer が旧 JSON を読むための legacy field とします。

## 6.5 コピペ出力規則

### 固定値

そのまま貼っても省略時と同じ挙動になるものは有効行で出力可能です。

```cns
ID = 0
Pos = 0, 0
```

### 継承 / 派生 / 必須 / 不明

**行全体をコメントアウト**します。

```cns
; Size.XScale =        ; 省略時: 親から継承
; StateNo =            ; 必須: 値を指定してください
; Lag =                ; 省略時挙動: 未確認
```

これにより、現行の意図である「コピーして必要部分だけ編集」を維持しつつ、空値を誤って有効な CNS として貼る危険を下げます。

---

# 7. `load_priority` は第一級の仕様として維持

`load_priority` は削除・非表示・付録化しません。

MUGEN ではバグ利用・未文書化挙動・内部評価順自体が制作技術になっており、パラメーターの内部評価 / 読み込み順が計算式や副作用へ影響するケースを記録する価値があります。

## 7.1 公式の「記述順」と混同しない

次の 3 種類を区別します。

1. **State Controller ブロック自体の実行順** — State 内で上から評価される
2. **カンマ区切り式の評価順** — 左から右
3. **同一 Controller 内の各パラメーターの内部評価 / 読み込み優先順位** — `load_priority` で扱う実測・解析対象

公式文書が「グループ内のパラメーター記述順は任意」と説明していても、3 の内部実装情報と矛盾するとは限りません。

## 7.2 evidence を追加可能にする

既存配列は維持します。

```json
"load_priority": ["21"]
```

必要なページでは次を追加します。

```json
"load_priority_evidence": {
  "status": "confirmed",
  "basis": ["runtime_test", "reverse_engineering"],
  "tested_on": ["winmugen-2002.04.14"],
  "source_refs": []
}
```

不明は `?` を維持してよいものの、`unverified` / `unknown` を evidence 側でも明示します。

---

# 8. Trigger に追加する構造

現行の `syntax` だけでは Trigger の型体系・旧式構文・引数制約を十分に表せません。

代表ページ検証後、最低限次を追加することを推奨します。

## 8.1 `return_type`

```json
"return_type": ["int"]
```

バージョンで変化する場合は `variants` で上書きします。

## 8.2 `syntax_kind`

```text
nullary       引数なし: Time, Alive 等
function      通常の関数型: Const(...), Sin(...) 等
old_style     AnimElem, TimeMod, ProjHit 等の旧式構文
special_form  IfElse / Cond のような特殊評価形式
```

## 8.3 `arguments`

```json
"arguments": [
  {
    "name": "value",
    "type": ["int"],
    "expression_policy": "expression"
  }
]
```

引数なしは `[]`。

### 今は追加しないもの

以下は代表 10 ページを通した後に必要性を再判定します。

- `evaluation_order` 専用トップレベルフィールド
- `bottom_behavior` 専用トップレベルフィールド
- `side_effects` 専用トップレベルフィールド

現時点では `notes` で表現し、スキーマを増殖させません。

---

# 9. 「仕様・バグ・エラー・変更点」を `notes` に統合

現行 `version` 配列には、バージョン変更・警告文・バグ・一般仕様・未検証情報が混在しています。

v2 では内部 JSON を `notes` に統一し、`kind` で分類します。

```json
"notes": [
  {
    "kind": "version_change",
    "change": "added",
    "at": "mugen-1.1-b1",
    "content": "ReMapPal が追加されました。",
    "evidence": {
      "status": "confirmed",
      "basis": ["official_document"],
      "source_refs": ["elecbyte-1.1-helper"]
    }
  },
  {
    "kind": "warning",
    "message": "NEGATIVE HELPER ID",
    "condition": "ID に負数を指定した場合",
    "content": "..."
  },
  {
    "kind": "behavior",
    "content": "Helper が射出した Projectile は Root 側の管理になる。",
    "evidence": {
      "status": "confirmed",
      "basis": ["runtime_test"]
    }
  }
]
```

## 9.1 kind 推奨値

```text
behavior          一般的な実挙動
version_change    バージョンによる追加・変更・修正
bug               バグ・不具合
warning           MUGEN の警告出力
error             読み込み失敗・停止等のエラー
compatibility     mugenversion / 別ビルド互換挙動
undocumented      未文書化仕様
research          解析・実験情報
deprecated        非推奨・廃止予定
limitation        制約
```

## 9.2 version_change.change

```text
added
changed
fixed
removed
deprecated
```

## 9.3 表示側

HTML では種類ごとに別ページセクションを増やす必要はありません。

既存の「仕様・バグ・エラー・変更点」相当の一つのセクション内で、badge / ラベル表示します。

例:

```text
[仕様] Helper が射出した Projectile は…
[WinMUGEN・実測] PosType の F/B/L/R は…
[1.1] ReMapPal を追加
[警告] NEGATIVE HELPER ID
[未検証] ...
```

---

# 10. 共通パラメーター

`src/data/common/IgnoreHitPause.json` と `Persistent.json` の共通化は維持します。

重要なのは、renderer 内で **固有パラメーター + 共通パラメーターを一度だけ merge した「有効パラメーター一覧」**を作り、以下の全表示が同じ一覧を参照することです。

- パラメーター詳細
- コピペ用パラメーター一覧
- デフォルト表示
- 将来の Lint / schema export

これにより、現状のように詳細欄には `IgnoreHitPause` / `Persistent` がある一方、デフォルト一覧から抜ける不整合を防ぎます。

---

# 11. 代表 10 ページによる schema stress test

全ページを移行する前に、以下を v2 の fixture とします。

| 種類 | ページ | 検証するもの |
| --- | --- | --- |
| State | Helper | 親子、継承、未文書化値、複数バージョン、load_priority |
| State | HitDef | 大量パラメーター、派生 default、警告、互換バグ、巨大な load_priority |
| State | VarSet | 代替構文、相互排他、旧式構文 |
| State | HitBy | Value / Value2 の one-of 制約 |
| State | Explod | 1.0→1.1 差分、追加パラメーター、未検証情報 |
| State | Zoom | 1.1 テスト実装・未文書化 / 不完全実装 |
| Trigger | MoveContact | DOS / Win / 1.x で戻り値・意味が変わるケース |
| Trigger | AnimElem | old-style trigger、式を引数に取れない特殊構文 |
| Trigger | IfElse / Cond | eager / short-circuit と version event |
| Trigger | AILevel | RC 単位の追加・修正履歴 |

補助 fixture として `TagIn`, `TagOut`, `StandBy`, `Const`, `TargetLifeAdd` も有効です。

この 10 ページで表現できない情報が出た場合だけ、新しいトップレベルフィールドを検討します。

---

# 12. IKEMEN GO を将来追加する場合

今は MUGEN の整備を優先し、IKEMEN GO 固有仕様を既存 MUGEN JSON に大量投入しません。

ただし、v2 の `engine` / `environment` / version registry により将来次のように追加可能にします。

```json
"environment": {
  "engine": "ikemen-go",
  "runtime": ["ikemen-go-v1.0.0"]
}
```

IKEMEN GO は MUGEN 1.1 互換を目標にしつつ bug-for-bug emulation を保証しないため、MUGEN の `mugen-1.1` を IKEMEN GO の別名として扱ってはいけません。

Nightly は可変なので、検証情報を残す場合は release tag または commit SHA を固定します。

---

# 13. HTML ページ構造

現状を大きく壊しません。

推奨表示順:

1. 概要
2. 構文・引数（Trigger 等、該当する場合）
3. パラメーター
4. 仕様・互換性・バグ・警告・実測情報 (`notes`)
5. コピペ用パラメーター一覧（省略時の挙動）
6. コードサンプル
7. パラメーターの読み込み / 評価順 (`load_priority`)
8. 引用記事・出典

`load_priority` は隠さず独立セクションを維持します。

---

# 14. 移行方針

## Phase 0 — バックアップと fixture 固定

- 上記 10 ページを fixture として固定
- 現在の HTML 出力を比較用に保存
- 全 JSON 一括書換えは禁止

## Phase 1 — schema を「追加だけ」で拡張

以下を optional field として追加します。

- `page.engine`
- `page.introduced_in`
- `environment`
- `expression_policy`
- `constraints`
- `variants`
- `default`
- `notes`
- `evidence`
- `load_priority_evidence`
- Trigger の `return_type`, `syntax_kind`, `arguments`

旧フィールドはこの段階では削除しません。

## Phase 2 — version registry

`src/data/engine-versions.json` を追加し、canonical ID を一元管理します。

まず MUGEN のみ確定させます。

## Phase 3 — 10 fixture の手動移行

1 ページずつ公式文書・CHAOS Wiki・旧引用記事・実機情報を突き合わせます。

## Phase 4 — renderer 改修

- `notes` rendering
- `default` からコピペ欄生成
- 共通パラメーター merge の一本化
- version label 解決

## Phase 5 — 全体移行

fixture で問題がなければ一括変換スクリプトを作成します。

機械変換後に「不明」を勝手に補完しないこと。

## Phase 6 — legacy field 削除の判断

全データが移行し、HTML/Lint が v2 のみで安定した後に初めて以下の削除を検討します。

- `page.version`
- `version`
- `default_value`
- その他 deprecated field

---

# 15. 情報調査の優先ルール

仕様確認時は複数ソースを比較します。

1. 実機で再現可能なテスト結果
2. Elecbyte 同梱 / 公式ドキュメント・update history
3. MUGEN CNS WIKI CHAOS@予定
4. 長期運用された国内外コミュニティ資料
5. フォーラム・IRC ログ・作者メモ等

これは「上ほど無条件に正しい」という順位ではありません。

食い違いがある場合は消去法で一つに決めず、`evidence.status = conflicting` として差異を残し、どの runtime / compatibility profile で再現するかを切り分けます。

---

# 16. 調査で確認できた設計上の重要事項

- Elecbyte 1.0 CNS 文書は、State Controller の大半のパラメーターに式を使用できる一方、`IgnoreHitPause` と `Persistent` は例外として式を取れないと説明している。
- 同文書は、カンマ区切り値を左から右に評価すると明記している。
- 同文書は、グループ内のパラメーターの**記述位置**自体は任意としている。これは当サイトで扱う実測 `load_priority`（内部評価 / 読み込み優先度）と別概念として管理する。
- MUGEN 1.0 update history には `mugenversion` が 2002 互換バグを切り替える事例が明記されており、runtime build と compatibility profile を分ける必要がある。
- MUGEN 1.1 history では Beta 1 の build date が 2013-07-28、Alpha 4 が 2012-08-31 と記録される。Web 公開日・流出日とは別に管理すべきである。
- CHAOS Wiki は Helper の `PosType` など、公式文書より細かい実測挙動を記録している。
- 未文書化の `TagIn`, `TagOut`, `StandBy` や、1.1 の不完全な `Zoom` のような項目が存在するため、「公式一覧に存在するか」だけで page の存在可否を決めない。

---

# 17. 調査元（設計ドラフト作成時）

- Elecbyte / MUGEN 1.0 CNS documentation mirror: https://network.mugenguild.com/justnopoint/1.0docs/cns.html
- Elecbyte / MUGEN 1.0 Update History mirror: https://network.mugenguild.com/justnopoint/1.0docs/history.html
- Elecbyte / MUGEN 1.1 Update History mirror: https://network.mugenguild.com/justnopoint/1.1docs/history.html
- Elecbyte / MUGEN 1.1 State Controller Reference mirror: https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html
- MUGEN CNS WIKI CHAOS@予定: https://w.atwiki.jp/mugencns/
- MUGEN Cheap Wiki / Undocumented Stuff: https://mugen-cheap.fandom.com/wiki/MUGEN%27s_Undocumented_Stuff
- MUGEN State Controller Reference mirror (mugen-net): https://www.mugen-net.work/wiki/index.php/M.U.G.E.N_Documentation%3AState_Controller_Reference
- IKEMEN GO repository: https://github.com/ikemen-engine/Ikemen-GO

