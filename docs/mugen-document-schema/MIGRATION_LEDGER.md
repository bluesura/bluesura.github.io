# 移行台帳と次の展開条件

2026-09-06 時点。自動集計は `npm run mugen:inventory` で再生成します。`artifacts/mugen/inventory.json` は全258件の公開 URL、状態、未対応履歴、未確認項目、旧データに残る未表示フィールドを記録します。

2026-09-07 追記: 管理者の指示により `research` / `visibility: internal` と evidence は HTML に掲載せず、JSON に保持します。既存の読み込み順は基本的に検証済みとの確認を受け、既知の値の根拠を `maintainer_report` に修正しました。エージェントによる再実測とは区別し、`?` は残しています。以下の「未検証」は初回移行時の記録であり、既知の読み込み順を一律に未検証とする判断は撤回しました。

## 元情報の対応

| 元情報 | 現在の扱い | 残る作業 |
| --- | --- | --- |
| `page.version` | 原文を保持。明確な初導入が確認できたものだけ `introduced_in` にビルド ID を追加 | 一律に初導入年へ変換しない。未確認は null |
| `version` | 原文・順序・引用を保持し、`notes[].legacy_index` で対応。未対応項目も表示 | 187件・284項目の意味分類と出典確認 |
| `parameter` | 順序・別形式・全メタデータを保持 | 読み込み順を元データの並びから推測しない |
| `default_value` | 原文を保持。代表 State では `default` を追加して表示を分離 | 固定値、条件、継承、不明を個別判断 |
| `load_priority` | 全値・疑問符・補足を保存 | 数値もこの作業で実測したものではない。再現条件・出典を調査 |
| Trigger の旧 `parameter` | `arguments[].legacy_index` で旧説明・画像等を引き継ぐ | 構文・戻り値の根拠をグループ単位で調査 |
| `quote` | 原タイトル・URL を保存し、ID と確認した資料を追加 | 古いリンク切れは別途、元URLを履歴に保持して修復 |
| `sample_code` | 原本に保持。従来から専用表示なし | `code_sample` への対応と表示回復を個別に検証 |
| `code_sample` | 原本のコード・説明・画像を保持。`visibility: internal` の例だけ HTML から除外 | 非公開例は前提を直して確認できた場合に公開用コードを編集 |
| Q&A | 質問・回答・補足を原本に保持。`visibility: internal` の項目だけ HTML から除外 | 非公開項目は根拠を確認し、掲載可能な結論へ編集してから公開 |
| Lifebar | 既存専用モデルと表示を維持 | 別途代表例と移行計画を定める |

`tests/mugen/baseline/` の旧 JSON と再帰的に比較し、説明・画像・未表示情報を含む旧フィールドが消えていないことをテストします。代表セット外は全原本のハッシュも照合します（Git の改行変換だけ許容）。

## 代表データで保持した不確実性

| 対象 | 追加した主な構造 | 確認範囲と残る調査 |
| --- | --- | --- |
| Helper | 継承 default、Pos の型の variants、注記の分類・出典 | 初導入不明。PosType の地面基準について公式資料と CHAOS の差を conflicting とした。ReMapPal の根拠は1.1資料に限定 |
| HitDef | 固定値・派生・既定値なし・必須・不明の区別、履歴／警告 | 旧記述の分類。読み込み順、音、空の既定値等は unverified / unknown を保持 |
| VarSet / HitBy | 代替書式・相互排他・依存関係 | `; fv`、同名の value など旧形式を保持。代替行はコピペ欄で自動有効化しない |
| Explod | runtime と互換プロファイル別の PosType、固有 IgnoreHitPause | SuperMove の「廃止」と公式資料の「非推奨」を併記。省略と明示指定の差は未検証 |
| Zoom | 1.1 Alpha 4 に範囲を限定した制約・不具合 | Pos / Lag 等の疑問符と不完全な挙動を保持。実機再現未実施 |
| MoveContact | 世代別の戻り値の意味 | 1.0・1.1のカウンターは資料確認。DOS / WinMUGEN の旧記述は未検証 |
| AnimElem | 旧式構文、引数、戻り値、制約 | ループ・bottom は資料確認。詳細な式の解釈例は probable とし、実測とはしない |
| IfElse / Cond | 特殊評価形式、引数、戻り値、RC6 / RC7 履歴 | 評価の説明を公式資料と照合。旧代入例は未実行のため本文全体の evidence は probable |
| AILevel | 引数なし、整数、RC2追加／RC4修正 | 履歴を保存済み公式 history と照合。旧 IKEMEN 注記を MUGEN と分離 |
| TagIn / TagOut / StandBy | ページの存続、警告・引数なしの表現 | 非公式・未文書化の記録を保持。StandBy の戻り値は unknown |
| Const / TargetLifeAdd | 引数の専用構文、エンジン別の注記 | 既存情報を保持。IKEMEN GO の記述は独立したエンジン範囲 |

この作業では MUGEN を起動した実機テストは行っていません。`confirmed` / `official_document` は資料への記載確認です。資料を参照できても、例に含まれるすべての推論まで実機確認済みへ昇格させません。

レジストリは必要なビルドから採用しています。DOS / Linux 旧版、WinMUGEN 系譜、1.1 Beta 1 Patch 1 の未確認日付は null、公開日は更新履歴の日付と混同せず null に維持しました。

## 移行前から存在する表示・参照の問題

- Explod の説明 HTML にある `./media/img/PosType_Right_Explod.png` 等、一部の旧画像参照が切れています。元文字列を保持し、今回の追加フィールドによる欠落と区別しました。
- Const の旧2002.04.14資料への `#Const` は保存済み文書に一致するアンカーがありません。元URLを保持し、新しい1.0・1.1の正しい参照を追加しています。
- ローカルプレビューでは、既存の Service Worker 登録処理が `/service-worker.js` の404を報告します。今回の静的コンポーネント変更から発生したものではありません。
- ビルドの既存警告（自動 docs コレクション、404エントリー、旧HTMLの lang / Pagefind の日本語 stemming 等）は残っています。

これらの既存問題を含め、旧情報の削除で検査を通すことはしません。新しく追加した保存済み資料へのリンクはファイルとアンカーをテストします。

## 次の小分け移行

2026-09-07: 以下の初回候補4件を `axis-motion-01` として実施しました。v2 の任意構造追加は累計20件、対象内の旧形式は214件、未対応の旧履歴は303項目です。実行手順・出典・保留事項は [BATCH_MIGRATION.md](BATCH_MIGRATION.md) に記録しています。以下はバッチごとに繰り返す手順として残します。

主要11件と補助5件について、元情報の保存、構造・参照、生成結果、狭い画面、コピー操作を確認しました。全件を同じ規則で意味分類できることまでは保証しません。

1. 関連する3〜5ページを選ぶ。初回候補は `PosAdd` / `PosSet` / `VelAdd` / `VelSet`。数値・軸指定の共通点と省略時の違いを確認する。
2. 変更前 JSON・生成記事を追加の比較基準として保存する。既存24ページの基準は上書きしない。
3. 対象ファイルの明示指定、既定は dry-run、変更予定フィールド・未変換項目のレポート、上書き防止を備えた変換処理を追加する。今回の `migrate-helper.mjs` / `migrate-fixture.mjs` は原本から代表セットを一度移す専用記録で、全体用のスクリプトとして流用しない。
4. 構造だけの変換と資料調査を分け、確定できない default や履歴は旧形式で残す。literal 候補も有効範囲・必須条件を確認する。
5. 旧情報保存、対象表示、全ルート、ビルド、Linux CI を通し、小さなコミットで積み重ねる。

スキーマに収まらない例が見つかった場合は代表例へ追加し、モデルを先に修正します。旧フィールド削除、サイト全体の物理ディレクトリ移動、Lifebar の新形式化はこの小分け変換へ混ぜません。

