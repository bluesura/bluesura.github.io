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
