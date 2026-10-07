# 移行状況

更新日: 2026-10-08

作業ブランチ: `codex/mugen-schema-v2-migration`

段階0〜4の基盤実装、主要11件・補助5件に加え、小分け移行204件への v2 任意構造の追加が完了しました。累計220件です。旧フィールドは削除していません。全体の移行および MUGEN の実機検証が完了したという意味ではありません。

| 段階 | 状態 |
| --- | --- |
| 原本保存 | `2e12ca38` に配置済み資料を保存 |
| 比較基準 | 初回24ページ・共通2項目・261 URL・全258原本のハッシュを固定。追加204ページは別の比較基準へ保存 |
| 追加型スキーマ・レジストリ | 実装済み。旧258 JSON と新しい任意フィールドを検証 |
| 共通処理・表示 | 実装済み。research / internal / evidence は JSON のみ。表・見出し・コード配色の表示調整を承認済み |
| 原文を保持する説明訂正 | `documentation` と `parameter[].documentation` を実装。本文・公開カテゴリ・パラメーター表示を原文非破壊で訂正 |
| Helper・主要／補助対象 | 全16件に任意構造を追加、旧情報の保存を検証 |
| 全体展開 | 76バッチ204件を実施。対象指定・dry-run・再実行保護を追加。対象内の残り14件 |
| statetype・Lifebar | 5件・19件は今回のスキーマ移行対象外 |
| 旧フィールド廃止 | 対象外 |

## 実装対象

- State Controller 87件: Helper、HitDef、VarSet、HitBy、Explod、Zoom、TagIn、TagOut、TargetLifeAdd、PosAdd、PosSet、VelAdd、VelSet、VelMul、PosFreeze、Gravity、AngleAdd、AngleMul、AngleSet、ChangeAnim、ChangeAnim2、ChangeState、SelfState、TargetState、CtrlSet、StateTypeSet、SprPriority、AttackMulSet、DefenceMulSet、PowerAdd、PowerSet、LifeAdd、LifeSet、TargetPowerAdd、TargetBind、TargetDrop、TargetFacing、BindToParent、BindToRoot、BindToTarget、TargetVelAdd、TargetVelSet、HitAdd、MoveHitReset、HitVelSet、HitFallSet、HitFallVel、HitFallDamage、HitOverRide、NotHitBy、FallEnvShake、EnvShake、AttackDist、PlayerPush、ScreenBound、Width、MakeDust、EnvColor、GameMakeAnim、Trans、ExplodBindTime、RemoveExplod、AfterImageTime、ClearClipboard、DisplayToClipboard、AppendToClipboard、Turn、Null、Pause、SuperPause、PlaySnd、StopSnd、SndPan、PalFX、AllPalFX、BGPalFX、RemapPal、AfterImage、AngleDraw、Offset、AssertSpecial、DestroySelf、VarAdd、ParentVarSet、ParentVarAdd、VarRandom、VarRangeSet
- Trigger 133件: MoveContact、AnimElem、IfElse、Cond、AILevel、StandBy、Const、Acos、Asin、Atan、PI、Sin、Cos、Tan、E、Exp、Ln、Log、Abs、Ceil、Floor、Random、GameTime、Time、TimeMod、AnimTime、AnimElemNo、AnimElemTime、Anim、AnimExist、SelfAnimExist、Var、FVar、SysVar、SysFVar、Life、LifeMax、Power、PowerMax、Alive、Ctrl、StateNo、PrevStateNo、StateType、MoveType、Facing、P2StateNo、P2StateType、P2MoveType、P2Life、NumEnemy、NumPartner、RoundState、RoundNo、RoundsExisted、ID、IsHelper、PlayerIDExist、NumHelper、NumTarget、NumExplod、NumProj、NumProjID、ProjContact、ProjHit、ProjGuarded、ProjContactTime、ProjHitTime、ProjGuardedTime、ProjCancelTime、MoveHit、MoveGuarded、MoveReversed、HitCount、UniqHitCount、HitPauseTime、HitShakeOver、HitOver、HitFall、HitVelX、HitVelY、CanRecover、InGuardDist、VelX、VelY、PosX、PosY、ScreenPosX、ScreenPosY、CameraPosX、CameraPosY、GameWidth、GameHeight、ScreenWidth、ScreenHeight、CameraZoom、LeftEdge、RightEdge、TopEdge、BottomEdge、FrontEdge、BackEdge、FrontEdgeDist、BackEdgeDist、FrontEdgeBodyDist、BackEdgeBodyDist、P2DistX、P2DistY、P2BodyDistX、P2BodyDistY、ParentDistX、ParentDistY、RootDistX、RootDistY、TeamMode、TeamSide、IsHomeTeam、MatchNo、MatchOver、Win、WinKO、WinTime、WinPerfect、Lose、LoseKO、LoseTime、DrawGame、Name、AuthorName、P1Name、P2Name、P3Name、P4Name
- `src/lib/mugen/` に共有処理を配置。非本番のレジストリ案は `docs/mugen-document-schema/examples/`、採用したレジストリは `src/data/engine-versions.json`
- 旧形式と v2 を併読し、未対応の履歴・引数も表示。共通2項目は詳細・コピペ欄・読み込み順・State 一覧で同じ有効定義を使用