## 2026-09-08：公開文の訂正

VelAdd / VelSet の X・Y の旧 `value` / `description` を原位置に保存したまま、任意の `documentation` で公開用のラベル・本文を訂正しました。「乗算速度」を加算する速度／設定する速度へ、「ターゲット」を実行者自身へ修正しています。旧本文・前回の内部研究・既定値・読み込み順・コピー出力は保持しています。入力規則、根拠、継続編集の手順は [EDITORIAL_GUIDE.md](EDITORIAL_GUIDE.md) を参照してください。資料間の矛盾が残る PosSet / PosAdd の調査を解消したという意味ではありません。

## 2026-09-09：axis-motion-02

VelMul / PosFreeze / Gravity の3件を追加し、累計23件・残り211件です。ルート `documentation.description` で概要を訂正し、旧本文を保存しました。Gravity と PosFreeze の旧本文が反対の説明を持つこと、CHAOS の Win版での確認記録を、両ページの非公開 `research` に `conflicting` として記録しています。ビルドや互換設定を推測せず、実機確認は未実施です。公開する基本動作・既定値、検証対象と実行手順は [BATCH_MIGRATION.md](BATCH_MIGRATION.md) に記録しています。

## 2026-09-09：drawing-angle-01

AngleAdd / AngleMul / AngleSet を追加し、累計26件・残り208件です。必須 value の省略不可、度と倍率、初期角度と省略時、AngleDraw の表示反映を分けました。旧本文・疑問符・画像・読み込み順を保持しています。AngleMul / AngleSet の CHAOS 個別ページを取得できない制約は内部記録へ残しています。実機検証は未実施です。

## 2026-09-09：inverse-trig-01

Acos / Asin / Atan / PI を追加し、累計30件・残り204件です。3関数は必須の式1個、PI は引数なしとして分け、戻り値 float、ラジアン、定義域外・bottom のエラー条件を保存済み Elecbyte 1.0 / 1.1 資料と対応させました。Atan のオフセット付き除算1例、PI の `IfElse` によるゼロ除算回避2例と一度の加減算だけで任意角を正規化するとする1例には前提不足または誤りがあるため、原本を削らず `visibility: internal` で非公開にしました。静的な式と資料の照合であり、MUGEN の実機テストではありません。

## 2026-09-09：circular-trig-01

Sin / Cos / Tan を追加し、累計33件・残り201件です。必須のラジアン式1個、戻り値 float、bottom のエラー条件を保存済み Elecbyte 1.0 / 1.1 資料へ対応させました。Sin の円運動例にある `ラディウス` と Tan の角度変換例にある `角度` は MUGEN の式として定義されていない説明用プレースホルダーです。そのまま実行できる例へ直して確認するまで、原本を削らず `visibility: internal` で非公開にしました。基本的な Sin / Cos / Tan の値を示す例は公開を維持しています。

## 2026-09-09：exponential-log-01

E / Exp / Ln / Log を追加し、累計37件・残り197件です。E は引数なし、Exp / Ln は float 式1個、Log は `base, exprn` の float 式2個として対応付けました。2002.04.14 の SFalse と1.0 / 1.1 の bottom を旧本文のまま区別しています。E / Exp の環境不明な具体的出力例と、Ln / Log の出所未確認の警告文字列は原本を削らず内部化しました。Log の底1は数学上の制約として既存説明を保持し、MUGEN の戻り値・警告は未検証として内部で追跡します。

## 2026-09-09：numeric-basic-01

Abs / Ceil / Floor を追加し、累計40件・残り194件です。3件とも整数・浮動小数点の式1個を取る関数として対応付けました。Abs は入力と同じ int / float を返し、Ceil / Floor は int を返します。2002.04.14 の SFalse と1.0 / 1.1 の bottom は旧本文のまま別の `notes` に対応させました。初導入ビルドは推測せず null を保持しています。既存の6コード例に明確な問題は見つからず、すべて公開を維持しました。

## 2026-09-09：random-time-01

Random / GameTime / Time / TimeMod を追加し、累計44件・残り190件です。前3件は引数なしで int を返し、TimeMod は比較演算子と2個の定数整数を取る旧式構文として対応付けました。TimeMod の除数0は2002.04.14の SFalse と1.0 / 1.1の bottom を分けています。Random の参照ごとに値が変わることを前提にした既存例は、保存資料に更新単位の説明がなく実行記録もないため、原本を保持して内部化しました。初導入ビルドは推測せず null を保持しています。

## 2026-09-10：animation-time-01

AnimTime / AnimElemNo / AnimElemTime を追加し、累計47件・残り187件です。3件とも int を返し、AnimTime は引数なし、残り2件は整数式1個を取ります。AnimElemNo / AnimElemTime の2002.04.14における SFalse と1.0 / 1.1における bottom を分け、AnimElemTime の有限ループに関する制約も公開注記へ追加しました。3ページの空コード例は要素を保持して内部化しています。AnimTime の時間-1に関する旧説明は実行記録がなく公式資料でも確認できないため原文を保持して非公開とし、確認済みの基本説明を公開しています。

## 2026-09-10：animation-identity-01

Anim / AnimExist / SelfAnimExist を追加し、累計50件・残り184件です。Anim は引数なし、存在判定2件は整数式1個を取り、いずれも int を返します。AnimExist の旧履歴と Q&A は、成功した攻撃によるカスタムステート中に攻撃側データを確認すると断定していましたが、保存済み公式資料は結果を未定義としています。原文は削除せず内部化し、公開文には未定義条件と SelfAnimExist の使用を記載しました。Q&A にも `visibility: internal` を実装し、既存の質問・回答・補足を JSON に保持したまま非表示にできます。AnimExist の未完成コード例と SelfAnimExist の空コード例も内部化しています。

## 2026-09-29：animation-change-01

ChangeAnim / ChangeAnim2 を追加し、累計52件・残り182件です。必須の value、任意の Elem、式入力、管理者確認済みの読み込み順を構造化しました。ChangeAnim2 の公開説明は、P2 をカスタムステートへ置いて P1 の AIR にあるアニメーションへ変更するという公式記載へ合わせています。既存の Elem=1 は保持していますが、今回確認した公式コントローラー資料には省略時の明記がないため確認済みの `default` へは移していません。負の Elem 警告、存在しないアニメ番号のエラー、断片的なクラッシュ文は原文を各 `version` に残し、再現条件が揃うまで非公開 `research` として対応付けました。

## 2026-09-30：state-transition-01

ChangeState / SelfState / TargetState を追加し、累計55件・残り179件です。実行者・自身のステートデータ・ターゲットという遷移対象を区別し、必須 value、任意 Ctrl / Anim、TargetState の ID=-1、管理者確認済みの読み込み順を構造化しました。TargetState の ID を指定できないとする旧説明は原本に保持し、保存済み公式資料に基づく公開文へ訂正しています。負数警告、ChangeState の旧上限、HitPause や復帰・simul 等の旧補足は実行条件が不足しているため内部 `research` にしました。旧 JSON の未検証メタ項目を削除せず公開だけ止める `parameter[].documentation.hide_legacy` を追加し、ChangeState の旧 max_value と ChangeState / SelfState の旧 Ctrl 既定値を HTML と CNS コピペ欄から除外しました。

## 2026-09-30：state-control-01

CtrlSet / StateTypeSet / SprPriority を追加し、累計58件・残り176件です。CtrlSet の必須フラグと0/非0、StateTypeSet の3種の固定トークンと省略時の維持、SprPriority の必須値・範囲 -5〜5・描画順を保存済み公式資料へ対応させました。CtrlSet の旧制作補足と StateTypeSet の U 明示指定・摩擦・重力・自動着地の詳細は原本と内部 `research` に保持しています。`documentation.hide_legacy` を `possible_value` にも適用できるようにし、StateTypeSet の未検証な旧候補表を公開HTMLから外しました。旧表内の画像は比較器が内部保存を確認します。StateTypeSet の読み込み順 `?` は推測していません。

