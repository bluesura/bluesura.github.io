$(document).ready(function() {
    // パフォーマンス改善 ＋ 日本語対応版 MUGEN シンタックスハイライト

    // --- 高速化のための準備 ---
    // 1. キーワードをカテゴリ別にSetに格納しておくことで、O(1)の高速なルックアップを可能にする
    const createSet = (str) => new Set(str.toLowerCase().split('|'));

    // パラメータ名 (ピンク: #E91E63) - 重複を削除し、アルファベット順に整理
    const paramNames = createSet("absolute|abspan|accel|add|affectteam|afterimage.framegap|afterimage.length|afterimage.paladd|afterimage.palbright|afterimage.palcolor|afterimage.palcontrast|afterimage.palinvertall|afterimage.palmul|afterimage.palpostbright|afterimage.time|afterimage.timegap|air.animtype|air.cornerpush.veloff|air.fall|air.hittime|air.juggle|air.type|air.velocity|airguard.cornerpush.veloff|airguard.ctrltime|airguard.velocity|alpha|ampl|anim|animtype|attack.width|attackdist|attr|bindtime|chainid|channel|color|ctrl|damage|darken|down.bounce|down.cornerpush.veloff|down.hittime|down.velocity|edge|elem|endcmdbuftime|envshake.ampl|envshake.freq|envshake.phase|envshake.time|excludeid|f|FaceP2|facing|fall|fall.animtype|fall.damage|fall.envshake.ampl|fall.envshake.freq|fall.envshake.phase|fall.envshake.time|fall.kill|fall.recover|fall.recovertime|fall.xvelocity|fall.yvelocity|first|flag|flag2|flag3|forceair|forcenofall|ForceStand|framegap|freq|freqmul|fvalue|fvar|fv|getpower|givepower|ground.cornerpush.veloff|ground.hittime|ground.slidetime|ground.type|ground.velocity|guard.cornerpush.veloff|guard.ctrltime|guard.dist|guard.hittime|guard.kill|guard.pausetime|guard.slidetime|guard.sparkno|guard.velocity|guardflag|guardsound|helpertype|hitcountpersist|hitdefpersist|hitflag|hitonce|hitsound|id|invertall|IgnoreHitPause|juggle|keepone|keyctrl|kill|last|length|loop|lowpriority|maxdist|mindist|movecamera|movehitpersist|movetime|movetype|mul|name|nochainid|numhits|offset|ontop|ownpal|paladd|palbright|palcolor|palcontrast|palinvertall|palmul|palpostbright|palfx.add|palfx.color|palfx.invertall|palfx.mul|palfx.sinadd|palfx.time|pan|params|partnerstateno|pausebg|pausemovetime|pausetime|p1facing|p1getp2facing|p1sprpriority|p1stateno|p2defmul|p2facing|p2getp1state|p2sprpriority|p2stateno|phase|physics|player|pos|pos2|postype|poweradd|priority|projanim|projcancelanim|projedgebound|projheightbound|projhitanim|projhits|projid|projmisstime|projpriority|projremanim|projremove|projremovetime|projscale|projshadow|projsprpriority|projstagebound|range|random|removetime|remvelocity|reversal.attr|ReMapPal|Recursive|RemoveExplods|scale|shadow|sinadd|size.air.back|size.air.front|size.ground.back|size.ground.front|size.head.pos|size.height|size.mid.pos|size.proj.doscale|size.shadowoffset|size.xscale|size.yscale|slot|snap|sound|spacing|SparkNo|SparkXY|sprpriority|stateno|statetype|supermove|supermovetime|sysfvar|sysvar|text|time|timegap|trans|triggerall|type|under|unhittable|v|value|value2|var|vel|velocity|velmul|velset|vfacing|volume|x|xvel|y|yaccel|yvel|z|WaveForm|Self|Space|Angle|XAngle|YAccelAngle|BindID|RemoveOnGethit|Source|Dest|Persistent|enabled|Language|Lag");

    // StateController名 (赤: #f44336) - 重複を削除し、アルファベット順に整理
    const stateControllers = createSet("afterimage|afterimagetime|allpalfx|angleadd|angledraw|anglemul|angleset|appendtoclipboard|assertspecial|attackdist|attackmulset|bgpalfx|bindtoparent|bindtoroot|bindtotarget|changeanim|changeanim2|changestate|clearclipboard|ctrlset|defencemulset|destroyself|displaytoclipboard|envcolor|envshake|explod|explodbindtime|fallenvshake|forcefeedback|gamemakeanim|gravity|helper|hitadd|hitby|hitdef|hitfalldamage|hitfallset|hitfallvel|hitoverride|hitvelset|lifeadd|lifeset|makedust|modifyexplod|movehitreset|nothitby|null|offset|palfx|parentvaradd|parentvarset|pause|playerpush|playsnd|posadd|posfreeze|posset|poweradd|powerset|projectile|removeexplod|reversaldef||Recursive|screenbound|selfstate|sndpan|sprpriority|statetypeset|stopsnd|superpause|tagin|targetbind|targetdrop|targetfacing|targetlifeadd|targetpoweradd|targetstate|targetveladd|targetvelset|trans|turn|varadd|varrandom|varrangeset|varset|veladd|velmul|velset|victoryquote|width");

    // Trigger関数/変数 (黄: #FFC107) - 重複を削除し、アルファベット順に整理
    const triggerFuncs = createSet("abs|acos|ailevel|alive|anim|animelem|animelemno|animelemtime|AnimTime|animexist|asin|atan|authorname|backedgebodydist|BackEdge|backedgedist|BottomEdge|canrecover|ceil|command|cond|const|cos|ctrl|drawgame|e|exp|facing|floor|FrontEdge|frontedgebodydist|frontedgedist|fvar|gametime|GameWidth|gethitvar|hitcount|hitdefattr|hitfall|hitover|hitpausetime|hitshakeover|hitvelx|hitvely|hitvelz|id|ifelse|inguarddist|ishelper|ishometeam|LeftEdge|life|lifemax|ln|log|lose|loseko|losetime|matchno|matchover|movecontact|moveguarded|movehit|movereversed|movetype|name|numenemy|numexplod|numhelper|numpartner|numproj|numprojid|numtarget|p1name|p2bodydistx|p2bodydisty|p2bodydistz|p2distx|p2disty|p2distz|p2life|p2movetype|p2name|p2stateno|p2statetype|p3name|p4name|palno|parentdistx|parentdisty|parentdistz|pi|playeridexist|posx|posy|posz|power|powermax|prevstateno|projcanceltime|projcontact|projcontacttime|projguarded|projguardedtime|projhit|projhittime|random|RightEdge|rootdistx|rootdisty|rootdistz|roundno|roundsexisted|roundstate|screenposx|screenposy|screenposz|selfanimexist|sin|stagevar|standby|stateno|statetime|statetype|sysfvar|sysvar|tan|teamside|teammode|tickspersecond|time|timemod|TopEdge|uniqhitcount|var|velx|vely|velz|win|winko|wintime|winperfect|CameraZoom|Data.Life|Data.Attack|Data.Defence|Data.Fall.Defence_Mul|Data.Liedown.Time|Data.AirJuggle|Data.SparkNo|Data.Guard.SparkNo|Data.KO.Echo|Data.IntPersistIndex|Data.FloatPersistIndex|Size.XScale|Size.YScale|Size.Ground.Back|Size.Ground.Front|Size.Air.Back|Size.Air.Front|Size.Height|Size.Attack.Dist|Size.Proj.Attack.Dist|Size.Proj.Doscale|Size.Head.Pos.X|Size.Head.Pos.Y|Size.Mid.Pos.X|Size.Mid.Pos.Y|Size.Shadowoffset|Size.Draw.offset.Y|Size.Draw.offset.X|Velocity.Walk.Fwd.X|Velocity.Walk.Back.X|Velocity.Run.Fwd.X|Velocity.Run.Fwd.Y|Velocity.Run.Back.X|Velocity.Run.Back.Y|Velocity.Jump.Y|Velocity.Jump.Neu.X|Velocity.Jump.Back.X|Velocity.Jump.Fwd.X|Velocity.Runjumo.Back.X|Velocity.Runjumo.Fwd.X|Velocity.AirJump.Y|Velocity.AirJump.Neu.X|Velocity.AirJump.Back.X|Velocity.AirJump.Fwd.X|Movement.Airjump.Num|Movement.AirJump.Height|Movement.YAccel|Movement.Stand.Friction|Movement.Crouch.Friction|Const240p|Const480p|Const720p|GameHeight|AnimType|GroundType|AirType|Damage|HitShakeTime|HitTime|HitShakeTime|SlideTime|CtrlTime|RecoverTime|HitCount|FallCount|XVel|YVel|YAccel|Fall|Fall.Damage|Fall.XVel|Fall.YVel|Fall.Recover|Fall.RecoverTime|ChainID|Guarded|IsBound|XVelAdd|YVelAdd|Type|XOff|YOff|ZOff|Fall.Kill|Fall.Envshake.Time|Fall.Envshake.Freq|Fall.Envshake.Ampl|Fall.Envshake.Phase|ScreenHeight|ScreenWidth");

    // 2トークン構成の Trigger (Pos X, Vel Y など) 用ベース名
    const pairTriggerBaseRegex = /^(camerapos|hitvel|p2bodydist|p2dist|parentdist|pos|rootdist|screenpos|vel)$/i;

    // リダイレクタ (青: #3F51B5)
    const redirectors = createSet("Parent|Root|Helper|Target|Partner|EnemyNear|Enemy|PlayerID");

    // 定数値 (グレイ: #9E9E9E) - 重複を削除し、アルファベット順に整理
    const constants = createSet("a|aa|add|add1|addalpha|air|ap|at|attack|b|back|bef|c|crouch|d|default|diagup|dodge|e|f|fg|front|globalnoshadow|h|ha|hard|high|hp|ht|i|idle|intro|invisible|l|left|liedown|light|low|m|maf|medium|miss|n|na|noairguard|noautoturn|nobardisplay|nobg|nocrouchguard|nofg|nojugglecheck|noko|nokoslow|nokosnd|nomusic|none|normal|nostandguard|noshadow|nowalk|np|nt|off|p|p1|p2|player|proj|r|right|roundnotover|s|sa|sca|single|simul|sine|sinesquare|sp|square|st|stand|sub|t|timerfreeze|tp|trip|turns|u|unchanged|unguardable|up");

    // Lifebar 系パラメータ用の判定
    // 1) 接頭辞 + ドット付き (start.x, win.time, fight.time, etc.)
    // 2) ドット無し (sff, snd, font1〜font9, framespercount, useiconupto)
    const lifebarDotParamRegex = /^(p[1-4]|team[12]|round\d*|start|counter|text|fightfx|common|level[1-9]|match|fight|ctrl|ko|dko|to|slow|over|win2?|win|draw|bg)\./i;
    const lifebarSingleParamRegex = /^(pos|displaytime|sff|snd|font[1-9]|framespercount|useiconupto)$/i;


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

    // ▼ 追加：全文の中で paramNames / stateControllers が一度でも出たかどうか
    let hasAnyParamOrState = false;

    // --- 1パス目: ざっくりスキャンしてフラグを立てる ---
    $(".code li").each(function() {
        const txt = $(this).text();
        if (!txt.trim()) return;

        const tokens = txt.match(tokenizerRegex) || [];
        for (const token of tokens) {
            if (/^\s+$/.test(token)) continue;
            const lowerToken = token.toLowerCase();

            if (paramNames.has(lowerToken) || stateControllers.has(lowerToken)) {
                hasAnyParamOrState = true;
                return false; // この行のループ終了
            }
        }
    });

    // ▼ Trigger を優先するかどうかのフラグ
    const preferTrigger = !hasAnyParamOrState;

    // --- 2パス目: 実際のシンタックスハイライト ---
    $(".code li").each(function() {
        const txt = $(this).text();
        if (!txt.trim()) return;

        const tokens = txt.match(tokenizerRegex) || [];
        let html = "";

        let hasEquals = false;
        let isStateType = false;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (/^\s+$/.test(token)) {
                html += token;
                continue;
            }

            const lowerToken = token.toLowerCase();

            if (token.startsWith(';') || token.startsWith('"')) {
                html += `<span style="color:#4CAF50">${token}</span>`;
            }
            else if (token.startsWith('[') && !hasEquals) {
                html += `<span style="color:#f44336">${token}</span>`;
                hasEquals = false;
                isStateType = false;
            }
            else if (/^-?\d/.test(token)) {
                html += `<span style="color:#03A9F4">${token}</span>`;
            }
            else if (/[=\+\-\*/\^&|!<>(),%\[\]]/.test(token[0]) || [":=","!=","<=",">=","&&","||","**","^^"].includes(token)) {
                if (token === '=') hasEquals = true;
                html += `<span style="color:#9E9E9E">${token}</span>`;
            }
            else {
                // ▼ ここから優先度の調整部分 ▼

                // 0) 2トークン構成 Trigger: Pos X / Vel Y / ScreenPos X など
                if (pairTriggerBaseRegex.test(lowerToken)) {
                    // 次の非空白トークンを探す
                    let j = i + 1;
                    while (j < tokens.length && /^\s+$/.test(tokens[j])) {
                        j++;
                    }

                    if (j < tokens.length && /^[xy]$/i.test(tokens[j])) {
                        // ベース名を Trigger 色
                        html += `<span style="color:#FFC107">${token}</span>`;
                        // 間の空白はそのまま
                        for (let k = i + 1; k < j; k++) {
                            html += tokens[k];
                        }
                        // X / Y も Trigger 色
                        html += `<span style="color:#FFC107">${tokens[j]}</span>`;

                        i = j; // X/Y まで処理したのでインデックスを飛ばす
                        continue;
                    }
                }

                // （1）左辺の param 名の判定
                if (!hasEquals && !preferTrigger && paramNames.has(lowerToken)) {
                    html += `<span style="color:#E91E63">${token}</span>`;
                    if (lowerToken === 'type') isStateType = true;
                }
                // Trigger1, Victory1 など
                else if (!hasEquals && /^(trigger[1-9][0-9]*)|(victory[1-9][0-9]*)$/i.test(lowerToken)) {
                    html += `<span style="color:#E91E63">${token}</span>`;
                }
                // StateController 名
                else if (isStateType && stateControllers.has(lowerToken)) {
                    html += `<span style="color:#f44336">${token}</span>`;
                    isStateType = false;
                }
                // （2）Trigger 関数/変数（単体トークン）
                else if (
                    triggerFuncs.has(lowerToken) &&
                    (
                        hasEquals ||                         // = の右側
                        preferTrigger ||                     // ファイル全体 Trigger 優先モード
                        (!hasEquals && !paramNames.has(lowerToken)) // 左辺だが param 名ではない
                    )
                ) {
                    html += `<span style="color:#FFC107">${token}</span>`;
                }
                // リダイレクタ
                else if (hasEquals && redirectors.has(lowerToken)) {
                    html += `<span style="color:#3F51B5">${token}</span>`;
                }
                // 定数
                else if (hasEquals && constants.has(lowerToken)) {
                    html += `<span style="color:#9E9E9E">${token}</span>`;
                }
                // Lifebar 系
                else if (!hasEquals && (
                    lifebarDotParamRegex.test(lowerToken) ||
                    lifebarSingleParamRegex.test(lowerToken)
                )) {
                    html += `<span style="color:#E91E63">${token}</span>`;
                }
                // その他
                else {
                    html += `<span>${token}</span>`;
                }
            }
        }

        $(this).html(html);
    });
});