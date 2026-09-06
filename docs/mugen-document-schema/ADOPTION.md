# v2 の採用範囲と実装上の決定

2026-09-06、段階的移行を開始しました。設計案全体の完成を意味しません。進捗は [STATUS.md](STATUS.md) に記録します。

## 有効な配置

- 現行形式の入口: `src/data/about_mugen-template-all.md`
- 実行する構造検証: `src/lib/mugen/schema.mjs`（Astro と CLI で共有）
- 本番バージョン ID: `src/data/engine-versions.json`
- 非本番の原案: `docs/mugen-document-schema/examples/engine-versions-v2-draft.json`
- 比較基準: `tests/mugen/baseline/`。JSON 24ページ・共通2項目、記事 HTML・抽出結果、全261 URL、全258原本のハッシュを保存

Node.js 20 の CI とブラウザ表示の両方で同じ処理を使うため、共有ロジックは追加トランスパイラー不要の `.mjs` としました。Astro の既存コレクション定義は `src/content/config.ts` に維持します。

## 任意追加として使える構造

`page.engine` / `page.introduced_in`、`environment`、`expression_policy`、`constraints`、`variants`、`default`、`notes`、`evidence`、`load_priority_evidence`、Trigger の `return_type` / `syntax_kind` / `arguments`、`quote.id` / `quote.source_type` を採用しています。階層・列挙値・型は `schema.mjs` を正とします。旧フィールドと未知の旧メタデータを引き続き保持します。

## 新旧の対応

- `default` を記述した項目は、それを表示に使います。未指定なら `default_value` を読みます。`default: []` は無効です。
- `notes[].legacy_index` は同じオブジェクトの `version` 配列の0始まりインデックスです。対応する旧履歴を置き換えて表示し、旧見出し・引用先は維持します。対応していない旧履歴は引き続き表示します。
- 新旧の履歴本文が異なる場合は、公開用の新本文を表示し、旧本文は JSON に保持します。管理用の差分説明を本文へ自動併記しません。
- `arguments[].legacy_index` は同じオブジェクトの旧 `parameter` 配列に対応します。旧説明・画像等を引き継ぎ、未対応の引数も残します。`arguments: []` だけで既存引数を消す処理にはしません。
- `notes: []` だけで旧履歴を消す処理にはしません。旧フィールドを廃止する作業は別段階です。

## バージョン・検証状態

- `mugen-1.0` は系列、`mugen-1.0-final` は正式版の実行ビルドです。
- `page.introduced_in` と変更履歴の `at` はビルド ID を参照します。系列を初導入ビルドとして指定できません。初導入が分からなければ `null` / 未指定とします。
- `environment.runtime` はビルドまたは系列、`compatibility_profile` は互換プロファイルを参照します。別エンジンの ID 混入は検証エラーにします。
- 旧 IKEMEN の記録を保持する識別子 `ikemen` と、別実装の `ikemen-go` を区別します。新しい GO の仕様整備を始めたという意味ではありません。
- `evidence.status` は `confirmed` / `probable` / `unverified` / `conflicting`。`unknown` は既定値の種類や式の可否に使います。
- `confirmed` と `basis: official_document` は資料の記載確認です。実機テストとは区別します。実機検証済みとする場合には `tested_on` にビルド ID が必要です。
- `confirmed` は空の `basis` を許しません。資料・解析・ソースコードに基づく確認には `source_refs` も必要です。
- `basis: maintainer_report` は管理者による確認です。`comment` に確認の内容を残せます。ビルド不明の管理者確認に架空の `tested_on` を補いません。エージェント自身が行った `runtime_test` とは区別します。
- 環境の省略は適用範囲未分化の記述を許すためのものです。全ビルドを検証したという推論には使いません。

## コピペ欄と共通パラメーター