## 検証

- `npm run mugen:validate`: 258 JSON、共通パラメーター、バージョン参照を検証
- `npm run mugen:test`: 357件。モデル、元フィールド保存、対象外原本の不変性、新しい出典のローカルファイル・アンカー、dry-run・一括事前検証・再実行保護を検証。公開文・公開カテゴリ・型・必須／任意分類の優先順位、概要・内部の資料差、旧メタ項目・候補表・画像・内部出典の公開除外、コード例・Q&A の公開制御、CNS 出力、環境別の必須・任意分類、内部パラメーターの非表示とアンカー保存も検証
- `npm run build`: 263ページを生成
- `npm run mugen:check-html`: 261 URL、初回24ページ・追加204ページ・一覧 等3ページ。公開本文・メタ情報・履歴・セクション・出典・画像参照・コード例内 iframe の保存、内部記録・内部メタ項目・内部画像・内部コード例・内部 Q&A・内部出典の非表示、共通項目と CNS コピペ出力を検証
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
- projectile-events-01 のブラウザ: ProjContactを通常幅、ProjHitの引数表とProjGuardedのコード例を幅390pxで確認。接尾辞・0始まりの時間比較と内部研究の非表示を確認し、表示幅をリセット・検査用タブを終了
- projectile-times-01 のブラウザ: ProjContactTime/ProjHitTimeを通常幅、ProjGuardedTimeの引数表とProjCancelTimeのWinMUGENバグ注記を幅390pxで確認。整数時間・0/-1と内部研究の非表示を確認し、表示幅をリセット・検査用タブを終了
- move-results-01 のブラウザ: MoveHitを通常幅、MoveGuardedのコード例とMoveReversedの判定側/継承注記を幅390pxで確認。MoveContactの共有図の非表示も確認し、表示幅をリセット・検査用タブを終了
- hit-count-pause-01 のブラウザ: HitCountを通常幅、UniqHitCountの半開区間例とHitPauseTimeの履歴/仕様を幅390pxで確認。内部研究・IKEMEN履歴の非表示を確認し、表示幅をリセット・検査用タブを終了
- gethit-status-01 のブラウザ: HitShakeOverを通常幅、HitOverの負数境界/条件例とHitFallの被弾条件例を幅390pxで確認。内部研究・旧移行例・別エンジン履歴の非表示を確認し、表示幅をリセット・検査用タブを終了
- hit-recovery-guard-01 のブラウザ: HitVelXの軸指定表を通常幅、HitVelYの表/例・CanRecoverのCommon例・InGuardDistの仕様を幅390pxで確認。符号研究・旧AI例・未確認Win履歴の非表示と関連リンクを確認し、表示幅をリセット・検査用タブを終了
- velocity-position-01 のブラウザ: VelXの軸指定表を通常幅、PosXの1.1基準式・PosYの0を含む例・VelYの軸表と境界を390pxで確認。旧丸め助言/座標図/研究の非表示を確認し、表示幅をリセット・検査用タブを終了
- screen-camera-01 のブラウザ: ScreenPosXの1.0/固定幅例を通常幅、ScreenPosYのRC3履歴・CameraPosXの軸表・CameraPosYの位置例を390pxで確認。内部図/IKEMEN/研究の非表示を確認し、表示幅をリセット・検査用タブを終了
- size-zoom-01 のブラウザ: GameWidthのRC4履歴を通常幅、ScreenHeightのText/Params例・ScreenWidthのローカル単位の配置例・CameraZoomの概要・GameHeightの1.0条件例を390pxで確認。内部図/研究/別エンジン記録の非表示を確認し、表示幅をリセット・検査用タブを終了
- screen-edges-01 のブラウザ: LeftEdgeの基準/公式例を通常幅、RightEdgeのコード欄・TopEdgeの仕様/FAQ・BottomEdgeの条件例を390pxで確認。内部図/研究/旧px・破棄例の非表示を確認し、表示幅をリセット・検査用タブを終了
- facing-edges-01 のブラウザ: BackEdgeの概要・関連リンクを通常幅、FrontEdge/BackEdgeの厳密比較と端上を含む条件例を390pxで確認。訂正したCameraPosXへの遷移、内部図/旧FAQ/IKEMEN研究の非表示を確認し、表示幅をリセット・検査用タブを終了
- edge-distances-01 のブラウザ: FrontEdgeDistの概要を通常幅、FrontEdgeBodyDistの仕様/幅バー説明・BackEdgeBodyDist/BackEdgeDistのコード例を390pxで確認。負数を含む閾値と0以上の範囲、横スクロールするCNS欄、内部情報の非表示を確認し、表示幅をリセット・検査用タブを終了
- opponent-distances-01 のブラウザ: P2DistXの概要を通常幅、P2BodyDistXの必須軸指定表・幅基準の説明、P2DistY/P2BodyDistYの境界例を390pxで確認。4件の公開文と内部研究/図/旧例の非表示を確認し、表示幅をリセット・検査用タブを終了
- helper-distances-01 のブラウザ: ParentDistXの概要を通常幅、RootDistXの必須軸表、ParentDistYの0/-12/12境界例、RootDistYの世代別エラーを390pxで確認。4件の公開文・親子階層と内部研究/図/旧例/別エンジン記録の非表示を確認し、表示幅をリセット・検査用タブを終了
- team-affiliation-01 のブラウザ: TeamModeの概要を通常幅、必須演算子/モード表とRC履歴、TeamSideの既存VarSet/IfElse例、IsHomeTeamの短い条件例を390pxで確認。3件の訂正Q&A・内部研究/旧例/別エンジン記録の非表示を確認し、表示幅をリセット・検査用タブを終了
- match-progress-01 のブラウザ: MatchNoの番号/continue説明を通常幅、番号の条件例とMatchOverの1.0/1.1仕様/公開例を390pxで確認。内部図/旧例/研究/別エンジン記録の非表示を確認し、表示幅をリセット・検査用タブを終了
- round-win-01 のブラウザ: Winを通常幅、WinKOの否定/Win併用例・WinTimeの概要・WinPerfectの訂正Q&A/KO併用例を390pxで確認。内部図/旧フラグ例/研究/運用注意の非表示を確認し、表示幅をリセット・検査用タブを終了
- round-loss-draw-01: 生成HTMLで4件の公開文/条件例と内部図/旧フラグ例/研究の非表示を検査。ブラウザ目視は未完了。前回は利用上限による自動承認レビュー拒否、2026-10-07再開時は開発サーバー停止による接続エラー後、エラーページの操作がURLポリシーで拒否されたため。開発サーバーは4322で再起動済み
- name-comparisons-01: 生成HTMLで必須演算子/引用文字列の引数表、公開比較例、AuthorNameのRC4仕様と内部図/旧Var=0例/研究の非表示を確認。前段のブラウザURLポリシー拒否が未解消のため、今回の通常/390px目視確認は未実施
- player-names-01: P1Nameを通常幅、P2Nameの必須引数表・P3Name/P4Nameの存在確認例を390pxで確認。訂正文と内部研究/旧例/図の非表示を確認し、表示幅をリセット・検査タブを終了。前段のブラウザ拒否以後の再開確認が完了
- GitHub Actions に Node.js 20 / Ubuntu の検証を追加。`master` へのマージや公開用デプロイは行わない構成

