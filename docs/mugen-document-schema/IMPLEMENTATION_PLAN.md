# MUGEN ドキュメント整備：現状調査と移行計画

作成日: 2026-09-06  
調査基点: `4713d7cc`（調査開始時の `master`）  
作業ブランチ: `codex/mugen-schema-v2-migration`

この文書は調査時点の構成と承認済みの実装計画を保存したものです。以下の「未実施」「提案」は調査時点の記録です。継続実装の最新状況は [STATUS.md](STATUS.md)、実際に採用した構造・配置は [ADOPTION.md](ADOPTION.md) を参照してください。

推奨する進め方は、**資料の不整合解消 → 比較用データの固定 → 旧形式と v2 を読める基盤・表示処理 → Helper → 残りの代表ページ → 小分けで全体へ展開**です。データの物理配置と形式を同時に大きく変えず、公開 URL と既存情報を維持します。

## 1. 読み取った指示と資料の位置づけ

| 資料 | 現在の役割 |
| --- | --- |
| [AGENTS.md](../../AGENTS.md) | リポジトリ全体のエージェント向け指示。今回確認できた指示の入口 |
| [現行 JSON 仕様](../../src/data/about_mugen-template-all.md) | 現在有効な形式の説明 |
| [現行テンプレート](../../src/data/mugen-template-all.json) | 入力例。機械的に検証するスキーマではない |
| [文書マップ](README.md) | 資料の役割と優先順位 |
| [移行ガイド](MIGRATION_GUIDE.md) | 段階導入の手順と検証要件 |
| [v2 設計案](SCHEMA_V2_DRAFT.md) | 将来のデータモデル。未実装の設計案 |
| [バージョンモデル](VERSION_MODEL.md) | engine / runtime build / compatibility profile / 日付の分離方針 |
| [旧配置の v2 設計案](../../src/data/about_mugen-template-all-v2-draft.md) | `SCHEMA_V2_DRAFT.md` と説明本文が一致する重複資料 |
| [バージョンレジストリ案](examples/engine-versions-v2-draft.json) | 現在は本番処理から参照されていないデータ案 |

ルート以外の `AGENTS.md`、専用エージェント定義、リポジトリ内の `.agents/`・`.codex/` は確認できませんでした。配置済み資料は、エージェントが参照する指示・設計文書として構成されています。

調査開始時点で、`AGENTS.md`、既存の `docs/` 内4文書、`src/data/` 内の v2 関連2ファイルはすべて Git 未登録でした。今後の実装前に、配置済み原本をブランチ上のコミットとして固定する必要があります。

## 2. 現在の構成と公開の流れ

```text
AGENTS.md                          エージェント向け指示
docs/mugen-document-schema/         設計・移行文書
src/
  content/
    config.ts                      Astro のデータコレクション定義
    state-controllers/             97 JSON
    triggers/                      142 JSON
    lifebars/                      19 JSON
    docs/                          Starlight の初期サンプル文書
  data/
    about_mugen-template-all.md     現行形式の説明
    mugen-template-all.json         現行テンプレート
    common/                        IgnoreHitPause / Persistent
    *-v2-draft.*                    設計段階の資料
  pages/MUGEN/document/
    State/                         一覧・個別ページ生成
    Trigger/                       一覧・個別ページ生成
    Lifebar/                       一覧・個別ページ生成
  layouts/                         共通ページ枠・記事・ライフバー用レイアウト
  components/content/              パラメーター・既定値・履歴・出典等の表示
public/
  MUGEN/document/Official/          保存済み公式資料等
  MUGEN/document/Other/            その他の既存資料
  MUGEN/memo/                       メモ
  images/, styles/, scripts/       公開用アセット
  Tools/                           今回の個別調査・変更対象外
.github/workflows/                  GitHub Actions
.astro/, dist/, node_modules/       生成物・依存関係
```

JSON は合計 **258ファイル**です。State 系97件の内訳は `category: state` が92件、`statetype` が5件（`A` / `C` / `L` / `S` / `U`）です。フォルダ名だけで全件をステートコントローラーとして処理できる構成ではありません。

State / Trigger の表示は、`getCollection()` → 動的ページの `getStaticPaths()` → `ArticleLayout.astro` → 各表示コンポーネントの順に組み立てています。Lifebar は `JsonLifebarLayout.astro` と `LifebarContent.astro` を使う別系統です。

