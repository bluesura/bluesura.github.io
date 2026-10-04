# 小分け移行の手順と記録

2026-09-07 採用。主要11件・補助5件の検証後、関連する最大5件ずつを移行します。

## 配置と変更範囲

- `scripts/mugen/plans/<batch-id>.json`: 人が意味を確認した追加内容と保留項目。対象コレクション・ファイル名を列挙します。自然文を自動分類する処理ではありません。
- `scripts/mugen/batch.mjs`: 計画の読み取り、明示された対象の dry-run / 適用、原本のハッシュとスキーマの検証。
- `scripts/mugen/capture-batch.mjs`: 移行前 JSON・記事 HTML・抽出結果を `tests/mugen/batches/<batch-id>/` へ保存します。
- 元の `tests/mugen/baseline/` は変更しません。追加した比較基準は `mugen:test` と `mugen:check-html` の対象へ自動的に入ります。

現在の変換は**キーの追加と配列末尾への追加のみ**です。既存キー・配列要素への上書きは拒否します。移行後のラベル・説明の訂正は、2026-09-08 採用の [EDITORIAL_GUIDE.md](EDITORIAL_GUIDE.md) に従い、原文を保持して公開文を個別に編集します。

## 実行手順

1. 対象の旧 JSON・保存済み資料・コミュニティの記録を読み、計画 JSON に追加内容と出典・保留項目を記述します。
2. 変更前の `npm run build` を完了してから比較基準を保存します。原本のハッシュ、本文・コピペ出力と現在のデータの一致も確認します。
3. 既定の dry-run で追加パスと値、未対応の旧履歴、保留項目を確認します。
4. `--apply` を付けたときだけ、指定した対象へ書き込みます。すべての対象を検証してから書き始めます。
5. JSON・テスト・ビルド・生成 HTML とブラウザの表示／コピー結果を確認し、ブランチへ保存して Linux CI を通します。

初回バッチで使用したコマンド例です。**このバッチは適用済みなので、現在の原本へ再実行すると拒否されます。**

```sh
npm run mugen:batch-baseline -- --batch axis-motion-01
npm run mugen:batch -- --batch axis-motion-01 --target PosAdd --target PosSet --target VelAdd --target VelSet
npm run mugen:batch -- --batch axis-motion-01 --target PosAdd --target PosSet --target VelAdd --target VelSet --apply
```

- `--target` は必須です。全件指定やワイルドカードはありません。
- 計画にない対象、重複指定、既存フィールドへの上書き、移行済みまたは比較基準から編集された JSON を拒否します。
- 対象のうち1件でも不一致・検証エラーがあれば、原本への書き込みは開始しません。比較基準を作り直してエラーを回避しないでください。
- 部分適用も可能です。まだ適用していない対象だけを明示して実行できます。
- 出力は標準出力の JSON レポートです。必要なら Git 管理外の `artifacts/mugen/` に保存します。dry-run は原本を書き換えません。

## axis-motion-01：位置・速度の4件

変更前の比較基準は `tests/mugen/batches/axis-motion-01/` に保存しました。原本は全258件を固定した最初のハッシュとも照合します。

| 対象 | 追加した公開仕様 | 内部に保存した情報・保留事項 |
| --- | --- | --- |
| PosAdd | X/Y の既定値0、式の指定、小数を指定できること | 2015年の訂正前の誤説、float に対する二要素の整数範囲、CHAOS 内の座標説明の不一致 |
| PosSet | 省略した軸の座標を変更しないこと、式・小数の指定 | 旧 default_value の0、訂正前の誤説、ステージ中央／画面中央の記述差 |
| VelAdd | 省略した軸の速度を変更しないこと、式の指定 | 旧「乗算速度」「ターゲット」というラベル・説明の訂正候補 |
| VelSet | 省略した軸の速度を変更しないこと、式の指定 | 旧「乗算速度」「ターゲット」というラベル・説明の訂正候補 |

