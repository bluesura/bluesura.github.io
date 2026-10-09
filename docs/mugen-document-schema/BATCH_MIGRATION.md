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

## display-offset-01：表示位置のずらしの1件

2026-10-04、Offsetを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/display-offset-01/` に保存しています。

- 保存済み公式3世代と[CHAOS](https://w.atwiki.jp/mugencns/pages/241.html)を照合しました。表示と攻撃・食らい判定枠はずれますが、Pos X/Yと押し合い判定は変わらない点を整理しています。Xは画面右が正、Yは下が正で、Facingに依存しない方向を明記しました。
- X/Yはそれぞれ任意ですが、省略時の数値は資料に明記されていません。旧default_valueの空文字は原位置に残し、defaultをunknownにしてCNS欄はコメントのままにしています。読み込み順1・2は維持しました。
- 1.0 RC6の座標系に対する拡縮の修正と、2002互換でHitPause中に効果がリセットされない挙動の再現を別の履歴として公開しました。自動着地・TargetStateによる取消、Explod射出基準、同フレーム重複時の合成は内部researchへ保存し、実機検証は行っていません。

```sh
npm run mugen:batch-baseline -- --batch display-offset-01
npm run mugen:batch -- --batch display-offset-01 --target Offset
npm run mugen:batch -- --batch display-offset-01 --target Offset --apply
```

このバッチは適用済みです。次はAssertSpecialのフラグ、世代差、1フレーム効果と互換挙動を照合します。

## special-flags-01：特殊フラグの1件

2026-10-04、AssertSpecialを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/special-flags-01/` に保存しています。