公開先は `/MUGEN/document/State/Helper.html` のような、ファイル名に由来する大文字小文字を含む `.html` URL です。一覧、関連項目、サイドバー、既存資料内のリンクもこの構成に依存します。

現在の [GitHub Actions](../../.github/workflows/deploy-gh-pages.yml) は `master` への push を契機に Node.js 20 で `npm ci` → `npm run build` を実行し、`dist/` を `gh-pages` に公開します。作業ブランチへの push や PR に対する検証用ワークフローはありません。

## 3. 現状確認の結果

### 実行した確認

| 確認 | 結果 |
| --- | --- |
| 258 JSON の `JSON.parse` | 全件成功 |
| `npm run build` | 成功。Astro の生成ページ数263件 |
| 生成された State / Trigger / Lifebar HTML | 各98 / 143 / 20件。一覧を含む |
| 主要11・補助5ファイルの対応ページ | 全件生成を確認 |
| `Helper` の共通パラメーターと継承値 | 生成 HTML から表示の不整合を確認 |
| GitHub 作業ブランチ | 作成・push 済み。ローカルで追跡設定済み |

検証環境は Windows、Node.js `v24.12.0`、npm `11.6.2`、インストール済み Astro `5.15.3`、Starlight `0.36.2` です。CI の Node.js 20 と同一環境での再現確認は今後の検証工程に含めます。

通常権限での初回ビルドは Astro のユーザー設定ディレクトリ作成で `EPERM` となりました。実行許可を得た再実行で成功しています。ソースコードのビルドエラーではありません。

既存警告として、`docs` コレクションの自動生成の非推奨、`docs → 404` 不在、依存コードの未使用 import、Node の子プロセス関連の非推奨警告、Pagefind の HTML・言語属性・検索対象に関する警告が出ています。保存済み資料に由来する警告もあり、移行による新規警告と区別して管理します。

現在の `package.json` にあるスクリプトは `dev` / `start` / `build` / `preview` / `astro` です。専用のテスト・Lint・データ検証スクリプトと `@astrojs/check` は未導入です。今回確認したのは JSON 構文、現行の最小スキーマを通るビルド、生成 HTML の一部構造であり、厳密な v2 検証・ブラウザでの外観確認・MUGEN 実機検証ではありません。

### 実装とデータの主な課題

| 課題 | 根拠・移行への影響 |
| --- | --- |
| 実際のスキーマが非常に緩い | `src/content/config.ts` は State の `state`、Trigger の `trigger` 等だけを定義し、残りは `.passthrough()`。ビルド成功だけではパラメーターや出典の整合性を保証できない |
| 共通パラメーターの入力経路が異なる | State ページは固有値に共通2項目を追加して詳細欄へ渡すが、既定値・読み込み順は元の `content.parameter` を使う。`Helper` の生成 HTML でも差を確認 |
| 共通パラメーターの適用範囲が広すぎる | State フォルダ全体へ一律追加しており、`statetype` の `A.html` にも共通2項目が出る。文書種別で適用範囲を区別する必要がある |
| コピペ欄に意味説明が混ざる | `Helper` は `Size.XScale = ;親から継承` と出力され、代入行自体は有効。既定値の意味と出力用文字列を分ける必要がある |
| パラメーター名に表示制御が混ざる | `VarSet` の `; fv` / `; value` / `; var(番号)`、`HitDef` の `; MinDist` 等。先頭の `;` を一括除去すると代替構文や有効・無効の意図を失う |
| 不明値が構造の中に残る | `ReversalDef` の `parameter_type: ?<!--optional?-->`、`Zoom` の既定値 `?`、コメント入りの `load_priority` 等。厳密化のために値を推測して埋めない |
| `version` に異なる意味が混在 | 一般仕様、警告、互換性、未検証情報、変更履歴を同じ配列で表示。`notes` への移行には項目ごとの分類が必要 |
| 新しいフィールドの表示経路がない | `default` / `notes` / `evidence` / `variants` 等は現状の表示処理に未対応。JSON のキー変更を先行すると情報が表示されなくなる |
| 入力仕様と表示範囲にも差がある | State / Trigger の `sample_code` は計14ファイルにあるが `ArticleLayout` から表示されない。`qanda.c` / `qanda.r` も表示側は未対応。JSON 全体と HTML の両方で保存状況を確認する |
| MUGEN と派生エンジンの記述が混在 | 共通パラメーター、`TargetLifeAdd`、`AILevel` 等に IKEMEN / IKEMEN GO の記述がある。消去せず別エンジンの情報として扱い、旧 IKEMEN を GO と同一視しない |

