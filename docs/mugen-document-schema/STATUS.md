# 移行状況

更新日: 2026-10-05

作業ブランチ: `codex/mugen-schema-v2-migration`

段階0〜4の基盤実装、主要11件・補助5件に加え、小分け移行134件への v2 任意構造の追加が完了しました。累計150件です。旧フィールドは削除していません。全体の移行および MUGEN の実機検証が完了したという意味ではありません。

| 段階 | 状態 |
| --- | --- |
| 原本保存 | `2e12ca38` に配置済み資料を保存 |
| 比較基準 | 初回24ページ・共通2項目・261 URL・全258原本のハッシュを固定。追加134ページは別の比較基準へ保存 |
| 追加型スキーマ・レジストリ | 実装済み。旧258 JSON と新しい任意フィールドを検証 |
| 共通処理・表示 | 実装済み。research / internal / evidence は JSON のみ。表・見出し・コード配色の表示調整を承認済み |
| 原文を保持する説明訂正 | `documentation` と `parameter[].documentation` を実装。本文・公開カテゴリ・パラメーター表示を原文非破壊で訂正 |
| Helper・主要／補助対象 | 全16件に任意構造を追加、旧情報の保存を検証 |
| 全体展開 | 56バッチ134件を実施。対象指定・dry-run・再実行保護を追加。対象内の残り84件 |
| statetype・Lifebar | 5件・19件は今回のスキーマ移行対象外 |
| 旧フィールド廃止 | 対象外 |

## 実装対象

- State Controller 87件: Helper、HitDef、VarSet、HitBy、Explod、Zoom、TagIn、TagOut、TargetLifeAdd、PosAdd、PosSet、VelAdd、VelSet、VelMul、PosFreeze、Gravity、AngleAdd、AngleMul、AngleSet、ChangeAnim、ChangeAnim2、ChangeState、SelfState、TargetState、CtrlSet、StateTypeSet、SprPriority、AttackMulSet、DefenceMulSet、PowerAdd、PowerSet、LifeAdd、LifeSet、TargetPowerAdd、TargetBind、TargetDrop、TargetFacing、BindToParent、BindToRoot、BindToTarget、TargetVelAdd、TargetVelSet、HitAdd、MoveHitReset、HitVelSet、HitFallSet、HitFallVel、HitFallDamage、HitOverRide、NotHitBy、FallEnvShake、EnvShake、AttackDist、PlayerPush、ScreenBound、Width、MakeDust、EnvColor、GameMakeAnim、Trans、ExplodBindTime、RemoveExplod、AfterImageTime、ClearClipboard、DisplayToClipboard、AppendToClipboard、Turn、Null、Pause、SuperPause、PlaySnd、StopSnd、SndPan、PalFX、AllPalFX、BGPalFX、RemapPal、AfterImage、AngleDraw、Offset、AssertSpecial、DestroySelf、VarAdd、ParentVarSet、ParentVarAdd、VarRandom、VarRangeSet
- Trigger 63件: MoveContact、AnimElem、IfElse、Cond、AILevel、StandBy、Const、Acos、Asin、Atan、PI、Sin、Cos、Tan、E、Exp、Ln、Log、Abs、Ceil、Floor、Random、GameTime、Time、TimeMod、AnimTime、AnimElemNo、AnimElemTime、Anim、AnimExist、SelfAnimExist、Var、FVar、SysVar、SysFVar、Life、LifeMax、Power、PowerMax、Alive、Ctrl、StateNo、PrevStateNo、StateType、MoveType、Facing、P2StateNo、P2StateType、P2MoveType、P2Life、NumEnemy、NumPartner、RoundState、RoundNo、RoundsExisted、ID、IsHelper、PlayerIDExist、NumHelper、NumTarget、NumExplod、NumProj、NumProjID
- `src/lib/mugen/` に共有処理を配置。非本番のレジストリ案は `docs/mugen-document-schema/examples/`、採用したレジストリは `src/data/engine-versions.json`
- 旧形式と v2 を併読し、未対応の履歴・引数も表示。共通2項目は詳細・コピペ欄・読み込み順・State 一覧で同じ有効定義を使用

## 検証

