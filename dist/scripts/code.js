$(document).ready(function() {
    // パフォーマンス改善 ＋ 日本語対応版 MUGEN シンタックスハイライト

    // --- 高速化のための準備 ---
    // 1. キーワードをカテゴリ別にSetに格納しておくことで、O(1)の高速なルックアップを可能にする
    const createSet = (str) => new Set(str.toLowerCase().split('|'));

    // パラメータ名 (ピンク: #E91E63) - 重複を削除し、アルファベット順に整理
    const paramNames = createSet("absolute|abspan|accel|add|affectteam|afterimage.framegap|afterimage.length|afterimage.paladd|afterimage.palbright|afterimage.palcolor|afterimage.palcontrast|afterimage.palinvertall|afterimage.palmul|afterimage.palpostbright|afterimage.time|afterimage.timegap|air.animtype|air.cornerpush.veloff|air.fall|air.hittime|air.juggle|air.type|air.velocity|airguard.cornerpush.veloff|airguard.ctrltime|airguard.velocity|alpha|ampl|anim|animtype|attack.width|attackdist|attr|bindtime|chainid|channel|color|ctrl|damage|darken|down.bounce|down.cornerpush.veloff|down.hittime|down.velocity|edge|elem|endcmdbuftime|envshake.ampl|envshake.freq|envshake.phase|envshake.time|excludeid|f|facing|fall|fall.animtype|fall.damage|fall.envshake.ampl|fall.envshake.freq|fall.envshake.phase|fall.envshake.time|fall.kill|fall.recover|fall.recovertime|fall.xvelocity|fall.yvelocity|first|flag|flag2|flag3|forceair|forcenofall|ForceStand|framegap|freq|freqmul|fvalue|fvar|fv|getpower|givepower|ground.cornerpush.veloff|ground.hittime|ground.slidetime|ground.type|ground.velocity|guard.cornerpush.veloff|guard.ctrltime|guard.dist|guard.hittime|guard.kill|guard.pausetime|guard.slidetime|guard.sparkno|guard.velocity|guardflag|guardsound|helpertype|hitcountpersist|hitdefpersist|hitflag|hitonce|hitsound|id|invertall|IgnoreHitPause|juggle|keepone|keyctrl|kill|last|length|loop|lowpriority|maxdist|mindist|movecamera|movehitpersist|movetime|movetype|mul|name|nochainid|numhits|offset|ontop|ownpal|paladd|palbright|palcolor|palcontrast|palinvertall|palmul|palpostbright|palfx.add|palfx.color|palfx.invertall|palfx.mul|palfx.sinadd|palfx.time|pan|params|partnerstateno|pausebg|pausemovetime|pausetime|p1facing|p1getp2facing|p1sprpriority|p1stateno|p2defmul|p2facing|p2getp1state|p2sprpriority|p2stateno|phase|physics|player|pos|pos2|postype|poweradd|priority|projanim|projcancelanim|projedgebound|projheightbound|projhitanim|projhits|projid|projmisstime|projpriority|projremanim|projremove|projremovetime|projscale|projshadow|projsprpriority|projstagebound|range|random|removetime|remvelocity|reversal.attr|ReMapPal|Recursive|RemoveExplods|scale|shadow|sinadd|size.air.back|size.air.front|size.ground.back|size.ground.front|size.head.pos|size.height|size.mid.pos|size.proj.doscale|size.shadowoffset|size.xscale|size.yscale|slot|snap|sound|spacing|SparkNo|SparkXY|sprpriority|stateno|statetype|supermove|supermovetime|sysfvar|sysvar|text|time|timegap|trans|triggerall|type|under|unhittable|v|value|value2|var|vel|velocity|velmul|velset|vfacing|volume|x|xvel|y|yaccel|yvel|z|WaveForm|Self|Space|Angle|XAngle|YAccelAngle|BindID|RemoveOnGethit|Source|Dest|Persistent|enabled|Language|Lag");

    // StateController名 (赤: #f44336) - 重複を削除し、アルファベット順に整理
    const stateControllers = createSet("afterimage|afterimagetime|allpalfx|angleadd|angledraw|anglemul|angleset|appendtoclipboard|assertspecial|attackdist|attackmulset|bgpalfx|bindtoparent|bindtoroot|bindtotarget|changeanim|changeanim2|changestate|clearclipboard|ctrlset|defencemulset|destroyself|displaytoclipboard|envcolor|envshake|explod|explodbindtime|fallenvshake|forcefeedback|gamemakeanim|gravity|helper|hitadd|hitby|hitdef|hitfalldamage|hitfallset|hitfallvel|hitoverride|hitvelset|lifeadd|lifeset|makedust|modifyexplod|movehitreset|nothitby|null|offset|palfx|parentvaradd|parentvarset|pause|playerpush|playsnd|posadd|posfreeze|posset|poweradd|powerset|projectile|removeexplod|reversaldef||Recursive|screenbound|selfstate|sndpan|sprpriority|statetypeset|stopsnd|superpause|tagin|targetbind|targetdrop|targetfacing|targetlifeadd|targetpoweradd|targetstate|targetveladd|targetvelset|trans|turn|varadd|varrandom|varrangeset|varset|veladd|velmul|velset|victoryquote|width");

    // Trigger関数/変数 (黄: #FFC107) - 重複を削除し、アルファベット順に整理
    const triggerFuncs = createSet("abs|acos|alive|anim|animelem|animelemno|animelemtime|AnimTime|animexist|asin|atan|authorname|backedgebodydist|backedgedist|canrecover|ceil|command|cond|const|cos|ctrl|drawgame|e|exp|facing|floor|frontedgebodydist|frontedgedist|fvar|gametime|gethitvar|hitcount|hitdefattr|hitfall|hitover|hitpausetime|hitshakeover|hitvelx|hitvely|hitvelz|id|ifelse|inguarddist|ishelper|ishometeam|life|lifemax|ln|log|lose|loseko|losetime|matchno|matchover|movecontact|moveguarded|movehit|movereversed|movetype|name|numenemy|numexplod|numhelper|numpartner|numproj|numprojid|numtarget|p1name|p2bodydistx|p2bodydisty|p2bodydistz|p2distx|p2disty|p2distz|p2life|p2movetype|p2name|p2stateno|p2statetype|p3name|p4name|palno|parentdistx|parentdisty|parentdistz|pi|playeridexist|posx|posy|posz|power|powermax|prevstateno|projcanceltime|projcontact|projcontacttime|projguarded|projguardedtime|projhit|projhittime|random|rootdistx|rootdisty|rootdistz|roundno|roundsexisted|roundstate|screenposx|screenposy|screenposz|selfanimexist|sin|stagevar|standby|stateno|statetime|statetype|sysfvar|sysvar|tan|teamside|teammode|tickspersecond|time|timemod|uniqhitcount|var|velx|vely|velz|win|winko|wintime|winperfect|CameraZoom|Data.Life|Data.Attack|Data.Defence|Data.Fall.Defence_Mul|Data.Liedown.Time|Data.AirJuggle|Data.SparkNo|Data.Guard.SparkNo|Data.KO.Echo|Data.IntPersistIndex|Data.FloatPersistIndex|Size.XScale|Size.YScale|Size.Ground.Back|Size.Ground.Front|Size.Air.Back|Size.Air.Front|Size.Height|Size.Attack.Dist|Size.Proj.Attack.Dist|Size.Proj.Doscale|Size.Head.Pos.X|Size.Head.Pos.Y|Size.Mid.Pos.X|Size.Mid.Pos.Y|Size.Shadowoffset|Size.Draw.offset.Y|Size.Draw.offset.X|Velocity.Walk.Fwd.X|Velocity.Walk.Back.X|Velocity.Run.Fwd.X|Velocity.Run.Fwd.Y|Velocity.Run.Back.X|Velocity.Run.Back.Y|Velocity.Jump.Y|Velocity.Jump.Neu.X|Velocity.Jump.Back.X|Velocity.Jump.Fwd.X|Velocity.Runjumo.Back.X|Velocity.Runjumo.Fwd.X|Velocity.AirJump.Y|Velocity.AirJump.Neu.X|Velocity.AirJump.Back.X|Velocity.AirJump.Fwd.X|Movement.Airjump.Num|Movement.AirJump.Height|Movement.YAccel|Movement.Stand.Friction|Movement.Crouch.Friction|Const240p|Const480p|Const720p|GameHeight|AnimType|GroundType|AirType|Damage|HitShakeTime|HitTime|HitShakeTime|SlideTime|CtrlTime|RecoverTime|HitCount|FallCount|XVel|YVel|YAccel|Fall|Fall.Damage|Fall.XVel|Fall.YVel|Fall.Recover|Fall.RecoverTime|ChainID|Guarded|IsBound|XVelAdd|YVelAdd|Type|XOff|YOff|ZOff|Fall.Kill|Fall.Envshake.Time|Fall.Envshake.Freq|Fall.Envshake.Ampl|Fall.Envshake.Phase|ScreenHeight|ScreenWidth");

    // リダイレクタ (青: #3F51B5)
    const redirectors = createSet("Parent|Root|Helper|Target|Partner|EnemyNear|Enemy|PlayerID");

    // 定数値 (グレイ: #9E9E9E) - 重複を削除し、アルファベット順に整理
    const constants = createSet("a|aa|add|add1|addalpha|air|ap|at|attack|b|back|bef|c|crouch|d|default|diagup|dodge|e|f|fg|front|globalnoshadow|h|ha|hard|high|hp|ht|i|idle|intro|invisible|l|left|liedown|light|low|m|maf|medium|miss|n|na|noairguard|noautoturn|nobardisplay|nobg|nocrouchguard|nofg|nojugglecheck|noko|nokoslow|nokosnd|nomusic|none|normal|nostandguard|noshadow|nowalk|np|nt|off|p|p1|p2|player|proj|r|right|roundnotover|s|sa|sca|single|simul|sine|sinesquare|sp|square|st|stand|sub|t|timerfreeze|tp|trip|turns|u|unchanged|unguardable|up");

    // 高速なトークナイザ正規表現
    const tokenizerRegex = new RegExp(
        ';.*' + // 1. コメント
        '|"[^"]*"' + // 2. 文字列リテラル
        '|\\[[^\\]]*\\]' + // 3. セクションヘッダ or 範囲指定
        '|[a-zA-Z_][a-zA-Z0-9_\\.]*' + // 4. キーワード (ドットを含む)
        '|-?\\d+(?:\\.\\d+)?' + // 5. 数値
        '|:=|!=|<=|>=|&&|\\|\\||\\*\\*|\\^\\^' + // 6. 複数文字の演算子
        '|[=\\+\\-\\*/\\^&|!<>(),%\\[\\]]' + // 7. 単一文字の演算子/記号
        '|\\s+' + // 8. 空白
        '|[^\x00-\x7F]+' // 9. 非ASCII文字（日本語など）
    , 'g');

    $(".code li").each(function() {
        const txt = $(this).text();
        if (!txt.trim()) return;

        const tokens = txt.match(tokenizerRegex) || [];
        let html = "";
        
        // 文脈を判断するためのフラグ
        let hasEquals = false;
        let isStateType = false;

        for (const token of tokens) {
            if (/^\s+$/.test(token)) {
                html += token;
                continue;
            }

            const lowerToken = token.toLowerCase();

            if (token.startsWith(';') || token.startsWith('"')) {
                html += `<span style="color:#4CAF50">${token}</span>`; // コメント, 文字列
            } 
            // 【修正点】セクションヘッダの判定に !hasEquals を追加
            else if (token.startsWith('[') && !hasEquals) {
                html += `<span style="color:#f44336">${token}</span>`; // セクションヘッダ
                hasEquals = false;
                isStateType = false;
            } else if (/^-?\d/.test(token)) {
                html += `<span style="color:#03A9F4">${token}</span>`; // 数値
            } else if (/[=\+\-\*/\^&|!<>(),%\[\]]/.test(token[0]) || [":=","!=","<=",">=","&&","||","**","^^"].includes(token)) {
                if(token === '=') hasEquals = true;
                html += `<span style="color:#9E9E9E">${token}</span>`; // 演算子
            } else {
                if (!hasEquals && paramNames.has(lowerToken)) {
                    html += `<span style="color:#E91E63">${token}</span>`; // パラメータ名
                    if(lowerToken === 'type') isStateType = true;
                }
                else if (!hasEquals && /^(trigger[1-9][0-9]*)|(victory[1-9][0-9]*)$/i.test(lowerToken)) {
                    html += `<span style="color:#E91E63">${token}</span>`; // Trigger パラメータ
                }
                else if (isStateType && stateControllers.has(lowerToken)) {
                    html += `<span style="color:#f44336">${token}</span>`; // StateController名
                    isStateType = false;
                }
                else if (hasEquals && triggerFuncs.has(lowerToken)) {
                    html += `<span style="color:#FFC107">${token}</span>`; // Trigger関数/変数
                }
                else if (hasEquals && redirectors.has(lowerToken)) {
                    html += `<span style="color:#3F51B5">${token}</span>`; // リダイレクタ
                }
                else if (hasEquals && constants.has(lowerToken)) {
                    html += `<span style="color:#9E9E9E">${token}</span>`; // 定数値
                }
                else if (!hasEquals && /^(p[1-4]|team[12]|round\d*)\./i.test(lowerToken)) {
                     html += `<span style="color:#E91E63">${token}</span>`; // Lifebar系パラメータ
                }
                else {
                    // 範囲指定 [200,300] などは、演算子と数値の組み合わせとして個別に色付けされるべきですが、
                    // 現在のトークナイザでは一つの塊として扱われます。
                    // ここではデフォルトの色で表示することで、以降の解析が壊れないようにします。
                    html += `<span>${token}</span>`; // その他
                }
            }
        }
        
        // 行末でフラグをリセット (各行で文脈を判断するため)
        // ※ ループの最後でリセット処理は不要でしたので削除しました。
        //    各 .each() の最初で変数が初期化されるためです。

        $(this).html(html);
    });
});