以上はソースコードと既存データの観察です。既存 JSON に書かれた MUGEN の挙動自体の正否は、今回の調査では再認定していません。

## 4. 実装前に整合させる設計上の論点

| 論点 | 推奨する解決方針 |
| --- | --- |
| v2 文書の二重配置 | 設計の編集先を `docs/mugen-document-schema/` に一本化し、旧配置は案内文または履歴として扱う。現行の `about_mugen-template-all.md` は実装段階に合わせて更新 |
| レジストリ案の参照先が存在しない | README / VERSION_MODEL が示す `docs/.../examples/engine-versions-v2-draft.json` へ、現在の `src/data/engine-versions-v2-draft.json` を原本保存後に移す。本番用 `src/data/engine-versions.json` の採用とは別作業 |
| 正式版と系列の ID が紛らわしい | レジストリ案・VERSION_MODEL に合わせ、`mugen-1.0` は系列、正式版は `mugen-1.0-final` とする案を確認し、設計内の各例を用途に応じて修正 |
| レジストリ案は代表データを網羅していない | 例として `Cond` に RC7 の記述があるが、レジストリ案に RC7 がない。必要 ID を抽出し、採用前に根拠を確認する。日付を本文から無条件に転記しない |
| 設計案と移行ガイドで順序が違う | 設計案の Phase 3 はデータ移行、Phase 4 は表示改修。実施手順は `MIGRATION_GUIDE.md` 第10節に合わせ、表示処理の旧新両対応を先行させる |
| 「代表10ページ」の数え方 | `IfElse` / `Cond` は別ファイルなので、主要対象は10検証テーマ・11 JSON と明記する |
| `StandBy` の分類 | 実ファイルは `src/content/triggers/StandBy.json`。State 側への新規作成や移動を前提にしない |
| `one_of` の意味 | 案では「一つ以上必要」。相互排他と併用する場合の意味・対象範囲を定義し、JSON Schema の `oneOf` と混同しない。`HitBy` / `VarSet` で検証する |
| 未検証・適用環境の扱い | `evidence.status` の列挙値には `unknown` がない一方、本文に使用を示唆する箇所がある。未検証は `unverified` を使う等、定義を統一する。旧情報の環境未確認を「全ビルドで検証済み」へ変換しない |
| 新旧フィールドの併存 | `default` がある箇所の優先順位、空配列と未指定の違い、`notes` と `version` の重複・取りこぼし、Trigger の旧 `parameter` と新 `arguments` の対応を決める |
| 複数の値と条件付き既定値 | `["0, 0"]` と `["0", "0"]`、固定値と継承の混在、文字列リテラル、バージョン別 default を代表データで検証する。単純なカンマ分割や数値化にしない |

## 5. ディレクトリ移行の提案

配置済み資料には、サイト全体の JSON をどこへ移すかという完成形のディレクトリツリーはありません。初期段階は次の追加・整理に限定する案を推奨します。以下の新規パスは提案であり、今回作成済みという意味ではありません。

```text
docs/mugen-document-schema/
  README.md, MIGRATION_GUIDE.md, SCHEMA_V2_DRAFT.md, VERSION_MODEL.md
  IMPLEMENTATION_PLAN.md            本計画
  examples/                        非本番の設計例・レジストリ案
src/
  content/config.ts                既存コレクションの接続を維持
  content/{state-controllers,triggers,lifebars}/
                                   当面、現在の原本配置を維持
  data/common/                     共通パラメーター原本
  data/engine-versions.json         レビュー後に採用する本番レジストリ
  lib/mugen/
    schema.ts                      共有する構造定義
    normalize.ts                   旧新データを表示用に揃える処理
    parameters.ts                  有効パラメーター一覧の組み立て
    defaults.ts                    CNS コピペ出力規則
    versions.ts                    ID・ラベル・参照の解決
  components/content/              既存表示を拡張
tests/mugen/
  fixtures/legacy/                 比較用の旧 JSON
  fixtures/v2/                     v2 の検証例
  expected/                       表示内容・CNS 出力・参照先の期待値
scripts/mugen/                     検証・差分レポート、後段の移行処理
```

