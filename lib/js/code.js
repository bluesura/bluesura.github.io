$(document).ready(function() {
    // =================================================================================
    // MUGEN cns/cmd/defファイル用 シンタックスハイライト処理
    // 概要:
    //  指定されたクラス名を持つ要素内のテキストをMUGENのシンタックスルールに従って色分けします。
    //  パフォーマンス向上のため、キーワードのマッチングにはSetオブジェクトを利用しています。
    //  また、文脈（等号"="の出現位置など）を考慮して、より正確なハイライトを実現しています。
    // =================================================================================

    // --- パフォーマンス向上のための準備 ---
    // 1. キーワード群をSetオブジェクトに格納します。
    //    配列のincludes()メソッド（計算量O(n)）に比べ、Setのhas()メソッドは計算量O(1)と非常に高速なため、
    //    大量のキーワード検索が行われるシンタックスハイライト処理においてパフォーマンスが大幅に向上します。
    // 2. キーワードはすべて小文字に変換しておき、大文字・小文字を区別しないマッチングを効率的に行います。
    const createSet = (str) => new Set(str.toLowerCase().split('|'));

    // --- キーワード定義 ---
    // 各カテゴリのキーワードをパイプ区切りで定義し、createSetヘルパー関数でSetオブジェクトを生成します。
    // MUGENの言語仕様に基づき、パラメータ名、ステートコントローラー名、トリガー関数名などに分類しています。
    // キーワードは重複を削除し、可読性のためにアルファベット順にソートされています。

    // パラメータ名 (スタイル: ピンク #E91E63)
    // SCTRLのパラメータや[Data]セクションなどで使われるキーワード群。
    const paramNames = createSet("absolute|abspan|accel|add|affectteam|afterimage.framegap|afterimage.length|afterimage.paladd|afterimage.palbright|afterimage.palcolor|afterimage.palcontrast|afterimage.palinvertall|afterimage.palmul|afterimage.palpostbright|afterimage.time|afterimage.timegap|air.animtype|air.cornerpush.veloff|air.fall|air.hittime|air.juggle|air.type|air.velocity|airguard.cornerpush.veloff|airguard.ctrltime|airguard.velocity|alpha|ampl|anim|animtype|attack.width|attackdist|attr|bindtime|chainid|channel|color|ctrl|damage|darken|down.bounce|down.cornerpush.veloff|down.hittime|down.velocity|edge|elem|endcmdbuftime|envshake.ampl|envshake.freq|envshake.phase|envshake.time|excludeid|f|facing|fall|fall.animtype|fall.damage|fall.envshake.ampl|fall.envshake.freq|fall.envshake.phase|fall.envshake.time|fall.kill|fall.recover|fall.recovertime|fall.xvelocity|fall.yvelocity|first|flag|flag2|flag3|forceair|forcenofall|ForceStand|framegap|freq|freqmul|fvalue|fvar|fv|getpower|givepower|ground.cornerpush.veloff|ground.hittime|ground.slidetime|ground.type|ground.velocity|guard.cornerpush.veloff|guard.ctrltime|guard.dist|guard.hittime|guard.kill|guard.pausetime|guard.slidetime|guard.sparkno|guard.velocity|guardflag|guardsound|helpertype|hitcountpersist|hitdefpersist|hitflag|hitonce|hitsound|id|invertall|IgnoreHitPause|juggle|keepone|keyctrl|kill|last|length|loop|lowpriority|maxdist|mindist|movecamera|movehitpersist|movetime|movetype|mul|name|nochainid|numhits|offset|ontop|ownpal|paladd|palbright|palcolor|palcontrast|palinvertall|palmul|palpostbright|palfx.add|palfx.color|palfx.invertall|palfx.mul|palfx.sinadd|palfx.time|pan|params|partnerstateno|pausebg|pausemovetime|pausetime|p1facing|p1getp2facing|p1sprpriority|p1stateno|p2defmul|p2facing|p2getp1state|p2sprpriority|p2stateno|phase|physics|player|pos|pos2|postype|poweradd|priority|projanim|projcancelanim|projedgebound|projheightbound|projhitanim|projhits|projid|projmisstime|projpriority|projremanim|projremove|projremovetime|projscale|projshadow|projsprpriority|projstagebound|range|random|removetime|remvelocity|reversal.attr|ReMapPal|Recursive|RemoveExplods|scale|shadow|sinadd|size.air.back|size.air.front|size.ground.back|size.ground.front|size.head.pos|size.height|size.mid.pos|size.proj.doscale|size.shadowoffset|size.xscale|size.yscale|slot|snap|sound|spacing|SparkNo|SparkXY|sprpriority|stateno|statetype|supermove|supermovetime|sysfvar|sysvar|text|time|timegap|trans|triggerall|type|under|unhittable|v|value|value2|var|vel|velocity|velmul|velset|vfacing|volume|x|xvel|y|yaccel|yvel|z|WaveForm|Self|Space|Angle|XAngle|YAccelAngle|BindID|RemoveOnGethit|Source|Dest|Persistent|enabled|Language|Lag");

    // StateController名 (スタイル: 赤 #f44336)
    // [StateDef]内で type = ... の右辺に来るキーワード群。
    const stateControllers = createSet("afterimage|afterimagetime|allpalfx|angleadd|angledraw|anglemul|angleset|appendtoclipboard|assertspecial|attackdist|attackmulset|bgpalfx|bindtoparent|bindtoroot|bindtotarget|changeanim|changeanim2|changestate|clearclipboard|ctrlset|defencemulset|destroyself|displaytoclipboard|envcolor|envshake|explod|explodbindtime|fallenvshake|forcefeedback|gamemakeanim|gravity|helper|hitadd|hitby|hitdef|hitfalldamage|hitfallset|hitfallvel|hitoverride|hitvelset|lifeadd|lifeset|makedust|modifyexplod|movehitreset|nothitby|null|offset|palfx|parentvaradd|parentvarset|pause|playerpush|playsnd|posadd|posfreeze|posset|poweradd|powerset|projectile|removeexplod|reversaldef||Recursive|screenbound|selfstate|sndpan|sprpriority|statetypeset|stopsnd|superpause|tagin|targetbind|targetdrop|targetfacing|targetlifeadd|targetpoweradd|targetstate|targetveladd|targetvelset|trans|turn|varadd|varrandom|varrangeset|varset|veladd|velmul|velset|victoryquote|width");

    // Trigger関数/変数 (スタイル: 黄 #FFC107)
    // trigger = ... の右辺で使われる関数や組み込み変数群。
    const triggerFuncs = createSet("abs|acos|alive|anim|animelem|animelemno|animelemtime|AnimTime|animexist|asin|atan|authorname|backedgebodydist|backedgedist|canrecover|ceil|command|cond|const|cos|ctrl|drawgame|e|exp|facing|floor|frontedgebodydist|frontedgedist|fvar|gametime|gethitvar|hitcount|hitdefattr|hitfall|hitover|hitpausetime|hitshakeover|hitvelx|hitvely|hitvelz|id|ifelse|inguarddist|ishelper|ishometeam|life|lifemax|ln|log|lose|loseko|losetime|matchno|matchover|movecontact|moveguarded|movehit|movereversed|movetype|name|numenemy|numexplod|numhelper|numpartner|numproj|numprojid|numtarget|p1name|p2bodydistx|p2bodydisty|p2bodydistz|p2distx|p2disty|p2distz|p2life|p2movetype|p2name|p2stateno|p2statetype|p3name|p4name|palno|parentdistx|parentdisty|parentdistz|pi|playeridexist|posx|posy|posz|power|powermax|prevstateno|projcanceltime|projcontact|projcontacttime|projguarded|projguardedtime|projhit|projhittime|random|rootdistx|rootdisty|rootdistz|roundno|roundsexisted|roundstate|screenposx|screenposy|screenposz|selfanimexist|sin|stagevar|standby|stateno|statetime|statetype|sysfvar|sysvar|tan|teamside|teammode|tickspersecond|time|timemod|uniqhitcount|var|velx|vely|velz|win|winko|wintime|winperfect");

    // リダイレクタ (スタイル: 青 #3F51B5)
    // trigger内で使われる、操作対象を指定するためのキーワード群。
    const redirectors = createSet("Parent|Root|Helper|Target|Partner|EnemyNear|Enemy|PlayerID");

    // 定数値 (スタイル: グレイ #9E9E9E)
    // SCTRLのパラメータ値などで使われる特定の文字列定数群。
    const constants = createSet("a|aa|add|add1|addalpha|air|ap|at|attack|b|back|bef|c|crouch|d|default|diagup|dodge|e|f|fg|front|globalnoshadow|h|ha|hard|high|hp|ht|i|idle|intro|invisible|l|left|liedown|light|low|m|maf|medium|miss|n|na|noairguard|noautoturn|nobardisplay|nobg|nocrouchguard|nofg|nojugglecheck|noko|nokoslow|nokosnd|nomusic|none|normal|nostandguard|noshadow|nowalk|np|nt|off|p|p1|p2|player|proj|r|right|roundnotover|s|sa|sca|single|simul|sine|sinesquare|sp|square|st|stand|sub|t|timerfreeze|tp|trip|turns|u|unchanged|unguardable|up");

    // --- トークナイザ ---
    // コードを意味のある単位（トークン）に分割するための正規表現です。
    // パイプ "|" で区切られた各パターンが優先順位の高い順にマッチングされます。
    // この順序は、例えばキーワードの一部が演算子として解釈されるのを防ぐために重要です。
    const tokenizerRegex = new RegExp(
        ';.*' + // 1. コメント (セミコロンから行末まで)
        '|"[^"]*"' + // 2. 文字列リテラル (ダブルクォートで囲まれた部分)
        '|\\[[^\\]]*\\]' + // 3. セクションヘッダ or 範囲指定 ([Statedef]や[200,300]など)
        '|[a-zA-Z_][a-zA-Z0-9_\\.]*' + // 4. キーワード (ドットを含む。例: size.xscale)
        '|-?\\d+(?:\\.\\d+)?' + // 5. 数値 (整数、負数、小数に対応)
        '|:=|!=|<=|>=|&&|\\|\\||\\*\\*|\\^\\^' + // 6. 複数文字の演算子 (例: :=, &&) - 単一文字より先にマッチさせる
        '|[=\\+\\-\\*/\\^&|!<>(),%\\[\\]]' + // 7. 単一文字の演算子/記号
        '|\\s+' + // 8. 1つ以上の空白文字
        '|[^\x00-\x7F]+' // 9. 非ASCII文字（日本語などの全角文字を想定）
    , 'g'); // 'g'フラグでグローバル検索（文字列全体で繰り返し検索）を行う

    // --- メイン処理 ---
    // ".code li" セレクタにマッチする各要素（各行のコード）に対してループ処理を行います。
    $(".code li").each(function() {
        const txt = $(this).text();

        // 空白行の場合は処理をスキップ
        if (!txt.trim()) return;

        // トークナイザ正規表現を使って、行のテキストをトークンの配列に分割します。
        // マッチしない場合は空の配列を返します。
        const tokens = txt.match(tokenizerRegex) || [];
        let html = ""; // ハイライト処理後のHTMLを格納する変数

        // --- 文脈判断フラグ ---
        // MUGENのシンタックスは、同じ単語でも文脈によって意味が異なります（例: "type"）。
        // これらのフラグを使って、行内での文脈を追跡します。
        let hasEquals = false; // 行内に '=' が出現したか
        let isStateType = false; // 直前のトークンが `type` パラメータだったか

        // 各トークンをループして、種類に応じたHTMLタグで囲んでいきます。
        for (const token of tokens) {
            // 空白トークンはそのまま追加
            if (/^\s+$/.test(token)) {
                html += token;
                continue; // 次のトークンへ
            }

            const lowerToken = token.toLowerCase(); // マッチング用に小文字化

            // --- トークンの種類に応じた色分け処理 ---
            
            // 1. コメント or 文字列リテラル
            if (token.startsWith(';') || token.startsWith('"')) {
                html += `<span style="color:#4CAF50">${token}</span>`;
            }
            // 2. セクションヘッダ
            // [Statedef] や [State 100] など。
            // 範囲指定 [200,300] と区別するため、'='がまだ出現していないことを条件にしています。
            else if (token.startsWith('[') && !hasEquals) {
                html += `<span style="color:#f44336">${token}</span>`;
                // セクションヘッダ内では文脈がリセットされるため、フラグを初期化
                hasEquals = false;
                isStateType = false;
            }
            // 3. 数値
            else if (/^-?\d/.test(token)) {
                html += `<span style="color:#03A9F4">${token}</span>`;
            }
            // 4. 演算子
            // 複数文字の演算子も単一文字の演算子もここでまとめて処理します。
            else if (/[=\+\-\*/\^&|!<>(),%\[\]]/.test(token[0]) || [":=","!=","<=",">=","&&","||","**","^^"].includes(token)) {
                if(token === '=') hasEquals = true; // '=' が出現したことを記録
                html += `<span style="color:#9E9E9E">${token}</span>`;
            }
            // 5. キーワード（文脈に応じて判断）
            else {
                // (a) パラメータ名: '=' より前に出現するキーワード
                if (!hasEquals && paramNames.has(lowerToken)) {
                    html += `<span style="color:#E91E63">${token}</span>`;
                    // もしこのパラメータが 'type' なら、次のトークンはStateController名である可能性が高い
                    if(lowerToken === 'type') isStateType = true;
                }
                // (b) triggerN パラメータ: '=' より前に出現する特殊なパラメータ
                else if (!hasEquals && /^(trigger[1-9][0-9]*)|(victory[1-9][0-9]*)$/i.test(lowerToken)) {
                    html += `<span style="color:#E91E63">${token}</span>`;
                }
                // (c) StateController名: 'type = ' の直後に出現するキーワード
                else if (isStateType && stateControllers.has(lowerToken)) {
                    html += `<span style="color:#f44336">${token}</span>`;
                    isStateType = false; // StateControllerを処理したのでフラグをリセット
                }
                // (d) Trigger関数/変数: '=' より後に出現するキーワード
                else if (hasEquals && triggerFuncs.has(lowerToken)) {
                    html += `<span style="color:#FFC107">${token}</span>`;
                }
                // (e) リダイレクタ: '=' より後に出現するキーワード
                else if (hasEquals && redirectors.has(lowerToken)) {
                    html += `<span style="color:#3F51B5">${token}</span>`;
                }
                // (f) 定数値: '=' より後に出現するキーワード
                else if (hasEquals && constants.has(lowerToken)) {
                    html += `<span style="color:#9E9E9E">${token}</span>`;
                }
                // (g) Lifebar系パラメータ (特殊ケース): `p1.`, `team1.` などで始まるキーワード
                else if (!hasEquals && /^(p[1-4]|team[12]|round\d*)\./i.test(lowerToken)) {
                     html += `<span style="color:#E91E63">${token}</span>`;
                }
                // (h) その他のトークン
                // どのカテゴリにも一致しない場合（変数名など）は、デフォルトのスタイルを適用します。
                // 注意: 現在のトークナイザでは範囲指定 `[200,300]` が一つのトークンとして扱われますが、
                //       上記のどの条件にもマッチしないため、ここでデフォルト表示となり、処理の破綻を防いでいます。
                else {
                    html += `<span>${token}</span>`;
                }
            }
        }
        
        // 元の要素の内容を、ハイライト処理を施したHTMLで置き換えます。
        $(this).html(html);

        // ※補足: 各行の処理は独立しているため、ループの最後で文脈判断フラグをリセットする必要はありません。
        //         `.each()` の次のループが始まる際に、フラグは自動的に再初期化されるためです。
    });
});