- `npm run mugen:validate`: 258 JSON、共通パラメーター、バージョン参照を検証
- `npm run mugen:test`: 247件。モデル、元フィールド保存、対象外原本の不変性、新しい出典のローカルファイル・アンカー、dry-run・一括事前検証・再実行保護を検証。公開文・公開カテゴリ・型・必須／任意分類の優先順位、概要・内部の資料差、旧メタ項目・候補表・画像・内部出典の公開除外、コード例・Q&A の公開制御、CNS 出力、環境別の必須・任意分類、内部パラメーターの非表示とアンカー保存も検証
- `npm run build`: 263ページを生成
- `npm run mugen:check-html`: 261 URL、初回24ページ・追加134ページ・一覧 等3ページ。公開本文・メタ情報・履歴・セクション・出典・画像参照・コード例内 iframe の保存、内部記録・内部メタ項目・内部画像・内部コード例・内部 Q&A・内部出典の非表示、共通項目と CNS コピペ出力を検証
- ブラウザ: デスクトップと幅390pxで Helper／Explod／Cond を確認。Helper のコピー結果28行を確認し、継承項目がコメント、共通2項目が含まれることを確認。履歴のモバイル表示で見つかった重なりを修正
- 追加バッチのブラウザ: PosAdd / PosSet / VelAdd / VelSet の省略時表示、内部注記の非表示、PosSet の実コピー結果7行、VelSet の幅390pxの表示を確認
- 2026-09-08 の説明訂正: 生成 HTML の見出し・本文・State 一覧への反映と内部根拠の非表示を検査。前回最後のブラウザ操作が利用上限による自動承認レビューで拒否されたため、今回のブラウザ再確認は未実施
- resource-read-01 のブラウザ: Lifeを幅1280px、LifeMaxを通常幅、Power / PowerMaxを幅390pxで確認。公開文・構文・戻り値・コード例の表示と内部図/報告の非表示を確認。表示幅は検査後にリセット
- state-status-01 のブラウザ: PrevStateNo / Ctrl / Aliveを通常幅、StateNoを幅390pxで確認。構文・精度制限・範囲例の両端と関連リンク、内部情報の非表示を確認。表示幅は検査後にリセット
- state-attributes-01 のブラウザ: StateTypeを通常幅、MoveType / Facingを幅390pxで確認。引数表・L・UとPhysicsの分離、内部情報の非表示、Facingの左右比較を確認。既存タブの接続タイムアウトは新しい検査用タブで復旧し、検査後に表示幅をリセットして検査用タブを終了
- opponent-state-01 のブラウザ: P2StateTypeを通常幅、P2StateNo / P2MoveTypeを幅390pxで確認。比較引数・関連リンク・不在時の説明・公開例と内部情報の非表示を確認。検査後に表示幅をリセットして検査用タブを終了
- opponent-counts-01 のブラウザ: NumPartnerを通常幅、NumEnemy / P2Lifeを幅390pxで確認。整数参照・人数条件を先に置く例と内部情報の非表示を確認。検査後に表示幅をリセットして検査用タブを終了
- round-progress-01 のブラウザ: RoundStateを通常幅、RoundNo / RoundsExistedを幅390pxで確認。進行状態・番号・出場履歴、短い公開例と内部情報の非表示を確認。検査後に表示幅をリセットして検査用タブを終了
- player-identity-01 のブラウザ: IsHelperを通常幅、PlayerIDExistの必須引数表とIDのコード例を幅390pxで確認。公開文・存在確認と内部情報の非表示を確認。表示幅操作の接続タイムアウトは新しい検査用タブで復旧し、検査後に表示幅をリセット・検査用タブを終了
- owned-counts-01 のブラウザ: NumHelperの引数表を通常幅、NumTargetの存在確認/参照例とNumExplodの引数表を幅390pxで確認。所有数・ID境界と内部情報の非表示を確認し、表示幅をリセット・検査用タブを終了
- projectile-counts-01 のブラウザ: NumProjを通常幅、NumProjIDの必須引数表を幅390pxで確認。負数の0扱い・Root参照例と内部研究の非表示を確認し、表示幅をリセット・検査用タブを終了
- GitHub Actions に Node.js 20 / Ubuntu の検証を追加。`master` へのマージや公開用デプロイは行わない構成

## 残る調査と次の作業

`npm run mugen:inventory` で全件を再集計できます。現在、対象内の旧形式84件に未対応履歴161項目があります。また、28ページに現在の表示コンポーネントが使っていない旧フィールドがあります。未表示情報も原本に保持しています。内部注記は345件です。

小分け移行の記録は [BATCH_MIGRATION.md](BATCH_MIGRATION.md) にあります。StateType・MoveType・Facingまで実施しました。StateType/MoveTypeの文字比較・0/1の結果と、Facingの1/-1の参照を分離しています。Lの列挙漏れと旧Trigger表記は原位置・内部へ保持し、Uの継承指定とPhysics、MoveType=Iの意味を整理しました。P2StateNo・P2StateType・P2MoveTypeまで移行し、相手不在のbottomと通常の不一致0を分け、対象選択の研究と無関係・空欄の旧例を内部へ保存しました。P2Life・NumEnemy・NumPartnerまで移行し、人数とチームモードを分離しました。P2Life不在時の値・特殊ヘルパー・消滅条件・ID順による番号推定はJSONへ保持しています。RoundState・RoundNo・RoundsExistedまで移行し、進行状態・試合全体の番号・プレイヤーの出場履歴を分離しました。旧監視図・初期化例・別エンジンの変更履歴は内部へ保持しています。ID・IsHelper・PlayerIDExistまで移行し、一意IDとHelperの指定IDを分離しました。誤記を含む旧例とフリーズ回避策は内部へ保存し、公開例は存在確認と参照を分けています。NumHelper・NumTarget・NumExplodまで移行し、IDの意味と全数指定の境界を分けました。旧原文と公式NumTargetの例の表記差、所有範囲や上限の研究を内部へ保存しています。NumProj・NumProjIDまで移行し、総数と必須ProjIDの個数、負数の0扱い、Helper生成時のRoot所有を分離しました。次はProjContact・ProjHit・ProjGuardedを照合します。

未確認仕様、資料間の相違、既存の表示不具合、およびフィールドの対応表は [MIGRATION_LEDGER.md](MIGRATION_LEDGER.md) を参照してください。入力規則と新旧の優先順位は [ADOPTION.md](ADOPTION.md) に記録しています。
