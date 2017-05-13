  <meta charset="UTF-8">
  <meta http-equiv="Content-Language" content="ja">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <!-- （*´ω｀*）＜ソースコードを見るなんてえっちぃ人ですね！ -->

{if $content.page.level == "1"}
  <title itemprop="headline">Name = sura</title>
{elseif $content.page.level == "2"}
  <title itemprop="headline">{$content.page_title|escape} - Name = sura</title>
{elseif $content.page.level == "3"}
  <title itemprop="headline">{$content.page_subtitle} {if $content.page.category[1]}【{$content.page.category[1]|escape}】 {/if}| {$content.page_title|escape} - Name = sura</title>
{/if}
  <link rel="fluid-icon" href="/media/img/icon-512x512.png" title="MUGEN">
  <link rel="shortcut icon" href="/media/img/favicon.png" type="image/png">
  <link rel="icon" sizes="128x128" href="/media/img/icon-128x128.png">
  <link rel="apple-touch-icon" sizes="128x128" href="/media/img/icon-128x128.png">
  <link rel="apple-touch-icon-precomposed" sizes="128x128" href="/media/img/icon-128x128.png">
  <link rel="icon" sizes="192x192" href="/media/img/icon-192x192.png">
  <meta name="msapplication-TileImage" content="/media/img/icon-512x512.png">

  <link rel="mask-icon" href="/media/img/infinite-M.svg" color="#1E88E5">
  <link rel="icon" type="image/x-icon" href="/media/img/favicon.png">

  <link rel="manifest" href="/manifest.json">
  <link rel="canonical" href="{$content.url}">

  <!-- 「チェス盤を引っくり返す！」 -->
  <meta name="theme-color" content="#1E88E5">
  <meta name="msapplication-TileColor" content="#1E88E5">
  <meta name="robots" content="INDEX,FOLLOW">
  <meta name="viewport" content="width=device-width">
  <meta name="author" content="sura">
  <meta name="generator" content="Smarty">
  <meta name="mobile-web-app-capable" content="yes">
{*
  <meta name="description" content="$content.description|strip_tags:false|escape">
  <meta name="keywords" content="MUGEN, M.U.G.E.N, むげん, 無限, 夢幻">
*}
  <!-- 「駄目ね、全然駄目だわ」 -->

{*<!-- ジョインジョイン OGP -->
  <meta property="og:url" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/index.html">
  <meta property="og:title" content="M.U.G.E.N ステートコントローラ一覧 - Name = sura">
  <meta property="og:description" content="">
  <meta property="og:type" content="website">
  <meta property="og:image" content="http://analyticsfile.web.fc2.com/media/img/profile_200.png">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:site_name" content="Name = sura">
<!-- もういい、ここまでだっ・・・ -->*}

  <link rel="author" title="sura" href="https://twitter.com/bluesura">
  <link href="https://github.com/bluesura/bluesura.github.io/commits/master.atom" rel="alternate" title="ATOM" type="application/atom+xml">

  <link rel="stylesheet" href="/lib/css/material.css?version=20161230">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

{*<!--sidebar-->
  <link rel="stylesheet" href="/lib/css/normalize.css">
  <link rel="stylesheet" href="/lib/css/component.css">
  <script src="/lib/js/modernizr.custom.js"></script>
  <!--sidebar-->*}

  <script type="text/javascript" src="//code.jquery.com/jquery-2.2.0.min.js"></script>
  <script async type="text/javascript" src="//feed.mikle.com/js/rssmikle.js"></script>
  <script async type="text/javascript" src="/lib/js/code.js?version=20161230"></script>
{*
  <script type="text/javascript" src="/lib/js/isMobile.min.js?version=20161230"></script>
  <script async type="text/javascript" src="/lib/js/js-ctrl.js?version=20161230"></script>
  <script async type="text/javascript" src="/lib/js/jquery.touchSwipe.min.js"></script>
*}

