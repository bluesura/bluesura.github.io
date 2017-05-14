  {*<link rel="dns-prefetch" href="">*}

  <meta charset="UTF-8">
  <meta http-equiv="Content-Language" content="ja">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="referrer" content="unsafe-url" />
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
  <link rel="icon" sizes="192x192" href="/media/img/icon-192x192.png">
  <meta name="msapplication-TileImage" content="/media/img/icon-512x512.png">

  <link rel="mask-icon" href="/media/img/infinite-M.svg" color="#1E88E5">
  <link rel="icon" type="image/x-icon" href="/media/img/favicon.png">

  <link rel="apple-touch-icon-precomposed" sizes="128x128" href="/media/img/icon-128x128.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="canonical" href="{$content.url}">

  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="MUGEN Document" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <!-- 「チェス盤を引っくり返す！」 -->
  <meta name="theme-color" content="#1E88E5">
  <meta name="msapplication-TileColor" content="#1E88E5">
  <meta name="robots" content="INDEX,FOLLOW">
  <meta name="viewport" content="width=device-width">
  <meta name="author" content="sura">
  <meta name="copyright" content="Copyright© SURA(すら) All rights reserved." />
  <meta name="generator" content="Smarty">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="referrer" content="unsafe-url">
  <meta name="description" content="MUGENのステートコントローラー・トリガー・ライフバーの記述について、ちょっとだけまとめてます。">
{*
  <meta name="keywords" content="MUGEN, M.U.G.E.N, むげん, 無限, 夢幻">
*}
  <!-- 「駄目ね、全然駄目だわ」 -->

  <!-- ジョインジョイン OGP -->
  <meta property="og:url" content="{$content.url}">
  <meta property="og:title" content="{$content.page_subtitle} | {$content.page_title}">
  <meta property="og:description" content="MUGENのステートコントローラー・トリガー・ライフバーの記述について、ちょっとだけまとめてます。">
  <meta property="og:type" content="website">
{if $content.images[0].src != ""}  <meta property="og:image" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}">{/if}
  <meta property="og:locale" content="ja_JP">
  <meta property="og:site_name" content="Name = sura">
  <!-- もういい、ここまでだっ・・・ -->
  <meta name="twitter:site" content="@bluesura">
  <meta name="twitter:creator" content="@bluesura">
  <meta name="twitter:url" content="{$content.url}">
  <meta name="twitter:title" content="{$content.page_subtitle} | {$content.page_title}">
  <meta name="twitter:description" content="MUGENのステートコントローラー・トリガー・ライフバーの記述について、ちょっとだけまとめてます。">
  <meta name="twitter:text:description" content="">
  <meta name="twitter:card" content="summary_large_image">
{if $content.images[0].src != ""}  <meta name="twitter:image" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}" />{/if}
{if $content.images[0].src != ""}  <link rel="image_src" href="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}" />{/if}
{if $content.images[0].src != ""}<meta property="pin:media" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}" />
<meta property="pin:description" content="{$content.images[0].alt}" />{/if}


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