## 2026-09-30：combat-power-01

AttackMulSet / DefenceMulSet / PowerAdd / PowerSet を追加し、累計62件・残り172件です。4件の必須 value と基本動作を保存済み公式資料へ対応させました。DefenceMulSet は2002.04.14の逆数説明と1.0 / 1.1の直接倍率説明を統合せず、`conflicting` の内部 `research` に両方を保持しています。AttackMulSet の効果時間・特殊値・攻撃主体別適用、Power 系の32-bit値域・ゲージ端処理・RoundState 条件も原本を削除せず非公開にしました。PowerAdd / PowerSet の完全なコード例と既存図は公開を維持しています。

## 2026-09-30：life-power-01

LifeAdd / LifeSet / TargetPowerAdd を追加し、累計65件・残り169件です。LifeAdd の Value / Absolute / Kill、LifeSet の Value、TargetPowerAdd の value / ID と既定値を保存済み公式資料へ対応させました。ライフ操作の RoundState 固定化、Win/Lose 順序、IKEMEN GO の競合、TargetPowerAdd の RoundState 3 / 4 記録は内部 `research` に保持しています。未検証情報を含むライフ図と LifeSet Q&A も JSON から削除せず非公開にするため、`images[].visibility` を実装しました。

## 2026-10-01：target-control-01

TargetBind / TargetDrop / TargetFacing を追加し、累計68件・残り166件です。対象 ID、固定時間・位置、一覧から外す条件、向きと各既定値を保存済み公式資料へ対応させました。TargetBind の「対象指定不能」と Pos 省略時 `-1025,-1025` は公式資料との衝突を内部記録へ残し、公開文を修正しています。TargetBind / TargetFacing の複数ターゲット時フリーズ、TargetBind の負数警告、速度同期も条件不足のため非公開です。TargetFacing の必須 value に付いていた旧既定値1は削除せず公開だけ止め、読み込み順 `?` は維持しました。

## 2026-10-01：bind-position-01

BindToParent / BindToRoot / BindToTarget を追加し、累計71件・残り163件です。Helper 専用の親・ルート基準、各 Time / Facing / Pos、Target の ID と基準位置を保存済み公式資料へ対応させました。BindToRoot の旧親基準説明は原本を保持して公開文だけを訂正しています。Parent / Root の Time=-1 と32-bit範囲、Target の x/y 省略値、-1025 座標、次フレーム移動、速度同期、負数警告は条件不足のため非公開です。Target Pos の読み込み順末尾 `?` も推測していません。

## 2026-10-01：target-velocity-01

TargetVelAdd / TargetVelSet を追加し、累計73件・残り161件です。加算と設定、任意 X / Y、軸を省略した場合の非変更、ID=-1 の全対象、各正方向を保存済み公式資料へ対応させました。TargetVelSet の X 正方向は公式3資料が実行者基準、旧 JSON がターゲット基準とするため、旧文を保持して公開説明だけを公式記載へ合わせ、差異を内部記録に残しています。

## 2026-10-01：hit-control-01

HitAdd / MoveHitReset / HitVelSet を追加し、累計76件・残り158件です。コンボカウンターへの必須加算、3種の接触トリガーのリセット、任意 X / Y フラグによる被弾速度設定、HitVelSet の非推奨状態を保存済み公式資料へ対応させました。HitAdd の旧値域・GetHitVar影響・残存期間、MoveHitReset の MoveReversed、HitVelSet の旧バージョン限定と制作用途は実機条件不足または公式記載との差があるため非公開です。

## 2026-10-01：hit-fall-01

HitFallSet / HitFallVel / HitFallDamage を追加し、累計79件・残り155件です。落下フラグと落下速度変数、HitDef 由来の速度反映、落下ダメージ適用を保存済み公式資料へ対応させました。HitFallSet の旧「強制移行」カテゴリも原位置へ残したまま公開表示だけを訂正できる `documentation.page_category` を追加しました。value=-2以下、XVel / YVel の未読疑義・推測既定値、3件の旧制作用途は条件不足または公式記載との差があるため非公開です。

## 2026-10-01：hit-defense-01

HitOverRide / NotHitBy を追加し、累計81件・残り153件です。HitOverRide の属性・8スロット・有効時間・ForceAir と、StateNo の2002.04.14対1.0 / 1.1の世代差を保存済み公式資料へ対応させました。NotHitBy は共有2スロット、value / value2 の排他的必須指定、Time=1を構造化しました。HitOverRide の旧警告・MoveType・スパーク／サウンド記録と、NotHitBy の旧カンマ解釈・永続時間・値域は原本を保持して非公開です。

## 2026-10-01：environment-shake-01

FallEnvShake / EnvShake を追加し、累計83件・残り151件です。FallEnvShake の発動条件と実行後の値消去、EnvShake の必須 Time、Freq / Ampl / Phase の既定値と解像度・周波数依存を保存済み公式資料へ対応させました。旧制作用途、警告、連続実行、ライフバー、波形計算、高解像度ステージ、Time 値域は原本を保持して非公開です。

## 2026-10-01：boundary-push-01

AttackDist / PlayerPush / ScreenBound / Width を追加し、累計87件・残り147件です。ガード距離、押し合い判定、画面境界とカメラ追従、前後幅と代替書式を保存済み公式資料へ対応させました。Width の旧必須分類を原位置に残し、公開表示とCNSコピーだけを任意へ訂正する `parameter[].documentation.parameter_type` を採用しました。PlayerPush の初期値、ScreenBound の2002省略値と旧ワープ記録、Width の旧制作用途・値域は内部で追跡します。

## 2026-10-01：dust-effect-01

MakeDust を追加し、累計88件・残り146件です。Pos / Pos2 / Spacing の省略値と1.0 / 1.1における非推奨を保存済み公式資料へ対応させました。旧警告・素材・効果時間の記録は原文と内部注記に保持して非公開です。

## 2026-10-01：environment-color-01

EnvColor を追加し、累計89件・残り145件です。RGB値、Timeの持続時間、Underの描画位置を保存済み公式資料へ対応させました。旧 Time=-2 不具合・警告・詳細な描画順と制作用途は原文と内部注記に保持して非公開です。

## 2026-10-01：game-animation-01

GameMakeAnim を追加し、累計90件・残り144件です。4パラメーターの省略値、X/Y独立ランダム変位、非推奨を保存済み公式資料へ対応させました。旧警告・Randomの正方形比喩・非推奨開始ビルドは内部で追跡します。

## 2026-10-02：transparency-01

Trans を追加し、累計91件・残り143件です。透過型トークンとAlphaの世代・型依存の省略値を保存済み公式資料へ対応させました。旧候補表、影と反射、1.1の負数アルファ、2002 / 1.0資料内の指定必須と省略値の不整合は原文と内部注記に保持します。

## 2026-10-02：explod-binding-01

ExplodBindTime を追加し、累計92件・残り142件です。ID=-1、Time=1/-1、value代替書式を保存済み公式資料へ対応させました。旧警告、-2以下の扱い、Time/value併記時の優先順位は内部で追跡します。

## 2026-10-02：explod-removal-01

RemoveExplod を追加し、累計93件・残り141件です。ID指定時の絞り込みと省略時の全件削除を保存済み公式資料へ対応させました。旧ID=-1定数と警告は原文と内部注記に保持し、CNSコピー欄で未確認定数を有効にしません。

## 2026-10-02：afterimage-duration-01

AfterImageTime を追加し、累計94件・残り140件です。Time必須とValue代替、TimeGap!=1時の既知のフレーム位置リセットを保存済み公式資料へ対応させました。旧時間計算・特殊値・警告・動画付き例は原文と内部注記に保持して非公開です。