役割ごとの処理を Astro コンポーネントから分けることで、HTML 生成と将来の Linter が同じ意味情報を使えるようにします。Linter 本体の実装や既存ツールの改修は今回の移行範囲に含めません。

物理的な JSON の移動が後から必要になった場合は、コレクション読み込みと公開 ID の対応表を先に用意し、移動だけの変更として検証します。Astro の Content Layer への移行やメジャー更新も、v2 データ移行と同時に実施する必須条件にはしません。

## 6. 作業段階と完了条件

### 段階0：原本と比較基準を固定する

- 配置済み資料を、その時点の内容を保持して Git に登録する。その後、上記の文書重複・参照先・用語・手順の不整合を整理する。
- 主要11ファイル、補助5ファイル、共通2項目、`statetype` を区別するためのデータを固定する。
- 現在の JSON、代表 HTML の本文・各セクション・コピペ欄・出典リンク・公開 URL 一覧を保存し、基点コミットと実行環境を記録する。
- HTML に出ていない情報も含め、旧フィールドの移行先と未解決事項を追跡する一覧を用意する。
- 検証コマンドを実装し、実在するスクリプトとして `package.json` に登録する。PR 用 CI はデプロイせず検証だけ実行する構成で追加する。

**完了条件:** 基準出力を再生成・比較でき、既存の不整合と新しく発生した欠落を区別できる。今回の `dist/` は生成確認済みですが、永続的な比較 fixture の固定は未実施です。

### 段階1：追加型スキーマと参照検証を用意する

- `page.engine` / `page.introduced_in`、`environment`、`expression_policy`、`constraints`、`variants`、`default`、`notes`、`evidence`、`load_priority_evidence` を適切な階層の任意フィールドとして定義する。
- Trigger の `return_type` / `syntax_kind` / `arguments` は、主要例が必要とする範囲で定義する。
- 既存の任意フィールドと未分類情報を保持し、旧データを一律に新しい必須条件で落とさない。v2 として記述した部分は型・参照を検証する。
- 出典 ID の一意性と `source_refs`、環境・履歴等のバージョン参照、engine と build/profile の整合性を検証する。
- レジストリの ID をレビューし、本番用レジストリを採用してから本番 JSON で参照する。未確認の導入バージョン・日付は不明のまま残す。

**完了条件:** 旧 JSON 全258件が引き続き読み込め、v2 の不正な型・存在しない参照は検出できる。通常の説明文を勝手に実測済み仕様へ変換しない。

### 段階2：旧形式と v2 を表示できるようにする

- 文書種別に応じた有効パラメーター一覧を一度だけ作り、詳細・既定値・読み込み順・必要な一覧表示から共有する。
- `statetype` / Trigger / Lifebar への共通パラメーター追加を避ける。コントローラー固有の例外は一般値で上書きせず、明示した根拠とともに扱う。
- 重複排除で `VarSet` の代替構文や同じ名前の別形式を消さない。共通項目の衝突解決と代替構文の識別を分ける。
- 固定値は CNS の有効行を生成できるようにし、継承・派生・必須未指定・不明・環境で値が定まらない項目は行全体をコメントにする。
- `notes` の分類ラベル、適用環境、出典・検証状態を既存のまとまったセクション内に表示する。旧 `version` も表示できるようにする。
- バージョンラベル、Trigger の構文・引数、引用記事を拡張し、既存のセクション ID・リンクを維持する。
- 読み込み順の `?`・複数値・補足文は保持する。並びを勝手に数値ソートして確定した評価順に見せない。
- `sample_code` 等の未表示情報は移行台帳へ記録し、表示回復を別の明示的変更として扱う。未表示だから不要とは判断しない。

**完了条件:** 旧データの本文・コード例・出典を維持し、v2 fixture が表示できる。共通パラメーターの掲載範囲と、コメントが必要な CNS 行について期待値テストが通る。

### 段階3：Helper を最初に移行する

- 既存23パラメーター、共通2項目、履歴、引用、コード例の対応を確認する。
- 固定値と親からの継承、バージョン差、警告、未文書化仕様、読み込み順を v2 で表す。
- 保存済み公式資料、引用先、コミュニティの研究、利用可能な実機検証を比較する。参照できない資料や再現できない挙動は、その状態を記録する。
- 同じ変更内で表示、検証、仕様説明を更新し、旧記述と新しい表現を対応づける。