## 残る調査と次の作業

`npm run mugen:inventory` で全件を再集計できます。現在、対象内の旧形式14件に未対応履歴92項目があります。また、29ページに現在の表示コンポーネントが使っていないフィールドがあります。旧項目に加え、今回追加したCanRecoverのQ&A出典rもJSONで保持しています。内部注記は636件です。

小分け移行の記録は [BATCH_MIGRATION.md](BATCH_MIGRATION.md) にあります。StateType・MoveType・Facingまで実施しました。StateType/MoveTypeの文字比較・0/1の結果と、Facingの1/-1の参照を分離しています。Lの列挙漏れと旧Trigger表記は原位置・内部へ保持し、Uの継承指定とPhysics、MoveType=Iの意味を整理しました。P2StateNo・P2StateType・P2MoveTypeまで移行し、相手不在のbottomと通常の不一致0を分け、対象選択の研究と無関係・空欄の旧例を内部へ保存しました。P2Life・NumEnemy・NumPartnerまで移行し、人数とチームモードを分離しました。P2Life不在時の値・特殊ヘルパー・消滅条件・ID順による番号推定はJSONへ保持しています。RoundState・RoundNo・RoundsExistedまで移行し、進行状態・試合全体の番号・プレイヤーの出場履歴を分離しました。旧監視図・初期化例・別エンジンの変更履歴は内部へ保持しています。ID・IsHelper・PlayerIDExistまで移行し、一意IDとHelperの指定IDを分離しました。誤記を含む旧例とフリーズ回避策は内部へ保存し、公開例は存在確認と参照を分けています。NumHelper・NumTarget・NumExplodまで移行し、IDの意味と全数指定の境界を分けました。旧原文と公式NumTargetの例の表記差、所有範囲や上限の研究を内部へ保存しています。NumProj・NumProjIDまで移行し、総数と必須ProjIDの個数、負数の0扱い、Helper生成時のRoot所有を分離しました。ProjContact・ProjHit・ProjGuardedまで移行し、ID接尾辞・旧式の真偽条件と0始まりの時間比較を構造化しました。括弧付き旧例・相殺や反対イベントのリセット報告・資料の差は内部へ残しました。ProjContactTime・ProjHitTime・ProjGuardedTime・ProjCancelTimeまで移行し、最後の接触記録、必須ID式と負数の0扱い、0始まりの計測と-1除外を整理しました。公式の直後=1例や名前の差は内部へ、相殺IDのバグはWinMUGENの報告として分けています。MoveHit・MoveGuarded・MoveReversedまで移行し、ヒット/ガードと当て身された側、停止中のカウンターとStateDef継承を分けました。公式の他3つ0という例の差、DOS/Win境界、別エンジン報告や同時処理は内部に保持し、共有図はMoveContactを含む4件で内部へ保存しました。HitCount・UniqHitCount・HitPauseTimeまで移行し、ステートのヒット回数と画面コンボ数、同時命中の加算を分離しました。6未満の範囲例と停止中に評価されない条件を訂正し、RC1修正と旧キャラの互換補正を整理しています。HitShakeOver・HitOver・HitFallまで移行し、揺れ終了・のけぞり満了・fallフラグを分離しました。HitTime=0という旧説明と資料の負数境界、被弾以外で未定義のHitFall、旧5010移行例と別エンジン履歴は内部へ保持しています。HitVel X/Y・CanRecover・InGuardDistまで移行し、被弾速度と現在速度、受身の許可とCommon遷移条件、ガード認識距離とガード成立を分離しました。HitVelの符号資料差と旧Win/DOS導入記録は内部へ残し、Common例は固定コミットの1.0ファイルと照合しています。Vel X/Y・Pos X/Yまで移行し、向き基準の速度と画面/地面基準の座標、0を含む境界を分離しました。旧左右逆転と一律の整数化助言を原文に残し、座標図と処理順研究は内部へ保持。ScreenPos X/Y・CameraPos X/Yまで移行し、画面左上とカメラの基準位置、位置と移動方向を分離しました。RC2/RC3修正をビルドに対応付け、旧Round案内・別エンジン履歴・座標図を内部へ。GameWidth/Height・ScreenWidth/Height・CameraZoomまで移行し、実行者のローカル座標単位と世代、ズームの有無を分離しました。Game寸法のRC4追加を対応付け、旧ピクセル説明・誤ったデバッグ指定・資料内の換算式の矛盾は内部へ保持。LeftEdge・RightEdge・TopEdge・BottomEdgeまで移行し、端そのものの座標と距離、ステージ境界、画像全体の判定を分離しました。旧px/裸の代入/破棄例・一律ズーム変動と図、公式RightEdgeの転記差は内部へ保持。FrontEdge・BackEdgeまで移行し、Facingによる端選択・片側の厳密比較と端上を含む比較、座標と距離を分離しました。旧画面内/背面側画面外のラベル・px FAQ・IKEMEN互換研究・図は内部へ保持。関連トリガーの公開配列を原文非破壊で訂正できる構造を追加し、BackEdgeのCameraPosリンクをCameraPosXへ修正しました。FrontEdgeDist・BackEdgeDist・FrontEdgeBodyDist・BackEdgeBodyDistまで移行し、基準軸と対画面端幅バー端・座標と距離・閾値と非負範囲を分離しました。旧px/黄色playerバー/[Size]との混同・例・FAQ出典・図を保持し、公式floatとCHAOSのInt/切り捨て報告、StateType別のWin/1.0研究、別エンジン引用は内部へ。P2Dist X/Y・P2BodyDist X/Yまで移行し、基準軸間と幅基準のX距離、両者のY軸の高さの差、負数を含む閾値と下限のある範囲を分離しました。旧本文・図・例・引用と履歴は保持し、X精度/Width処理の資料差・P2不在時の値・別エンジン報告は内部へ。ParentDist X/Y・RootDist X/Yまで移行し、Helper専用・直接の親と本体・実行者Facing・基準軸の距離と高さ、通常0と1.0/1.1の不在時bottomを分離しました。旧SFalse/bottom記録・RootDist節のParentDist表記・X精度の研究・図・例・別エンジンを内部へ保持。TeamMode・TeamSide・IsHomeTeamまで移行し、評価対象のチーム形式・所属側1/2・ホーム扱い1/0を分離しました。RC4の解析修正とRC5の評価修正をビルドに対応付け、旧1対1/左右案内・前提不足なイントロ例・Win引用符/!=研究と別エンジン記録を内部へ保持。MatchNo・MatchOverまで移行し、試合番号/ラウンド番号と試合決着/ラウンド結果を分離しました。コンティニューの旧本文と公式の衝突・DOS/Winのタイミング研究・前提不足なゲージ/PreOver/PalFX例・GO履歴を内部へ保持。Win・WinKO・WinTime・WinPerfectまで移行し、ラウンド勝利・終了理由・パーフェクト扱いを分離しました。旧PreOver/1回フラグ例・勝利ポーズの一般推奨・回復と履歴の資料差・共有図を内部へ保持。Lose・LoseKO・LoseTime・DrawGameまで移行し、ラウンド敗北・理由・引き分けと試合決着を分離しました。旧1回フラグ例・共有図・Draw/DrawGame表記差・結果再判定と引き分け上限の研究を内部へ保持。Name・AuthorNameまで移行し、引用文字列/比較節と整数結果、内部名/表示名/作者名、不在時bottomを分離しました。AuthorNameのRC4修正を対応付け、Win向け!=/空文字研究・文字コード・旧Var=0例・図を内部へ保持。P1Name・P2Name・P3Name・P4Nameまで移行し、相手とパートナーの関係、不在時の直接比較0/1とリダイレクト不在bottomを分離しました。旧対象の誤説・前提不足の例・図・選択順研究を内部へ保持。次はPalNo・TicksPerSecondを照合します。

未確認仕様、資料間の相違、既存の表示不具合、およびフィールドの対応表は [MIGRATION_LEDGER.md](MIGRATION_LEDGER.md) を参照してください。入力規則と新旧の優先順位は [ADOPTION.md](ADOPTION.md) に記録しています。