## 2026-10-02：clipboard-clear-01

ClearClipboard を追加し、累計95件・残り139件です。実行者のクリップボードのテキスト消去と固有パラメーターなしを保存済み公式3世代資料へ対応させました。次の DisplayToClipboard / AppendToClipboard は書式指定・引数数・旧バージョンの危険な書式指定の記録を個別に精査します。AfterImage 本体の旧 `Alpha` / `Trans=AddAlpha` は公式3世代の AfterImage 欄に見当たらず、根拠と公開範囲が決まるまで推測で移行しません。

## 2026-10-02：clipboard-display-01

DisplayToClipboard を追加し、累計96件・残り138件です。`Text` の必須書式、`Params` の数値式と5個／6個のバージョン差を保存済み公式資料へ対応させました。旧 `%s` フリーズ、`%n` の危険性、型不一致の詳細、コード例、誤ラベルの画像は原本を保持して非公開です。内部調査だけで使う旧出典を引用一覧から除外できる `quote[].visibility` を採用しました。次は AppendToClipboard です。

## 2026-10-02：clipboard-append-01

AppendToClipboard を追加し、累計97件・残り137件です。既存クリップボードへの改行追記と DisplayToClipboard と同じ書式、5個／6個の数値式上限を保存済み公式資料へ対応させました。旧 `Params.type: string` は原位置へ残し、公開型を「数値式」に訂正する `parameter[].documentation.type` を採用しました。旧 `%s`・`%n` の記録、例、内部調査用出典は非公開です。

## 2026-10-02：parameterless-controllers-01

Turn / Null を追加し、累計99件・残り135件です。どちらも固有パラメーターを持たないことを保存済み公式3世代資料へ対応させました。Turn はアニメーションを再生せず即座に反転します。Null のトリガー評価は1.1資料に限って明記されているため、1.1系列の注記として公開しました。

## 2026-10-02：pause-time-01

Pause を追加し、累計100件・残り134件です。Timeの0許容、MoveTime / EndCmdBufTimeのTime以下、任意3項目の既定値、Pause / SuperPauseとの重複時の挙動を保存済み公式3世代資料へ対応させました。旧「Time=0で警告」は公式資料と衝突し、旧警告3件や詳細な更新停止条件とともに原本・内部注記へ保持して非公開にしています。

## 2026-10-03：superpause-time-01

SuperPause を追加し、累計101件・残り133件です。11任意項目の既定値、Pauseの任意項目の継承、Sound引数順、Posの実行者軸基準、P2DefMul=0の設定参照とPause中断を保存済み公式3世代資料へ対応させました。旧RoundState条件・警告・更新停止の詳細・固定最大値は原本と内部researchへ保持しています。UnHitTableの綴りとPowerAddの読み込み順20は変更していません。新たなスキーマ・表示機能は追加していません。

## 2026-10-03：sound-control-01

