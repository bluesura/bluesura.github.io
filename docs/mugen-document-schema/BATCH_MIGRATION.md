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