PosAdd の0は保存済み Elecbyte 1.0 / 1.1 資料で確認しています。PosSet・VelAdd・VelSet の省略時は、CHAOS の各項目の説明を根拠とし、エージェント自身の実機テストとは区別します。[PosSet の記録](https://w.atwiki.jp/mugencns/pages/27.html)、[VelAdd の記録](https://w.atwiki.jp/mugencns/pages/270.html)、[VelSet の記録](https://w.atwiki.jp/mugencns/pages/269.html)

`PosAdd` のコピー欄は `X = 0` / `Y = 0`。ほかの3件は `default.kind: none` で非操作を表し、行全体をコメントにして「省略」と「0の明示指定」の違いを保持します。既存の `default_value` を削除・変更しません。

小数に関する2015年の訂正は、MUGEN のバージョン変更ではありません。旧 `version` 本文は `research` として対応付け、公開する結論を別の `behavior` にしています。撤回した説明が旧形式の読み込み経由で再表示されないことも検証します。

既存の `load_priority` は全値・順序を保存し、管理者確認を JSON に追加しました。初導入は4件とも未確定のため `introduced_in: null` です。研究・出典検証情報の非公開方針は [ADOPTION.md](ADOPTION.md) に従います。

このバッチで新しいスキーマフィールドや表示コンポーネントは追加していません。旧ラベルや本文そのものの訂正、物理ディレクトリ移動、Lifebar の新形式化は保留しています。次は VelAdd / VelSet の明らかな転記ミスを原文付きで訂正できる編集手順を整え、その後に次の関連グループへ進みます。

2026-09-08 追記: VelAdd / VelSet の訂正を `parameter[].documentation` で実施しました。上記は初回バッチ時点の記録です。バッチ計画・比較基準・旧文・初回の追加フィールドは保持し、訂正方法と適用内容を [EDITORIAL_GUIDE.md](EDITORIAL_GUIDE.md) に記録しました。次は VelMul / PosFreeze / Gravity を候補に、旧 JSON と資料を確認して次の小分け計画を作成します。

## axis-motion-02：速度倍率・位置停止・重力

2026-09-08 に資料を照合し、2026-09-09 に検証・保存。対象は VelMul / PosFreeze / Gravity の3件です。移行前の JSON・記事・ハッシュは `tests/mugen/batches/axis-motion-02/` に保存しました。

| 対象 | 公開する内容 | 原本と内部に残す内容 |
| --- | --- | --- |
| VelMul | 速度に掛ける倍率、X/Y の省略時1、式の使用 | 旧ラベル・本文・空の default_value、初導入不明 |
| PosFreeze | 1フレームの速度移動停止、速度値との区別、value の0／非0と既定値1 | Gravity との相反する旧本文と確認記録、既存 int 型 |
| Gravity | yaccel を実行ごとに加算、固有パラメーターなし、physics=N 時の着地処理 | 「常に重力」「PosFreeze中に加速を受けない」という旧文、相互作用の資料差 |

VelMul の既定値1は [CHAOS の記録](https://w.atwiki.jp/mugencns/pages/271.html)、PosFreeze の既定値と非0判定は保存済み Elecbyte 1.0 / 1.1 の記載に基づきます。コピー欄は VelMul が `X = 1` / `Y = 1`、PosFreeze が `value = 1`、Gravity は共通2項目のみです。読み込み順は管理者確認を保持しています。

[CHAOS の PosFreeze](https://w.atwiki.jp/mugencns/pages/254.html) には Win版で Gravity による加速が反映されるという記録があり、[Gravity の記事](https://w.atwiki.jp/mugencns/pages/230.html) も同じ方向の説明です。旧 Gravity と旧 PosFreeze は反対の説明を持っていました。具体的なビルド・実行順・physics・互換設定を今回の資料だけから決められないため、両ページの `research` に `conflicting` として保存しました。今回の実機テストではありません。公開文では未確定の相互作用を断定しません。

パラメーター本文に加え、ルート `documentation.description` を実装しました。元の概要は保持し、詳細・一覧・メタ情報が公開本文を使うことを HTML 検査で確認します。適用済みバッチの再実行は拒否されます。

```sh
npm run mugen:batch-baseline -- --batch axis-motion-02
npm run mugen:batch -- --batch axis-motion-02 --target VelMul --target PosFreeze --target Gravity
npm run mugen:batch -- --batch axis-motion-02 --target VelMul --target PosFreeze --target Gravity --apply
```

次は AngleAdd / AngleMul / AngleSet の角度操作3件を照合します。

## drawing-angle-01：描画角度の3件

2026-09-09、AngleAdd / AngleMul / AngleSet を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/drawing-angle-01/` へ保存しています。既存の画像も保持しています。

- 3件とも `value` は必須。`default.kind: required` と式の使用を記録し、旧 `default_value: ["?"]` を保持しました。コピー欄の値を0や1で勝手に有効化しません。
- AngleAdd / AngleSet は度、AngleMul は角度に掛ける倍率です。AngleMul の「単位は度」「1以上でアクセル」という旧文を原位置に残し、公開本文は倍率1で角度を保つことを説明します。角度の内部範囲を実測したという意味ではありません。
- 角度を表示に反映する AngleDraw、1フレームの描画効果、角度の保持、当たり判定が回転しないことを公開注記に整理しました。
- AngleSet の「角度を0で初期化する」という公式記載は、必須の `value` の省略時とは分けて説明しています。
- Add / Set の逆三角関数は、旧 `arc●●●` から Acos / Asin / Atan の具体名へ整理しました。戻り値がラジアンであることを保存済みトリガー資料で確認し、度への変換例を記載しています。

根拠は保存済み Elecbyte 1.0 / 1.1 の各コントローラー、AngleDraw、CNS、数学トリガー資料と [CHAOS の AngleAdd 共通説明](https://w.atwiki.jp/mugencns/pages/76.html) です。CHAOS の AngleMul / AngleSet 個別ページは取得できなかったため、未読の内容を根拠へ加えていません。この制約と訂正理由は AngleMul の非公開 `research` に保持しています。

```sh
npm run mugen:batch-baseline -- --batch drawing-angle-01
npm run mugen:batch -- --batch drawing-angle-01 --target AngleAdd --target AngleMul --target AngleSet
npm run mugen:batch -- --batch drawing-angle-01 --target AngleAdd --target AngleMul --target AngleSet --apply
```

このバッチは適用済みです。新しいスキーマや表示コンポーネントは追加していません。次は関連する Acos / Asin / Atan / Pi の数学トリガーを確認します。

## inverse-trig-01：逆三角関数と円周率の4件

2026-09-09、Acos / Asin / Atan / PI を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/inverse-trig-01/` へ保存しています。既存の画像、コード例、Q&A も原本に保持しています。

- Acos / Asin / Atan は `Exprn` を必須の式1個として対応付けました。PI は `syntax_kind: nullary`、`arguments: []` とし、引数欄を生成しません。4件とも戻り値は float、初導入ビルドは未確定です。
- Acos / Asin の入力範囲外と、3関数の bottom に対するエラー条件を旧履歴へ対応付けました。関数の結果はラジアンです。保存済み Elecbyte 1.0 / 1.1 資料の記載確認であり、既存サンプルを実機で実行したという意味ではありません。
- Atan の旧 `code_sample[1]` は分母へ50を加えても `P2BodyDist X = -50` なら0になります。PI の旧 `code_sample[0]` / `[3]` は、選択外の引数も評価する `IfElse` ではゼロ除算を回避できません。
- PI の旧 `code_sample[2]` は1回の実行で `2 * PI` を一度だけ加減するため、例えば `5 * PI` は `3 * PI` となり、任意の入力を一度で `-PI`〜`PI` に収めません。
- 上記4例はコード・説明を各 `code_sample` に残し、`visibility: internal` で HTML から外しました。検証済みかどうかと掲載価値は分けて管理します。PI の Q&A にある度・ラジアン変換はこの問題を含まないため、公開のままです。

このバッチで `code_sample[].visibility` の `public` / `internal` を追加しました。省略時は従来どおり公開し、内部例しかないページではサンプルコード節を生成しません。比較検査は公開例の数・順序・コード・説明と、内部例にだけ存在する画像・リンクの非表示を確認します。

```sh
npm run mugen:batch-baseline -- --batch inverse-trig-01
npm run mugen:batch -- --batch inverse-trig-01 --target Acos --target Asin --target Atan --target PI
npm run mugen:batch -- --batch inverse-trig-01 --target Acos --target Asin --target Atan --target PI --apply
```

このバッチは適用済みです。次の対象は、戻り値やエラー条件を同じ資料群で比較できる数学トリガーから3〜5件を選びます。

## circular-trig-01：正弦・余弦・正接の3件

2026-09-09、Sin / Cos / Tan を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/circular-trig-01/` へ保存しています。既存の画像とコード例も原本に保持しています。

- 3件ともラジアン単位の必須式1個を取り、float を返す関数として対応付けました。bottom のエラー条件は旧履歴の同じ項目へ対応させています。初導入ビルドは未確定です。
- 保存済み Elecbyte 1.0 / 1.1 資料で構文、引数、戻り値、エラー条件を確認しました。既存コード例を MUGEN で実行したという意味ではありません。
- Sin の旧 `code_sample[1]` は `ラディウス`、Tan の旧 `code_sample[1]` は `角度` という説明用プレースホルダーを式へ直接含み、そのままでは実行できません。コードと説明を残し、`visibility: internal` で HTML から外しました。
- Sin / Cos / Tan の基本値を示す先頭の例は公開を維持しました。公開例の数・順序・コード・説明は生成 HTML でも比較しています。

```sh
npm run mugen:batch-baseline -- --batch circular-trig-01
npm run mugen:batch -- --batch circular-trig-01 --target Sin --target Cos --target Tan
npm run mugen:batch -- --batch circular-trig-01 --target Sin --target Cos --target Tan --apply
```

このバッチは適用済みです。次は E / Exp / Ln / Log の指数・対数トリガーを同じ公式資料で照合します。

## exponential-log-01：指数・対数の4件

2026-09-09、E / Exp / Ln / Log を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/exponential-log-01/` へ保存しています。既存の長いコード例、iframe、警告文字列も原本に保持しています。

- E は float を返す引数なしの定数、Exp / Ln は float 式1個、Log は `base, exprn` の順で float 式2個を取る関数として対応付けました。初導入ビルドは未確定です。
- Exp が `E ** exprn` よりわずかに高精度であること、Ln が `Log(E, exprn)` よりわずかに高精度であること、Ln / Log の正値条件とエラー結果を保存済み Elecbyte 資料で確認しました。
- Ln の2002.04.14における SFalse と、1.0 / 1.1における bottom は旧履歴の別項目へ対応させ、両方を公開します。発生ビルドやログ原本を確認できない `TOOK LN...` / `TOOK LOG...` の警告文字列は、旧履歴を残して `research` として非公開にしました。
- E / Exp の先頭コード例は、具体的な浮動小数点出力に対応するビルド・実行環境・再現手順がありません。`[State ]` の未完成見出しも含むため、コードと説明を残して `visibility: internal` にしました。公式に記載された一般的な精度差は本文に残ります。
- Log の既存説明は底1を使用不可としています。これは数学上必要な条件ですが、保存済み公式資料は正値条件だけを記しているため、MUGEN が底1へ返す値と警告は内部の未検証事項として残しました。

HTML 比較では `src` を持たない `srcdoc` iframe を媒体 URL として数えず、公開コード例の iframe の `src` / `srcdoc` 自体を比較します。これにより、URLのない埋め込みデモも内容の欠落を検出します。

```sh
npm run mugen:batch-baseline -- --batch exponential-log-01
npm run mugen:batch -- --batch exponential-log-01 --target E --target Exp --target Ln --target Log
npm run mugen:batch -- --batch exponential-log-01 --target E --target Exp --target Ln --target Log --apply
```

このバッチは適用済みです。次は Abs / Ceil / Floor の基本数値関数を同じ資料で照合します。

## numeric-basic-01：基本数値関数の3件

2026-09-09、Abs / Ceil / Floor を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/numeric-basic-01/` へ保存しています。既存のコード例も原本に保持しています。

- 3件とも整数または浮動小数点の式 `exprn` を1個取る関数として対応付けました。Abs は引数と同じ int / float、Ceil / Floor は int を返します。初導入ビルドは未確定です。
- 2002.04.14 で式が SFalse の場合に SFalse を返す記述と、1.0 / 1.1 で式が bottom の場合に bottom を返す記述を、旧履歴の別項目へ対応させました。
- 保存済み Elecbyte 2002.04.14 / 1.0 / 1.1 資料で構文、引数、戻り値、エラー条件を確認しました。既存コード例を MUGEN で実行したという意味ではありません。
- 既存の6コード例は式として完結しており、今回確認した仕様とも矛盾しないため公開を維持しました。

```sh
npm run mugen:batch-baseline -- --batch numeric-basic-01
npm run mugen:batch -- --batch numeric-basic-01 --target Abs --target Ceil --target Floor
npm run mugen:batch -- --batch numeric-basic-01 --target Abs --target Ceil --target Floor --apply
```

このバッチは適用済みです。次は Random / GameTime / Time / TimeMod の値と時間単位、特殊構文を照合します。

## random-time-01：乱数と時間の4件

2026-09-09、Random / GameTime / Time / TimeMod を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/random-time-01/` へ保存しています。既存のコード例も原本に保持しています。

- Random / GameTime / Time は引数なしで int を返します。Random の範囲は0〜999、GameTime はゲーム開始からの総 tick 数、Time は現在のステートに滞在した tick 数です。
- TimeMod は `[oper] divisor, value1` の旧式構文で、整数の2値は式を取れません。戻り値は0または1の int です。式を使える `%` 演算子への置換が公式資料で推奨されています。
- TimeMod の除数0について、2002.04.14 の SFalse と1.0 / 1.1 の bottom を別々に保存しました。旧履歴の SFalse 本文は変更していません。
- Random の旧 `code_sample[1]` は、同じフレームでも参照ごとに値が変わることを前提にしています。保存済み公式トリガー資料には更新単位の記載がなく、実行記録もないため、コードと説明を残して `visibility: internal` で HTML から外しました。
- Random の確率判定・剰余変換、GameTime・Time・TimeMod の公式例と一致するコードは公開を維持しました。

```sh
npm run mugen:batch-baseline -- --batch random-time-01
npm run mugen:batch -- --batch random-time-01 --target Random --target GameTime --target Time --target TimeMod
npm run mugen:batch -- --batch random-time-01 --target Random --target GameTime --target Time --target TimeMod --apply
```

このバッチは適用済みです。次は AnimTime / AnimElemNo / AnimElemTime のアニメーション時間トリガーを照合します。

## animation-time-01：アニメーション時間の3件

2026-09-10、AnimTime / AnimElemNo / AnimElemTime を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/animation-time-01/` へ保存しています。空文字だけのコード例も原本に保持しています。

- 3件とも int を返します。AnimTime は引数なし、AnimElemNo は現在を基準にした tick オフセットの整数式、AnimElemTime は確認する要素番号の整数式を取ります。
- AnimElemNo / AnimElemTime について、2002.04.14 の SFalse と1.0 / 1.1 の bottom を別々に保存しました。AnimElemTime が有限 looptime の2周目以降のループ先頭で成立しない制約と、`AnimTime = 0` を併用する公式の回避例も公開注記にしました。
- AnimTime の旧説明にある表示時間 `-1` の特殊例は、保存済み公式資料に記載がなく実行記録もありません。原文を description に保持し、公開説明は終端からの符号付き時間と `AnimTime = 0` の確認済み仕様へ差し替えました。
- 3ページの旧 `code_sample[0]` はタイトルもコードも空文字です。各要素を削除せず `visibility: internal` とし、空のサンプル節とページ内ナビを生成しません。
- HTML 比較器は、全コード例が明示的に内部化された場合に限り、`#CodeSample` 節とそのページ内リンクの消失を許可します。他の節・リンクの欠落検出は維持します。

```sh
npm run mugen:batch-baseline -- --batch animation-time-01
npm run mugen:batch -- --batch animation-time-01 --target AnimTime --target AnimElemNo --target AnimElemTime
npm run mugen:batch -- --batch animation-time-01 --target AnimTime --target AnimElemNo --target AnimElemTime --apply
```

このバッチは適用済みです。次は Anim / AnimExist / SelfAnimExist のアニメーション識別トリガーを照合します。

## animation-identity-01：アニメーション番号・存在判定の3件

2026-09-10、Anim / AnimExist / SelfAnimExist を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/animation-identity-01/` へ保存しています。旧履歴・Q&A・コード例も原本に保持しています。

- Anim は引数なしで現在のアクション番号を int で返します。AnimExist / SelfAnimExist はアニメーション番号を返す整数式1個を取り、存在を1または0の int で返します。初導入ビルドは3件とも未確定です。
- AnimExist は、成功した攻撃によってカスタムステートへ置かれた場合の結果が公式上未定義です。旧履歴と Q&A は攻撃側データを参照すると断定しているため、原文を保持して `research` / `visibility: internal` で非公開にしました。公開文には未定義条件と SelfAnimExist の使用だけを記載しています。
- SelfAnimExist は、攻撃によって P2 のアニメーションデータを与えられている場合でも P1 自身のデータだけを確認します。対象が反対にも読める旧説明を description に残し、documentation.description で公開文を訂正しました。
- AnimExist の旧コード例は `Value =` が未記入で、未定義条件に当たり得る特殊やられ例です。SelfAnimExist の旧コード例は空文字だけです。どちらも要素を削除せず `visibility: internal` で HTML から外しました。
- このバッチで `qanda[].visibility` の `public` / `internal` を追加しました。省略時は従来どおり公開し、内部項目しかないページでは Q&A 節を生成しません。比較検査は公開 Q&A の数・順序・質問・回答と、内部項目だけに存在するリンク・画像の非表示を確認します。

```sh
npm run mugen:batch-baseline -- --batch animation-identity-01
npm run mugen:batch -- --batch animation-identity-01 --target Anim --target AnimExist --target SelfAnimExist
npm run mugen:batch -- --batch animation-identity-01 --target Anim --target AnimExist --target SelfAnimExist --apply
```

このバッチは適用済みです。次は ChangeAnim / ChangeAnim2 / AnimElem のアニメーション変更・要素判定を照合します。

## animation-change-01：アニメーション変更の2件

2026-09-29、ChangeAnim / ChangeAnim2 を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/animation-change-01/` へ保存しています。AnimElem は代表セット段階ですでに v2 追加済みのため、再移行せず対象から外しました。

- ChangeAnim は実行者のアクション番号を変更します。value は必須、Elem は任意で、どちらも整数式を取ります。ChangeAnim2 は同じパラメーターを使用します。
- ChangeAnim2 は、攻撃によって P2 をカスタムステートへ置き、P1 の AIR に定義されたアニメーションへ P2 を変更するときに使用します。旧 description を保持し、P1 / P2 の関係を明示した公開説明を追加しました。
- 既存の Elem の `default_value: ["1"]` とコピー出力は維持しました。一方、保存済み公式コントローラー資料は Elem を任意とするだけで省略時1を明記していないため、確認済みの構造化 `default` は追加していません。
- 既存の読み込み順1・2は管理者確認を付けました。value の必須条件を構造化し、コピー欄では値未指定の必須行をコメントのまま、Elem=1 を従来どおり有効行として出力します。
- 負の Elem に関する警告、存在しないアニメ番号の「エラー」、`Assert failure in array.h line 110:` は、対象ビルド、完全な出力、結果、再現手順が不足しています。旧本文とリンクを保持し、`research` として HTML から外しました。
- HTML 比較器は、旧履歴が存在し、対応後の注記がすべて内部記録になった場合に限り、`#Version` 節とそのナビリンクの消失を許可します。公開注記が1件でもあるページの節欠落は引き続き失敗します。

```sh
npm run mugen:batch-baseline -- --batch animation-change-01
npm run mugen:batch -- --batch animation-change-01 --target ChangeAnim --target ChangeAnim2
npm run mugen:batch -- --batch animation-change-01 --target ChangeAnim --target ChangeAnim2 --apply
```

このバッチは適用済みです。次は ChangeState / SelfState / TargetState のステート遷移を照合します。

## state-transition-01：ステート遷移の3件

2026-09-30、ChangeState / SelfState / TargetState を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/state-transition-01/` へ保存しています。

- ChangeState は実行者、SelfState は実行者自身のステートデータ、TargetState は対象ターゲットのステートを変更します。各 value は省略不可の整数式です。
- ChangeState / SelfState の Anim は任意で、省略時は現在のアニメーションを維持します。Ctrl は任意で 0 が操作不可、0以外が操作可能です。旧 JSON の Ctrl 省略時説明は保存済み公式資料で確認できないため、原本に保持したまま公開ビューから除外しました。
- TargetState の ID は任意の整数式で、既定値 -1 は全ターゲットを対象にします。旧説明の「特定のターゲットを指定できない」は公式資料と衝突するため原文を保持し、公開ラベルと本文だけを一致するターゲット ID の指定へ訂正しました。
- 負数指定の警告文、ChangeState value の旧上限・強制変更説明、HitPause に関する補足、SelfState の制作上の推奨、TargetState の復帰・simul 等の運用説明は、対象ビルドや実行記録が不足しています。すべて `research` として JSON に保持し、HTML から外しました。
- `parameter[].documentation.hide_legacy` を追加しました。`default_value` / `min_value` / `max_value` の原本を削除せず、未検証の旧メタ項目だけを公開ビューと CNS コピペ出力から除外できます。このバッチでは ChangeState の旧 max_value と ChangeState / SelfState の旧 Ctrl 既定値に使用しています。
- 既存の読み込み順は管理者確認を `maintainer_report` として JSON に記録しました。根拠メタデータは HTML に表示しません。

```sh
npm run mugen:batch-baseline -- --batch state-transition-01
npm run mugen:batch -- --batch state-transition-01 --target ChangeState --target SelfState --target TargetState
npm run mugen:batch -- --batch state-transition-01 --target ChangeState --target SelfState --target TargetState --apply
```

このバッチは適用済みです。次は CtrlSet / StateTypeSet / SprPriority の状態・表示制御を照合します。

## state-control-01：状態・表示制御の3件

2026-09-30、CtrlSet / StateTypeSet / SprPriority を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/state-control-01/` へ保存しています。

- CtrlSet は必須の整数式 value でコントロールフラグを設定します。0は操作不可、0以外は操作可能です。旧本文の技途中の操作と StateDef 冒頭に関する制作補足は原文に保持し、確認できる記載がないため `research` として非公開にしました。
- StateTypeSet の StateType / Physics / MoveType は省略可能な固定トークンです。公式資料で StateType の A/C/S/L、Physics の A/C/S/N、MoveType の I/A/H と、省略時に現在値を維持することを確認しました。コピー欄では継承値を有効な代入行にしません。
- StateTypeSet の旧候補表は、`U` の明示指定、摩擦式、重力式、自動着地を含みます。原表を JSON に残し、公式コントローラー資料だけでは確認できない詳細を公開HTMLから外しました。読み込み順の `?` も推測していません。
- SprPriority は必須の整数式 value、範囲 -5〜5、値が大きいほど手前に描画されることを確認しました。
- `parameter[].documentation.hide_legacy` の対象に `possible_value` を追加しました。HTML比較器は、明示的に非公開化した旧候補表に含まれる画像・リンクを内部保存として扱い、それ以外の媒体欠落は引き続き失敗させます。

```sh
npm run mugen:batch-baseline -- --batch state-control-01
npm run mugen:batch -- --batch state-control-01 --target CtrlSet --target StateTypeSet --target SprPriority
npm run mugen:batch -- --batch state-control-01 --target CtrlSet --target StateTypeSet --target SprPriority --apply
```

このバッチは適用済みです。次は AttackMulSet / DefenceMulSet / PowerAdd / PowerSet の数値変更系を照合します。

## combat-power-01：攻撃・防御倍率とパワー操作の4件

2026-09-30、AttackMulSet / DefenceMulSet / PowerAdd / PowerSet を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/combat-power-01/` へ保存しています。

- 4件の value は省略不可の式です。AttackMulSet / DefenceMulSet は float、PowerAdd / PowerSet は int として、既存の読み込み順1には管理者確認を付けました。
- AttackMulSet は攻撃倍率を設定し、与えるダメージを倍率で変化させる基本動作と、`value = 2` で2倍になる例を公開しました。旧本文の効果1フレーム、負数・0、Projectile / Helper 別の適用範囲は原文を保持し、実機記録がないため `research` として非公開にしました。
- DefenceMulSet は保存済み公式資料自体に差があります。2002.04.14 は指定値の逆数で受けるダメージを変化させ `value = 2` で半減、1.0 / 1.1 は指定値を直接用い `value = .5` で半減すると説明します。公開文は防御倍率で受けるダメージを変更する範囲に留め、世代差、LifeAdd、旧 Win版の MoveType・初回ヒット・特殊値を `conflicting` の内部記録に保存しました。
- PowerAdd / PowerSet は、指定量の加算と指定値への設定という公式資料で確認できる基本動作を公開しました。旧 JSON の32-bit値域、0〜PowerMaxへの制限、RoundState 3 / 4 で変化しないという記録は削除せず、パラメーターメタ情報・履歴節・公開本文から外しました。
- PowerAdd / PowerSet の既存コード例は、必須値を含む完全な例として公開を維持しています。既存のパワーゲージ図も原本に保持しています。

```sh
npm run mugen:batch-baseline -- --batch combat-power-01
npm run mugen:batch -- --batch combat-power-01 --target AttackMulSet --target DefenceMulSet --target PowerAdd --target PowerSet
npm run mugen:batch -- --batch combat-power-01 --target AttackMulSet --target DefenceMulSet --target PowerAdd --target PowerSet --apply
```

このバッチは適用済みです。次は LifeAdd / LifeSet / TargetPowerAdd のライフ・パワー操作を照合します。

## life-power-01：ライフ・ターゲットパワー操作の3件

2026-09-30、LifeAdd / LifeSet / TargetPowerAdd を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/life-power-01/` へ保存しています。

- LifeAdd は必須の整数式 Value、任意の Absolute / Kill を構造化しました。Absolute は省略時0で防御倍率による調整、1で指定量をそのまま加算します。Kill は省略時1、0ならこの加算によってライフが1未満にならないようにします。
- LifeSet は実行者のライフを必須の整数式 Value へ設定します。旧本文の用途例は原本に残し、公開文は公式資料で確認できる基本動作へ絞りました。
- TargetPowerAdd は必須の整数式 value をターゲットのパワーへ加算します。任意の整数式 ID は省略時 -1 で全ターゲットを対象にします。RoundState 3 / 4 の旧記録は `research` として非公開にしました。
- LifeAdd / LifeSet の RoundState 3 における固定化と Win/Lose の順序は、旧コミュニティ資料へのリンクと原文を維持したまま非公開にしました。IKEMEN GO の競合記録は `environment.engine: ikemen-go` を付け、MUGEN の公開本文から分離しています。
- 旧ヘッダー画像は未検証の RoundState・記述位置の推奨・IKEMEN GO 互換性を1枚に含むため、画像データを削除せず `visibility: internal` にしました。LifeSet の同じ説明に基づく Q&A も内部化しました。文書画像にも公開範囲を指定できるよう、スキーマ・正規化・HTML比較検査を拡張しています。

```sh
npm run mugen:batch-baseline -- --batch life-power-01
npm run mugen:batch -- --batch life-power-01 --target LifeAdd --target LifeSet --target TargetPowerAdd
npm run mugen:batch -- --batch life-power-01 --target LifeAdd --target LifeSet --target TargetPowerAdd --apply
```

このバッチは適用済みです。次は TargetBind / TargetDrop / TargetFacing のターゲット制御を照合します。

## target-control-01：ターゲット選択・固定・向きの3件

2026-10-01、TargetBind / TargetDrop / TargetFacing を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/target-control-01/` へ保存しています。

- TargetBind は任意の ID / Time / Pos を取り、省略時はそれぞれ -1（全ターゲット）、1 tick、実行者の軸から 0,0 です。旧 description の「特定ターゲットを指定できない」は公式資料の ID 説明と衝突するため、原文を保持し、公開本文では ID による絞り込みを案内します。
- TargetBind の旧 Pos 省略時 `P2BodyDist=-1025,-1025` は、公式3資料の `0,0` と衝突します。旧記録、複数ターゲット時のフリーズ、Time=-2以下の警告、固定中の速度説明は内部 `research` に保持しました。
- TargetDrop は任意の ExcludeID / KeepOne を取り、省略時は -1（全ターゲットを外す）と1（最大1体を残す）です。KeepOne が0以外の場合のランダムな1体選択と、0の場合の全一致対象保持を公開しました。
- TargetFacing は必須 value の正負で、実行者と同方向・反対方向を指定します。任意 ID は省略時 -1 です。必須 value に付いていた旧 `default_value=1` は原本へ残して公開ビューと CNS コピペ欄から外し、読み込み順 `?` は推測していません。
- TargetFacing の複数ターゲット時フリーズ記録も、対象ビルドと再現ログがないため内部化しました。

```sh
npm run mugen:batch-baseline -- --batch target-control-01
npm run mugen:batch -- --batch target-control-01 --target TargetBind --target TargetDrop --target TargetFacing
npm run mugen:batch -- --batch target-control-01 --target TargetBind --target TargetDrop --target TargetFacing --apply
```

このバッチは適用済みです。次は BindToParent / BindToRoot / BindToTarget の位置固定を照合します。

## bind-position-01：親・ルート・ターゲット基準の位置固定3件

2026-10-01、BindToParent / BindToRoot / BindToTarget を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/bind-position-01/` へ保存しています。

- BindToParent / BindToRoot は Helper である実行者だけに作用し、それぞれ親・ルートの軸を基準に固定します。Time / Facing / Pos はすべて任意で、省略時は1 tick、向きを変えない、基準軸から 0,0 です。
- BindToRoot の旧 description は親 Helper を基準にすると説明していました。原文を保持し、公開本文では公式資料に合わせてルート基準へ訂正しました。
- BindToParent / BindToRoot の旧 Time 説明にある -1 の永続化、最小値 -1、最大値 2147483647 は、今回確認した公式コントローラー資料に記載がないため、JSON に保持して公開メタ情報から外しました。
- BindToTarget は任意の ID / Time / Pos を取り、ID は省略時 -1 で任意のターゲット1体、Time は省略時1です。Pos の基準位置は Foot / Mid / Head で、省略時の基準点はターゲットの軸です。
- BindToTarget の x/y オフセット省略値は公式資料に明記がないため不明を維持しました。旧 -1025 座標、次フレーム移動、速度同期、Time=-1、Time=-2以下の警告も対象ビルドと実行ログがないため内部 `research` に保持しました。

```sh
npm run mugen:batch-baseline -- --batch bind-position-01
npm run mugen:batch -- --batch bind-position-01 --target BindToParent --target BindToRoot --target BindToTarget
npm run mugen:batch -- --batch bind-position-01 --target BindToParent --target BindToRoot --target BindToTarget --apply
```

このバッチは適用済みです。次は TargetVelAdd / TargetVelSet のターゲット速度操作を照合します。

## target-velocity-01：ターゲット速度の加算・設定2件

2026-10-01、TargetVelAdd / TargetVelSet を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/target-velocity-01/` へ保存しています。

- TargetVelAdd は対象ターゲットの現在速度へ X / Y を加算し、TargetVelSet は指定した X / Y へ設定します。両方とも X / Y は任意で片方だけを指定でき、省略した軸の速度は変更しません。
- ID は任意の整数式で、省略時は -1 となり、すべてのターゲットを対象にします。既存の読み込み順1・2・3には管理者確認を付けました。
- 両コントローラーとも Y の正方向は画面下です。TargetVelAdd の X 正方向は各ターゲットが向いている方向、TargetVelSet は実行者が向いている方向です。
- TargetVelSet の旧 X / Y description は X 正方向もターゲット基準とします。原文を保持し、保存済み公式3資料に基づく実行者基準の説明を公開しました。対象ビルド別の実機照合までは行っていないため、差異を内部 `research` に残しています。

```sh
npm run mugen:batch-baseline -- --batch target-velocity-01
npm run mugen:batch -- --batch target-velocity-01 --target TargetVelAdd --target TargetVelSet
npm run mugen:batch -- --batch target-velocity-01 --target TargetVelAdd --target TargetVelSet --apply
```

このバッチは適用済みです。次は HitAdd / MoveHitReset / HitVelSet のヒット関連制御を照合します。

## hit-control-01：コンボ・接触フラグ・被弾速度の3件

2026-10-01、HitAdd / MoveHitReset / HitVelSet を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/hit-control-01/` へ保存しています。

- HitAdd は現在のコンボカウンターへ必須の整数式 value を加算します。旧 -2147483647〜2147483647 の値域、GetHitVar の HitCount への影響、リセットまで残るという記録は、対象ビルドと実行ログがないため内部 `research` に保持しました。
- MoveHitReset はパラメーターを取らず、実行後に MoveContact / MoveGuarded / MoveHit を0へ戻します。旧 description の Win版 MoveReversed も0にするという記録は、保存済み公式3資料に記載がないため非公開にしました。
- HitVelSet は任意の X / Y フラグを取り、0以外なら対応する実行者の速度成分を HitDef 由来の被弾速度へ設定します。0または省略時はその軸を変更しません。
- HitVelSet は2002.04.14資料から Obsolete、1.0 / 1.1資料でも Deprecated とされています。非推奨であることは公開本文へ移し、旧記録の「MUGEN 1.0以上」という限定と制作用途の補足は原文を保持して内部化しました。

```sh
npm run mugen:batch-baseline -- --batch hit-control-01
npm run mugen:batch -- --batch hit-control-01 --target HitAdd --target MoveHitReset --target HitVelSet
npm run mugen:batch -- --batch hit-control-01 --target HitAdd --target MoveHitReset --target HitVelSet --apply
```

このバッチは適用済みです。次は HitFallSet / HitFallVel / HitFallDamage の落下関連制御を照合します。

## hit-fall-01：落下変数・落下速度・落下ダメージの3件

2026-10-01、HitFallSet / HitFallVel / HitFallDamage を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/hit-fall-01/` へ保存しています。

- HitFallSet は任意の value / XVel / YVel を取り、value は省略時 -1 で落下フラグを変更しません。0は落下しない、1は落下する設定です。XVel / YVel は指定した場合だけ `fall.xvel` / `fall.yvel` を変更します。
- 旧 description とページカテゴリの「落下状態への強制移行」は、公式3資料の「落下変数を設定」と差があるため、原文を保持して公開本文・見出し・title・OGPを訂正しました。このため `documentation.page_category` を追加しています。
- 旧 value 説明の -2 以下、XVel / YVel が読み込まれない可能性、推測を含む GetHitVar 既定値は、対象ビルドと実行ログがないため内部 `research` に保持しました。XVel / YVel の読み込み順 `?` は推測していません。
- HitFallVel と HitFallDamage はパラメーターを取らず、前者は落下状態の実行者へ HitDef の落下速度を設定し、後者は落下ダメージを適用します。旧制作用途の補足は条件不足のため非公開です。

```sh
npm run mugen:batch-baseline -- --batch hit-fall-01
npm run mugen:batch -- --batch hit-fall-01 --target HitFallSet --target HitFallVel --target HitFallDamage
npm run mugen:batch -- --batch hit-fall-01 --target HitFallSet --target HitFallVel --target HitFallDamage --apply
```

このバッチは適用済みです。次は HitOverRide / NotHitBy の防御関連制御を照合します。

## hit-defense-01：攻撃属性への特殊防御2件

2026-10-01、HitOverRide / NotHitBy を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/hit-defense-01/` へ保存しています。

- HitOverRide は指定属性の HitDef を受けたときに通常のやられ処理を置き換え、最大8スロットを同時に有効化できます。Attr は必須、Slot は省略時0、Time は省略時1で -1 は上書きまで有効、ForceAir は省略時0です。
- HitOverRide の StateNo は公式資料の世代差を統合せず、Linux MUGEN 2002.04.14では任意・省略時 -1、MUGEN 1.0 / 1.1では必須として環境別に保存しました。CNS コピペ欄では環境依存値を有効な行へ決め打ちしません。
- MUGEN 1.0 / 1.1で有効な HitOverride がある場合、一致する相手 HitDef の `p1stateno != -1` または `p2getp1state = 1` の影響を受けない公式記載は公開注記にしました。旧警告文、MoveType H、スパーク／サウンドの記録は対象ビルドと再現ログがないため内部 `research` に保持しました。
- NotHitBy は HitBy と共有する2スロットの一方へ、指定属性を除く攻撃属性を設定します。value / value2 はどちらか一方が必須で同時指定不可、Time は省略時1です。CNS コピペ欄では value / value2 の両方を未指定のコメント行として残します。
- NotHitBy の旧カンマ／OR解釈と `SCA, NA` の例、Time=-1以下の永続化、32-bit値域、60フレーム補足は今回確認した公式資料から確定できないため、原文と内部 `research` に保存して HTML から外しました。

```sh
npm run mugen:batch-baseline -- --batch hit-defense-01
npm run mugen:batch -- --batch hit-defense-01 --target HitOverRide --target NotHitBy
npm run mugen:batch -- --batch hit-defense-01 --target HitOverRide --target NotHitBy --apply
```

このバッチは適用済みです。次は FallEnvShake / EnvShake の画面振動関連制御を照合します。

## environment-shake-01：落下時・任意指定の画面振動2件

2026-10-01、FallEnvShake / EnvShake を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/environment-shake-01/` へ保存しています。

- FallEnvShake はパラメーターを取らず、HitDef 由来の `fall.envshake` を使って落下時の画面振動を開始します。`GetHitVar(fall.envshake.time)` が0以外の場合だけ有効で、実行後は同値を0へ戻します。
- 保存済み公式更新履歴は2000-11-18項目で FallEnvShake を新規コントローラーと記録します。ただし対応する正確なビルドIDを現行レジストリで特定できないため、`introduced_in` は null のままです。旧制作用途は公式説明との差を内部 `research` に保持しました。
- EnvShake は上下方向の画面振動です。Time は省略不可、Freq は省略時60で0〜180、Ampl は2002.04.14では -4、1.0 / 1.1では240p=-4・480p=-8・720p=-16、Phase は Freq が90未満なら0・90以上なら90です。
- 解像度で変わる Ampl と Freq により変わる Phase は、CNS コピペ欄で単一の有効値へ決め打ちせずコメント行にします。Freq=60だけは確認済み固定値として有効行を維持します。
- EnvShake の旧負数警告、連続実行と作用開始、ライフバー、正弦波・`360 / Freq` 計算、高解像度ステージの背景振幅、Time の32-bit値域・60fps補足は対象ビルドと実行ログが不足しているため、原文と内部 `research` に保存して HTML から外しました。

```sh
npm run mugen:batch-baseline -- --batch environment-shake-01
npm run mugen:batch -- --batch environment-shake-01 --target FallEnvShake --target EnvShake
npm run mugen:batch -- --batch environment-shake-01 --target FallEnvShake --target EnvShake --apply
```

このバッチは適用済みです。次は AttackDist / PlayerPush / ScreenBound / Width の接触・画面境界関連制御を照合します。

## boundary-push-01：ガード距離・押し合い・画面境界の4件

2026-10-01、AttackDist / PlayerPush / ScreenBound / Width を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/boundary-push-01/` へ保存しています。

- AttackDist は現在の HitDef の `guard.dist` を変更します。2002資料は有効な HitDef がない場合に効果がないとし、1.0 / 1.1資料は `MoveType = A` の条件を記載します。value は必須のピクセル距離です。
- PlayerPush は押し合い判定を1 tick切り替え、value=0で無効、非0で有効です。旧説明のプレイヤー／Helper初期値は公式コントローラー資料で確認できないため原文と内部 `research` に保持しました。
- ScreenBound は画面外への移動許可とカメラ追従を別々に制御し、効果は1 tickです。value の省略時は2002資料で不明、1.0 / 1.1資料で0、MoveCamera は0,0です。旧「value=0で追従を止める」と解除時ワープの記録は内部化しました。
- Width は Edge / Player が任意でそれぞれ省略時0,0、`; value` が両方を同時に設定する代替書式です。旧 JSON は Edge / Player を必須としていたため原文を保持し、公開分類とCNSコピペ欄だけを任意へ訂正できる `parameter[].documentation.parameter_type` を追加しました。未検証の値域と投げ技用途は内部に残しました。
- Width の既存デバッグ画像と、画面端幅を橙・押し合い幅を黄で表示する確認済み情報は保持しています。代替の `value` は CNS コピー欄で有効化しません。

```sh
npm run mugen:batch-baseline -- --batch boundary-push-01
npm run mugen:batch -- --batch boundary-push-01 --target AttackDist --target PlayerPush --target ScreenBound --target Width
npm run mugen:batch -- --batch boundary-push-01 --target AttackDist --target PlayerPush --target ScreenBound --target Width --apply
```

このバッチは適用済みです。次は画面演出・表示制御の未移行ページを照合します。

## dust-effect-01：土煙表示の1件

2026-10-01、MakeDust を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/dust-effect-01/` へ保存しています。

- 公式3世代資料で必須パラメーターなし、Pos の省略時 0,0、Pos2 省略時は2つ目を表示しないこと、Spacing の省略時3・指定値1以上を確認しました。CNSコピー欄は Pos / Spacing を有効行、Pos2 をコメント行にします。
- 1.0 / 1.1資料で非推奨と Explod の案内を確認しました。旧履歴本文を保持し、対象世代を構造化しました。
- 旧警告文 `MAKEDUST SPACING <= 0`、fightfx.air の素材、1フレーム効果は対象ビルドの実行記録がないため、原文と内部 `research` に保存してHTMLから外しました。旧画像は維持しています。

```sh
npm run mugen:batch-baseline -- --batch dust-effect-01
npm run mugen:batch -- --batch dust-effect-01 --target MakeDust
npm run mugen:batch -- --batch dust-effect-01 --target MakeDust --apply
```

このバッチは適用済みです。次は EnvColor など画面演出・表示制御の未移行ページを照合します。

## environment-color-01：画面の単色表示の1件

2026-10-01、EnvColor を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/environment-color-01/` へ保存しています。

- 公式3世代資料で RGB各成分0〜255、省略時255,255,255（白）、Time省略時1 tick・-1で無期限、Under省略時0・1でキャラクターと飛び道具の下に描画することを確認しました。CNSコピー欄は3パラメーターとも確認済みの省略値を有効行にします。
- 前面レイヤーのアニメーションと `ontop` Explod は塗りつぶしの上に表示され、ステージの前面レイヤーは表示されないという公式説明を公開します。旧画像は維持しています。
- 旧 Time=-2 描画不具合、警告文、AllPalFX・ライフバー等との細かなレイヤー相互作用、制作用途、数値上限は原文と内部 `research` に残し、HTMLから外しました。

```sh
npm run mugen:batch-baseline -- --batch environment-color-01
npm run mugen:batch -- --batch environment-color-01 --target EnvColor
npm run mugen:batch -- --batch environment-color-01 --target EnvColor --apply
```

このバッチは適用済みです。次はほかの画面演出・表示制御ページを照合します。

## game-animation-01：共通アニメーション表示の1件

2026-10-01、GameMakeAnim を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/game-animation-01/` へ保存しています。

- 公式3世代資料で `fightfx` の共通アニメーション表示、非推奨と Explod への置き換え、4つの任意パラメーターを確認しました。value=0、Pos=0,0、Random=0、Under=0をCNSコピー欄に有効行で出します。
- Random はX・Y方向へ独立したランダム変位を与え、各変位は指定値の半分までという公式説明に対応しました。旧「正方形の範囲」説明は原位置と内部 `research` に残します。
- 旧2警告は対象ビルドの実行記録がないため内部 `research` へ対応付けました。旧履歴の非推奨文はそのまま公開し、旧見出しの不明な開始バージョンは確定しません。

```sh
npm run mugen:batch-baseline -- --batch game-animation-01
npm run mugen:batch -- --batch game-animation-01 --target GameMakeAnim
npm run mugen:batch -- --batch game-animation-01 --target GameMakeAnim --apply
```

このバッチは適用済みです。次はほかの画面演出・表示制御ページを照合します。
## transparency-01：アニメーション透過の1件

2026-10-02、Trans を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/transparency-01/` へ保存しています。

- 公式3世代資料で1 tickの透過上書き、必須の Trans と任意の Alpha を確認しました。Default（変更なし）と None（透過なし）を区別し、旧候補表の推測を公開しません。
- Alpha の2002 / 1.0資料における省略値256,0と、1.1資料における透過型別の値を分けました。Transが必須、Alphaが型依存のため、CNSコピー欄では両方をコメント行にします。
- 1.1資料で AddAlpha / Add1 が非推奨であることを公開し、旧影・反射記録と負数アルファは内部 `research` に保持しました。2002 / 1.0資料内の「AddAlphaではAlpha指定必須」と「Alpha省略時256,0」の不整合も内部で追跡します。旧サンプルと画像は保持しています。

```sh
npm run mugen:batch-baseline -- --batch transparency-01
npm run mugen:batch -- --batch transparency-01 --target Trans
npm run mugen:batch -- --batch transparency-01 --target Trans --apply
```

このバッチは適用済みです。次はほかの画面演出・表示制御ページを照合します。

## explod-binding-01：Explodの位置結合時間の1件

2026-10-02、ExplodBindTime を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/explod-binding-01/` へ保存しています。

- 公式3世代資料で ID の省略時 -1（すべての実行者のExplod）、Timeの省略時1 tickと -1 の無期限結合、value の代替書式を確認しました。CNSコピー欄は ID / Time を有効行、value をコメント行にします。
- 旧Time説明の「-1以下で永続化」は公式資料の「-1」と範囲が異なり、旧警告の -2 以下とも食い違います。警告文2件と値域の差は原文・内部 `research` に保持しました。Time/value併記時の優先順位も内部に残します。

```sh
npm run mugen:batch-baseline -- --batch explod-binding-01
npm run mugen:batch -- --batch explod-binding-01 --target ExplodBindTime
npm run mugen:batch -- --batch explod-binding-01 --target ExplodBindTime --apply
```

このバッチは適用済みです。次はほかの画面演出・表示制御ページを照合します。

## explod-removal-01：Explod削除の1件

2026-10-02、RemoveExplod を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/explod-removal-01/` へ保存しています。

- 公式3世代資料で実行者が所有するExplodの削除、ID指定による絞り込み、省略時の全件削除を確認しました。
- 旧JSONの `ID=-1` は公式のRemoveExplod資料では具体値として記されていません。原文と内部 `research` に保持し、CNSコピー欄ではIDをコメント行にしました。旧負数警告も対象ビルドの実行ログがないため内部に保持しています。

```sh
npm run mugen:batch-baseline -- --batch explod-removal-01
npm run mugen:batch -- --batch explod-removal-01 --target RemoveExplod
npm run mugen:batch -- --batch explod-removal-01 --target RemoveExplod --apply
```

このバッチは適用済みです。次はほかの画面演出・表示制御ページを照合します。

## afterimage-duration-01：残像持続時間の1件

2026-10-02、AfterImageTime を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/afterimage-duration-01/` へ保存しています。

- 公式3世代資料で表示中の残像効果にのみ作用すること、Time が必須で Value が代替書式であることを確認しました。旧 Time の任意分類は原位置へ残し、公開分類とCNSコピー欄だけを必須に訂正しました。
- 元の AfterImage の TimeGap が1以外だとフレーム位置がリセットされる不具合は公式3資料に明記されていました。旧疑問形の記録は内部に保持し、制作に役立つ断定文を公開の bug 注記として追加しました。
- 旧概要・Time説明の計算式、特殊値、警告、動画付き3例は今回の資料だけで裏付けられないため、原文・コード・動画IDをJSONに残し、HTMLから外しました。CNSコピー欄ではTime / Valueともコメント行にします。

```sh
npm run mugen:batch-baseline -- --batch afterimage-duration-01
npm run mugen:batch -- --batch afterimage-duration-01 --target AfterImageTime
npm run mugen:batch -- --batch afterimage-duration-01 --target AfterImageTime --apply
```

このバッチは適用済みです。次は AfterImage 本体など残像表示関連ページを照合します。

## clipboard-clear-01：クリップボード消去の1件

2026-10-02、ClearClipboard を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/clipboard-clear-01/` に保存しています。

- 保存済み Elecbyte 2002.04.14 / 1.0 / 1.1 資料で、実行者のクリップボードにあるテキストの消去と固有の必須・任意パラメーターがないことを確認しました。
- 旧説明と出典をそのまま保持し、公開説明・内部根拠・ローカル公式出典を追加しました。CNS コピー欄の共通パラメーターは維持し、`Text` / `Params` のような他の Clipboard コントローラーの項目を生成しません。
- AfterImage 本体の旧 `Alpha` と `Trans=AddAlpha` は今回確認した保存済み公式資料に見当たらず、残像本体の移行は別途公開範囲を整理してから行います。

```sh
npm run mugen:batch-baseline -- --batch clipboard-clear-01
npm run mugen:batch -- --batch clipboard-clear-01 --target ClearClipboard
npm run mugen:batch -- --batch clipboard-clear-01 --target ClearClipboard --apply
```

このバッチは適用済みです。次は DisplayToClipboard / AppendToClipboard の書式とバージョン差を照合します。

## clipboard-display-01：クリップボード上書き表示の1件

2026-10-02、DisplayToClipboard を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/clipboard-display-01/` に保存しています。

- 保存済み公式資料で、デバッグ用クリップボードの上書き、ダブルクォートで囲む `Text`、数値式の `Params`、2002資料の最大5個と1.0 / 1.1資料の最大6個を確認しました。1.0 / 1.1の数値書式指定は公式に列挙されたものだけを公開しています。
- 旧 `%s` フリーズ、`%n` の危険性、書式候補表、型不一致の旧説明は資料や実機結果と照合できないため、旧フィールド・内部 `research` に保持しました。旧コード3例と AppendToClipboard とラベル付けされた画像も内部に残しました。
- `%n` の旧調査リンクは JSON に残す一方、引用記事一覧から外しました。このため `quote[].visibility: internal` を追加し、生成HTML比較で内部出典リンクを追跡します。公開履歴の比較検査は、旧文を原本に保持した上で、書き直した公開用本文を照合するよう修正しました。

```sh
npm run mugen:batch-baseline -- --batch clipboard-display-01
npm run mugen:batch -- --batch clipboard-display-01 --target DisplayToClipboard
npm run mugen:batch -- --batch clipboard-display-01 --target DisplayToClipboard --apply
```

このバッチは適用済みです。次は AppendToClipboard を照合します。

## clipboard-append-01：クリップボード追記表示の1件

2026-10-02、AppendToClipboard を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/clipboard-append-01/` に保存しています。

- 保存済み公式資料で、DisplayToClipboard と同じ書式を使いながら既存内容の次の行へ追記することを確認しました。`Text` の必須書式、`Params` の2002資料では最大5個、1.0 / 1.1資料では最大6個という差も対応させました。
- 旧 `Params.type` は `string` ですが、公式資料では数値式のリストです。原本を残しつつ公開型だけ `parameter[].documentation.type` で「数値式」に訂正しました。CNS コピー欄では未指定の `Text` / `Params` を有効な代入行にしません。
- 旧 `%s` フリーズ・`%n` の危険性・未確認の書式候補、コード例3件、内部調査用出典は JSON に残してHTMLから外しました。

```sh
npm run mugen:batch-baseline -- --batch clipboard-append-01
npm run mugen:batch -- --batch clipboard-append-01 --target AppendToClipboard
npm run mugen:batch -- --batch clipboard-append-01 --target AppendToClipboard --apply
```

このバッチは適用済みです。次はほかのデバッグ表示系か残像関連ページを照合します。

## parameterless-controllers-01：固有パラメーター不要の2件

2026-10-02、Turn と Null を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/parameterless-controllers-01/` に保存しています。

- 保存済み Elecbyte 2002.04.14 / 1.0 / 1.1 資料で、Turn は振り向きアニメーションなしの即時反転、Null は無処理で一時的なコントローラー無効化に使えることを確認しました。両方とも固有の必須・任意パラメーターはありません。
- Null のトリガーも評価されるという補足は1.1資料だけに明記されていたため、対象を1.1系列に絞った公開注記として追加しました。Turn の既存画像と両ページの旧説明・出典は保持しています。
- CNS コピペ欄に架空の固有パラメーターが現れず、共通の IgnoreHitPause / Persistent だけが続くことを検査しました。

```sh
npm run mugen:batch-baseline -- --batch parameterless-controllers-01
npm run mugen:batch -- --batch parameterless-controllers-01 --target Turn --target Null
npm run mugen:batch -- --batch parameterless-controllers-01 --target Turn --target Null --apply
```

このバッチは適用済みです。次は Pause など時間停止関連ページを照合します。

## pause-time-01：通常時間停止の1件

2026-10-02、Pause を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/pause-time-01/` に保存しています。

- 保存済み公式3世代資料で、Time 必須・0以上、MoveTime / EndCmdBufTime の0からTimeまで、MoveTime=0、PauseBG=1、EndCmdBufTime=0の既定値を確認しました。旧説明の「Timeは必ずMoveTimeより大きい」は両者が等しい場合を除外するため、公開文を訂正しました。
- 停止中に別のPauseを実行すると前の効果を取り消し、SuperPause中のPauseはその終了後に有効になることを公開注記へ記録しました。旧警告文、全スプライトと-1/-2/-3ステートの停止、Helper / Explodの詳細は原文・内部注記に保持しています。特に旧「Timeに0以下で警告」は公式の0許容と衝突するため公開しません。
- 旧警告の参照リンクもJSON内に残して引用一覧から外しました。CNS欄はTimeを必須のコメント行とし、確認できた任意3項目の既定値を有効行にします。

```sh
npm run mugen:batch-baseline -- --batch pause-time-01
npm run mugen:batch -- --batch pause-time-01 --target Pause
npm run mugen:batch -- --batch pause-time-01 --target Pause --apply
```

このバッチは適用済みです。次は SuperPause を照合します。

## superpause-time-01：演出付き時間停止の1件

2026-10-03、SuperPause を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/superpause-time-01/` に保存しています。

- 保存済み公式3世代資料と同じ世代の Pause 欄を照合し、11項目の任意指定と既定値を構造化しました。Time=30、Anim=-1の演出なし、Sound=-1の無音、S接頭辞、Posの実行者軸基準、P2DefMul=0の設定参照、Pauseの中断と残り時間保持を対応させました。
- 旧 Sound ラベルは番号の順が逆なので、公開ラベルを「グループ番号・サウンド番号」へ訂正しました。TimeとMoveTimeの厳密な大小関係、EndCmdBufTimeの対象、PosとP2DefMulの説明も原文を残して訂正しています。UnHitTableは公式のunhittableと大文字小文字だけが異なるため、既存名を保持しました。
- RoundStateによるパワー増減条件、警告5件、細かな更新停止条件と固定最大値は原文・内部researchへ保持しました。PowerAddの読み込み順20を含め既存順序は維持しています。CNS欄は確認した11項目の省略値を有効行にします。

```sh
npm run mugen:batch-baseline -- --batch superpause-time-01
npm run mugen:batch -- --batch superpause-time-01 --target SuperPause
npm run mugen:batch -- --batch superpause-time-01 --target SuperPause --apply
```

このバッチは適用済みです。次は PlaySnd / StopSnd / SndPan などサウンド関連ページを照合します。

## sound-control-01：サウンド再生・停止・定位の3件

2026-10-03、PlaySnd / StopSnd / SndPan を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/sound-control-01/` に保存しています。

- 保存済み公式3世代資料で、PlaySndのSND識別子・F接頭辞・Channel=-1/0・周波数と繰り返し、StopSndのChannel必須と-1で他プレイヤーも含む全停止、SndPanのChannelとPan / AbsPanの代替必須指定を確認しました。旧SndPanの任意分類・Pan=0は原位置へ残し、公開分類とCNSコピー欄を訂正しています。StopSndの旧コード2例は保持しました。
- PlaySndの音量方式は1.0 RC8からVolumeScaleへ変わり、Volumeが無視されます。`mugen-1.0-rc8` をレジストリへ追加し、公式履歴の2010-06-29を記録しました。1.0系列全体をRC8以降として扱わず、RC8・正式版・1.1に適用範囲を絞っています。旧`;VolumeScale` 名も保持し、世代依存の音量行はCNS欄でコメントのままです。
- [CHAOSのPlaySnd記録](https://w.atwiki.jp/mugencns/pages/251.html)で旧Volume=0とLowPriority=0の省略値を照合しました。旧Volumeの±255は同記事でも推定値なので、元の最小・最大値を保持し公開表から外しています。旧common.snd候補表、警告、Pan / AbsPan併記時の優先順位、Loopによる影響、大きいチャンネル番号の挙動は内部で追跡します。

```sh
npm run mugen:batch-baseline -- --batch sound-control-01
npm run mugen:batch -- --batch sound-control-01 --target PlaySnd --target StopSnd --target SndPan
npm run mugen:batch -- --batch sound-control-01 --target PlaySnd --target StopSnd --target SndPan --apply
```

このバッチは適用済みです。次は PalFX / AllPalFX / BGPalFX など色調関連ページを照合します。

## palette-effects-01：パレットの色効果の3件

2026-10-03、PalFX / AllPalFX / BGPalFX を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/palette-effects-01/` に保存しています。

- 保存済み公式3世代資料の適用対象と共通6項目を照合しました。BGPalFXの対象には背景に加えてライフバーも含まれます。Color、InvertAll、加算・乗算の順を公開し、反転を最後に行う旧Q&Aは原文を保持して内部へ移しました。Mulの固定1..256範囲を外し、0以上という指定条件を公開しています。
- Time=0は進行中の効果停止、-1は無期限継続です。Timeの省略値0は[CHAOSのPalFX記録](https://w.atwiki.jp/mugencns/pages/64.html)へ対応させました。SinAddの旧省略値0,0,0,0は公式欄に明記がなく、独立した根拠が得られないためunknownへ分類し、CNS欄ではコメントにしています。旧値、パラメーター画像、カンマを含む読み込み順の表記は保持しました。
- AllPalFXの緑・青が無視される修正は1.0 RC8、デバッグ文字への影響の修正は1.1 Beta 1の公式履歴へ対応させました。旧「1.0以降で使えない」というデバッグ文字用コード例と18件の旧履歴・警告は内部へ残しています。フラッシュ例と動画は保持しました。
- [CHAOSのAllPalFX記録](https://w.atwiki.jp/mugencns/pages/63.html)にある持続中の効果消失と同じAdd/Mulによる再実行の問題も保持しました。BGPalFXのCHAOS個別記事は取得できず、その本文を推測して補っていません。新たなスキーマ・表示機能は追加していません。

```sh
npm run mugen:batch-baseline -- --batch palette-effects-01
npm run mugen:batch -- --batch palette-effects-01 --target PalFX --target AllPalFX --target BGPalFX
npm run mugen:batch -- --batch palette-effects-01 --target PalFX --target AllPalFX --target BGPalFX --apply
```

このバッチは適用済みです。次は RemapPal などパレット関連ページを照合します。

## palette-remap-01：パレット割り当ての1件

2026-10-03、RemapPal を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/palette-remap-01/` に保存しています。

- 保存済み公式1.0資料ではSource / Destが必須、1.1では任意で両方の省略値が-1,0です。`variants[].parameter_type` を採用して各環境の分類を表示し、見出しも世代依存を示します。CNS欄ではSource / Destを環境確認付きのコメント行にして、1.1値を1.0向けへ無条件に出力しません。
- 割り当てが非推移的である既存の番号例を保持し、1.1のSourceグループ=-1による全対象変更・既存割り当て解除、Destグループ=-1と同番号指定による解除、同時8件制限と未登録Sourceの失敗条件を公開しました。旧必須分類・?・読み込み順のカンマ表記は保持しています。
- OwnPal=1のHelper / Explodに作用しない不具合の修正は1.0 RC4へ対応させました。初導入RC、1.1の任意指定・特殊値対応の正確な変更ビルドは未確定の内部researchです。「New in 1.1」の記述をAlpha 4等の特定ビルドへ推定で割り当てません。

```sh
npm run mugen:batch-baseline -- --batch palette-remap-01
npm run mugen:batch -- --batch palette-remap-01 --target RemapPal
npm run mugen:batch -- --batch palette-remap-01 --target RemapPal --apply
```

このバッチは適用済みです。次は AfterImage 本体の旧透過指定の根拠と公開範囲を整理します。

## afterimage-effects-01：残像生成の1件

2026-10-03、AfterImage を移行しました。移行前の JSON・記事・ハッシュは `tests/mugen/batches/afterimage-effects-01/` に保存しています。

- 保存済み公式3世代の標準12項目を照合しました。PalPostBrightは全残像共通の乗算後加算です。PalAdd / PalMulは最新の履歴へ0回、古い履歴へ1回・2回…と繰り返します。PalMulの旧整数・256で割る説明は原位置へ残し、公開型を浮動小数の倍率へ訂正しました。FrameGap=4の表示例も1番目・5番目・9番目へ対応させています。
- `parameter[].visibility` / `arguments[].visibility` を採用しました。旧Alphaの説明・256,0?・読み込み順21,22は内部へ保持し、詳細・一覧・CNS欄・読み込み順表から外します。非公開項目の後にある共通項目は元のアンカー番号を保ちます。通常の12省略値と共通2項目はCNS欄の有効行です。
- 公式AfterImage欄にはAlpha / AddAlphaがありませんが、[新MUGENの報告](https://w.atwiki.jp/niconicomugen/pages/3627.html)には対応の世代差が記録されています。非実在と断定せず、対応ビルドと省略値を内部で追跡します。PalBrightの赤が「1.0より前だけ機能しない」という旧区切りも確定せず、[CHAOS](https://w.atwiki.jp/mugencns/pages/60.html)と[1.0解析記事](https://ziddia.blog.fc2.com/blog-entry-42.html)の表記差を残しました。
- 旧不具合・警告の履歴5件、範囲外の値・丸め、終了時間計算、AfterImageMaxの値、Q&A6件、応用例3件は原文を保持して内部で追跡します。基本例とその透過比較画像、パラメーター動画・画像・トップ画像は公開のままです。取得できなかった旧IRC・2500loops記事の本文を推測で補っていません。

```sh
npm run mugen:batch-baseline -- --batch afterimage-effects-01
npm run mugen:batch -- --batch afterimage-effects-01 --target AfterImage
npm run mugen:batch -- --batch afterimage-effects-01 --target AfterImage --apply
```

このバッチは適用済みです。次は AngleDraw など描画変換のページを照合します。

## angle-draw-01：回転・拡縮描画の1件

2026-10-04、AngleDrawを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/angle-draw-01/` に保存しています。

- 保存済み公式3世代と[CHAOS](https://w.atwiki.jp/mugencns/pages/74.html)を照合し、valueの省略時は保持している角度を使うと表示します。旧default_valueの0は原位置に残し、CNS欄のvalueは省略条件付きコメントへ変更しました。Scaleの1,1は等倍の中立倍率として保持し、同フレームの複数実行は倍率を乗算すること、既存の拡縮をリセットしないことを説明しました。
- 1.0 RC6の公式履歴にあるHitPause中の効果非リセットを2002互換設定へ対応させました。旧「1.0より前／以後」2履歴は内部researchへ対応させ、累積倍率やIgnoreHitPauseの詳細を実行バージョンだけで確定しません。
- AIR座標・反転・透過の無効化とAfterImageへの波及、途中Elem=-1の二重表示、描画品質、対応開始世代の資料差は内部に保存しました。旧画像・読み込み順は保持しています。旧kneco・luna記事の本文は取得できず、実機検証は行っていません。新たなスキーマ・表示機能は追加していません。

```sh
npm run mugen:batch-baseline -- --batch angle-draw-01
npm run mugen:batch -- --batch angle-draw-01 --target AngleDraw
npm run mugen:batch -- --batch angle-draw-01 --target AngleDraw --apply
```

このバッチは適用済みです。次はOffsetの描画位置、判定枠への影響、省略時の値、RC6の互換対応を照合します。
