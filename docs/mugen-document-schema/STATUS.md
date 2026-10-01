# 移行状況

更新日: 2026-10-01

作業ブランチ: `codex/mugen-schema-v2-migration`

段階0〜4の基盤実装、主要11件・補助5件に加え、小分け移行73件への v2 任意構造の追加が完了しました。累計89件です。旧フィールドは削除していません。全体の移行および MUGEN の実機検証が完了したという意味ではありません。

| 段階 | 状態 |
| --- | --- |
| 原本保存 | `2e12ca38` に配置済み資料を保存 |
| 比較基準 | 初回24ページ・共通2項目・261 URL・全258原本のハッシュを固定。追加73ページは別の比較基準へ保存 |
| 追加型スキーマ・レジストリ | 実装済み。旧258 JSON と新しい任意フィールドを検証 |
| 共通処理・表示 | 実装済み。research / internal / evidence は JSON のみ。表・見出し・コード配色の表示調整を承認済み |
| 原文を保持する説明訂正 | `documentation` と `parameter[].documentation` を実装。本文・公開カテゴリ・パラメーター表示を原文非破壊で訂正 |
| Helper・主要／補助対象 | 全16件に任意構造を追加、旧情報の保存を検証 |
| 全体展開 | 25バッチ73件を実施。対象指定・dry-run・再実行保護を追加。対象内の残り145件 |
| statetype・Lifebar | 5件・19件は今回のスキーマ移行対象外 |
| 旧フィールド廃止 | 対象外 |

## 実装対象

- State Controller 58件: Helper、HitDef、VarSet、HitBy、Explod、Zoom、TagIn、TagOut、TargetLifeAdd、PosAdd、PosSet、VelAdd、VelSet、VelMul、PosFreeze、Gravity、AngleAdd、AngleMul、AngleSet、ChangeAnim、ChangeAnim2、ChangeState、SelfState、TargetState、CtrlSet、StateTypeSet、SprPriority、AttackMulSet、DefenceMulSet、PowerAdd、PowerSet、LifeAdd、LifeSet、TargetPowerAdd、TargetBind、TargetDrop、TargetFacing、BindToParent、BindToRoot、BindToTarget、TargetVelAdd、TargetVelSet、HitAdd、MoveHitReset、HitVelSet、HitFallSet、HitFallVel、HitFallDamage、HitOverRide、NotHitBy、FallEnvShake、EnvShake、AttackDist、PlayerPush、ScreenBound、Width、MakeDust、EnvColor
- Trigger 31件: MoveContact、AnimElem、IfElse、Cond、AILevel、StandBy、Const、Acos、Asin、Atan、PI、Sin、Cos、Tan、E、Exp、Ln、Log、Abs、Ceil、Floor、Random、GameTime、Time、TimeMod、AnimTime、AnimElemNo、AnimElemTime、Anim、AnimExist、SelfAnimExist
- `src/lib/mugen/` に共有処理を配置。非本番のレジストリ案は `docs/mugen-document-schema/examples/`、採用したレジストリは `src/data/engine-versions.json`
- 旧形式と v2 を併読し、未対応の履歴・引数も表示。共通2項目は詳細・コピペ欄・読み込み順・State 一覧で同じ有効定義を使用

## 検証

- `npm run mugen:validate`: 258 JSON、共通パラメーター、バージョン参照を検証
- `npm run mugen:test`: 122件。モデル、元フィールド保存、対象外原本の不変性、新しい出典のローカルファイル・アンカー、dry-run・一括事前検証・再実行保護を検証。公開文・公開カテゴリ・必須／任意分類の優先順位、概要・内部の資料差、旧メタ項目・候補表・画像の公開除外、コード例・Q&A の公開制御、CNS 出力も検証
- `npm run build`: 263ページを生成
- `npm run mugen:check-html`: 261 URL、初回24ページ・追加73ページ・一覧 等3ページ。公開本文・メタ情報・履歴・セクション・出典・画像参照・コード例内 iframe の保存、内部記録・内部メタ項目・内部画像・内部コード例・内部 Q&A の非表示、共通項目と CNS コピペ出力を検証
- ブラウザ: デスクトップと幅390pxで Helper／Explod／Cond を確認。Helper のコピー結果28行を確認し、継承項目がコメント、共通2項目が含まれることを確認。履歴のモバイル表示で見つかった重なりを修正
- 追加バッチのブラウザ: PosAdd / PosSet / VelAdd / VelSet の省略時表示、内部注記の非表示、PosSet の実コピー結果7行、VelSet の幅390pxの表示を確認
- 2026-09-08 の説明訂正: 生成 HTML の見出し・本文・State 一覧への反映と内部根拠の非表示を検査。前回最後のブラウザ操作が利用上限による自動承認レビューで拒否されたため、今回のブラウザ再確認は未実施
- GitHub Actions に Node.js 20 / Ubuntu の検証を追加。`master` へのマージや公開用デプロイは行わない構成

## 残る調査と次の作業

`npm run mugen:inventory` で全件を再集計できます。現在、対象内の旧形式145件に未対応履歴249項目があります。また、28ページに現在の表示コンポーネントが使っていない旧フィールドがあります。未表示情報も原本に保持しています。内部注記は107件です。

小分け移行の記録は [BATCH_MIGRATION.md](BATCH_MIGRATION.md) にあります。EnvColor まで実施しました。これまでの未確認事項に加え、EnvColor の Time=-2 描画不具合・警告・詳細な描画順を内部で追跡します。次はほかの画面演出・表示制御ページを確認します。

未確認仕様、資料間の相違、既存の表示不具合、およびフィールドの対応表は [MIGRATION_LEDGER.md](MIGRATION_LEDGER.md) を参照してください。入力規則と新旧の優先順位は [ADOPTION.md](ADOPTION.md) に記録しています。