PlaySnd / StopSnd / SndPan を追加し、累計104件・残り130件です。SND識別子、再生・停止チャンネル、定位の排他指定とSndPanでの代替必須、VolumeScaleのRC8切り替えを保存済み公式3世代資料へ対応させました。RC8のビルドIDを追加し、旧VolumeとLowPriorityの省略値は[CHAOSの記録](https://w.atwiki.jp/mugencns/pages/251.html)へ対応させています。旧警告・音量の推定範囲・素材表・詳細な評価条件は原本と内部researchへ保持しました。旧チャンネル上限とコミュニティの大きい番号でも機能する記録はconflictingとし、対象ビルドの実測で未解決です。

## 2026-10-03：palette-effects-01

PalFX / AllPalFX / BGPalFX を追加し、累計107件・残り127件です。適用対象、Color→InvertAll→加算・乗算、Time=0で停止、Mulの0以上を保存済み公式3世代資料へ対応させました。AllPalFXのRC8と1.1 Beta 1の修正履歴も追加しています。反転を最後に行う旧Q&A、旧警告と効果消失条件、デバッグ文字用例は原本と内部researchに保持しました。SinAddの旧0,0,0,0は独立した根拠を確認できずunknownに保ち、CNS欄で有効にしません。丸め・飽和・画像の数値と、BGPalFXの未取得コミュニティ本文は調査が残っています。

## 2026-10-03：palette-remap-01

RemapPal を追加し、累計108件・残り126件です。Source / Destの1.0必須と1.1任意・-1,0省略値、非推移性、1.1の解除指定・8件制限を保存済み公式資料へ対応させました。環境別の必須・任意を表示する `variants[].parameter_type` を追加し、CNS欄は環境確認付きのコメント行です。旧?・必須分類・番号例・カンマを含む読み込み順は原位置に保持しました。OwnPal=1のHelper / Explodの修正は1.0 RC4へ対応させ、初導入RCや1.1の任意指定・特殊値の正確な変更ビルドは未確定の内部researchに残しています。今回の確認は資料照合であり実機検証ではありません。

## 2026-10-03：afterimage-effects-01

AfterImage を追加し、累計109件・残り125件です。標準12項目の型・省略値、保存/表示間隔、全残像共通と履歴への累積色効果を保存済み公式3世代へ対応させました。PalMulの浮動小数倍率とPalPostBrightの全残像適用を訂正しています。旧Alpha / AddAlphaの対応ビルド・省略値は未確定で、パラメーター単位のvisibilityを採用し、説明・読み込み順21,22をJSONへ保持して非公開にしました。PalBright赤の不具合の世代境界、極端値・終了計算・AfterImageMax、Q&Aと応用例も内部に保持しています。基本例・動画・画像は保持しました。旧IRC・2500loopsの本文は取得できず、実機再現も未実施です。

## 2026-10-04：angle-draw-01

AngleDrawを追加し、累計110件・残り124件です。valueの保持角度とScaleの中立倍率・同フレーム累積を公式資料とCHAOSへ対応させ、旧0・1,1・読み込み順を保持しました。CNS欄で省略した角度を0へリセットしません。HitPause中の効果非リセットはRC6の2002互換対応へ分類しています。旧HitPause2履歴、AIR指定無効化・AfterImage波及、途中Elem=-1の二重表示、Win版限定という資料差はJSON内部へ保持しました。旧kneco・luna記事の本文は取得できず、実機再現は未実施です。次はOffsetです。

## 2026-10-04：display-offset-01

Offsetを追加し、累計111件・残り123件です。描画と判定枠のずらし、Pos X/Y・押し合い判定との区別、画面基準の方向を公式資料とCHAOSへ対応させました。旧X/Y省略値の空文字・読み込み順1/2は原位置へ保持し、省略値はunknownとしてCNS欄で推測の0を有効にしません。RC6の座標系修正と2002互換HitPause挙動を分けて公開しています。自動着地・TargetStateの取消、Explod射出基準、同フレーム合成は内部記録です。実機再現は未実施で、次はAssertSpecialです。

## 2026-10-04：special-flags-01

AssertSpecialを追加し、累計112件・残り122件です。公開19フラグの対象・効果を訂正し、旧表はdocumentation.possible_valueとhide_legacyで原位置に保存しました。NoKOを非実在とは断定せず、対応ビルド・生死判定条件が未確定の内部記録へ対応させています。必須Flag/任意Flag2/3、RC6のInvisible修正と2002互換9フラグの非解除を構造化しました。旧2履歴・所有物/負ステート・描画/カウンターの詳細・ガード不能例は内部に保持し、基本表示例を公開しました。実機検証は未実施です。

## 2026-10-04：helper-destruction-01

DestroySelfを追加し、累計113件・残り121件です。Helper専用効果、1.1の子孫Helper/所有Explod消去・0省略値、バインド解除を整理しました。RC5のステート評価中断修正とビルドIDを追加しています。旧値・?・3履歴・分身対策例は原位置に保持しました。1.1の追加/不安定動作修正の正確なビルド、旧クラッシュとExplod位置ずれ、消去のタイミングは未確定の内部記録です。実機検証は未実施で、次は変数操作です。

## 2026-10-04：variable-operations-01

VarAdd / ParentVarSet / ParentVarAddを追加し、累計116件・残り118件です。書式別の必須値、整数/浮動小数の番号と値、代替書式の加算・代入、直近の親への作用を公式3世代とCHAOSへ対応させました。ParentVarSetの旧optionalと増加量ラベルは原位置に保持して公開表示だけを訂正しています。読み込み順1/2と括弧内先行の注釈は変更していません。1.1のsysvar/sysfvar非対応とBeta 1の解析クラッシュ修正を分け、対応追加とは記述していません。旧7履歴、VarAddの停止中挙動・未文書化sysvar対応、大文字・警告・型変換と書式併記の優先順位は内部に保持しました。旧警告出典とParentVarAddのCHAOS本文は今回取得できず、実機再現は未実施です。次はVarRandom・VarRangeSetです。

## 2026-10-04：variable-ranges-01

VarRandom / VarRangeSetを追加し、累計118件・残り116件です。VarRandomの指定範囲・両端・単一引数・0,1000省略値と、VarRangeSetの連続範囲・1回評価・First=0・型別Last=59/39を公式3世代へ対応させました。旧カテゴリ/説明・空欄/?の代入値・条件文の省略値と読み込み順を原位置に保持しています。旧2警告、乱数の限界/分布と無効範囲・型変換、コミュニティFValueのInt型表記差とラウンド持ち越し/F4、範囲外の部分適用・併記時の優先順位は内部に残しました。旧警告出典は503で本文取得不可、実機再現も未実施です。次は変数読み取りトリガーです。

## 2026-10-04：variable-read-01

Var / FVar / SysVar / SysFVarを追加し、累計122件・残り112件です。必須整数式N、戻り値のint/float、2002資料のSFalse・1.0/1.1のbottomと特殊形式の例外、通常変数への:=代入と型変換を照合しました。documentation.syntax/associated_stateで旧構文と関連IDを保持して公開訂正し、詳細・一覧の構文も共通化しています。SysVar/SysFVarの旧:=・未定義関連ID、2002/1.0公式Format表記差、旧共通図・更新/キャッシュ例・一部Q&A、WinMUGENビルドへの旧対応付けは内部に残しました。ParentVar系のBeta 1解析クラッシュ修正は対応追加ではありません。番号型変換・警告・持ち越し・式全体のリダイレクト代入条件は実機未検証です。次はLife/LifeMax・Power/PowerMaxです。

## 2026-10-04：resource-read-01

Life / LifeMax / Power / PowerMaxを追加し、累計126件・残り108件です。引数なし・整数戻り値、現在値と最大値の分離、LifeMaxのチームモード等での補正、整数除算と小数割合の比較を整理しました。旧図、Persistent式と減少量の丸め、キャラ固有の応用例、IKEMEN GOの旧1履歴と出典は原位置に保持して内部へ保存。Powerの共有・PowerMaxの基準キャラ・具体的補正率・導入ビルド・KO処理順は実機未検証です。今回内部注記17件を追加し累計270件、未対応旧履歴は163項目です。次はAlive・Ctrl・StateNo・PrevStateNoの状態参照です。

## 2026-10-04：state-status-01

Alive / Ctrl / StateNo / PrevStateNoを追加し、累計130件・残り104件です。引数なし・整数戻り値、Ctrlのキャンセル例外と参照/設定の分離、StateNoの両端を含む範囲と650未満の比較、PrevStateNoの構文・精度非保証を整理しました。旧関連IDと比較式は保持して公開側だけ訂正。AliveのKOタイミング・NoKO・復活/タッグ、Ctrlの自動遷移、PrevStateNoの中間くらいステート/履歴更新と公式Format誤記、前提不足の複合例/生存敵検索はJSON内部へ残しました。今回内部注記13件を追加し累計283件、未対応旧履歴は163項目です。実機検証は未実施で、次はStateType・MoveType・Facingです。

## 2026-10-04：state-attributes-01

StateType / MoveType / Facingを追加し、累計133件・残り101件です。文字指定の旧式比較と0/1の結果、Facingの1/-1と単独条件の真偽、Uの継承指定・Physicsの別設定を整理しました。StateTypeのLと旧構文・説明・関連ID、Facingの旧Trigger =例は保持。2002/1.0のL列挙差と公式Facing例の番号省略、未検証の幅・HitDef/ガード・自動振り向き・相手向きの条件はJSON内部へ残しました。内部注記8件を追加し累計291件、未対応旧履歴は163項目です。実機検証は未実施で、次はP2StateNo・P2StateType・P2MoveTypeです。

### 2026-10-05：opponent-state-01

P2StateNo / P2StateType / P2MoveTypeを追加し、累計136件（51バッチ120件＋主要・補助16件）、対象内の残り98件になりました。旧フィールド・説明・構文・例・出典は保持。P2StateNoの整数参照とP2StateType/P2MoveTypeの文字比較を分け、LとU/Iの意味、HitOverRideの公開リンクを整理しました。P2StateNo/P2StateTypeの1.0/1.1不在時bottomと通常の0を区別し、旧SFalse・旧0説明・不在タイミング・L列挙差を内部へ保存。P2MoveTypeの不在時の返り値は資料に記載がないため未確認のままです。CHAOSのP2対象選択（X距離・Playerヘルパー・5150除外・EnemyNearとの差）と空欄/無関係な旧例を内部へ保持しました。実機検証は未実施で、内部注記は13件追加の304件、未対応旧履歴は162項目です。223テスト・263ページビルド・261 URL/147比較対象ページのHTML検査を通過。次はP2Life・NumEnemy・NumPartnerです。

### 2026-10-05：opponent-counts-01

P2Life / NumEnemy / NumPartnerを追加し累計139件（52バッチ123件＋主要・補助16件）、対象内の残り95件です。P2Lifeの整数参照とライフ割合・生存判定を区別し、NumEnemy/NumPartnerは通常ヘルパー・中立プレイヤーを除く現在人数として公開。人数とTeamModeを分け、旧全ヘルパー除外、旧チーム戦1とCHAOSの交代制チーム0との差、特殊ヘルパー・死亡/消滅/改造時・旧ID順の番号推定を内部へ保持しました。P2Life不在時の値と導入ビルドは推測していません。旧公式の人数確認→リダイレクト例は維持。実機検証は未実施で、内部注記は10件追加の314件、未対応旧履歴162項目です。228テスト・263ページビルド・261 URL/150比較対象ページHTML検査を通過。次はRoundState・RoundNo・RoundsExistedです。

### 2026-10-05：round-progress-01

RoundState / RoundNo / RoundsExistedを追加し、累計142件（53バッチ126件＋主要・補助16件）、対象内の残り92件です。進行状態0〜4・試合全体の番号・プレイヤーごとの存在ラウンド数を分離。RoundStateとCtrl、RoundsExisted=0と最初の1フレームを区別し、短い条件行を公開しました。旧監視図・変数/フラグ例・Q&Aは保持して内部へ。IKEMEN GOの旧nightly報告は別エンジンの内部研究（legacy_index: 0）に対応付け、固定ビルドや導入日を推測していません。RoundNoの前提不明/適用範囲が広い初期化例、RoundsExistedの旧RoundNo - 1推測・単数表記・公式例の説明差を内部へ残しています。導入はnullで実機未検証。内部注記10件追加の324件、未対応旧履歴161項目。233テスト・263ページビルド・261 URL/153比較対象ページのHTML検査を通過。次はID・IsHelper・PlayerIDExistです。

### 2026-10-05：player-identity-01

ID / IsHelper / PlayerIDExistを追加し、累計145件（54バッチ129件＋主要・補助16件）、残り89件です。一意ID・Helperの指定ID・TargetIDを分離し、任意/必須の整数式を構造化しました。公式value抜粋とIsHelper旧例は保持。保存済み一意IDの存在確認からリダイレクトへ進む別条件行を公開しています。旧PlayerExist誤記・ID順によるHelper推定/代入例・DestroySelf後の召喚フリーズ対策・NumTarget列挙・公式PlayerExistID表記差は内部へ。割当詳細・特殊引数・消滅境界・回避策の再現条件は実機未確認です。旧フィールドの保存と内部非表示を検証し、238テスト・263ページビルド・261 URL/156比較対象ページのHTML検査を通過。初導入はnull、内部注記10件追加の334件、未対応旧履歴161項目。次はNumHelper・NumTarget・NumExplodです。

### 2026-10-05：owned-counts-01

NumHelper / NumTarget / NumExplodを追加し、累計148件（55バッチ132件＋主要・補助16件）、残り86件です。各所有数と任意IDを構造化し、Helperの0以下とTarget/Explodの-1以下の全数扱いを分離。旧説明・2例ずつを原位置に保持し、存在確認から参照する例を追加しました。公式NumTargetのNumExplod例という表記差、CHAOSのRoot共有と所有・Target上限8/ID上書きは内部へ残しました。導入ビルド・特殊型・射出/消滅境界・所有の細部は実機未検証です。243テスト・263ページビルド・261 URL/159比較対象ページのHTML検査を通過。内部注記8件追加の342件、未対応旧履歴161項目。次はNumProj・NumProjIDです。

### 2026-10-05：projectile-counts-01

NumProj / NumProjIDの2件で累計150件（56バッチ134件＋主要・補助16件）、残り84件です。引数なし総数と必須ProjIDの個数、負IDの0扱いを区別。Helper生成ProjectileのRoot所有は公式3世代とCHAOSに照合し、Root参照例を追加しました。旧原文/有効な例を保持。SFalse/bottom資料差・初導入・個数更新や所有/無効型の特殊条件は内部へ保存し、実機未検証です。247テスト・263ページビルド・261 URL/161比較対象ページHTML検査を通過。内部注記345件、未対応旧履歴161項目。次はProjContact・ProjHit・ProjGuardedです。

### 2026-10-05：projectile-events-01

ProjContact / ProjHit / ProjGuardedの3件で累計153件（57バッチ137件＋主要・補助16件）、残り81件です。接触・ヒット・ガードの旧式真偽条件とID接尾辞、0始まりの時間比較、ID省略/0の全Projectile扱いを構造化しました。原文・旧書式を保持し、括弧付きContact旧例と公式Hit例の説明差、CHAOSのID計算式/相殺や反対イベントのリセット/同時ヒット報告は内部へ保存。公開は具体的な接尾辞例・0〜14フレーム例とRoot参照に整理し、Hit/Guardedの旧公開例も保持しました。初導入はnullで実機未検証。252テスト・263ページビルド・261 URL/164比較対象ページHTML検査を通過。内部注記356件、未対応旧履歴161項目。次はProjContactTime・ProjHitTime・ProjGuardedTime・ProjCancelTimeです。

### 2026-10-05：projectile-times-01

Projectileの経過時間4件で累計157件（58バッチ141件＋主要・補助16件）、残り77件です。必須整数ID式、最後の接触記録、0のID照合なし/負数の0扱い、整数の0始まりと未該当-1を分離。公式直後=1の旧例と名前/書式の差を内部へ保持し、0始まりと負数除外の具体例を公開しました。CancelTimeの旧バグはWin版検証報告としてWinMUGENに限定し、0指定の例を公開。正確なWinビルドと1.0/1.1再現/修正、リセット・同時イベント・記録寿命は内部へ保存し実機未検証です。258テスト・263ページビルド・261 URL/168比較対象ページHTML検査を通過。内部注記374件、未対応旧履歴160項目。次はMoveHit・MoveGuarded・MoveReversedです。

### 2026-10-05：move-results-01

MoveHit / MoveGuarded / MoveReversedで累計160件（59バッチ144件＋主要・補助16件）、残り74件です。整数・引数なし、ヒット/ガードと当て身された側、1.0/1.1の停止中カウンター、遷移先StateDefによる保持を分離しました。MoveHitResetのMoveReversedへの影響を推定せず、短い旧例は維持。旧8履歴・IKEMEN GO/CMD例・公式の他3つ0説明・同時処理/DOS/Win境界を内部へ保持しました。共有図はMoveContactも含め4ページで内部へ保存し原画像を維持。2002更新履歴を公開し導入ビルドはnull。実機未検証。263テスト・263ページビルド・261 URL/171比較対象ページHTML検査を通過。内部注記393件、未対応旧履歴152項目。次はHitCount・UniqHitCount・HitPauseTimeです。

### 2026-10-05：hit-count-pause-01

ヒット回数/停止時間3件で累計163件、残り71件。相手ごとの加算と画面コンボ数、StateDef保持を分離し、UniqHitCount旧閉区間例を保持して公開側を半開区間へ訂正。HitPauseTimeの非評価と0、攻撃側と被弾側、RC1修正と互換補正を分けました。旧説明・Q&A・IKEMEN推論・同時処理や停止境界は内部に保持。導入null、実機未検証。268テスト・263ページビルド・261 URL/174比較対象ページのHTML検査と通常/390px表示を確認。内部注記402件、未対応旧履歴150項目。次はHitShakeOver・HitOver・HitFallです。

### 2026-10-05：gethit-status-01

被弾側判定3件で累計166件（61バッチ150件＋主要・補助16件）、残り68件。揺れ終了・のけぞり満了・fallフラグと被弾状態の前提を分離し、HitOverの負数境界とHitFallの被弾状態外の未定義を公開。旧0説明/旧5010移行例/未確認Ctrl復帰・停止境界・別エンジン履歴は原本・内部へ保持。HitFallSetでのfall更新と、前提確認を置いた条件例を追加しました。導入null、実機未検証。273テスト・263ページビルド・261 URL/177比較対象ページのHTML検査と通常/390px表示を確認。内部注記413件、未対応旧履歴148項目。次はHitVel・CanRecover・InGuardDistです。

### 2026-10-05：hit-recovery-guard-01

被弾速度/受身許可/ガード距離4件で累計170件（62バッチ154件＋主要・補助16件）、残り64件。HitVelの必須軸指定とfloatを構造化し、旧正方向とWin研究の資料差を内部へ。CanRecoverはfall外未定義・許可と入力/遷移を分離し、旧Common例を固定コミットの1.0ファイルへ照合して維持。旧AI/コンボFAQとフラグ残存研究は内部へ。InGuardDistは攻撃不在0、AttackDistとの関係を公開し、旧Win/DOS/距離境界・?を内部に保持しました。導入null、実機未検証。279テスト・263ページビルド・261 URL/181比較対象ページHTML検査と通常/390px表示を確認。内部注記422件、未対応旧履歴145項目。Q&Aのrを含む未表示フィールドは29ページ。次はVel X/Y・Pos X/Yです。

### 2026-10-05：velocity-position-01

速度・座標4件で累計174件（63バッチ158件＋主要・補助16件）、残り60件。必須軸指定/floatを構造化し、Vel Xの向き基準とPos Xの画面基準、Pos Yの地面0と>=0の境界を分離。1.1のCameraPos加算は系列を限定し、旧左右逆転/カテゴリ/一律丸め助言、座標図と処理順の研究を内部へ保存。原文・例・図・出典を保持、初導入null/実機未検証。285テスト・263ページビルド・261 URL/185比較対象HTMLと通常/390px表示を確認。内部注記433件、未対応旧履歴145項目、未表示フィールド29ページ。次はScreenPos X/Y・CameraPos X/Yです。

### 2026-10-05：screen-camera-01

画面/カメラ座標4件で累計178件（64バッチ162件＋主要・補助16件）、残り56件。必須軸指定/float、画面左上とカメラの基準位置・実行者の座標空間を分離。RC3を追加してRC2/RC3修正へ旧履歴を対応付け、Round案内とPosの絶対座標記述、IKEMEN GOの履歴/issueと共通図は内部へ保持。半開区間の固定幅例と1.0に限定したGameサイズ例を公開。CameraPosの1.1追加は資料確認できるがAlpha 4導入は推定せずnull。原文保持/実機未検証。291テスト・263ページビルド・261 URL/189比較対象HTMLと通常/390px表示を確認。内部注記446件、未対応旧履歴141項目、未表示フィールド29ページ。次はGameWidth/Height・ScreenWidth/Height・CameraZoomです。

### 2026-10-06：size-zoom-01

ゲーム/スクリーン寸法とズーム5件で累計183件（65バッチ167件＋主要・補助16件）、残り51件。引数なし/float、ローカル座標単位と描画ピクセル、MUGEN 1.0/1.1を分離。Game寸法の追加はRC4へ対応付け、1.1項目の初導入はnull。原文・旧例・履歴・Q&A・出典・図を保持し、公式換算式/転記の矛盾・別エンジン研究を内部へ保存。有効なExplod例を維持し、16単位の抜粋と%f/Text/Paramsデバッグ例、1.0基準位置条件とCameraZoomの短い比較例を公開。スキーマ/レンダラー/CSSは変更なし、実機未検証。297テスト・263ページビルド・261 URL/194比較対象HTMLと通常/390px表示を確認。内部注記463件、未対応旧履歴135項目、未表示フィールド29ページ。次はLeftEdge・RightEdge・TopEdge・BottomEdgeです。

### 2026-10-06：screen-edges-01

画面四端4件で累計187件（66バッチ171件＋主要・補助16件）、残り47件。1.1の引数なし/float・ステージ基準の端座標とローカル単位、Pos XへのCameraPos加算・地面基準Pos Yを分離。公式の等価式/比較例を維持し、旧px距離・裸の代入/破棄例・一律ズーム連動・図とRightEdgeの公式Format転記差は内部へ保持。旧履歴12項目を対応付け、初導入null。上下FAQを基準位置の説明へ訂正し、両端を含む片軸の2条件行を追加。原文保持/実機未検証。303テスト・263ページビルド・261 URL/198比較対象HTMLと通常/390px表示を確認。内部注記480件、未対応旧履歴123項目、未表示フィールド29ページ。次はFrontEdge・BackEdgeです。

### 2026-10-06：facing-edges-01

前面/背面の端座標2件で累計189件（67バッチ173件＋主要・補助16件）、残り45件。Facingによる選択・ステージ基準とローカル単位・距離を分離。片側比較を全画面内とする旧FrontEdge例、背面端より左を両向きの背面側画面外とする旧BackEdgeラベルは保持して内部へ。厳密比較と端上を含む比較を公開し、公開式の正負Facing/両端上/カメラずれ/反対側画面外の代数的結果を確認しました。原文・FAQ・例・図・sample_code・別エンジン研究を保持。documentation.associated_triggerを採用し、CameraPos旧IDを残して公開リンクをCameraPosXへ訂正。CSS変更なし、導入null/実機未検証。309テスト・263ページビルド・261 URL/200比較対象HTMLと通常/390px表示/リンク遷移を確認。内部注記489件、未対応旧履歴121項目、未表示フィールド29ページ。次は前後EdgeDist/EdgeBodyDistの4件です。

### 2026-10-06：edge-distances-01

前後EdgeDist/EdgeBodyDistの4件で累計193件（68バッチ177件＋主要・補助16件）、残り41件。基準軸/対画面端幅バー端、座標/距離、閾値/非負範囲を分離。旧px/[Size]/黄色playerバーの混同・例・FAQ/r・図・引用と履歴を保持。公式float/CHAOS Int・切り捨て、Win/1.0のStateType別幅/壁押し戻し・符号・Width処理時点、2002 BackEdgeDist例のBodyDist表記差と別エンジン資料を内部へ保存。導入null、LocalCoord/ズーム/リダイレクト/幅の実機測定は未実施。スキーマ/レンダラー/CSS変更なし。314テスト・263ページビルド・261 URL/204比較対象HTMLと通常/390px表示を確認。内部注記508件、未対応旧履歴114項目、未表示フィールド29ページ。次はP2Dist X/Y・P2BodyDist X/Yです。

### 2026-10-06：opponent-distances-01

P2Dist X/Y・P2BodyDist X/Yの4件で累計197件（69バッチ181件＋主要・補助16件）、残り37件。必須char軸指定/float、Facing基準のX距離と幅基準の距離、両者のY軸の高さの差を分離。旧本文・メタ・構文・履歴・例・図・引用を保持し、Xの負数を含む閾値と下限指定・基準軸前方条件、Yの0/-12/12境界を明示しました。公式front.width/前面同士と実際のground/airキー・CHAOSの相手側幅点/同軸の後ろ幅/Width処理の差、X小数切り捨てとY小数保持、P2対象選択/不在時の値とIKEMEN履歴は内部に保存。初導入null、距離計測/幅/精度は実機未検証。スキーマ/レンダラー/CSS変更なし。320テスト・263ページビルド・261 URL/208比較対象HTMLと通常/390px表示を確認。内部注記528件、未対応旧履歴111項目、未表示フィールド29ページ。次はParentDist X/Y・RootDist X/Yです。

### 2026-10-06：helper-distances-01

ParentDist X/Y・RootDist X/Yの4件で累計201件（70バッチ185件＋主要・補助16件）、残り33件。Helper専用/必須char軸指定/float、直接の親と所有本体、実行者Facing基準のXと基準軸の高さの差を分離。1.0/1.1の不在時bottomと通常数値0を分けて公開し、旧SFalse/3世代まとめのbottom説明と公式RootDist節のParentDist表記差、X精度・Y未読資料・LocalCoord換算・寿命/処理順・別エンジンZ記録を内部へ保存。旧本文・メタ・構文・全8履歴・例・図・引用を保持。IsHelperを参照先存在の保証とせず、公開比較式の符号/0/-12/12/30境界を検査。初導入null、エンジン実機未検証、スキーマ/レンダラー/CSS変更なし。326テスト・263ページビルド・261 URL/212比較対象HTMLと通常/390px表示を確認。内部注記552件、未対応旧履歴103項目、未表示フィールド29ページ。次はTeamMode・TeamSide・IsHomeTeamです。

### 2026-10-06：team-affiliation-01

TeamMode・TeamSide・IsHomeTeamの3件で累計204件（71バッチ188件＋主要・補助16件）、残り30件。評価対象のチーム形式比較/所属側1・2/ホーム扱い1・0、現在人数/位置/Facingを分離。旧RC4/RC5を別々の解析/評価修正として既存ビルドに対応付けました。旧本文・全6履歴・構文・Q&A/c/r・例・引用を保持し、Singleの1対1説明・左右案内・前提不足のイントロ例・Win引用符/!=研究・GOモード/AttachedChar/issueを内部へ保存。TeamSideの既存VarSet/IfElse例は公開を維持、TeamModeの2002公開引用は実在アンカーへ案内。初導入null、特殊モード/敵選択/互換設定は実機未検証。332テスト・263ページビルド・261 URL/215比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記566件、未対応旧履歴97項目、未表示フィールド29ページ。次はMatchNo・MatchOverです。

### 2026-10-06：match-progress-01

MatchNo・MatchOverの2件で累計206件（72バッチ190件＋主要・補助16件）、残り28件。試合番号/ラウンド番号と決着/ラウンド結果を分離。continueの旧増加記録と公式3世代の非増加を内部へ保存して公開を訂正し、MatchOverの1.0/1.1通常仕様へ履歴対応を追加。DOS/Winのタイミング研究・勝敗取り消しの1→0、前提不足のゲージ/PreOver/PalFX例・共有図とGO遅延記録は内部へ。旧全文・メタ・引用・未表示sample_codeを保持し、初導入null、実機未検証。337テスト・263ページビルド・261 URL/217比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記576件、未対応旧履歴95項目、未表示フィールド29ページ。次はWin・WinKO・WinTime・WinPerfectです。

### 2026-10-06：round-win-01

Win・WinKO・WinTime・WinPerfectの4件で累計210件（73バッチ194件＋主要・補助16件）、残り24件。ラウンド勝利と終了理由・パーフェクト扱い・試合決着を分離。1.0/1.1のMatchOver遅延をbehaviorへ対応し、旧RoundState=3一般推奨・1回フラグ例8件・共有図は内部へ保持。WinPerfectの旧履歴判定Q&Aと公式/CHAOS回復研究の衝突、勝利の取り消し・KO切替/デバッグ・カウント制約を内部へ保存。旧全文・Q&A/c/r・履歴・例・引用は保持。初導入null、実機未検証。342テスト・263ページビルド・261 URL/221比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記594件、未対応旧履歴92項目、未表示フィールド29ページ。次はLose・LoseKO・LoseTime・DrawGameです。

### 2026-10-07：round-loss-draw-01

Lose・LoseKO・LoseTime・DrawGameの4件で累計214件（74バッチ198件＋主要・補助16件）、残り20件。ラウンド敗北/理由・引き分けと試合決着を分離。旧1回フラグ例8件・共有図・Draw/DrawGame表記差・結果再判定と引き分け上限/勝ち星研究を内部へ保持。Lose系の個別CHAOS本文は取得できず、勝利側研究を反転して確認済みとはしません。旧全文・メタ・構文・例・図・引用は保持。初導入null、実機未検証。347テスト・263ページビルド・261 URL/225比較対象HTMLを確認。ブラウザ目視は利用上限による自動承認レビュー拒否と再開後の接続エラー/エラーページURLポリシー拒否により未完了。開発サーバーは4322で再起動済み。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記612件、未対応旧履歴92項目、未表示フィールド29ページ。次はName・AuthorNameです。

### 2026-10-07：name-comparisons-01

Name・AuthorNameの2件で累計216件（75バッチ200件＋主要・補助16件）、残り18件。必須演算子/引用文字列と比較全体の整数結果、内部名/表示名/作者名、不在時bottomを分離。AuthorNameの!=解析修正をRC4へ対応付け、Win向け!=/空文字研究との資料差を内部に保持。Nameの有効なNoAutoTurn例は公開を維持し、AuthorNameのVar=0旧例・共有図・文字コード/Helper研究は内部へ保存。旧2002アンカーを内部保持して有効リンクを追加。全原文・構文・例・図・引用を保持。初導入null、実機未検証。352テスト・263ページビルド・261 URL/227比較対象HTMLを確認。前段のブラウザURLポリシー拒否が未解消のため通常/390px目視は未実施。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記620件、未対応旧履歴92項目、未表示フィールド29ページ。次はP1Name・P2Name・P3Name・P4Nameです。

### 2026-10-08：player-names-01

P1Name・P2Name・P3Name・P4Nameの4件で累計220件（76バッチ204件＋主要・補助16件）、残り14件。必須演算子/引用文字列と整数比較結果、評価対象から見た自分/対戦相手/パートナー/第2の相手を分離。P2の旧パートナー説明と関連NumPartner、不在時bottomの旧説を原文保持で訂正しました。直接比較の不在=0/!=1と1.0/1.1不在リダイレクトbottomを区別し、公開例はNumEnemy > 0 / NumPartner > 0 / NumEnemy >= 2の存在確認を併用。旧Var=2例・前提不足な-2移行例・共有図・primary/nearestの選択研究を内部へ保持。2002アンカーを修復し、初導入null、実機未検証。357テスト・263ページビルド・261 URL/231比較対象HTMLと通常/390px表示を確認。前段ブラウザ拒否後の再開確認が完了。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記636件、未対応旧履歴92項目、未表示フィールド29ページ。次はPalNo・TicksPerSecondです。

### 2026-10-08：palette-tick-rate-01

PalNo・TicksPerSecondの2件で累計222件（77バッチ206件＋主要・補助16件）、残り12件。引数なし/int、選択パレット番号と1.xの.def順序省略時のボタン対応表、秒数×tick換算とステート経過時間を分離。PalNoのHelper継承修正はRC2、Start選択修正はRC3へ個別対応。Win Helperの1固定/1.0疑問符・描画再割当て・デバッグ加速/停止の研究、標準4番慣習と旧FPS表現を内部保持。旧PalNoのY=5ラベルを残して条件例を追加し、TicksPerSecondの有効な旧公式比較例は公開維持。全原文・summary・メタ・構文・例・引用を保存。初導入null、実機未検証。362テスト・263ページビルド・261 URL/233比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記643件、未対応旧履歴92項目、未表示フィールド29ページ。次はConst240p・Const480p・Const720pです。

### 2026-10-08：coordinate-conversion-01

Const240p・Const480p・Const720pの3件で累計225件（78バッチ209件＋主要・補助16件）、残り9件。1.0/1.1系列の必須float式引数とfloat戻り値、320/640/1280幅基準から評価対象の座標空間への横幅比による換算、入力bottom伝播と通常0を分離。旧現解像度/概ね/localcoord相当の原文・引数・関連・例・引用を保持し、既存3/6/12の公式換算例は公開維持、実在VelSetのx/yによる短い例を追加。2011.01.18やRC1のLocalCoord追加を初導入と推定せずnull。CHAOS索引のウィンドウ疑問符・互換設定/Helper/リダイレクト/精度の留保は内部へ保存。367テスト・263ページビルド・261 URL/236比較対象HTMLと通常/390px表示を確認。換算式の代数テストであり実機未検証。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記652件、未対応旧履歴92項目、未表示フィールド29ページ。次はCommand・StageVarです。

### 2026-10-08：command-stage-metadata-01

Command・StageVarの2件で累計227件（79バッチ211件＋主要・補助16件）、残り7件。必須の比較演算子/引用文字列とint結果、StageVarの引用しない識別子を構造化。Commandの逆転したTime/Buffer.Time説明を原文保存で訂正し、EndCmdBufTimeの0..Time・対象制限を公開FAQへ具体化。StageVar追加はRC8へ対応し、公式のinfo.authorname/author差と停止/入力/カスタムステート/別エンジン研究は内部保持。374テスト・263ページビルド・261 URL/238比較対象HTMLと通常/390px表示を確認。ブラウザで既存の色付け処理がCMDの~/$を消す不具合を再現し、記号と未分類文字の保持を修正、失敗→通過の回帰テストと再読み込み後の~D表示を確認。JSON原文・メタ・構文・表・例・履歴・FAQ・引用を保持。スキーマ/レジストリ/CSS変更なし、実機未検証。内部注記658件、未対応旧履歴90項目、未表示フィールド29ページ。次はHitDefAttr・GetHitVarです。

### 2026-10-08：hitdef-attribute-01

HitDefAttrの1件で累計228件（80バッチ212件＋主要・補助16件）、残り6件。必須演算子・引用しない姿勢/攻撃種別と整数戻り値を構造化し、旧oper省略可を原位置に保持。RC4の!=解析修正とRC5の評価修正を分離。旧一致例2件は公開維持、旧否定例は内部に残して同じコードを1.x適用/非攻撃時の留保付きで追加。公式の部分集合とCHAOSの共通部分/空属性/更新順/Projectile研究、個別項目の!=疑問符と図は内部保持。初導入null、実機未検証。379テスト・263ページビルド・261 URL/239比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記661件、未対応旧履歴88項目、未表示フィールド29ページ。