**完了条件:** JSON の情報保存と HTML の表示確認の両方を満たす。例として継承項目は `; Size.XScale = ...`、共通2項目は対象の各表示に一度だけ出る。MUGEN 上で未検証の内容は未検証と明記する。

### 段階4：残りの代表データでモデルを検証する

| 順序 | 対象 | 主な検証テーマ |
| --- | --- | --- |
| 1 | Helper（段階3） | 継承・出典・共通項目・読み込み順の最初の縦通し |
| 2 | HitDef | 86パラメーター、複数値、派生 default、警告・読み込み順 |
| 3 | VarSet / HitBy | 代替構文、同名の別形式、必須条件と相互排他 |
| 4 | Explod / Zoom | 環境別仕様、未検証・未文書化・不完全な挙動 |
| 5 | MoveContact / AnimElem | 世代差、戻り値、特殊な構文 |
| 6 | IfElse / Cond / AILevel | 評価の違い、RC ごとの履歴、レジストリの網羅性 |

これで主要11ファイルです。補助対象は State の `TagIn` / `TagOut` / `TargetLifeAdd`、Trigger の `StandBy` / `Const` の5ファイルです。さらに State フォルダの `statetype` 5件と Lifebar の表示を回帰確認に含めます。

**完了条件:** 主要・補助対象で情報の欠落がなく、必要な仕様をモデルで表現できる。残る不明点は出典・調査状態とともに記録され、型の都合で断定へ変わっていない。例外が残る場合は全体移行へ進めず、代表データで設計を修正する。

### 段階5：全体へ小分けで展開する

- 代表データの検証後に変換スクリプトを設計する。dry-run、対象ファイル指定、差分・未変換項目のレポート、再実行時の安定性を備える。
- 機械変換できる構造変更と、資料調査・人の判断が必要な内容分類を分ける。
- 関連項目や同じ形式を持つ小さなまとまり単位で移行し、各単位でビルドと回帰確認を行う。
- 旧 `version` をすべて `version_change` にする、空値を `0` にする、HTML を一律除去する等の変換は行わない。
- ライフバーは現在の別モデルを維持して検証する。ライフバー自体の新スキーマへの移行は、その代表例と計画を別途定める。

**完了条件:** 対象ごとの移行状態と未解決事項が追跡でき、公開 URL・本文・CNS 出力・出典・履歴の回帰確認を満たす。

### 段階6：旧フィールドを廃止するか判断する

全データと表示・検証が新形式で安定した後、別途明示的に依頼された整理作業として `page.version` / `version` / `default_value` 等の削除を検討します。今回の計画策定や初期実装に、削除を含めません。

## 7. 検証・リリース・戻し方

- 各変更で JSON 構文と該当する構造・参照検証を実行し、`npm run build` を通す。追加の検証スクリプト名は実装時に確定する。
- 比較は HTML の完全一致だけに頼らず、本文、パラメーター、CNS テキスト、セクション ID、リンク、元 JSON の未表示フィールドを対象にする。意図した表示改善は期待差分として記録する。
- 代表ページと State / Trigger 一覧、サイドバー、Lifebar 一覧・代表ページ、関連項目・出典・画像リンクを確認する。大文字小文字の差は Linux CI でも確認する。
- 表示改修時はデスクトップ・狭い画面で代表ページを確認し、コード欄から実際にコピーしたテキストも検証する。
- engine の仕様検証とソフトウェアの検証を区別する。HTML が正しく生成できても、MUGEN の実機で挙動を確認したことにはならない。
- 段階ごとにレビュー可能なコミット・PR に分ける。公開は現在の `master` → `gh-pages` の流れを維持する。
- 不具合時は原因の変更単位を revert できるようにし、旧 JSON と旧形式の読み込みを残す。生成済み `.astro/` や `dist/` を直接修正して復旧しない。

## 8. 次に着手する具体的な範囲

最初の実装単位は、段階0と段階1の基盤部分です。配置済み資料の原本保存と配置整理、代表データ・生成出力の固定、検証処理、追加型スキーマまでをまとめます。続いて表示処理を対応させ、最初の本番 JSON の移行対象を `Helper` とします。

今回作成した作業ブランチは GitHub に存在します。配置済み資料と本計画は調査完了時点ではローカルの未コミットファイルです。本番 JSON、表示コンポーネント、公開用ワークフローの変更および JSON の一括移行は、今回実施していません。