- `default.kind: literal` の文字列 `value` は CNS のリテラルトークンです。文字列値なら `"my helper"` のように CNS 側の引用符も含めます。複数成分は配列の複数要素で記述できます。
- 継承・派生・必須・不明、適用環境で値が変わる項目は行全体をコメントにします。未移行の旧既定値は単純なリテラルの場合のみ有効行にし、それ以外は原文をコメントとして保持します。
- 条件・相互排他のある項目や、旧パラメーター名の先頭に `;` がある代替書式は自動的に有効化しません。
- 共通2項目は `category: state` にのみ追加します。ページ側に同じ共通パラメーターがある場合、その固有定義を優先します。共通名以外の重複・代替書式は統合しません。
- `load_priority` は順序や注釈をそのまま維持します。`?` を数値へ置換せず、パラメーターの並びを推測でソートしません。
- 2026-09-07 の管理者確認に従い、既存の読み込み順は基本的に検証済みの成果として扱います。移行エージェントが再実測していないことだけを理由に `unverified` へ降格しません。既知の値には `maintainer_report` を記録し、`?` は引き続き不明として残します。
- `default.display` への変換で、具体的な文字列・計算規則を抽象的な説明へ置き換えないでください。Helper.Name の `"<ヘルパーを呼び出したキャラ名>"'s helper` のような書式も情報そのものです。CNS の有効な固定値ではないため行はコメントにしますが、具体的な文字列は保持します。

## 公開する情報と内部記録（2026-09-07 採用）

検証状態と公開可否は別の軸です。検証が済んでも、制作に役立たない確認過程・棄却した仮説・重複した知見は内部記録として保持できます。

- `notes.kind: research` は検証状態にかかわらず HTML へ出力しません。`visibility: public` との組み合わせは入力エラーです。
- それ以外の注記も `visibility: internal` で HTML への出力を抑止できます。公開する通常の注記は `visibility` 省略または `public` とします。
- `evidence` / `load_priority_evidence` はすべて JSON 内の記録です。確認済み・未検証などの表示、根拠の折りたたみ、根拠への個別リンクは生成しません。既存の「引用記事」一覧は残します。
- 非公開にした注記に `legacy_index` がある場合、対応する旧 `version` も公開表示へ復活させません。新旧の両方を原本に残します。
- ページ全体の注記と、パラメーター内の注記に同じ規則を適用します。
- 確認できた研究結果を掲載するときは、制作上の結論を `behavior` / `bug` 等の公開用注記として編集します。調査過程は `research` または `visibility: internal` の別記録で保持できます。`evidence.status` の変更だけでは自動公開しません。

```json
{
  "kind": "research",
  "content": "確認手順と結果。公開本文には不要な内部記録。",
  "evidence": {
    "status": "confirmed",
    "basis": ["maintainer_report"],
    "comment": "管理者による確認。"
  }
}
```

ドキュメントの表示調整は `src/styles/mugen-document.css` と表示コンポーネントで行います。`.mugen-document` / `.mugen-doc-page` に限定し、ブランドのヘッダー・配色やドキュメント以外のページを変更しません。

## 制約の意味

`one_of` は列挙したものの一つ以上が必要、`mutually_exclusive` は同時に指定できない、という別の制約です。JSON Schema の `oneOf` とは別概念です。両方あるときに「ちょうど一つ」を表します。

制約の `parameters` は同じ文書の実在するパラメーター表記を参照し、旧データの `; fv` 等も保持します。現段階は仕様の構造・参照・表示の検証であり、ユーザーの CNS を評価する Linter の実装ではありません。

## 検証コマンド

```text
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
```

`npm run mugen:baseline` は初回固定用で、既存の比較基準を上書きしません。基準の更新を通常テストの一部にはしません。

`npm run mugen:inventory` は原本を書き換えず、全件の移行状態・未分類履歴・未確認情報・既存の未表示フィールドを `artifacts/mugen/inventory.json` / `.md` に出力します。レポートは生成物のため Git 管理外です。

`mugen-template-all.json` は従来形式の空テンプレートとして維持します。v2 の実例は `src/content/state-controllers/Helper.json` と `src/content/triggers/Cond.json` を参照してください。新しい必須条件を空の旧テンプレートへ一律に持ち込みません。