- 保存済み公式3世代の19フラグを、フラグ・対象・効果の公開表へ整理しました。`documentation.possible_value` を採用し、旧20フラグ表を原位置に保持して訂正表を表示します。NoMusicは一時停止、GlobalNoShadowはplayer/helper/explod、UnGuardableは実行者のHitDef、ガード制限は実行者自身に対応させています。NoKOSndの11,0とエコー抑制50フレーム以上も保持しました。
- Flag必須・Flag2/3省略時は追加指定なしを構造化しました。CNS欄は3項目ともコメントで、Flag1など非実在のパラメーターを出力しません。読み込み順の?は未確認のまま保持しました。
- RC6のInvisibleのHitPause修正と2002互換設定での9フラグ非解除を別履歴へ対応させました。旧NoMusicプラグイン・RoundNotOverの配点なし移行、NoKOのビルド/判定条件、負ステート/所有物への作用、背景描画、Time/GameTime/Juggle更新は内部に保持しています。[CHAOS](https://w.atwiki.jp/mugencns/pages/199.html)の記録も内部で対応させ、未取得の旧ブログ本文は補っていません。
- 旧ガード不能例は実行者へのガード制限であり、説明とPrevStateNo条件にもずれがあります。原文を内部に保持し、表示と影を消す基本例を公開しました。スキーマ・公開値の解決・HTML検査を変更し、候補表の保存と訂正、混在形式の拒否、共通定義とTrigger引数の優先順位を検査しています。CSSやページのブランドは変更していません。

```sh
npm run mugen:batch-baseline -- --batch special-flags-01
npm run mugen:batch -- --batch special-flags-01 --target AssertSpecial
npm run mugen:batch -- --batch special-flags-01 --target AssertSpecial --apply
```

このバッチは適用済みです。

## helper-destruction-01：Helper消去の1件

2026-10-04、DestroySelfを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/helper-destruction-01/` に保存しています。

- Helper専用の消去と、2002/1.0の固有項目なし、1.1のRecursive/RemoveExplodsを照合しました。Recursiveは子・孫以降の再帰消去、RemoveExplodsは所有Explodの消去です。両方1なら子孫のExplodも消去します。旧「画像全般」のラベルは原位置へ残して訂正しました。
- 両省略値0は1.1環境へ対応させ、CNS欄は環境確認付きコメントです。1.1の強制バインド解除と未消去Explodの所有元喪失を公開しました。1.0 RC5のステート評価中断修正へ対応させ、レジストリにRC5と公式履歴の日付2009-10-28を追加しています。
- 1.1履歴のRecursive追加・不安定動作修正はNew in 1.1で、特定Alphaを推定していません。旧Explod残存の世代境界、Helper生成後クラッシュ、[CHAOS](https://w.atwiki.jp/mugencns/pages/212.html)の消去タイミング・Draw.offset位置ずれは内部に保持しました。旧分身対策例は適用条件の整理待ちで内部に残し、アニメ終了時の基本例を公開しています。実機検証は未実施です。

```sh
npm run mugen:batch-baseline -- --batch helper-destruction-01
npm run mugen:batch -- --batch helper-destruction-01 --target DestroySelf
npm run mugen:batch -- --batch helper-destruction-01 --target DestroySelf --apply
```

このバッチは適用済みです。次はVarAdd・ParentVarSet・ParentVarAddの変数番号・値・代替書式を照合します。

## variable-operations-01：変数の加算・親への操作の3件

2026-10-04、VarAdd / ParentVarSet / ParentVarAddを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/variable-operations-01/` に保存しています。

- 保存済み公式3世代を照合し、整数番号0～59、浮動小数番号0～39、v/value・fv/valueと代替書式を整理しました。VarAdd系の `var(番号) = 値` も加算で、ParentVarSetは置き換えです。旧ラベル・説明・空欄/?の省略値を原位置へ残し、必須値を推測の0で埋めていません。
- ParentVarSetの旧optionalを保持し、公開表示では選択した書式の必須項目へ訂正しました。1つの書式を選ぶ制約と番号/valueの組を明記し、CNS欄の固有6行はすべてコメントにしています。基本例では整数標準書式と浮動小数代替書式を別々に示しています。
- ParentVar系は直近の親へ作用し、親がHelperならそのHelperが対象です。[CHAOSのParentVarSet](https://w.atwiki.jp/mugencns/pages/244.html)とも照合しました。カスタムステートの実行者・対象を明記し、1.1のsysvar/sysfvar非対応とBeta 1の解析クラッシュ修正を分けています。修正をシステム変数対応の追加へ変換しません。
- 旧7履歴、停止中のVarAdd、大文字・警告・型変換・書式併記の優先順位は内部に保持しました。[CHAOSのVarAdd](https://w.atwiki.jp/mugencns/pages/243.html)のsysvar/sysfvar記載も未文書化の対応調査として残しています。ParentVarAddのCHAOS本文と旧警告の出典は今回取得できず、実機検証も未実施です。読み込み順1/2と括弧内先行の注釈は保持しています。

```sh
npm run mugen:batch-baseline -- --batch variable-operations-01
npm run mugen:batch -- --batch variable-operations-01 --target VarAdd --target ParentVarSet --target ParentVarAdd
npm run mugen:batch -- --batch variable-operations-01 --target VarAdd --target ParentVarSet --target ParentVarAdd --apply
```

このバッチは適用済みです。次はVarRandom・VarRangeSetです。

## variable-ranges-01：乱数代入・連続範囲への代入の2件

2026-10-04、VarRandom / VarRangeSetを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/variable-ranges-01/` に保存しています。

- 保存済み公式3世代を照合しました。VarRandomは実行者の整数変数1つへ指定範囲の乱数を代入し、浮動小数変数は対象外です。Rangeの両端を含む範囲・単一引数の0～最大値・省略値0,1000を明記し、旧カテゴリのRandomトリガーとの混同とvの「増減」を原文非破壊で訂正しました。
- VarRangeSetは連続範囲へ同じ値を代入します。value/fvalueはどちらか必須で、式は1回だけ評価されます。Firstは0、Lastは整数用valueなら59、浮動小数用fvalueなら39です。Lastの旧「最初」説明を訂正し、具体的な59/39をderivedの表示に保存しました。CNS欄で代入値・Lastを推測の固定値として有効にしません。
- 基本例はVarRandomの単一引数と負の値を含む範囲、VarRangeSetの同じRandom評価結果を5変数へ代入する例と全40浮動小数変数への0.5代入例を公開しました。相手のカスタムステートでの作用対象も整理しています。CSS・スキーマ・表示コンポーネントは変更していません。
- [VarRandomのCHAOS](https://w.atwiki.jp/mugencns/pages/246.html)の+32767限界・15bit/分布の推測は内部の未検証記録です。[VarRangeSetのCHAOS](https://w.atwiki.jp/mugencns/pages/247.html)のFValueのInt型表記は公式floatとの差をconflictingとして保持し、5900/F4・チームの持ち越し条件も内部へ残しました。旧2警告・範囲外/逆転/部分適用・型変換も未検証です。旧警告の出典本文は503で取得できませんでした。読み込み順と各成分を保持し、実機検証は未実施です。

```sh
npm run mugen:batch-baseline -- --batch variable-ranges-01
npm run mugen:batch -- --batch variable-ranges-01 --target VarRandom --target VarRangeSet
npm run mugen:batch -- --batch variable-ranges-01 --target VarRandom --target VarRangeSet --apply
```

このバッチは適用済みです。次はVar・FVar・SysVar・SysFVarです。

## variable-read-01：変数参照トリガーの4件

2026-10-04、Var / FVar / SysVar / SysFVarを移行しました。移行前のJSON・記事・ハッシュは `tests/mugen/batches/variable-read-01/` に保存しています。

- 保存済み公式3世代を照合しました。整数戻り値はVar/SysVar、浮動小数戻り値はFVar/SysFVarで、引数の番号はすべて整数式です。必須Nを旧parameterへ対応させ、0～59 / 0～39 / 0～4の範囲と元のメタ情報を保持しています。State用の共通パラメーターをTriggerへ追加しません。
- 2002資料のSFalseと1.0/1.1のbottomを、実機の変更履歴とは区別して公開しました。旧WinMUGENというビルドへの対応付けは内部に残しました。Cond/IfElseの特殊な評価規則を分け、部分式のbottomが常に式全体へ波及するとは書きません。
- 1.0/1.1の式中代入はリダイレクトされていないVar/FVarが左辺です。右辺の整数切り詰め・浮動小数への変換・代入後の戻り値を整理しました。[CHAOSの演算子](https://w.atwiki.jp/mugencns/pages/44.html)とも照合し、SysVar/SysFVarの旧:=説明・構文を公開側で訂正しています。関連するSysVarSet/SysVarAdd/SysFVarSet/SysFVarAddは照合したElecbyte仕様とリポジトリ内に対応定義がなく、旧IDを保持してリンクを非表示にしました。
- ルートdocumentationへsyntax/associated_stateを追加しました。構文は詳細とTrigger一覧で共通解決し、関連IDは未指定時の旧値と明示した空配列を区別します。旧公開リンクの除外は明示した訂正配列に限定し、HTML検査で新しい構文と関連リンクを確認しています。旧データの保存検査は維持しています。
- 旧共通図のbottom例外・リダイレクト代入の説明、前提不足の更新/キャッシュ例とVarの一部Q&Aは原位置へ保持して内部にしました。Var/FVarの公開例ではNullの式中代入と条件の比較を明示しています。SysVar/SysFVarの公式2002/1.0 Format欄の通常変数名という表記差も内部に保存しました。ParentVar系の1.1 Beta 1解析クラッシュ修正は対応追加と区別して公開しています。番号の型変換・警告・持ち越し・リダイレクトされた式全体の代入条件は実機未検証です。

```sh
npm run mugen:batch-baseline -- --batch variable-read-01
npm run mugen:batch -- --batch variable-read-01 --target Var --target FVar --target SysVar --target SysFVar
npm run mugen:batch -- --batch variable-read-01 --target Var --target FVar --target SysVar --target SysFVar --apply
```

このバッチは適用済みです。次はLife・LifeMax・Power・PowerMaxです。

## 2026-10-04：resource-read-01

Life / LifeMax / Power / PowerMaxの4件を追加しました。累計126件（主要・補助16件＋48バッチ110件）、残り108件です。型と引数なしは保存済み2002.04.14・1.0・1.1b1のTrigger Referenceを照合し、導入ビルドはnullに保持しました。

- Lifeは現在ライフ、LifeMaxはチーム等で補正され得る最大ライフ、Powerは現在量、PowerMaxは最大量として公開概要を整理。整数除算とfloatの割合比較を分け、短い例を追加しました。既存の正しい短い例はそのまま表示します。
- Life / LifeMaxの旧図はKO・RoundState=3・監視ステートの未検証断定とIKEMEN GO差を含むため内部へ、Power / PowerMaxの旧図はPowerSetが最大値を設定するような矢印を含むため内部へ保存しました。画像ファイル・寸法・代替文は変更していません。
- LifeMaxのPersistent式、整数除算にCeilを重ねた減少量、敵変数/回復変数の未提示の前提、行を分割したfvar代入は旧コード・説明を保持して内部へ移しました。Powerの上限未満という説明と固定3000条件の差、キャラ固有Command/変数/ステートの応用例も保持して内部へ移しました。
- LifeMaxの旧IKEMEN GO issue #2957は別エンジンのresearchへ対応付け。mutable nightlyの報告を固定ビルドでの検証済み情報とせず、MUGENの仕様として公開しません。Powerの共有、PowerMaxのタッグ先頭基準、補正率や導入境界は実機未検証です。Const(Data.Power)は保存済みConst一覧にないため公開構文に追加していません。
- CHAOSの[LifeMax](https://w.atwiki.jp/mugencns/pages/144.html)、[Power](https://w.atwiki.jp/mugencns/pages/187.html)、[PowerMax](https://w.atwiki.jp/mugencns/pages/188.html)、[CNS設定](https://w.atwiki.jp/mugencns/pages/45.html)と[IKEMEN GO報告](https://github.com/ikemen-engine/Ikemen-GO/issues/2957)を照合・内部参照として保持。CHAOSのLifeページ本文は取得できませんでした。

~~~sh
npm run mugen:batch-baseline -- --batch resource-read-01
npm run mugen:batch -- --batch resource-read-01 --target Life --target LifeMax --target Power --target PowerMax
npm run mugen:batch -- --batch resource-read-01 --target Life --target LifeMax --target Power --target PowerMax --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

208テスト・263ページビルド・261 URL/137比較対象ページのHTML検査を通過。ブラウザでLife（幅1280px）、LifeMax（通常幅）、Power / PowerMax（幅390px）を確認しました。Astroのテレメトリー設定ディレクトリ作成がローカル権限で失敗したため、正式な環境変数ASTRO_TELEMETRY_DISABLED=1を使ってビルドを完了しています。既存のPagefind/保存HTMLの警告は継続しています。スキーマ・表示コンポーネントの変更はありません。次はAlive・Ctrl・StateNo・PrevStateNoです。

## 2026-10-04：state-status-01

Alive / Ctrl / StateNo / PrevStateNoを追加しました。累計130件（主要・補助16件＋49バッチ114件）、残り104件です。比較基準を `tests/mugen/batches/state-status-01/` に保存し、保存済み2002.04.14・1.0・1.1b1とCHAOSの各ページを照合しました。引数なし・整数戻り値を構造化し、Alive/Ctrlの0/1とステート番号を区別しています。

- Ctrlは基本動作のコントロールフラグで、キャンセルなどCtrlを条件に含めない入力受付もあることを公開しました。CtrlSet・StateDef/ChangeStateの設定と参照を区別しています。
- StateNoの旧例は題名が650未満なのにコードは650を含むため、原文を内部へ保持し、650以下の閉区間と650未満の半開区間の例を公開しました。StateNo/PrevStateNoの旧関連ID HitOverrideを保持し、公開リンクを実在するHitOverRideページへ対応させました。
- PrevStateNoは比較式から引数なし構文を分離し、詳細と一覧で同じ構文を表示。公式3世代が明記する精度非保証を公開しました。公式Format欄のStateNo表記と旧例の資料差は内部へ保持しています。
- Aliveの複合応用例と生存敵検索は構成の前提・PowerAdd.Absoluteの未文書化・EnemyNear(9)と代替処理のAlive条件欠落を内部へ記録し、原行を削除していません。正しい既存の死亡処理例を保持し、短い生存条件例を追加しました。
- [Alive](https://w.atwiki.jp/mugencns/pages/66.html)の生死判定時点の疑問符・NoKO・復活/タッグ、[Ctrl](https://w.atwiki.jp/mugencns/pages/107.html)と[StateNo](https://w.atwiki.jp/mugencns/pages/179.html)の自動遷移、[PrevStateNo](https://w.atwiki.jp/mugencns/pages/181.html)の中間くらいステート・HitDef/ReversalDefの履歴更新は実機未検証の内部researchです。導入ビルドはnullに保持しました。

~~~sh
npm run mugen:batch-baseline -- --batch state-status-01
npm run mugen:batch -- --batch state-status-01 --target Alive --target Ctrl --target StateNo --target PrevStateNo
npm run mugen:batch -- --batch state-status-01 --target Alive --target Ctrl --target StateNo --target PrevStateNo --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

213テスト・263ページビルド・261 URL/141比較対象ページのHTML検査を通過しました。ブラウザでPrevStateNo/Ctrl/Aliveを通常幅、StateNoの範囲例を幅390pxで確認し、検査後に表示幅をリセットしました。既存のPagefind/保存HTMLの警告は継続しています。スキーマ・表示コンポーネント・CSSの変更はありません。次はStateType・MoveType・Facingです。

## 2026-10-04：state-attributes-01

StateType / MoveType / Facingを追加しました。累計133件（主要・補助16件＋50バッチ117件）、残り101件です。比較基準は tests/mugen/batches/state-attributes-01/ に保存しました。保存済み2002.04.14・1.0・1.1b1のTrigger/CNS資料とCHAOSの [StateType](https://w.atwiki.jp/mugencns/pages/162.html)、[MoveType](https://w.atwiki.jp/mugencns/pages/160.html)、[Facing](https://w.atwiki.jp/mugencns/pages/119.html)を照合しました。

- StateType/MoveTypeは[oper]と引用符なしのchar指定を持つ旧式比較構文として整理。= / !=のみ、成立1・不成立0を返すことを明記し、通常の数値参照Facingと分けました。CNS用の共通パラメーターは追加しません。
- StateTypeはS/C/A/Lと関連Lページを保持。2002/1.0のTrigger ReferenceのL列挙漏れとCNS/1.1/CHAOSの差をconflictingとして内部へ残しました。1.1での追加とは推測せず、導入ビルドはnullです。UはStateDefの継承指定であり、Physicsは別設定であることを公開しています。
- MoveType=Iは攻撃でもくらいでもない行動状態で、立ち姿勢や無動作の保証ではありません。公開構文には具体的なA/I/Hの比較を表示。旧movetype != H例を保持し、Iの短い条件例を追加しました。
- Facingは右1/左-1で、単独のFacing条件は左右とも0以外です。旧Trigger = Facing = -1と公式例の表記差は原位置へ残して内部にし、Trigger1を使う左右の例を追加しました。MoveTypeの2002公式出典は実在するMoveType(*,***)アンカーへ新しい参照を付けています。
- StateTypeの幅/被弾移行、MoveTypeのHitDef/ガード/発生1F目、自動振り向き・相手向きの特殊条件・導入境界は内部researchです。今回の資料確認を実機検証へ昇格していません。スキーマ・表示コンポーネント・CSSは変更していません。

~~~sh
npm run mugen:batch-baseline -- --batch state-attributes-01
npm run mugen:batch -- --batch state-attributes-01 --target StateType --target MoveType --target Facing
npm run mugen:batch -- --batch state-attributes-01 --target StateType --target MoveType --target Facing --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

218テスト・263ページビルド・261 URL/144比較対象ページのHTML検査を通過。ブラウザでStateTypeの引数表を通常幅、MoveType/Facingを幅390pxで確認しました。既存タブの接続タイムアウトは新しい検査用タブで復旧し、幅設定と検査用タブは終了時に戻しました。既存のPagefind/保存HTMLの警告は継続しています。次はP2StateNo・P2StateType・P2MoveTypeです。

## 2026-10-05：opponent-state-01

P2StateNo / P2StateType / P2MoveTypeの3件を追加しました。累計136件（主要・補助16件＋51バッチ120件）、残り98件です。移行前のJSON・HTML・抽出結果とハッシュは tests/mugen/batches/opponent-state-01/ に保存しています。

- P2StateNoは引数なしの整数参照、P2StateType/P2MoveTypeは = / != と文字を使う比較として構造化。S/C/A/LとA/I/Hを区別し、L、Uの継承指定、Iの意味を保持しました。P2StateNoのHitOverrideという旧関連IDを残し、公開リンクはリポジトリのHitOverRideへ訂正しました。
- P2StateNo/P2StateTypeの1.0/1.1資料は相手不在時をbottomと記載します。通常の整数0と分離し、最終条件の偽扱い・特殊形式の例外を公開しました。旧SFalse・旧P2StateTypeの0説明・勝利や終了画面での不在タイミング・Lの列挙差は内部に保持しています。P2MoveTypeには同じエラー条件の記載がないため、不在時の値を推測で追加していません。
- CHAOSの[P2StateNo](https://w.atwiki.jp/mugencns/pages/180.html)、[P2StateType](https://w.atwiki.jp/mugencns/pages/163.html)、[P2MoveType](https://w.atwiki.jp/mugencns/pages/161.html)、[対象選択](https://w.atwiki.jp/mugencns/pages/43.html)を照合。P2のX距離・HelperType=Player・StateNo=5150除外・Enemy/EnemyNearとの差は内部研究に記録しました。今回の実機検証ではありません。
- 空欄例とP2StateTypeを使わないDestroySelf/IsHelperの旧例は原位置を保持して内部へ。公開には各トリガーを使う短い条件行を追加しました。スキーマ・レンダラー・CSSは変更していません。

~~~sh
npm run mugen:batch-baseline -- --batch opponent-state-01
npm run mugen:batch -- --batch opponent-state-01 --target P2StateNo --target P2StateType --target P2MoveType
npm run mugen:batch -- --batch opponent-state-01 --target P2StateNo --target P2StateType --target P2MoveType --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・223テスト・263ページビルド・261 URL/147比較対象ページのHTML検査を通過しました。出典検査で見つかった2002 MoveTypeのアンカー表記を修正しています。ブラウザでP2StateType（通常幅）、P2StateNo/P2MoveType（幅390px）を確認し、表示幅をリセット・検査用タブを終了しました。内部注記は304件、未対応旧履歴は162項目です。導入ビルドはnullに保持。次はP2Life・NumEnemy・NumPartnerです。

## 2026-10-05：opponent-counts-01

P2Life / NumEnemy / NumPartnerの3件を追加しました。累計139件（主要・補助16件＋52バッチ123件）、残り95件です。移行前原本とHTMLは tests/mugen/batches/opponent-counts-01/ に保存しています。

- 3件は引数なし・整数戻り値です。P2LifeはP2の現在ライフであり、最大値の割合や生存判定とは分離。相手不在時の値は公式3世代の項目に記載がないため推測しません。P2の対象選択や空欄の旧例を内部に保持しました。
- NumEnemy/NumPartnerは現在存在する敵/パートナー数として公開。公式3世代が明記する通常ヘルパー・中立プレイヤーの除外へ説明を限定し、全ヘルパー除外という旧説明と特殊ヘルパー・KO/消滅/改造環境の差を内部に残しています。人数は真偽フラグやモード名とは区別しています。
- NumPartnerの旧「チーム戦は1」と[CHAOS](https://w.atwiki.jp/mugencns/pages/167.html)の交代制チーム0という差を保持。モード別の固定値を公開文で断定せず、人数を取得する仕様とTeamModeを分けました。Helperでの本体基準、デバッグ消滅、死亡時の人数と改造人数は実機未確認です。
- NumEnemyの公式Squash例とNumPartnerの人数/Partner,Life例は維持しました。追加例は先にNumEnemy >= 2を確認してEnemyNear(1),Lifeを参照し、NumPartner > 0で存在を確認します。旧ID大小によるプレイヤー番号推定・式中代入/フォールバックの例は原文とコメントを保持して内部へ移しました。スキーマ・レンダラー・CSSは変更していません。
- [対象選択](https://w.atwiki.jp/mugencns/pages/43.html)とNumPartnerのCHAOS本文を照合しました。P2Life/NumEnemyのCHAOS本文は取得できなかったため、その内容を新たな確認済み根拠にはしていません。

~~~sh
npm run mugen:batch-baseline -- --batch opponent-counts-01
npm run mugen:batch -- --batch opponent-counts-01 --target P2Life --target NumEnemy --target NumPartner
npm run mugen:batch -- --batch opponent-counts-01 --target P2Life --target NumEnemy --target NumPartner --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・228テスト・263ページビルド・261 URL/150比較対象ページのHTML検査を通過しました。ブラウザでNumPartner（通常幅）、NumEnemy/P2Life（幅390px）を確認し、表示幅をリセット・検査用タブを終了しました。内部注記10件追加の314件、未対応旧履歴162項目。初導入はnullに保持し、実機検証は未実施です。次はRoundState・RoundNo・RoundsExistedです。

## 2026-10-05：round-progress-01

RoundState / RoundNo / RoundsExistedの3件を追加しました。累計142件（主要・補助16件＋53バッチ126件）、残り92件です。移行前のJSON・HTML・抽出結果は tests/mugen/batches/round-progress-01/ に保存しています。

- 公式3世代の引数なし・整数戻り値を構造化。RoundStateは0〜4の進行状態、RoundNoは試合全体の番号、RoundsExistedはプレイヤーごとの存在ラウンド数で最初は0、と分けています。RoundState = 2とCtrlは別の条件で、RoundsExisted = 0は単独で最初の1フレームを意味しません。
- RoundStateの旧処理ループ図・監視変数のsample_code・開始フラグ例・Q&Aは原位置へ保持して内部へ。CNSの-3のカスタムステート例外・Helperの-3/-2/-1条件をJSONに残し、Pause/HitPause・正確なフレーム境界・変数初期化・全プレイヤーの同フレーム観測は実機未確認としています。公開例は進行状態とCtrlを調べる短い条件行です。
- [CHAOSのRoundState](https://w.atwiki.jp/mugencns/pages/191.html)と[IKEMEN GOの変更資料](https://github.com/ikemen-engine/Ikemen-GO/wiki/Triggers-(changed)#roundstate)を照合。旧nightly日付の導入境界は未確定で、legacy_index: 0の内部研究を別エンジンへ対応付けました。関連する旧IKEMEN出典も内部へ移しています。[common1.cnsの参照先](https://gist.github.com/Jesuszilla/0aff36b31ff0f732d24f9de3648b6247)は修正版であり全ビルドの配布原本とは扱いません。
- RoundNoの旧ゲージ初期化例は、説明の1試合目1ラウンド目以外でもOR条件で成立し得るため内部へ。3ラウンド目の短い旧例は維持しています。RoundsExistedのTurns/5900の旧例は維持し、最初の出場ラウンドの短い例を追加。非Turnsで常にRoundNo - 1という旧推測・旧単数名・公式RoundNo > 0とafter the first roundという説明差を内部へ保持しました。
- スキーマ・レンダラー・CSSは変更していません。初導入ビルドはnull。RoundNo/RoundsExistedのCHAOS本文は取得できず、新しい確認済み根拠には使っていません。

~~~sh
npm run mugen:batch-baseline -- --batch round-progress-01
npm run mugen:batch -- --batch round-progress-01 --target RoundState --target RoundNo --target RoundsExisted
npm run mugen:batch -- --batch round-progress-01 --target RoundState --target RoundNo --target RoundsExisted --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・233テスト・263ページビルド・261 URL/153比較対象ページのHTML検査を通過。ブラウザでRoundState（通常幅）、RoundNo/RoundsExisted（幅390px）を確認し、表示幅をリセット・検査用タブを終了しました。内部注記10件追加の324件、未対応旧履歴161項目。実機検証は未実施です。次はID・IsHelper・PlayerIDExistです。

## 2026-10-05：player-identity-01

ID / IsHelper / PlayerIDExistの3件を追加しました。累計145件（主要・補助16件＋54バッチ129件）、残り89件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/player-identity-01/ に保存しています。

- IDの一意番号、Helperコントローラーの指定ID、HitDefのTargetIDを分離しました。IDは引数なしの整数参照、IsHelperは任意整数引数、PlayerIDExistは必須整数式で、判定は通常1/0です。IsHelperの公式Arguments欄のnoneと本文の任意引数という差はJSON内部へ残しています。省略を0や-1に置き換えません。
- IDの公式value抜粋2件とIsHelperの旧2例を保持。IDにNumEnemy > 0を先に確認するVarSet例を追加し、var(0)を保存先として明示しています。PlayerIDExistは保存済み一意IDの存在確認とPlayerIDによるライフ参照を同番号の別条件行で公開しました。
- [CHAOSのID](https://w.atwiki.jp/mugencns/pages/49.html)の割当開始値・順序・増加・Turns/スロットIDの報告を内部へ保持。[CHAOSのPlayerIDExist](https://w.atwiki.jp/mugencns/pages/184.html)にも存在するPlayerExist誤記と旧推定/代入例は原位置へ保持して内部へ。NumTargetをリダイレクトとして列挙する旧本文と、公式CNSのPlayerExistID表記差も保存しています。
- DestroySelf後のHelper・Explod召喚フリーズ回避策は消去せず、旧コードと説明を内部に保存。対象ビルド・再現条件が未確認で、東方夢幻館の本文も取得できなかったため公開必須条件にはしていません。CHAOSのIsHelper本文も取得できず、今回の確認済み根拠にはしていません。
- 1.0/1.1で引数がbottomなら結果もbottomというエラーを通常の不一致/不在0から分離。2002資料のSFalseと導入ビルド不明は内部に保持。スキーマ・レンダラー・CSSの変更はありません。実機検証は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch player-identity-01
npm run mugen:batch -- --batch player-identity-01 --target ID --target IsHelper --target PlayerIDExist
npm run mugen:batch -- --batch player-identity-01 --target ID --target IsHelper --target PlayerIDExist --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・238テスト・263ページビルド・261 URL/156比較対象ページのHTML検査を通過。ブラウザはIsHelper（通常幅）、PlayerIDExist/ID（幅390px）で確認し、接続復旧後に設定と検査用タブを片付けました。既存のPagefind/保存HTMLの警告は継続。内部注記10件追加の334件、未対応旧履歴161項目。次はNumHelper・NumTarget・NumExplodです。

## 2026-10-05：owned-counts-01

NumHelper / NumTarget / NumExplodの3件を追加しました。累計148件（主要・補助16件＋55バッチ132件）、残り86件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/owned-counts-01/ に保存しています。

- 3件の任意整数式exprn・引数省略の総数・個数としての戻り値を構造化しました。指定するIDはそれぞれHelperコントローラー、HitDefのTargetID、ExplodコントローラーのIDです。一意PlayerIDと区別し、実在しない共通パラメーターを加えていません。
- NumHelperは正のIDで絞り込み、0以下で全数。NumTarget/NumExplodは0以上で絞り込み、-1以下で全数です。旧NumHelperの0以上と0以下の重なり、NumExplodの-1のみを説明する旧文を原位置に保持し、公開説明を整理しました。省略を特定の整数に置き換えていません。
- 旧2例は3件とも維持。Helper/Targetの参照は先に同IDの個数 > 0を別条件行で確認する短い例を追加しました。NumExplodは同IDの個数 = 0を追加しています。
- 保存済み公式3世代のNumTarget ExamplesがNumExplodの例になっている表記差を内部へ保存。既存JSONの正しいNumTarget比較は変更していません。[CHAOSのNumHelper](https://w.atwiki.jp/mugencns/pages/166.html)のRoot共有・子孫を含む範囲とParent不在の報告、[NumTarget](https://w.atwiki.jp/mugencns/pages/170.html)のHelper/Projectileによる所有・8体上限とTargetID上書きは内部研究です。NumExplodのCHAOS本文は取得できず、新しい確認済み根拠にはしていません。
- 1.0/1.1の引数bottomと正常な個数0を分離し、2002資料のSFalse・初導入不明・型変換/射出消去の境界は内部へ。スキーマ・レンダラー・CSSの変更はありません。実機検証は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch owned-counts-01
npm run mugen:batch -- --batch owned-counts-01 --target NumHelper --target NumTarget --target NumExplod
npm run mugen:batch -- --batch owned-counts-01 --target NumHelper --target NumTarget --target NumExplod --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・243テスト・263ページビルド・261 URL/159比較対象ページのHTML検査を通過。ブラウザはNumHelper（通常幅）、NumTarget/NumExplod（幅390px）で確認し、表示幅と検査用タブを復元しました。内部注記8件追加の342件、未対応旧履歴161項目。次はNumProj・NumProjIDです。

## 2026-10-05：projectile-counts-01

NumProj / NumProjIDの2件を追加し、累計150件（主要・補助16件＋56バッチ134件）、残り84件です。移行前のJSON・HTML・抽出結果を tests/mugen/batches/projectile-counts-01/ へ保存しました。

- NumProjは引数なしの総数、NumProjIDは必須整数式exprnによる指定ProjIDの個数として構造化。負のIDは0として扱い、NumProjID(0)は全数指定と区別しました。ProjID・PlayerID・TargetIDも分離しています。旧原文と各1件の有効な例は保持しました。
- 保存済み公式3世代のProjectile資料で、Helperが生成したProjectileは直ちにRootの所有になる記載を確認。[CHAOSのNumProjID](https://w.atwiki.jp/mugencns/pages/169.html)でもRoot参照と0指定の意味を照合しました。HelperからRootの個数を調べる例を追加。NumProjのCHAOS本文は取得できず、今回の確認済み根拠にしていません。
- NumProjIDの1.0/1.1 bottomと通常の個数0を分離。2002 SFalse・初導入・消去/相殺/アニメーション中の個数更新境界・無効型や所有の特殊条件は内部JSONへ保持。スキーマ・レンダラー・CSSは変更していません。実機検証は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch projectile-counts-01
npm run mugen:batch -- --batch projectile-counts-01 --target NumProj --target NumProjID
npm run mugen:batch -- --batch projectile-counts-01 --target NumProj --target NumProjID --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・247テスト・263ページビルド・261 URL/161比較対象ページHTML検査を通過。NumProj（通常幅）とNumProjID（幅390px）をブラウザ確認し設定を復元。内部注記3件追加の345件、未対応旧履歴161項目。次はProjContact・ProjHit・ProjGuardedです。

## 2026-10-05：projectile-events-01

ProjContact / ProjHit / ProjGuardedの3件を追加し、累計153件（主要・補助16件＋57バッチ137件）、残り81件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/projectile-events-01/ に保存しました。

- ヒットまたはガード・ヒットのみ・ガードのみの判定を分離。通常の数値関数へ変換せず、ProjID接尾辞・valueの真偽・演算子とvalue2の組を旧式構文として構造化しました。省略/0は全Projectileで、NumProjID(0)の個数対象とは異なります。
- 保存済み公式3世代とCNSで、短い条件は直後1フレーム、時間比較はnが0以上であることを照合しました。0〜14フレームの具体例を追加。旧説明の正の整数・カンマ等の欠落・複数IDに見える表は原位置に保持しています。
- ProjContactの括弧付き旧2例は原文のまま内部へ保存し、公開は公式の接尾辞例へ。CHAOSにはID計算式の括弧表記の報告があるため、無効と断定していません。ProjHit/ProjGuardedの旧2例ずつは公開を維持。公式ProjHit第2例の指定IDと全Projectileという説明差も内部に残しました。
- [CHAOSのProjContact](https://w.atwiki.jp/mugencns/pages/152.html)、[ProjHit](https://w.atwiki.jp/mugencns/pages/153.html)、[ProjGuarded](https://w.atwiki.jp/mugencns/pages/154.html)の相殺/反対イベントによる記録リセット、未接触時・同時ヒット・ID解析の報告は内部研究です。式を使うIDとCNSの旧式引数の制限の差も保持。今回の資料照合を実機確認と扱っていません。
- 多段イベントとHelperからRootを参照する説明を公開しました。初導入はnullのままで、スキーマ・レンダラー・CSSは変更していません。

~~~sh
npm run mugen:batch-baseline -- --batch projectile-events-01
npm run mugen:batch -- --batch projectile-events-01 --target ProjContact --target ProjHit --target ProjGuarded
npm run mugen:batch -- --batch projectile-events-01 --target ProjContact --target ProjHit --target ProjGuarded --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・252テスト・263ページビルド・261 URL/164比較対象ページのHTML検査を通過。ProjContact（通常幅）、ProjHitの引数表/ProjGuardedのコード例（幅390px）を確認し表示幅と検査用タブを復元。既存の保存HTML/Pagefind等の警告は継続。内部注記11件追加の356件、未対応旧履歴161項目。次はProjContactTime・ProjHitTime・ProjGuardedTime・ProjCancelTimeです。

## 2026-10-05：projectile-times-01

ProjContactTime / ProjHitTime / ProjGuardedTime / ProjCancelTimeの4件を追加し、累計157件（主要・補助16件＋58バッチ141件）、残り77件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/projectile-times-01/ に保存しました。

- 必須整数式exprn・関数形式・整数戻り値と未該当-1を構造化。最後に放出した弾という旧文を保持し、公開本文では最後の接触記録を調べる説明へ。ID 0は照合なし、負IDは0扱いで、戻り値を0に固定する指定ではありません。NumProjID(0)の意味とも区別しました。
- [CHAOSのProjContactTime](https://w.atwiki.jp/mugencns/pages/155.html)と[ProjCancelTime](https://w.atwiki.jp/mugencns/pages/158.html)の0始まりの記録を反映し、直後=0と未発生-1を除外する時間範囲例を公開。公式3世代/旧第1例の直後=1は原文とタイトルのまま内部に保持しています。旧第2例4件は公開を維持。実行ビルドや停止中の評価時点の差は解消した扱いにしません。
- ProjCancelTimeの旧バグをlegacy_index: 0へ対応。[CHAOSのWin版検証報告](https://w.atwiki.jp/mugencns/pages/158.html)として直前の命中ProjIDを基準にする問題をWinMUGENに限定して公開し、非限定の0指定を例にしています。公式の相殺ID照合・旧指定ID例も内部に保持。正確なWinビルド、1.0/1.1での再現/修正は推測していません。
- [ProjHitTime](https://w.atwiki.jp/mugencns/pages/156.html)・[ProjGuardedTime](https://w.atwiki.jp/mugencns/pages/157.html)の検証不足/反対イベントや相殺でのリセット・同時処理の推測、ContactTimeのリセットと誤記例は内部研究です。公式GuardedTime FormatのCancelTime表記、HitTime本文のProjHit表記差も保存しました。
- 1.0/1.1のbottomと正常な-1/0、Helper生成のRoot所有を公開。2002 SFalse・初導入・型変換・同ID複数弾/記録寿命は内部へ。初導入null、スキーマ/レンダラー/CSS変更なし。今回の実機検証は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch projectile-times-01
npm run mugen:batch -- --batch projectile-times-01 --target ProjContactTime --target ProjHitTime --target ProjGuardedTime --target ProjCancelTime
npm run mugen:batch -- --batch projectile-times-01 --target ProjContactTime --target ProjHitTime --target ProjGuardedTime --target ProjCancelTime --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・258テスト・263ページビルド・261 URL/168比較対象ページHTML検査を通過。通常幅でContactTime/HitTime、幅390pxでGuardedTime引数表/CancelTimeのWinMUGEN注記を確認し、表示幅と検査用タブを復元。既存の保存HTML/Pagefind等の警告は継続。内部注記18件追加の374件、未対応旧履歴160項目。次はMoveHit・MoveGuarded・MoveReversedです。

## 2026-10-05：move-results-01

MoveHit / MoveGuarded / MoveReversedの3件を追加し、累計160件（主要・補助16件＋59バッチ144件）、残り74件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/move-results-01/ に保存しました。既移行MoveContactでは共有図の内部化だけを追加し、新規移行数へ重複計上していません。

- 引数なし・整数戻り値を構造化し、ヒット/ガードとReversalDefに取られた側を分離。ReversalDefが成立した側のMoveHitとの違い、ProjectileはProj系という案内を公開しました。1.0/1.1の1始まりのカウンターと停止中の非加算、=1が1フレーム限定ではない説明を整理しています。
- 遷移先StateDefのMoveHitPersist=1による保持と通常リセットを公開。MoveHitResetは公式に挙がるMoveHit/Guarded/Contactに限定し、MoveReversedへの影響を確認済みとして追加していません。旧短い例は維持し、MoveHitのキャラ固有CMD例は原位置に保持して内部へ。関連リンクも維持しています。
- 2002.04.14の公式更新履歴のMoveHit/Guardedの戻り値変更とMoveReversed追加を公開。ただしWinMUGENの正確な導入ビルド・DOSからの境界を推定せずintroduced_inはnull。旧8履歴は原位置に保持して内部注記へ対応付け、IKEMEN GOのMoveHitVar報告は別エンジンの内部記録にしました。
- 公式MoveContact Detailsのガード後は他の3つが0という例は概要と整合しません。旧本文・出典と[CHAOSのMoveHit](https://w.atwiki.jp/mugencns/pages/149.html)、[MoveGuarded](https://w.atwiki.jp/mugencns/pages/150.html)の最後の一方/同時処理を内部へ保存。共通図を視認し、MoveContactからMoveReversedへの包含や1つだけ非0という図示も保持して4ページの公開から外しました。元画像ファイルは変更していません。
- [MoveReversed](https://w.atwiki.jp/mugencns/pages/151.html)のP2StateNo遷移・PauseTime中のリセット時点、HitOverrideや命中フレームでの読取り、DOS/Win区別は内部研究です。未検証状態を保持し、今回の実機テストとはしていません。スキーマ・レンダラー・CSSの変更はありません。

~~~sh
npm run mugen:batch-baseline -- --batch move-results-01
npm run mugen:batch -- --batch move-results-01 --target MoveHit --target MoveGuarded --target MoveReversed
npm run mugen:batch -- --batch move-results-01 --target MoveHit --target MoveGuarded --target MoveReversed --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・263テスト・263ページビルド・261 URL/171比較対象ページのHTML検査を通過。通常幅のMoveHit、幅390pxのMoveGuarded使用例/MoveReversed継承と判定側、MoveContact図の非表示を確認し、表示幅と検査用タブを復元。内部注記19件追加の393件、未対応旧履歴152項目。次はHitCount・UniqHitCount・HitPauseTimeです。

## 2026-10-05：hit-count-pause-01

HitCount / UniqHitCount / HitPauseTimeの3件を追加し、累計163件（主要・補助16件＋60バッチ147件）、残り71件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/hit-count-pause-01/ に保存しました。

- 引数なし・整数戻り値を構造化。HitCountとUniqHitCountの2体同時命中時の1/2加算、ガード除外、画面コンボ数との違い、遷移先StateDefのHitCountPersistと省略時0を公開しました。UniqHitCountは相手の種類数という意味にしない公開ラベルへ訂正しています。
- UniqHitCount旧例は6未満というタイトルと6を含む[4,6]が不一致です。原位置に保持して内部へ移し、[4,6)と4/5の説明を追加しました。HitCountの旧9回以上の例、HitPauseTimeのIgnoreHitPauseを含む2例は維持しています。
- HitPauseTimeのコントローラーが停止中に評価されないことと、式の0を区別。旧説明とQ&Aは保持し、公開FAQを整理しました。攻撃側のPauseTime / guard.pausetimeと被弾側GetHitVar(HitShakeTime)、一般のPause/SuperPauseとの違いを公開しています。
- 1.0 RC1のP1 PauseTimeが1 tick早く終了する修正と、旧mugenversionによる式評価後の-1補正、1.0形式へ移植する際のP1 +1とmugenversion設定を保存済み公式履歴に照合。旧version[0]は新しい公開変更履歴へ対応付けました。正確な初導入はnullで、旧IKEMEN GOの未掲載からの互換推測は別エンジンの内部記録です。
- [CHAOS HitCount](https://w.atwiki.jp/mugencns/pages/127.html)と[UniqHitCount](https://w.atwiki.jp/mugencns/pages/128.html)の同時ヒット/ガード・Target依存加算、[HitPauseTime](https://w.atwiki.jp/mugencns/pages/133.html)の表記差/疑問符、停止開始終了の評価順は内部へ保持。今回実機検証を行った記録にはしていません。スキーマ・レンダラー・CSSの変更はありません。

~~~sh
npm run mugen:batch-baseline -- --batch hit-count-pause-01
npm run mugen:batch -- --batch hit-count-pause-01 --target HitCount --target UniqHitCount --target HitPauseTime
npm run mugen:batch -- --batch hit-count-pause-01 --target HitCount --target UniqHitCount --target HitPauseTime --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・268テスト・263ページビルド・261 URL/174比較対象ページのHTML検査を通過。通常幅のHitCount、幅390pxのUniqHitCount使用例とHitPauseTimeの変更履歴/仕様を確認し、表示幅と検査用タブを復元。テスト側の正規化カテゴリの参照先を修正して再検査済み。内部注記9件追加の402件、未対応旧履歴150項目。次はHitShakeOver・HitOver・HitFallです。

## 2026-10-05：gethit-status-01

HitShakeOver / HitOver / HitFallの3件で累計166件（主要・補助16件＋61バッチ150件）、対象内の残り68件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/gethit-status-01/ に保存しました。

- 引数なし・整数の0/1とMoveType=Hの適用前提を整理。ヒットシェイク終了、のけぞり時間満了、fallフラグを別の条件として公開し、攻撃側HitPauseTime、被弾側GetHitVar(HitShakeTime)、HitFallSetで変わるfall情報と区別しています。通常ジャンプの下降や着地の代用とはしていません。
- HitOverの旧HitTime=0説明を原位置に保持。1.0/1.1の保存済みGetHitVarのhittime<0相当という記述を公開し、公式のカウント条件hitshaketime>0という文と[CHAOS HitOver](https://w.atwiki.jp/mugencns/pages/131.html)のCtrl復帰/同フレーム行動不可は内部へ保持。トリガー参照そのものにステート遷移やCtrl付与の効果は持たせていません。
- HitFallの公式の被弾状態外は未定義という条件を公開。旧!HitFall単独例は内部へ保持し、MoveType=Hの条件を先に置く例を追加しました。[CHAOS HitFall](https://w.atwiki.jp/mugencns/pages/130.html)の次の被弾まで持続するかという疑問符は未確認のままです。
- HitShakeOverの旧5000→5010の独自演出移行例は、[Commonステート](https://w.atwiki.jp/mugencns/pages/17.html)で5010が屈みヒットシェイク用という資料と照合し、原位置に保持して内部へ。既存のMoveType=H/HitShakeOver=0例は維持し、終了=1の条件行を追加。旧Q&Aも保持して攻撃側/被弾側と時間/真偽の違いを公開FAQにしました。
- P1 PauseTime修正をHitShakeOverの変更と広げた旧履歴と別エンジンのLua関数は内部へ対応付け。[CHAOS HitShakeOver](https://w.atwiki.jp/mugencns/pages/132.html)のIgnoreHitPause疑問符と停止境界、独自ステート/特殊攻撃の評価順は内部研究です。初導入null、今回の実機検証はありません。HitFall/HitOverのWeb取得はキャッシュ失敗のため、同じ既知URLの一次本文をブラウザで読んで補完しました。スキーマ・レンダラー・CSSの変更はありません。

~~~sh
npm run mugen:batch-baseline -- --batch gethit-status-01
npm run mugen:batch -- --batch gethit-status-01 --target HitShakeOver --target HitOver --target HitFall
npm run mugen:batch -- --batch gethit-status-01 --target HitShakeOver --target HitOver --target HitFall --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・273テスト・263ページビルド・261 URL/177比較対象ページのHTML検査を通過。通常幅のHitShakeOverと幅390pxのHitOver仕様/例・HitFallの被弾条件例を確認し、表示幅と検査用タブを復元しました。内部注記11件追加の413件、未対応旧履歴148項目。次はHitVel・CanRecover・InGuardDistです。

## 2026-10-05：hit-recovery-guard-01

HitVelX / HitVelY / CanRecover / InGuardDistの4件で累計170件（主要・補助16件＋62バッチ154件）、対象内の残り64件です。移行前JSON・HTML・抽出結果は tests/mugen/batches/hit-recovery-guard-01/ に保存しました。

- HitVel X/Yはfloatと空白区切りの必須軸指定を構造化し、被弾速度と現在速度Velを分離しました。旧構文・閾値例は維持し、現在の水平速度という旧カテゴリを公開側だけ訂正。公式/旧説明のX後方正・Y上方正と、[CHAOS X](https://w.atwiki.jp/mugencns/pages/134.html)/[Y](https://w.atwiki.jp/mugencns/pages/135.html)のWin版ではVelに反映される値そのままという報告は衝突として内部へ。方向規則やGetHitVarとの同義かという疑問符を断定しません。
- CanRecoverはfall状態の許可と実際の受身遷移、fall外の公式未定義を分離。旧2履歴を仕様へ対応付け、5050をエンジン全体の必須番号とは扱いません。Fall.Recover/Fall.RecoverTimeと揺れ時間除外を整理しました。
- [固定コミットb6885c6のMUGEN 1.0 common1.cns](https://github.com/fanyer/mugen/blob/b6885c654ba830157f5dd4f257bebfa738300df3/data/common1.cns)へ、旧5050例の速度/高さConst・Alive/CanRecover/recovery・5200/5210を照合し、公開のまま保持。旧-1 AI例と前提不足/コンボ可否FAQ・外部実装談は内部へ保存しました。既存のFall.Recover FAQは公開に残し、許可と入力/遷移を分けるFAQを追加しています。そのr出典は現在JSONのみで、inventoryの未表示フィールドのページ数は28から29へ増えました。
- [CHAOS CanRecover](https://w.atwiki.jp/mugencns/pages/101.html)のfall外に残る内部値、MoveType=H/Timeによるフラグ成立や次の被弾でリセット、立ち/倒れ/ステート奪取・死亡時の未検証を内部へ保持。公式の有効な適用前提と内部値の報告を同一にしません。
- InGuardDistは攻撃していない場合も0と明記し、打撃/Projectileの範囲、HitDef guard.distとAttackDist、ガード成立の違いを公開。関連AttackDistと短い条件行を追加し空欄旧例は保持して内部へ。[CHAOS](https://w.atwiki.jp/mugencns/pages/139.html)のWin/DOSと保存済み2002項目の差、基準位置/P2Distとの1差・一致/背面/重なり境界は内部へ保存し、導入nullと旧?を維持しています。
- 初導入・符号のビルド境界・受身フラグや距離境界の実機再現は未確認です。スキーマ・レンダラー・CSSの変更はありません。

~~~sh
npm run mugen:batch-baseline -- --batch hit-recovery-guard-01
npm run mugen:batch -- --batch hit-recovery-guard-01 --target HitVelX --target HitVelY --target CanRecover --target InGuardDist
npm run mugen:batch -- --batch hit-recovery-guard-01 --target HitVelX --target HitVelY --target CanRecover --target InGuardDist --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・279テスト・263ページビルド・261 URL/181比較対象ページのHTML検査を通過。HitVelX軸指定を通常幅、HitVelYの軸指定/閾値例とCanRecoverの横スクロールするCommon例・InGuardDistの仕様を390pxで確認し、表示幅と検査用タブを復元。内部注記9件追加の422件、未対応旧履歴145項目。次はVel X/Y・Pos X/Yです。

## 2026-10-05：velocity-position-01

VelX / VelY / PosX / PosYの4件で累計174件（主要・補助16件＋63バッチ158件）、対象内の残り60件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/velocity-position-01/ に保存しました。

- 必須の半角スペース区切り軸指定とfloatを構造化し、原構文と本文を保持しました。Vel Xは向き基準で前進正/後退負、Vel Yは下正/上負です。HitVelの符号が逆という旧比較は前回のWin報告との差を内部へ残して断定しません。
- Pos Xは画面中央基準、左負/右正です。旧左右逆転とステージ中心というカテゴリを原位置へ保持し、公開側だけ訂正。保存済み1.1資料のPos X + CameraPos XはMUGEN 1.1系列に限定して公開しています。
- Pos Yの地面0/上負/下正と、>=0は地面上も含む境界を明記。旧公式にもあるbelow the floorという例の不足を新しい説明で補正しました。旧例はJSONに保持し、XにはXの比較例、Yには地面上も含む同じ>=0コードの説明を追加。Vel Yの既存>=0例は維持し、下方向のみなら>0と明記しました。
- 小数を常にFloor/Ceilへ通す旧助言は内部記録にし、整数を要求する項目への変換と小数入力を分けて公開。公式CNSの変換説明にも転記らしい文言があるため、警告の条件を参照し、変換方向の誤文は取り込みません。
- [CHAOS Vel X](https://w.atwiki.jp/mugencns/pages/137.html)/[Y](https://w.atwiki.jp/mugencns/pages/136.html)のfloat警告報告、[Vel](https://w.atwiki.jp/mugencns/pages/35.html)の処理順/Bind/自動着地/Offsetの疑問符、[Pos X](https://w.atwiki.jp/mugencns/pages/185.html)/[Y](https://w.atwiki.jp/mugencns/pages/186.html)の記載差を内部へ保持。Pos Yの地面と画面中央、X/Yが混在する文をそのまま公開へ移しません。
- 既存の座標図を目視し、上向きY軸・Posとステージ絶対座標・CameraPos/GameWidth式の混在が未整理のため、画像とaltを保持してinternalへ。[座標研究](https://w.atwiki.jp/mugencns/pages/95.html)とLocalCoord/ズーム/旧ビルドの座標変換は実機未検証です。初導入はnull。スキーマ・レンダラー・CSS変更はありません。

~~~sh
npm run mugen:batch-baseline -- --batch velocity-position-01
npm run mugen:batch -- --batch velocity-position-01 --target VelX --target VelY --target PosX --target PosY
npm run mugen:batch -- --batch velocity-position-01 --target VelX --target VelY --target PosX --target PosY --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・285テスト・263ページビルド・261 URL/185比較対象ページのHTML検査を通過。通常幅VelX軸表、390pxのPosX世代表記/式・PosY境界例・VelY軸表を確認し、表示幅と検査タブを復元しました。内部注記11件追加で433件、未対応旧履歴145項目、未表示フィールド29ページ。次はScreenPos X/Y・CameraPos X/Yです。

## 2026-10-05：screen-camera-01

ScreenPosX / ScreenPosY / CameraPosX / CameraPosYの4件で累計178件（主要・補助16件＋64バッチ162件）、対象内の残り56件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/screen-camera-01/ に保存しました。

- ScreenPosの画面左/上基準、CameraPosの基準位置(0,0)と実行者の座標空間、必須軸指定/floatを整理。Posをステージ絶対座標とする旧説明とRound()の案内は原位置に残し、公開文を訂正しました。
- 保存済み公式1.0/1.1履歴へRC2のScreenPos X修正、RC3のcut stageでのY修正を照合。既存RC2に加え、RC3のビルドID/2009-10-12をレジストリへ追加し、公開・配布日はnullのままです。旧履歴は対応付けて保持します。
- 旧IKEMEN GO履歴と[issue #188](https://github.com/ikemen-engine/Ikemen-GO/issues/188)は別エンジンの内部記録へ。issueはExplod/HitFallVelのLocalCoord報告で、ScreenPosをMUGENでも一律丸めする根拠にはしません。元の本文/出典も保持します。
- [CHAOS ScreenPos X](https://w.atwiki.jp/mugencns/pages/192.html)/[Y](https://w.atwiki.jp/mugencns/pages/193.html)と公式のPos/ScreenPos転記、1.1冒頭のtop-rightとDetailsの左/上基準の食い違いを内部へ。半幅計算や拡縮を認識できないという報告は未検証のままです。
- 旧1.0以降とする例は内部へ保持して同じコードをMUGEN 1.0の例として公開し、1.1のズームへ一般化しません。旧閉区間[0,319]/[0,239]も保持し、新たな固定幅例は[0,320)/[0,240)へ。小数の末尾範囲を取りこぼさず、0を含み上限を含めない前提を明記しました。Game/Screenサイズの公式ズーム特性も世代を明記しています。
- CameraPosはMUGEN 1.1を対象に、移動速度ではなく現在位置と説明。公式のX>=0をleftとする例はDetailsの右増加と矛盾し内部へ、新例はX>0で右、Y<0で上。1.1追加は公式にありますが、旧2012.08.31からAlpha 4初導入と推定しません。元の個人記事は取得できず、初導入nullで保持します。
- 共通座標図とaltをinternalへ保持。ズーム/LocalCoord/リダイレクトを含む実機確認は未実施です。スキーマ・レンダラー・CSSは変更していません。

~~~sh
npm run mugen:batch-baseline -- --batch screen-camera-01
npm run mugen:batch -- --batch screen-camera-01 --target ScreenPosX --target ScreenPosY --target CameraPosX --target CameraPosY
npm run mugen:batch -- --batch screen-camera-01 --target ScreenPosX --target ScreenPosY --target CameraPosX --target CameraPosY --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・291テスト・263ページビルド・261 URL/189比較対象ページのHTML検査を通過。ScreenPosXの世代別/半開区間例を通常幅、390pxのScreenPosY RC3履歴・CameraPosX軸表とCameraPosY例を確認し、表示幅と検査タブを復元。内部注記13件追加で446件、未対応旧履歴141項目、未表示フィールド29ページ。次はGameWidth/Height・ScreenWidth/Height・CameraZoomです。

## 2026-10-06：size-zoom-01

2026-10-05に資料照合・原本保存・適用、2026-10-06に検証を完了。GameWidth / GameHeight / ScreenWidth / ScreenHeight / CameraZoomの5件で累計183件（主要・補助16件＋65バッチ167件）、対象内の残り51件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/size-zoom-01/ に保存しました。

- 5件の引数なし・floatを構造化。Game/Screen寸法は実行者のローカル座標系の値として整理し、描画ピクセル数と混同しない説明へ訂正しました。原文・履歴・構文・関連リンク・Q&A出典r・例・画像を保持します。
- GameWidth/Heightの追加は保存済み1.0公式履歴のRC4へ照合し、既存mugen-1.0-rc4を使用。ScreenWidth/Height・CameraZoomは公式New in 1.1にありますが、最初のAlpha/Betaビルドは推定せずintroduced_inをnullとしました。旧2012.08.31も保持しています。
- Gameの1.1 Beta 1旧履歴は説明追加の記録で、そこで実装が変更されたと断定しません。Game寸法がズームで変わることと、Screen寸法がズームで変わらないことを分離。公式GameWidth/Heightの反比例の説明とCameraZoom * ScreenWidthの積を同一とする公式例は矛盾として内部に保存し、換算式を公開しません。
- 公式GameWidthのFormatがGameHeightという転記差、ScreenHeightのpos = 0, ScreenHeightを右下とする説明差、CameraZoomの未完成Detailsを内部へ保持。[olt-EDENの一次研究](https://sakisukebekkan.blog.fc2.com/blog-entry-90.html)の逆数による対処・ズームイン確認もJSONに残し、資料確認と自分の実機検証を区別しています。
- Screenの旧Q&Aに含まれるIKEMEN GO設定と旧Wikiを内部へ保持。[issue #566](https://github.com/ikemen-engine/Ikemen-GO/issues/566)は2022年のエンジン差報告として参照し、全GO版・設定やMUGENの固定ビルドの保証へ一般化しません。MUGEN 1.1だけの公開Q&Aを追加しました。
- Gameの旧ズーム対応/端付近例は内部へ保持して、公開例を1.0のScreenPos基準位置条件へ限定。GameWidthの>=は中央を含むことを明記しています。
- 有効なScreenWidth右上・ScreenHeight中央Explod例は維持し、AIR番号と基準位置、screen空間の非バインドを説明。16pxの旧HUD例は内部へ保持し、新たな抜粋はローカル座標の16単位としました。誤ったText行/%dの旧デバッグ例を保存し、新例ではTextの%fと独立したParamsを指定します。CameraZoomの空例も内部へ保持し、係数が1以外という条件行を追加しました。
- 共通座標図をinternalへ保持。新しいスキーマ・レンダラー・CSS・レジストリ項目は追加していません。LocalCoord・解像度・ズーム・リダイレクトの組合せは実機未検証です。

~~~sh
npm run mugen:batch-baseline -- --batch size-zoom-01
npm run mugen:batch -- --batch size-zoom-01 --target GameWidth --target GameHeight --target ScreenWidth --target ScreenHeight --target CameraZoom
npm run mugen:batch -- --batch size-zoom-01 --target GameWidth --target GameHeight --target ScreenWidth --target ScreenHeight --target CameraZoom --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・297テスト・263ページビルド・261 URL/194比較対象ページHTML検査を通過。GameWidthのRC4履歴を通常幅、ScreenHeightのText/Params例・ScreenWidthの16単位例・CameraZoomの概要・GameHeightの1.0条件例を390pxで確認し、表示幅と検査タブを復元。内部注記17件追加で463件、未対応旧履歴135項目、未表示フィールド29ページ。次はLeftEdge・RightEdge・TopEdge・BottomEdgeです。

## 2026-10-06：screen-edges-01

LeftEdge / RightEdge / TopEdge / BottomEdgeの4件で累計187件（主要・補助16件＋66バッチ171件）、対象内の残り47件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/screen-edges-01/ に保存しました。

- MUGEN 1.1の引数なし/float、画面四端のステージ基準座標・実行者のローカル単位を整理。XはPos X + CameraPos X、Yは地面基準のPos Yで比較し、Facingで左右が切り替わるFrontEdge/BackEdgeと分離しました。旧構文・関連リンク・本文・メタ情報・Q&A・例・図・出典を保持します。
- 1.1公式の等価式（左右はCameraPos X ± GameWidth / 2、上はPos Y - ScreenPos Y、下はこれにGameHeight加算）と有効な公式条件例は維持。RightEdgeの公式FormatがLeftEdgeという転記差を内部へ残し、構文はRightEdgeを使用します。公式追加履歴はNew in 1.1で、個別の初導入ビルドは推定せずnullです。
- [CHAOSの座標研究](https://w.atwiki.jp/mugencns/pages/95.html)も照合し、現在の画面端とステージ全体の境界・移動可能範囲を区別。Win/1.0の幅・端・丸め研究を1.1の固定ビルドの実測へ一般化しません。
- 旧履歴12項目を個別対応付け。Game寸法が変わると各端も一律連動するとする記録は内部へ残し、ズーム中心/カメラ位置やLocalCoordの組合せを未確認のまま保持しました。
- 旧px距離、FVar(0)の裸の代入行、BottomEdgeを代入先に見せる関係式、画面外条件だけでHelper/Projectileを安全に削除するとする例をinternalへ。上下Q&Aの概ねGameHeightという関係も保持して内部へ移し、基準位置の上下と画像全体を区別する公開Q&Aへ整理しました。
- 新しい公開例は左右/上下の端の間にある基準位置を2行のTrigger1で判定し、両端を含むことと片軸だけの条件であることを明記。原位置の図・長いaltをinternalへ保持し、元画像は削除していません。
- スキーマ・レンダラー・CSS・レジストリは変更なし。LocalCoord・解像度・ズーム・リダイレクト・端差の等価性・破棄運用の実機検証は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch screen-edges-01
npm run mugen:batch -- --batch screen-edges-01 --target LeftEdge --target RightEdge --target TopEdge --target BottomEdge
npm run mugen:batch -- --batch screen-edges-01 --target LeftEdge --target RightEdge --target TopEdge --target BottomEdge --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・303テスト・263ページビルド・261 URL/198比較対象ページHTML検査を通過。LeftEdgeを通常幅、RightEdgeのコード欄・TopEdgeの仕様/FAQ・BottomEdgeの条件例を390pxで確認し、表示幅と検査タブを復元。内部注記17件追加で480件、未対応旧履歴123項目、未表示フィールド29ページ。次はFrontEdge・BackEdgeです。

## 2026-10-06：facing-edges-01

FrontEdge / BackEdgeの2件で累計189件（主要・補助16件＋67バッチ173件）、対象内の残り45件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/facing-edges-01/ に保存しました。

- MUGEN 1.1の引数なし/float、実行者のFacingによる前面/背面の端選択・ステージ基準X座標・ローカル単位を整理。座標とDistの基準軸/BodyDistの幅バー端からの距離を分離しました。旧本文・構文・履歴・関連配列・FAQ出典r・使用例・図・未表示sample_codeを保持します。
- 公式IfElseによる選択とFrontEdgeの等価式は維持。前面端との片側比較だけで画面内全体にいるとする旧例を内部へ保存し、反対側の端より外でも真になるという説明へ整理しました。BackEdge公式のPos X + CameraPos X < BackEdgeは背面端より左という例で、左向きも含む背面側画面外という旧ラベルとは異なります。旧例/ラベルを内部へ保持し、Facingで符号を選ぶ両向きの条件を公開しました。
- 新例は<による端上を含まない条件と、<=による端上を含む条件を並べています。正負のFacing、両端上、カメラ位置40のずれ、反対側の端より外に出た位置を含む固定ケースで公開式の代数的結果を確認。これはMUGEN実機テストではありません。
- pxという旧FAQ、BackEdge FAQのFrontEdge転記、裸のFVar/Abs距離例は原位置に保持して内部へ。画面全体/ステージ全体の境界・画像全体の表示判定を分離するFAQへ整理しました。
- [IKEMEN GO公式サイト](https://ikemen-engine.github.io/)の互換性案内は取得できましたが、個別トリガー/全Release/Nightlyの実測とせず、別エンジンの内部研究に記録。[CHAOSの座標研究](https://w.atwiki.jp/mugencns/pages/95.html)と旧共通図・altも内部へ保持し、Win/1.0の研究を1.1固定ビルドの実測へ一般化しません。
- documentation.associated_triggerを任意フィールドとして追加。未指定なら旧配列、[]なら明示的に非表示、指定された非空文字列の配列は公開リンクへ反映します。BackEdgeの旧CameraPosを保持し、実在するCameraPosXへ訂正。正規化・スキーマと採用/入力/編集ガイドを更新し、HTML検査で旧リンクの除外・訂正順序/リンク先ファイルの存在を確認します。AstroコンポーネントとCSSは変更なし。
- New in 1.1の追加履歴は確認できますが、初導入ビルドはnull。LocalCoord・ズーム・リダイレクト・幅・ScreenBoundの組合せは実機未検証です。

~~~sh
npm run mugen:batch-baseline -- --batch facing-edges-01
npm run mugen:batch -- --batch facing-edges-01 --target FrontEdge --target BackEdge
npm run mugen:batch -- --batch facing-edges-01 --target FrontEdge --target BackEdge --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・309テスト・263ページビルド・261 URL/200比較対象ページHTML検査を通過。BackEdgeの概要/リンクを通常幅、FrontEdge/BackEdge例を390pxで確認し、CameraPosXへの遷移、内部情報の非表示、表示幅/検査タブの復元を確認。内部注記9件追加で489件、未対応旧履歴121項目、未表示フィールド29ページ。次はFrontEdgeDist・BackEdgeDist・FrontEdgeBodyDist・BackEdgeBodyDistです。

## 2026-10-06：edge-distances-01

FrontEdgeDist / BackEdgeDist / FrontEdgeBodyDist / BackEdgeBodyDistの4件で累計193件（主要・補助16件＋68バッチ177件）、対象内の残り41件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/edge-distances-01/ に保存しました。

- 引数なし・公式記載のfloatを構造化。基準軸からの距離と対画面端の幅バー端からの距離、Facingによる端選択、1.1のFrontEdge/BackEdgeが返す端座標と距離を分けました。旧本文・メタ情報・構文・関連ID・履歴・例・図・FAQと出典rは保持します。新しいスキーマ・レンダラー・CSSの変更はありません。
- BodyDistの旧[Size] ground/airの幅・黄色playerバーとの混同を原位置に残し、公開文はWidth.Edgeの対画面端幅とPlayerの対プレイヤー幅を分けました。保存済み公式Widthの橙/黄/重なりの表示色とValueによる同時指定を照合。画像やClsn1/2の外縁と同一視しません。無関係な旧Size/Tutorial/KFM出典とIKEMEN引用は内部へ残します。
- 旧30px未満/近いという説明と2例は内部へ保持。同じ公式<30条件を負数も満たすという説明で公開し、下限を明示する0以上30未満・前後いずれかの非負範囲を追加。公開された式そのものを-1/0/29.5/30/100と反対側距離で検査し、0を含む/30を含まない/負数を除く/OR条件を確認しました。これは数値比較のテストであり、距離計測や幅処理のMUGEN実機検証ではありません。
- 公式3世代のfloatと[CHAOSのBackEdgeDist](https://w.atwiki.jp/mugencns/pages/99.html) / [BackEdgeBodyDist](https://w.atwiki.jp/mugencns/pages/96.html)にあるInt・切り捨ての資料差をconflicting/internalで保存。具体的なビルドや互換設定、小数位置/丸め方向を決めつけず、全世代の小数精度を保証しません。
- [CHAOSの座標研究](https://w.atwiki.jp/mugencns/pages/95.html) / [FrontEdgeBodyDist](https://w.atwiki.jp/mugencns/pages/97.html)のWin/1.0、StateType A/Lの幅と押し戻しの差、1.0の負数、Widthと常時監視の処理時点は内部へ保持。1.1へ一般化せず、資料の補正式/符号の整合は未検証です。FrontEdgeDist個別記事（pages/98.html）は取得できず、未読の記載を推定しません。
- 保存済み2002.04.14のBackEdgeDist節は基準軸の説明に対し例はBackEdgeBodyDistで、1.0/1.1ではBackEdgeDistです。資料差を内部へ保持し、公開例はBackEdgeDistを使います。旧負数FAQ/出典・一律px/ズーム変動の記述・共通図とaltも内部へ残しました。
- 初導入は4件ともnull。LocalCoord・ズーム・ScreenBound・Helper/リダイレクト・StateType別の幅/符号・処理順の実機測定は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch edge-distances-01
npm run mugen:batch -- --batch edge-distances-01 --target FrontEdgeDist --target BackEdgeDist --target FrontEdgeBodyDist --target BackEdgeBodyDist
npm run mugen:batch -- --batch edge-distances-01 --target FrontEdgeDist --target BackEdgeDist --target FrontEdgeBodyDist --target BackEdgeBodyDist --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・314テスト・263ページビルド・261 URL/204比較対象ページHTML検査を通過。FrontEdgeDistの概要を通常幅、FrontEdgeBodyDistの仕様・BackEdgeBodyDist/BackEdgeDistのコード例を390pxで確認し、内部情報の非表示と表示幅/検査タブの復元を確認。内部注記19件追加で508件、未対応旧履歴114項目、未表示フィールド29ページ。次はP2Dist X/Y・P2BodyDist X/Yです。

## 2026-10-06：opponent-distances-01

P2DistX / P2DistY / P2BodyDistX / P2BodyDistYの4件で累計197件（主要・補助16件＋69バッチ181件）、対象内の残り37件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/opponent-distances-01/ に保存しました。

- 必須のchar軸指定・専用構文・公式floatを構造化。半角スペースを含むP2Dist X/Y・P2BodyDist X/Yを維持し、数値引数の関数に変換しません。旧本文・構文・メタ情報・履歴・関連ID・例・図・引用は削除していません。スキーマ・レンダラー・CSSの変更はありません。
- XはFacing基準の基準軸間距離と幅基準の距離を分離。BodyDist Xを常に両者のfront同士とは扱わず、相手側の実行者に面する幅基準点を説明しました。[Size]の実際のground.front / ground.back / air.front / air.backは保存済みElecbyte 1.1b1 Tutorial 3と照合し、画像/Clsn1/2と幅基準の接触を区別しています。
- Yは公式2002.04.14/1.0/1.1の両者のY軸の高さの差を公開。上なら負・下なら正・同じ高さは0で、X成分の幅減算や画像/size boxの隙間とは分けました。[CHAOS P2DistY](https://w.atwiki.jp/mugencns/pages/175.html) / [P2BodyDistY](https://w.atwiki.jp/mugencns/pages/176.html)も照合しています。
- 旧Nullステートの例と共通図は内部へ保持。Xの公式<30例は負数を含む説明に訂正し、0以上30未満と基準軸前方の別条件を追加。Yは<0・<=-12・Absによる12未満を追加しました。公開式そのものを固定数値で検査し、負数/0/-12/12/30の境界と幅・基準軸条件の独立性を確認。これは数値比較のテストでありMUGENの距離計測の実機検証ではありません。
- [CHAOS P2DistX](https://w.atwiki.jp/mugencns/pages/171.html) / [P2BodyDistX](https://w.atwiki.jp/mugencns/pages/172.html)のX小数切り捨てとY小数保持をunverified/internalへ保存。BodyDist Xの公式front.width/前面同士という記述と、実際の[Size]キー・相手側の幅点・同軸時の後ろ幅・Widthを感知しないという研究の差はconflicting/internalへ保持。具体的なビルド・互換設定・丸め方向や修正世代は推定しません。
- [CHAOSの対象選択](https://w.atwiki.jp/mugencns/pages/43.html) / [座標研究](https://w.atwiki.jp/mugencns/pages/95.html)の特殊Playerヘルパー・5150除外・幅と処理順は内部へ。P2不在時の値は公式のError conditionsなしという記載から0/bottomを推定せず、NumEnemyだけによる参照保証も追加しません。IKEMEN GOの旧3履歴/引用は別エンジンとして内部に保持しました。初導入はnull、LocalCoord・Helper/リダイレクト・不在境界・幅/精度の実機測定は未実施です。

~~~sh
npm run mugen:batch-baseline -- --batch opponent-distances-01
npm run mugen:batch -- --batch opponent-distances-01 --target P2DistX --target P2DistY --target P2BodyDistX --target P2BodyDistY
npm run mugen:batch -- --batch opponent-distances-01 --target P2DistX --target P2DistY --target P2BodyDistX --target P2BodyDistY --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・320テスト・263ページビルド・261 URL/208比較対象ページHTML検査を通過。P2DistXを通常幅、P2BodyDistXの軸表とP2DistY/P2BodyDistYの例を390pxで確認し、内部情報の非表示と表示幅/検査タブの復元を確認。内部注記20件追加で528件、未対応旧履歴111項目、未表示フィールド29ページ。次はParentDist X/Y・RootDist X/Yです。

## 2026-10-06：helper-distances-01

ParentDistX / ParentDistY / RootDistX / RootDistYの4件で累計201件（主要・補助16件＋70バッチ185件）、対象内の残り33件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/helper-distances-01/ に保存しました。

- 必須char軸指定・専用構文・公式floatを構造化。半角スペースを含むParentDist X/Y・RootDist X/Yを保持し、括弧付き数値引数やMUGENのZ成分を生成しません。旧本文・メタ情報・構文・関連ID・2履歴ずつ・例・図・引用は保持。スキーマ/レンダラー/CSSは変更していません。
- 公式3世代のHelper専用条件を明示。Parentは直接の親、Rootは所有する本体で、本体 → Helper A → Helper Bの例を公開。Xは実行者HelperのFacing基準の正負と同軸0、Yは基準軸の高さの差（上は負・下は正・同じ高さは0）を整理し、相手のFacing・画像/Clsn外縁と区別しました。[CHAOS ParentDist X](https://w.atwiki.jp/mugencns/pages/173.html) / [RootDist X](https://w.atwiki.jp/mugencns/pages/174.html)も照合しています。
- 1.0/1.1の不在時bottomを公開するerrorとして世代を限定し、通常数値0を代入する処理と区別。保存済みCNSのbottom/特殊評価節を照合し、条件式全体がbottomなら偽となる説明とCond/IfElseの例外を記載しました。2002資料のSFalse・旧3世代共通bottom説明はlegacy_index:0のconflicting/internalに保持。表記差を実装の変更/修正時点へ変換しません。
- RootDistの公式X説明に3世代ともParentDistと書かれている点は内部に記録。節名・対象・例はRootDistなので、公開本文を親との距離へ誤変換しません。親のdestroyed/KOという公式例から、すべてのKOで即時参照切断されると推定していません。
- 旧Null例と共通図は内部へ保持。公開例はTriggerAll = IsHelperと短い比較条件で、Helper確認は参照先存在の保証ではないと説明。Xの!=0/0以上30未満/Absで30未満、Yの<0/<=-12/Absで12未満を追加し、公開式そのものを固定数値で検査しました。比較境界のテストであり、距離計測・親子関係・不在時bottomの実機シミュレーションではありません。
- CHAOSのX小数切り捨て報告はunverified/internalに保持し、型と数値精度・負数の丸め方向を分離。Y個別記事（177/178）は取得できず、Xの報告からYの整数化/小数保持を推定しません。LocalCoord換算・親Helper消滅/Root寿命・ラウンド/処理順・通常プレイヤー評価は実機未検証。初導入null、旧GOのZ成分4履歴は別エンジンの内部記録に保持しています。

~~~sh
npm run mugen:batch-baseline -- --batch helper-distances-01
npm run mugen:batch -- --batch helper-distances-01 --target ParentDistX --target ParentDistY --target RootDistX --target RootDistY
npm run mugen:batch -- --batch helper-distances-01 --target ParentDistX --target ParentDistY --target RootDistX --target RootDistY --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・326テスト・263ページビルド・261 URL/212比較対象ページHTML検査を通過。ParentDistXを通常幅、RootDistXの軸表・ParentDistYの例・RootDistYの世代別エラーを390pxで確認し、内部情報の非表示と表示幅/検査タブの復元を確認。内部注記24件追加で552件、未対応旧履歴103項目、未表示フィールド29ページ。次はTeamMode・TeamSide・IsHomeTeamです。

## 2026-10-06：team-affiliation-01

TeamMode / TeamSide / IsHomeTeamの3件で累計204件（主要・補助16件＋71バッチ188件）、対象内の残り30件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/team-affiliation-01/ に保存しました。

- TeamModeは必須演算子=/!=と引用符なしのSingle/Simul/Turnsを用いる旧式比較、TeamSide/IsHomeTeamは引数なしの整数参照として構造化。TeamModeの比較結果とIsHomeTeamは1/0、TeamSideはP1/P2所属の1/2を返します。チーム形式・現在人数・所属側・現在座標/Facing・ホーム扱いを分離しました。旧本文・メタ・構文・履歴・Q&A/c/r・例・引用は保持し、スキーマ/レジストリ/レンダラー/CSSは変更していません。
- 保存済み公式3世代と[CHAOS TeamMode](https://w.atwiki.jp/mugencns/pages/194.html)を照合。自チームSingleから相手もSingle/1対1とは推定せず、敵側はリダイレクトして調べます。公式のサバイバル敵側Turnsを公開、CHAOSの検証不足/疑問符は内部へ保持しました。TeamSide/IsHomeTeamのCHAOS記事は全文取得に失敗したため検索結果本文の確認範囲を内部に記録し、未読部分を推定しません。
- 旧RC4/RC5の2履歴を保存済み公式1.0履歴と照合。RC4は!=構文解析（HitDefAttr/AuthorNameも対象）、RC5はTeamMode/HitDefAttrの評価修正で、別々のversion_change/fixedと既存のmugen-1.0-rc4/rc5へ対応付けました。互換プロファイル・症状・再現条件を推定しません。
- CHAOSの!=より否定式を勧める留保と、2020年のWinMUGEN引用符付き指定でエラー落ちする[会議室報告](https://w.atwiki.jp/mugencns/pages/40.html)を内部へ保持。具体ビルド/1.0/1.1再現は未確認で、!=を全世代無効にはしていません。モード引数を通常の引用符付き文字列に変換せず、公開例は公式同様の引用符なしです。
- TeamSideの有効なVarSet/IfElseの旧2例は公開を維持。旧左右判定のPos/EdgeDist案内を内部へ保持してQ&Aを訂正し、所属側と現在の位置/向きを区別しました。IsHomeTeamの旧Q&A・RoundState=0/未定義9000/9010へのイントロ遷移例は内部へ保存し、公開はホーム/非ホームの短い条件行です。Training/Watch/CPU対CPU/Helperの実測とAILevelとの詳細関係は未確認です。
- 3件のGO履歴・TeamModeのGO Q&A/Tag/Ratio・TeamSideのAttachedChar=0・IsHomeTeamのissue報告と引用を別エンジンの内部記録へ保持。旧2002 TeamMode引用の#TeamModeを残し、公開は実在する#TeamMode(*,***)の新しい保存済み引用へ案内します。初導入null、特殊モード/敵消滅/人数更新/互換設定は実機未検証です。
- 公開例の比較式を固定したモード文字列/1・2/0・1で検査し、否定条件と既存分岐の100/200を確認。Enemy例の先行人数条件と参照式を検査しました。これは条件式と出力の検証であり、MUGENのモード選択・Enemy対象選択を再現するテストではありません。

~~~sh
npm run mugen:batch-baseline -- --batch team-affiliation-01
npm run mugen:batch -- --batch team-affiliation-01 --target TeamMode --target TeamSide --target IsHomeTeam
npm run mugen:batch -- --batch team-affiliation-01 --target TeamMode --target TeamSide --target IsHomeTeam --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・332テスト・263ページビルド・261 URL/215比較対象ページHTML検査を通過。TeamModeを通常幅、必須引数表/RC履歴・TeamSideの既存例・IsHomeTeamの公開例を390pxで確認し、内部情報の非表示と表示幅/検査タブの復元を確認。内部注記14件追加で566件、未対応旧履歴97項目、未表示フィールド29ページ。次はMatchNo・MatchOverです。

## 2026-10-06：match-progress-01

MatchNo / MatchOverの2件で累計206件（主要・補助16件＋72バッチ190件）、対象内の残り28件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/match-progress-01/ に保存しました。

- 両方を引数なし・整数返却として構造化し、試合番号/ラウンド番号と試合全体の決着/各ラウンドの勝敗を分離。MatchNoのtitle欠落、旧本文・メタ・構文・全履歴・画像/寸法/alt・sample_code・全使用例・引用を保持。スキーマ/レジストリ/レンダラー/CSS変更はありません。
- 保存済み公式3世代は、MatchNoが次試合開始で増え、continueでは増えず、クリア後の新ゲームで1へ戻ると明記。旧本文のcontinue増加・ゲームオーバー時リセットをconflictingの内部研究へ保持し、公開説明を訂正しました。対戦系では常に1で、RoundNoとの条件併用も1回実行を保証しません。CHAOSのMatchNo索引リンクは取得に失敗し、未読本文やSurvival/Training/Watchの更新を推定していません。
- MatchOverの1.0/1.1履歴は通常のbehaviorとして対応。公式の勝利ポーズ開始までという段階を公開し、旧「両者が180番」という一般化、正確なフレーム境界は内部へ保持。[CHAOS MatchOver](https://w.atwiki.jp/mugencns/pages/116.html)のDOS=180内のみという伝聞、Win以降の約10フレーム、時間切れ勝利の取り消しによる1→0を資料差として内部へ保存。全ビルドの確定値・永久フラグとして公開しません。
- MatchNoの旧ゲージ初期化例はOR条件が1試合目/1ラウンド目を保証せず、変数の更新前提も無いため内部へ。MatchOverの旧PreOver/結果フラグ例・共通勝敗画像も更新時点と最終決着を実測していないため内部へ。旧PalFX例はAdd固定・再実行で、徐々に暗くなる1回のフェードとして成立しないことを保存しました。公開例は番号比較・MatchOver/否定・WinとのAND条件に限定し、未定義変数や制御効果を追加していません。
- GOの15秒遅延/フェイルセーフ・RoundNotOver修正と2引用を別エンジンの内部記録へ保持。初導入null、モード/continue差の実測・DOS/Win/1.x成立時点・Turns/Helper・勝敗取り消し・旧フラグ初期化は未検証。固定入力の条件式テストはこれらのエンジン挙動を再現するものではありません。

~~~sh
npm run mugen:batch-baseline -- --batch match-progress-01
npm run mugen:batch -- --batch match-progress-01 --target MatchNo --target MatchOver
npm run mugen:batch -- --batch match-progress-01 --target MatchNo --target MatchOver --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・337テスト・263ページビルド・261 URL/217比較対象ページHTML検査を通過。MatchNoを通常幅、番号条件例とMatchOverの世代別仕様/コード例を390pxで確認し、内部非表示と表示幅/検査タブの復元を確認。内部注記10件追加で576件、未対応旧履歴95項目、未表示フィールド29ページ。次はWin・WinKO・WinTime・WinPerfectです。

## 2026-10-06：round-win-01

Win / WinKO / WinTime / WinPerfectの4件で累計210件（主要・補助16件＋73バッチ194件）、対象内の残り24件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/round-win-01/ に保存しました。

- 全4件を引数なし・整数1/0のラウンド結果参照として構造化。評価プレイヤー/チームの勝利、KO/時間切れの理由、パーフェクト扱い、試合全体のMatchOverを分離しました。旧全文・メタ・構文・3履歴・関連リンク・画像src/alt/寸法・8例・Q&A/c/r・引用を保持し、スキーマ/レジストリ/レンダラー/CSSは変更していません。
- 保存済み公式3世代はWin項目内で4構文をまとめて定義。WinKOは相手の現在Life=0だけ、WinTimeは時間切れ発生だけでは勝利を保証しないことを整理し、否定条件は未成立区間も含むと明示しました。WinKOの公開例はWinとの併用で別理由の勝利を限定、WinPerfectの例はWinKOとの併用で終了理由とパーフェクト扱いを別々に確認します。
- WinのMatchOver遅延履歴は1.0/1.1の通常behaviorへ対応。旧RoundState=3推奨のWin/WinKO運用注意は[2014年の特定キャラ/技の相談](https://mugenfreeforall.com/topic/19602-winroundstate-help-needed/)にLife/Alive/P2Life/EnemyNear・StateNo/PrevStateNo・専用777番という前提があり、一般推奨にはしません。履歴と引用は内部へ残しました。
- 旧-2のセット/リセット例8件と共有結果図は内部へ保持。Persistent=0の「そのステートにいる間1回」とラウンド/結果単位のラッチは別であり、負のステートでの適用・0区間の初期化/スキップ/更新順は未実測です。公開例へ変数や副作用・1回実行の保証を追加していません。
- [CHAOS Win](https://w.atwiki.jp/mugencns/pages/109.html)の取得前死亡による勝利取り消し、取得後との違い、Varでのカウント制約とIeflse表記を保持。[WinKO](https://w.atwiki.jp/mugencns/pages/110.html)/[WinTime](https://w.atwiki.jp/mugencns/pages/111.html)の時間切れ後のKO切替・同時に1にならない報告、デバッグ蘇生の差も研究として内部に保存し、全ビルドの永久確定フラグに変換しません。
- WinPerfectは公式no life lostから「途中で減った履歴を含む」と断定していた旧Q&Aと、[CHAOS検索結果本文](https://w.atwiki.jp/mugencns/pages/112.html)の被弾後/勝利判定後に回復しても1・Simulはパートナーも最大という記録が食い違います。直接本文取得は失敗したため確認範囲を明記し、原文/Q&A/c/r/資料差を内部へ保存。公開はパーフェクト扱いの判定と、現在の自分のLifeだけでは勝利/チームを判定できない説明へ訂正しました。回復前後の履歴条件を推定していません。
- 初導入null、結果の更新/取り消し時点、Simul/Turns、体力補正/回復、負のステート、互換設定は実機未検証。公開条件を固定1/0で検査し、否定とAND条件を確認しています。エンジンの勝敗計算/更新順を再現するテストではありません。

~~~sh
npm run mugen:batch-baseline -- --batch round-win-01
npm run mugen:batch -- --batch round-win-01 --target Win --target WinKO --target WinTime --target WinPerfect
npm run mugen:batch -- --batch round-win-01 --target Win --target WinKO --target WinTime --target WinPerfect --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・342テスト・263ページビルド・261 URL/221比較対象ページHTML検査を通過。Winを通常幅、WinKOのWin併用例・WinTimeの概要・WinPerfectの訂正Q&A/KO併用例を390pxで確認し、内部非表示と表示幅/検査タブの復元を確認。内部注記18件追加で594件、未対応旧履歴92項目、未表示フィールド29ページ。次はLose・LoseKO・LoseTime・DrawGameです。

## 2026-10-07：round-loss-draw-01

Lose / LoseKO / LoseTime / DrawGameの4件で累計214件（主要・補助16件＋74バッチ198件）、対象内の残り20件です。2026-10-06に資料照合・計画・適用・テスト/ビルドを実施し、再開した2026-10-07にHTML検査と記録を更新しました。移行前JSON・HTML・抽出結果は tests/mugen/batches/round-loss-draw-01/ に保存しています。

- 全4件を引数なし・整数1/0のプレイヤー/チームのラウンド結果参照として構造化。敗北とKO/時間切れの理由、引き分けと試合全体のMatchOverを分離しました。現在Life=0や時間切れ発生だけでは敗北理由を置き換えません。旧全文・メタ・構文・関連リンク・図src/alt/寸法・8例・引用を保持し、スキーマ/レジストリ/レンダラー/CSSは変更していません。
- 否定条件は結果がまだ成立していない区間も含みます。公開例は実在する短いTrigger条件とし、LoseKOはLoseとのANDで別理由の敗北、DrawGameは!MatchOverとのANDで試合全体未決着を調べます。勝ち星付与とトリガーの値を同一視せず、!Win/!Loseだけで引き分けと判断しません。
- 旧-2のセット/リセット例8件と共有図は内部へ保持。Persistent=0の「そのステートにいる間1回」とラウンド/結果単位のラッチは別であり、負のステート・初期化/スキップ/更新順は未実測です。RoundState=3だけで結果の即時/最終確定を保証していません。
- DrawGameは保存済み公式3世代のFormat=Drawと使用例trigger1=DrawGameが食い違います。資料差をconflictingな内部研究へ保存し、既存のDrawGame構文/使用例を維持。未確認のDraw別名は追加していません。
- [CHAOS DrawGame](https://w.atwiki.jp/mugencns/pages/108.html)のラウンド取得前の死亡による結果再判定・デバッグ蘇生/死亡・時間切れ後の死亡と「はず」の留保、引き分け上限超過で両者への勝利判定付与・カウント/チーム/Survival制約を内部へ保持。WinとDrawGameが同時に1になる証明とはせず、旧Win/Lose通常0という本文を残して全時点の排他性を公開では断定しません。
- Lose/LoseKO/LoseTimeのCHAOS個別ページは本文取得に失敗し検索でも確認できませんでした。Win系のKO切替/蘇生研究を敗北側へ写して確認済みとしません。初導入null、結果更新/取り消し・引き分け上限と勝ち星・Simul/Turns・互換設定は実機未検証。条件のテストは固定1/0の否定/ANDのみで、エンジンの勝敗計算や更新順を再現しません。

~~~sh
npm run mugen:batch-baseline -- --batch round-loss-draw-01
npm run mugen:batch -- --batch round-loss-draw-01 --target Lose --target LoseKO --target LoseTime --target DrawGame
npm run mugen:batch -- --batch round-loss-draw-01 --target Lose --target LoseKO --target LoseTime --target DrawGame --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・347テスト・263ページビルド・261 URL/225比較対象HTML検査を通過。ブラウザ目視は未完了です。前回は利用上限による自動承認レビュー拒否、2026-10-07再開時は開発サーバー停止による接続エラー後、エラーページの操作がURLポリシーで拒否されました。開発サーバーを4322で再起動しましたが、通常/390px表示を確認済みとは記録しません。内部注記18件追加で612件、未対応旧履歴92項目、未表示フィールド29ページ。次はName・AuthorNameです。

## 2026-10-07：name-comparisons-01

Name / AuthorNameの2件で累計216件（主要・補助16件＋75バッチ200件）、対象内の残り18件です。移行前JSON・HTML・抽出結果を tests/mugen/batches/name-comparisons-01/ に保存しました。

- 両者をold_style構文・整数1/0へ構造化。必須の= / !=演算子とダブルクォート付き文字列をspecial_syntaxの引数として定義し、単独の文字列取得関数や数値式とは区別しました。Nameの内部名とdisplayname/フォルダ名、AuthorNameの作者名を分離。旧全文・メタ・構文・図・例・引用・関連リンクを保持し、スキーマ/レジストリ/レンダラー/CSSは変更していません。
- 不在リダイレクトのbottomは正常な不一致0と分け、1.0/1.1の公式記載に範囲を限定しました。公開例はNumEnemyを同じTrigger1の先頭で確認してからEnemyへ参照を移し、作者名と内部名の併用も同じ参照先でAND条件にします。Enemyがチーム全員を走査する例ではなく、対象選択の再現テストでもありません。
- AuthorNameの!=構文解析修正を保存済み公式1.0 RC4履歴と照合し、既存のmugen-1.0-rc4へ対応付けました。Nameにはその修正を転用していません。[CHAOS AuthorName](https://w.atwiki.jp/mugencns/pages/89.html)は!=の利用不可の疑い、括弧付き一致条件の否定、空文字への!=不可と2バイト文字の環境差を記録します。公式の演算子表と1.x履歴との資料差はconflictingな内部研究へ保存し、全ビルドで!=無効としません。ChangStateという研究例の誤記もコピーしていません。
- Nameの既存NoAutoTurn例は有効な条件/パラメーターとして公開を維持。AuthorNameの旧VarSet例はVar = 0が公式v/valueまたはvar(n)代替形式と異なり、相手存在の確認とリセットもありません。コード・説明をJSONへ残して内部化し、変数用途を推定して書き換えていません。共有図も内部へ保存しました。
- 旧2002引用の#Name/#AuthorNameは実際のName(*,***)/AuthorName(*,***)アンカーと違うため、旧引用を内部保持して有効なリンクを追加。初導入はnull。CNSの大小文字の基本説明、[CHAOS DEF](https://w.atwiki.jp/mugencns/pages/31.html)のname/displayname/authorと2バイト文字注意を照合し、文字コード・空白/空文字/長さ・Helper.Nameと作者名・カスタムステートは未実測として内部へ残しました。CHAOS Name個別本文は取得できませんでした。

~~~sh
npm run mugen:batch-baseline -- --batch name-comparisons-01
npm run mugen:batch -- --batch name-comparisons-01 --target Name --target AuthorName
npm run mugen:batch -- --batch name-comparisons-01 --target Name --target AuthorName --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

258 JSON・352テスト・263ページビルド・261 URL/227比較対象HTML検査を通過。テストは原文保存・特殊構文・存在確認行の順序・与えた文字列の一致/否定/ANDを検査し、MUGENの大小文字比較/対象選択/文字コード/bottomを再現しません。前段のブラウザURLポリシー拒否が未解消のため、今回の通常/390px目視は未実施。内部注記8件追加で620件、未対応旧履歴92項目、未表示フィールド29ページ。次はP1Name・P2Name・P3Name・P4Nameです。

## 2026-10-08：player-names-01

P1Name・P2Name・P3Name・P4Nameの4件で累計220件（76バッチ204件＋主要・補助16件）、残り14件。必須演算子/引用文字列と整数比較結果、評価対象から見た自分/対戦相手/パートナー/第2の相手を分離。P2の旧パートナー説明と関連NumPartner、不在時bottomの旧説を原文保持で訂正しました。直接比較の不在=0/!=1と1.0/1.1不在リダイレクトbottomを区別し、公開例はNumEnemy > 0 / NumPartner > 0 / NumEnemy >= 2の存在確認を併用。旧Var=2例・前提不足な-2移行例・共有図・primary/nearestの選択研究を内部へ保持。2002アンカーを修復し、初導入null、実機未検証。357テスト・263ページビルド・261 URL/231比較対象HTMLと通常/390px表示を確認。前段ブラウザ拒否後の再開確認が完了。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記636件、未対応旧履歴92項目、未表示フィールド29ページ。次はPalNo・TicksPerSecondです。

移行前JSON・HTML・抽出結果は tests/mugen/batches/player-names-01/ に保存しました。全メタ・旧本文・構文・関連配列・例・図・引用を保持し、公開の訂正をdocumentation/behaviorへ追加しています。

- P1NameはNameのエイリアス。固定の1P側ではなく評価対象の内部名比較です。P2Nameは対戦相手、P3Nameはパートナー、P4Nameは第2の対戦相手という関係で、固定の側番号とは区別しました。
- 保存済み公式3世代のP2/P3/P4は対象不在の=が0、!=が1です。否定だけでは存在確認になりません。P4では敵が1人の境界も検査し、NumEnemy > 0では第2の相手の確認に不足することを公開例で説明しました。リダイレクト先自体の不在bottomとは別の仕様です。
- [CHAOS P2Name](https://w.atwiki.jp/mugencns/pages/92.html)の最も近い相手・リダイレクト先から見た対象という研究を、公式primary/firstと導入説明のusually closestとの表現差を含めて内部へ保持。生存者への切替・距離同値・Helper/所有者・文字コードとWinの!=境界は未実測で、固定ID順や全チーム走査を推測していません。CHAOS P1/P3/P4個別本文は取得失敗。
- P1の旧VarSetのVar = 2はv/valueまたはvar(n)形式と異なるため内部保持。旧ChangeState例も未定義の9000/9100移行先と-2での再入前提が未確認のためコード・説明を内部へ残し、移行先を推定した書き換えは行っていません。P3/P4の旧存在確認条件は誤りとは扱わず保持しています。
- 旧2002引用は実際のP*Name(*,***)アンカーへ公開リンクを追加し、旧引用を内部保持。AuthorNameのRC4修正をPxNameへ転用していません。テストは原文保存・公開範囲・引数・実際の条件行の人数境界を検査し、実機の対象選択や名前比較をエミュレートしません。

~~~sh
npm run mugen:batch-baseline -- --batch player-names-01
npm run mugen:batch -- --batch player-names-01 --target P1Name --target P2Name --target P3Name --target P4Name
npm run mugen:batch -- --batch player-names-01 --target P1Name --target P2Name --target P3Name --target P4Name --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## 2026-10-08：palette-tick-rate-01

PalNo・TicksPerSecondの2件で累計222件（77バッチ206件＋主要・補助16件）、残り12件。引数なし/int、選択パレット番号と1.xの.def順序省略時のボタン対応表、秒数×tick換算とステート経過時間を分離。PalNoのHelper継承修正はRC2、Start選択修正はRC3へ個別対応。Win Helperの1固定/1.0疑問符・描画再割当て・デバッグ加速/停止の研究、標準4番慣習と旧FPS表現を内部保持。旧PalNoのY=5ラベルを残して条件例を追加し、TicksPerSecondの有効な旧公式比較例は公開維持。全原文・summary・メタ・構文・例・引用を保存。初導入null、実機未検証。362テスト・263ページビルド・261 URL/233比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記643件、未対応旧履歴92項目、未表示フィールド29ページ。次はConst240p・Const480p・Const720pです。

移行前JSON・HTML・抽出結果は tests/mugen/batches/palette-tick-rate-01/ に保存しました。

- PalNoの公式1.xは.defで対応順を設定でき、省略時はA/B/C/X/Y/Z=1〜6、Start併用=7〜12です。既定の対応は6行3列の表として公開し、標準色が必ず4番・Yが必ず5番という全環境共通の説明へ拡張していません。旧ボタン付きタイトルを内部保持し、同じ有効コードを番号だけの説明で公開しています。
- 公式RC2のHelperが親のpalnoを継承しない修正とRC3のStart＋ボタンで7〜12を選べない修正は別々に対応付けました。[CHAOS PalNo](https://w.atwiki.jp/mugencns/pages/182.html)はWinのHelperで1だけを返す研究とRoot, PalNoの案、1.0の疑問符を記録しています。OwnPal・入れ子・描画パレット再割当て・欠番/上限は未実測として保持しています。
- TicksPerSecondはFPS計測の旧ラベルを残して、tick換算に公開訂正。旧公式Time > 10 * TicksPerSecond例は有効な条件として公開を維持し、>=の境界を含む例と10秒分以上11秒分未満の半開区間例を追加。1回だけの実行条件ではないことを説明しました。実機の各速度値を推定せず、テストの30/60/120は入力として与えた整数率に限ります。
- [CHAOS PlaySnd](https://w.atwiki.jp/mugencns/pages/251.html)のデバッグ加速に対応できない注意、[CHAOS Time](https://w.atwiki.jp/mugencns/pages/197.html)の移行時リセット/HitPause中の停止を内部に保持。公式のゲームスピードに関わらない換算例を、音声同期・停止中を含む実時間保証に広げていません。CHAOS TicksPerSecond個別本文は取得失敗です。

~~~sh
npm run mugen:batch-baseline -- --batch palette-tick-rate-01
npm run mugen:batch -- --batch palette-tick-rate-01 --target PalNo --target TicksPerSecond
npm run mugen:batch -- --batch palette-tick-rate-01 --target PalNo --target TicksPerSecond --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## 2026-10-08：coordinate-conversion-01

Const240p・Const480p・Const720pの3件で累計225件（78バッチ209件＋主要・補助16件）、残り9件。1.0/1.1系列の必須float式引数とfloat戻り値、320/640/1280幅基準から評価対象の座標空間への横幅比による換算、入力bottom伝播と通常0を分離。旧現解像度/概ね/localcoord相当の原文・引数・関連・例・引用を保持し、既存3/6/12の公式換算例は公開維持、実在VelSetのx/yによる短い例を追加。2011.01.18やRC1のLocalCoord追加を初導入と推定せずnull。CHAOS索引のウィンドウ疑問符・互換設定/Helper/リダイレクト/精度の留保は内部へ保存。367テスト・263ページビルド・261 URL/236比較対象HTMLと通常/390px表示を確認。換算式の代数テストであり実機未検証。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記652件、未対応旧履歴92項目、未表示フィールド29ページ。次はCommand・StageVarです。

移行前JSON・HTML・抽出結果は tests/mugen/batches/coordinate-conversion-01/ に保存しました。

- 保存済み公式1.0/1.1は横幅比を明記。320×240・640×480・1280×720基準の引数をそれぞれの基準幅で除して対象幅へ換算する公開文とし、高さの比・表示ピクセル数とは区別しました。引数は1つの必須float式、戻り値float、入力がbottomなら結果もbottomです。arguments[].legacy_indexで旧parameterの情報を引き継ぎ、元説明を上書きしません。
- common1.cnsの0以外の位置/速度オフセットへいずれかのConstを使う公式推奨を公開。既存value代入の抜粋は公式例と一致するため公開を維持し、追加例は実在するVelSetのX/Yへ換算値を指定しました。架空のパラメーターは追加していません。
- 3→6→12の結果、0・負数・小数、同幅/倍幅/半幅と1280×720の横幅比4対高さ比3を代数的に検査。与えた幅と数値についての検査であり、エンジンのLocalCoord/互換プロファイル/浮動小数精度/リダイレクトを実測したものではありません。
- 公式RC1履歴にはLocalCoordとAILevelがあるものの、この3関数の初追加は明記されません。page.versionを維持し初導入はnull。[CHAOS索引](https://w.atwiki.jp/mugencns/pages/24.html)のウィンドウの大きさに関する項目？という疑問符と、Helper・親/本体・カスタムステート・ズーム・非標準アスペクト比・精度は内部研究として保存しています。

~~~sh
npm run mugen:batch-baseline -- --batch coordinate-conversion-01
npm run mugen:batch -- --batch coordinate-conversion-01 --target Const240p --target Const480p --target Const720p
npm run mugen:batch -- --batch coordinate-conversion-01 --target Const240p --target Const480p --target Const720p --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## 2026-10-08：command-stage-metadata-01

Command・StageVarの2件で累計227件（79バッチ211件＋主要・補助16件）、残り7件。必須の比較演算子/引用文字列とint結果、StageVarの引用しない識別子を構造化。Commandの逆転したTime/Buffer.Time説明を原文保存で訂正し、EndCmdBufTimeの0..Time・対象制限を公開FAQへ具体化。StageVar追加はRC8へ対応し、公式のinfo.authorname/author差と停止/入力/カスタムステート/別エンジン研究は内部保持。374テスト・263ページビルド・261 URL/238比較対象HTMLと通常/390px表示を確認。ブラウザで既存の色付け処理がCMDの~/$を消す不具合を再現し、記号と未分類文字の保持を修正、失敗→通過の回帰テストと再読み込み後の~D表示を確認。JSON原文・メタ・構文・表・例・履歴・FAQ・引用を保持。スキーマ/レジストリ/CSS変更なし、実機未検証。内部注記658件、未対応旧履歴90項目、未表示フィールド29ページ。次はHitDefAttr・GetHitVarです。

移行前JSON・HTML・抽出結果は tests/mugen/batches/command-stage-metadata-01/ に保存しました。

- Commandは保存済み公式3世代の= / !=、引用名・大小文字区別・同名のいずれか・1/0を照合。固定コミットの[配布KFM CMDコメント](https://github.com/fanyer/mugen/blob/b6885c654ba830157f5dd4f257bebfa738300df3/chars/kfm/kfm.cmd)でTimeの入力猶予とBuffer.Timeの成立後持続を確認。逆転した旧説明付き例をinternalで保持し、同じ設定行を訂正説明付きで追加。ホールドのみの例外と、複数フレーム続く成立が1回だけのイベントではないことを公開しました。ChangeState先1000の定義は作者が用意する前提を明示しています。
- Pauseの実在パラメーターEndCmdBufTimeの終了側の入力バッファ、0〜Time・省略0・停止中動けないプレイヤーという対象、SuperPauseへの継承を公開FAQに記載。旧FAQ・補足は内部に保持しました。Key/KeyDown/KeyUpの旧関連配列は原位置に残して公開関連を実在するCtrl/StateTypeへ訂正。旧2002リンクは実際のCommand (*,***)へ新引用を追加。
- [CHAOS Command](https://w.atwiki.jp/mugencns/pages/105.html)と[CMD研究](https://w.atwiki.jp/mugencns/pages/37.html)の未定義名ロードエラー対公式none、Helper/AI/HitPause、カスタムステートでの定義順・recovery例外の疑問符、複合入力/向き反転・境界の留保を内部保持。GO issue365の報告・再現不足・dash単体の留保はengine=ikemen-goの旧履歴対応researchとして保存し、MUGENの一般仕様へ転用していません。
- StageVarは1.0/1.1のDetails/ExampleのInfo.Authorを維持し、Argumentsのinfo.authornameとの差をconflictingとして内部保存。未検証の別名を増やしていません。旧3引数の型・説明・表を残してlegacy_index付きの識別子・演算子・引用文字列へ対応。RC8履歴で初追加を確認し、displayname省略時nameというBGの説明を公開。比較のケース/文字コード/空文字・互換設定別の動作は未測定です。
- public/scripts/code.jsのトークナイザーが~/$と未分類ASCIIを落としていたため、CMD記号の分類と1文字フォールバックを追加。JSON/生成HTMLが正しくてもクライアント処理後に~DがDになることをブラウザとテストで確認しました。回帰テストは離し入力・チャージ・4方向・ホールド・元CMD例と未分類句読記号の全文保存を検査し、エンジン入力を模擬しません。

~~~sh
npm run mugen:batch-baseline -- --batch command-stage-metadata-01
npm run mugen:batch -- --batch command-stage-metadata-01 --target Command --target StageVar
npm run mugen:batch -- --batch command-stage-metadata-01 --target Command --target StageVar --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## 2026-10-08：hitdef-attribute-01

HitDefAttrの1件で累計228件（80バッチ212件＋主要・補助16件）、残り6件。必須演算子・引用しない姿勢/攻撃種別と整数戻り値を構造化し、旧oper省略可を原位置に保持。RC4の!=解析修正とRC5の評価修正を分離。旧一致例2件は公開維持、旧否定例は内部に残して同じコードを1.x適用/非攻撃時の留保付きで追加。公式の部分集合とCHAOSの共通部分/空属性/更新順/Projectile研究、個別項目の!=疑問符と図は内部保持。初導入null、実機未検証。379テスト・263ページビルド・261 URL/239比較対象HTMLと通常/390px表示を確認。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記661件、未対応旧履歴88項目、未表示フィールド29ページ。

移行前JSON・HTML・抽出結果は tests/mugen/batches/hitdef-attribute-01/ に保存しました。

- 全原文・メタ・構文・引数の型/省略分類/候補表・図・コード例・履歴・引用を保存。arguments[].legacy_indexで3引数へ対応し、operを必須、value1/value2を引用しない専用属性構文へ公開訂正。HitDef自身の属性と受けた攻撃・StateType単独を分離しています。
- 保存済み公式1.0履歴に!=解析修正（RC4）と評価修正（RC5）が個別にあり、旧履歴へlegacy_index付きで対応。初導入ビルドを旧2002日付から推定していません。否定を攻撃中の保証に使わないことを1.0/1.1の公開文と例に記載しました。
- [CHAOS属性頁](https://w.atwiki.jp/mugencns/pages/23.html)と[会議室](https://w.atwiki.jp/mugencns/pages/85.html)は両側の共通部分での反応・空指定・属性更新後の補完・重なり/停止/1F差を報告。公式の部分集合記述との複数属性モデル差をconflictingの内部注記へ保持しました。個別HitDefAttr頁の直接取得は失敗し、検索本文の!=使用不可？だけを未検証として記録。Wildcard/PとProjectile検知の範囲を推測で広げていません。
- 通常幅で必須演算子表、390pxで修正履歴・有効な一致例と適用範囲を補った否定例を確認しました。テストは保存と公開範囲/構文/履歴の対応を検査し、実機の属性集合判定や更新順を模擬しません。

~~~sh
npm run mugen:batch-baseline -- --batch hitdef-attribute-01
npm run mugen:batch -- --batch hitdef-attribute-01 --target HitDefAttr
npm run mugen:batch -- --batch hitdef-attribute-01 --target HitDefAttr --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## feedback-victory-01（2026-10-09）

ForceFeedback / VictoryQuote の2件。累計230件、81バッチ214件＋主要/補助16件、残り4件。

- 旧原文・メタ・パラメーター/省略値/読み込み順・図・コード例・引用を保持。移行前比較基準と追加計画を適用前にコミットしました。
- ForceFeedbackは保存済み1.0の「未実装」を公開制約へ限定し、旧「廃止（多分）」を内部へ対応付けました。1.1の同文から1.1の対応や削除ビルドを推定しません。数値定数・4係数・Freq無視を明示し、公式任意/CHAOS必須、旧引用符付き波形と配布common1.cnsの引用なし指定、対応機器の研究は内部へ。WaveFormはunknownの省略指定としてCNS出力をコメントに保ち、公開表示は資料で確認したsineだけを案内します。
- VictoryQuoteは公式RC1履歴による初導入、0..99と範囲外のランダム、勝者の指定・Helper無効を構造化しました。有効な既存英日Quotes例は公開維持し、Configの言語指定・Victory Screenの有効化・存在確認を伴うvictory3選択例を追加。範囲内の未定義番号をランダムと断定しません。旧一律9000,2必須/120×115、既定値の一般化、前提不足の旧例/図は内部保存。
- RC1レジストリを追加。公式履歴の22 Sep 2009と旧参考表の21 Sepの相違を記録し、配布日はnull。MUGEN/IKEMENを分離し、検証状態や根拠はHTMLへ出しません。資料確認を実機検証とはしません。
- 384テスト、263ページビルド、261 URL/241比較対象HTML、通常幅/390pxで2件の表・設定例・内部情報非表示を確認。開発サーバーの古いレジストリ参照は対象を確認して4322で再起動し解消。検査後に幅を復元して検査タブを終了しました。
- 内部注記665件、未対応旧履歴87項目、未表示フィールド29ページ。スキーマ/レンダラー/CSSは変更なし。残りはGetHitVar / ModifyExplod / Projectile / ReversalDefです。

~~~sh
npm run mugen:batch-baseline -- --batch feedback-victory-01
npm run mugen:batch -- --batch feedback-victory-01 --target ForceFeedback --target VictoryQuote
npm run mugen:batch -- --batch feedback-victory-01 --target ForceFeedback --target VictoryQuote --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## gethit-fields-01（2026-10-09）

GetHitVar の1件。累計231件、82バッチ215件＋主要/補助16件、残り3件。

- 旧33項目は別々の位置引数ではありません。すべての旧項目を内部に保持し、唯一の必須識別子param_nameと31候補の戻り値/参照情報の表に整理しました。argumentsは追加した候補表付き項目へlegacy_index=33で対応。旧summary・構文の重複・型・例・引用も保持しています。
- 公式2002/1.0/1.1のDetailsからisboundを補い、一覧だけのhitid/fall.timeの意味と型は推測しません。2002の非推奨Snap項目xoff/yoff/zoffは公開注記と旧内部詳細に保持し、「謎」を数値型へ置換していません。旧2002リンクは内部に残し、実在アンカーへの引用を追加。
- 旧非H時一律0とCHAOSの世代別保持、公式hittime減算条件とCHAOSの停止解除後減算は内部でconflicting。配布Commonのslidetime/ctrltimeのTime比較を確認して、減算カウンターと比較閾値を分けました。fall.recovertimeを起き上がりのrecovertimeと分離し、入力や遷移自体の保証を付けません。damageの短期間記録/補正/反映順、回数の持越し、fall速度の型/座標差などは内部へ。
- 既存公式のyvel例は公開維持。MoveType=Hを明示する速度・hittime < 0・isboundの条件部分を追加。初導入null、実機での保持/減算/精度/処理順は未測定。research/evidenceはHTMLへ出しません。
- 389テスト・263ページビルド・261 URL/242比較対象HTML、通常幅/390pxの候補表・条件例と内部情報非表示を確認。HTML検査の内部項目チェックがTriggerの存在しない読み込み順節で停止する問題を再現し修正しました。State Controllerの節存在/内部行非表示チェックは維持し、全比較検査が通過。
- スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記670件、未対応旧履歴87項目、未表示フィールド29ページ。残りはModifyExplod / Projectile / ReversalDefです。

~~~sh
npm run mugen:batch-baseline -- --batch gethit-fields-01
npm run mugen:batch -- --batch gethit-fields-01 --target GetHitVar
npm run mugen:batch -- --batch gethit-fields-01 --target GetHitVar --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
~~~

## modify-explod-01（2026-10-09）

ModifyExplod の1件。累計232件、83バッチ216件＋主要/補助16件、残り2件。

- 変更前のJSON・HTML・抽出結果を tests/mugen/batches/modify-explod-01/ へ保存し、計画とともに適用前にコミット。旧20パラメーター・9履歴・説明・候補図・全引用・読み込み順を削除していません。
- 実行者所有のID選択/-1/同ID複数を整理。更新項目を省略したときは変更しないことをコメント出力し、Explodの生成時0/1/2値やP1を更新用のCNSへ挿入しません。共通IgnoreHitPause=0/Persistent=1は保持。
- 1.0のPos/PosType同時指定とAddAlpha/Alphaを環境付き制約へ追加。旧Scaleの1つだけの型を保持して公開はfloat2値。Posの整数範囲・PosType候補図/地面基準/1.1以降一律None、TransのDefault=None推測を原位置に残し、公開の基準/候補表を訂正しました。
- 1.0のRGB Shadowと1.1の単一フラグ、Pos float・キャラmugenversion依存のPosType、新たな生成側引数の更新可否は内部研究へ。1.1の型・新しいパラメーターの更新例を推定せず、Color/Anim/OwnPalも追加しません。
- SuperMoveTime/PauseMoveTimeの変更不能報告、SuperMoveの停止/非推奨・負数永続報告を保持し、3項目は内部に保存。IgnoreHitPauseの命令実行とExplodのアニメ停止、BindTime=0の位置・RemoveTimeの経過/残時間、Random上端・OnTop優先と未読、更新順の資料差は内部へ。4警告の出典は503で本文再確認不可、Colorの誤記を含め原文保存しました。
- 縮尺だけを2倍にする公開例を追加。初導入null、MUGENの実機未検証。research/evidence/load_priority_evidenceは公開しません。
- 395テスト・263ページビルド・261 URL/243比較対象HTML、通常幅/390pxのパラメーター表・使用例と内部非表示を確認。幅を復元し検査タブを終了。スキーマ/レジストリ/レンダラー/CSS変更なし。内部注記684件、未対応旧履歴78項目、未表示フィールド29ページ。次はProjectile / ReversalDefです。

実行した手順：

```powershell
npm run mugen:batch-baseline -- --batch modify-explod-01
npm run mugen:batch -- --batch modify-explod-01 --target ModifyExplod
npm run mugen:batch -- --batch modify-explod-01 --target ModifyExplod --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
npm run mugen:inventory
```

## projectile-definition-01（2026-10-09）

Projectileの1件。累計233件、84バッチ217件＋主要/補助16件、残り1件。

- 変更前のJSON/HTML/抽出結果を tests/mugen/batches/projectile-definition-01/ へ保存し、計画とともに適用前にコミット。旧122項目・44履歴・全引用・候補図・GIF・読み込み順を削除していません。
- 86項目のHitDef共有設定と生成側36項目を照合。飛び道具IDと攻撃ID、ヒット回数とコンボ数、優先度と表示順、速度乗算と加速、ガード省略を整理。スパークの誤った2値指定、Down.Bounceの逆の条件、PauseTimeの対象、固定の受身入力の一般化を公開側で訂正しました。
- 1.1のOwnPal/RemapPalを環境と条件付きで公開し、OwnPalを追加。ProjShadowは1.0のRGB3値と1.1の単一整数をvariantsで分離、無条件RGBのCNSを出力しません。境界/重力/バウンド速度の座標別省略値もコメント出力です。
- AfterImage.Timeの1/0資料差はunknownのまま。AfterImage.Transを追加し、計124定義、公開119項目＋共通2項目、CNS124行です。残像12項目は条件付きコメント、PalPostBrightを加算0,0,0へ訂正。旧乗算文・バグ付き赤の負の読み込み順は原位置に保持しました。
- セミコロン付き3項目/Attack.Width/HitOnce、全40警告、Winの多段/相殺/パレット/PosType差、Offset精度と処理順、親の停止・MoveTime研究は内部へ。初導入null、MUGEN実機未検証。research/evidence/load_priority_evidenceは公開しません。
- Helper生成後Root所有とRoot, NumProjID条件、AIRを要する通常攻撃例を追加。StateDef -2で他者のステート/アニメデータを使う場合の未定義動作も整理しました。
- HTML保存検査で検出した共通項目の旧リンクずれを、任意のdocumentation.parameter_anchor_indicesと共有正規化で修正。schema/入力説明/採用記録と3回帰テストを追加し、旧122/123と他項目のアンカー・CNS不変性を確認しました。
- 407テスト・263ページビルド・261 URL/244比較対象HTML、通常幅/390pxの世代別定義・加算値・生成例と内部非表示を確認。追加schemaが開発サーバーの旧キャッシュに残ったため再起動し、旧リンクを再確認。幅を復元し検査タブを終了。内部注記735件、未対応旧履歴34項目、未表示フィールド29ページ。次はReversalDefです。

実行した手順：

```powershell
npm run mugen:batch-baseline -- --batch projectile-definition-01
npm run mugen:batch -- --batch projectile-definition-01 --target Projectile
npm run mugen:batch -- --batch projectile-definition-01 --target Projectile --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
npm run mugen:inventory
```

## reversal-definition-01（2026-10-09）

ReversalDefの1件。累計234件、85バッチ218件＋主要/補助16件。今回の対象234件への追加型移行を完了しました。

- 変更前のJSON/HTML/抽出結果を tests/mugen/batches/reversal-definition-01/ へ保存し、計画とともに適用前にコミット。旧87項目・34履歴・FAQ・全引用・2画像・ルート注釈・読み込み順を削除していません。
- 必須Reversal.Attrの複数属性とSCA, AA、実行者側Attrと相手側属性、MoveHitとMoveReversedを整理。公開9項目＋共通2項目、CNS14行。必須属性/未知のAttr・HitOnce/派生音・スパークはコメントです。
- PauseTime、HitSound、P1StateNo、P2StateNo、SparkNoとSparkXYを照合。SparkNoはS2000の単一値構文、SparkXYは相手HitDefの位置への加算。Attr/HitOnceの省略値はunknownのままです。
- HitDef由来の効果不確実な78項目は内部に保存。ID/Fallの検証不足、分身FAQ、永続ターゲット/PrevStateNo/停止研究、31警告は公開しません。既知の数値読み込み順と疑問符/調査中の証拠を分け、原値を保持しました。research/evidence/load_priority_evidenceはJSONのみです。
- 2002.04.14のスパーク位置変更と1.0 RC6の2002互換1tick遅れ修正を対応付け。必須属性、Clsn1、実在する移行先801を使う短い例を追加。初導入null、実機未検証です。
- 416テスト・258 JSON検証・263ページビルド・261 URL/245比較対象HTML、通常幅/390pxの表・変更履歴・使用例・内部非表示を確認。共通項目の旧アンカー87/88を確認し、幅を復元・検査タブ終了。スキーマ/レジストリ/レンダラー/CSS変更なし。
- 再集計で対象内旧形式0件・未対応旧履歴0項目・内部注記774件・未表示フィールド29ページ。対象外のLifebar19件/statetype5件と旧フィールド廃止、実機確認は今回の完了範囲に含めません。統合レビューはSTATUS.mdの手順へ進みます。

実行した手順：

```powershell
npm run mugen:batch-baseline -- --batch reversal-definition-01
npm run mugen:batch -- --batch reversal-definition-01 --target ReversalDef
npm run mugen:batch -- --batch reversal-definition-01 --target ReversalDef --apply
npm run mugen:validate
npm run mugen:test
npm run build
npm run mugen:check-html
npm run mugen:inventory
```
