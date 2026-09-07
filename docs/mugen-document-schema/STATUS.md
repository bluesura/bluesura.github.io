# 移行状況

更新日: 2026-09-07

作業ブランチ: `codex/mugen-schema-v2-migration`

段階0〜4の基盤実装、主要11件・補助5件に加え、最初の小分け移行4件への v2 任意構造の追加が完了しました。累計20件です。旧フィールドは削除していません。全体の移行および MUGEN の実機検証が完了したという意味ではありません。

| 段階 | 状態 |
| --- | --- |
| 原本保存 | `2e12ca38` に配置済み資料を保存 |
| 比較基準 | 初回24ページ・共通2項目・261 URL・全258原本のハッシュを固定。追加4ページは別の比較基準へ保存 |
| 追加型スキーマ・レジストリ | 実装済み。旧258 JSON と新しい任意フィールドを検証 |
| 共通処理・表示 | 実装済み。research / internal / evidence は JSON のみ。表・見出し・コード配色の表示調整を承認済み |
| Helper・主要／補助対象 | 全16件に任意構造を追加、旧情報の保存を検証 |
| 全体展開 | 最初の4件を実施。対象指定・dry-run・再実行保護を追加。対象内の残り214件 |
| statetype・Lifebar | 5件・19件は今回のスキーマ移行対象外 |
| 旧フィールド廃止 | 対象外 |

## 実装対象

- State Controller 13件: Helper、HitDef、VarSet、HitBy、Explod、Zoom、TagIn、TagOut、TargetLifeAdd、PosAdd、PosSet、VelAdd、VelSet
- Trigger 7件: MoveContact、AnimElem、IfElse、Cond、AILevel、StandBy、Const
- `src/lib/mugen/` に共有処理を配置。非本番のレジストリ案は `docs/mugen-document-schema/examples/`、採用したレジストリは `src/data/engine-versions.json`
- 旧形式と v2 を併読し、未対応の履歴・引数も表示。共通2項目は詳細・コピペ欄・読み込み順・State 一覧で同じ有効定義を使用

## 検証

- `npm run mugen:validate`: 258 JSON、共通パラメーター、バージョン参照を検証
- `npm run mugen:test`: 22件。モデル、元フィールド保存、対象外原本の不変性、新しい出典のローカルファイル・アンカー、dry-run・一括事前検証・再実行保護を検証
- `npm run build`: 263ページを生成
- `npm run mugen:check-html`: 261 URL、初回24ページ・追加4ページ・一覧 等3ページ。公開本文・履歴・セクション・出典・画像参照の保存、内部記録の非表示、共通項目と CNS コピペ出力を検証
- ブラウザ: デスクトップと幅390pxで Helper／Explod／Cond を確認。Helper のコピー結果28行を確認し、継承項目がコメント、共通2項目が含まれることを確認。履歴のモバイル表示で見つかった重なりを修正
- 追加バッチのブラウザ: PosAdd / PosSet / VelAdd / VelSet の省略時表示、内部注記の非表示、PosSet の実コピー結果7行、VelSet の幅390pxの表示を確認
- GitHub Actions に Node.js 20 / Ubuntu の検証を追加。`master` へのマージや公開用デプロイは行わない構成

## 残る調査と次の作業

`npm run mugen:inventory` で全件を再集計できます。現在、対象内の旧形式214件に未対応履歴303項目があります。また、28ページに現在の表示コンポーネントが使っていない旧フィールドがあります。未表示情報も原本に保持しています。内部注記は14件です。

最初の小分け移行 `axis-motion-01` は [BATCH_MIGRATION.md](BATCH_MIGRATION.md) に記録しています。PosSet の座標基準、PosAdd の数値範囲、VelAdd / VelSet の「乗算」「ターゲット」という旧説明を保留しています。次は原文を残して本文を訂正する手順を整え、関連グループごとの移行を続けます。全件の履歴を機械的に変更履歴へ置き換えることはしません。

未確認仕様、資料間の相違、既存の表示不具合、およびフィールドの対応表は [MIGRATION_LEDGER.md](MIGRATION_LEDGER.md) を参照してください。入力規則と新旧の優先順位は [ADOPTION.md](ADOPTION.md) に記録しています。
