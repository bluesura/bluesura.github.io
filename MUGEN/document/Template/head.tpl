	<!-- （*´ω｀*）＜ソースコードを見るなんてえっちぃ人ですね！ -->{*
	<link rel="dns-prefetch" href="">*}

	<meta charset="UTF-8">
	<meta http-equiv="Content-Language" content="ja">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="format-detection" content="telephone=no">
	<meta name="referrer" content="unsafe-url">
	<meta name="robots" content="INDEX,FOLLOW">
	<meta name="viewport" content="width=device-width">


	<title itemprop="headline">
{if $content.page_subtitle}{$content.page_subtitle} | {/if}
{if $content.page.category[1]}{$content.page.category[1]|escape} | {/if}
{if $content.page_title}{$content.page_title|escape} - {/if}
{$content.site_name|escape}
	</title>

	<!---->
	<meta name="apple-mobile-web-app-title" content="MUGEN Document">
	<link rel="fluid-icon" href="/media/img/icon-512x512.png" title="MUGEN Document">
	<link rel="icon" type="image/x-icon" href="/media/img/favicon.png">
	<link rel="shortcut icon" href="/media/img/favicon.png" type="image/png">
	<link rel="icon" sizes="128x128" href="/media/img/icon-128x128.png">
	<link rel="apple-touch-icon" sizes="128x128" href="/media/img/icon-128x128.png">
	<link rel="apple-touch-icon-precomposed" sizes="128x128" href="/media/img/icon-128x128.png">
	<link rel="icon" sizes="192x192" href="/media/img/icon-192x192.png">
	<meta name="msapplication-TileImage" content="/media/img/icon-512x512.png">

	<link rel="mask-icon" href="/media/img/infinite-M.svg" color="#1E88E5">
	<meta name="theme-color" content="#1E88E5">
	<meta name="msapplication-TileColor" content="#1E88E5">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">
	<link rel="manifest" href="/manifest.json">
	<!---->

	<!-- 「チェス盤を引っくり返す！」 -->
	<meta name="author" content="SURA(すら)">
	<meta name="author" content="https://plus.google.com/115204078302617252163">
	<meta name="copyright" content="Copyright© SURA(すら) All rights reserved.">
	<meta name="rating" content="General">
	<meta name="referrer" content="unsafe-url">
	<meta name="format-detection" content="telephone=no">
	<link rel="me" href="https://twitter.com/bluesura">
	<link rel="me" href="https://github.com/bluesura/">
	<link rel="me" href="mailto:suteadddayov@gmail.com">
	<link rel="index" href="https://bluesura.github.io/">

	<link rel="canonical" href="{$content.url}">
	<link href="https://github.com/bluesura/bluesura.github.io/commits/master.atom" rel="alternate" title="{$content.site_name|escape}の更新履歴" type="application/atom+xml">
	<meta name="generator" content="Smarty">
	<!-- 「駄目ね、全然駄目だわ」 -->

	<!-- ジョインジョイン OGP -->
	<meta name="description" content="{if $content.description==""}MUGENのステートコントローラー・トリガー・ライフバーの記述について、ちょっとだけまとめてます。{else}{$content.description|strip_tags:true|escape}{/if}">
{*  <meta name="keywords" content="MUGEN, M.U.G.E.N, むげん, 無限, 夢幻">*}
	<meta property="og:url" content="{$content.url}">
	<meta property="og:title" content="{$content.page_subtitle} | {$content.page_title}">
	<meta property="og:description" content="MUGENのステートコントローラー・トリガー・ライフバーの記述について、ちょっとだけまとめてます。">
	<meta property="og:type" content="website">
	<meta property="og:locale" content="ja_JP">
	<meta property="og:site_name" content="Name = sura">
	<meta name="twitter:site" content="@bluesura">
	<meta name="twitter:creator" content="@bluesura">
	<meta name="twitter:url" content="{$content.url}">
	<meta name="twitter:title" content="{$content.page_subtitle} | {$content.page_title}">
	<meta name="twitter:description" content="MUGENのステートコントローラー・トリガー・ライフバーの記述について、ちょっとだけまとめてます。">
	<meta name="twitter:card" content="summary_large_image">
{if $content.images[0].src != ""}
	<meta property="og:image" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}">
{/if}
{if $content.images[0].src != ""}
	<meta name="twitter:image" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}">
{/if}

{if $content.images[0].src != ""}
	<link rel="image_src" href="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}">
{/if}

{if $content.images[0].src != ""}
	<meta property="pin:media" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}">
	<meta property="pin:description" content="{$content.images[0].alt}">
{/if}
	<!-- もういい、ここまでだっ・・・ -->


	<!---->
	<link rel="stylesheet" href="/lib/css/material.css?version=2017811">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

	<script type="text/javascript" src="//code.jquery.com/jquery-2.2.0.min.js"></script>
	<script async type="text/javascript" src="//feed.mikle.com/js/rssmikle.js"></script>
	<script async type="text/javascript" src="/lib/js/code.js?version=20161230"></script>
{*  <script type="text/javascript" src="/lib/js/isMobile.min.js?version=20161230"></script>
	<script async type="text/javascript" src="/lib/js/js-ctrl.js?version=20161230"></script>
	<script async type="text/javascript" src="/lib/js/jquery.touchSwipe.min.js"></script>*}
{literal}
	<script type="application/ld+json">
	{
	"@context": "http://schema.org",
	"@type": "WebSite",
	"url": "https://www.google.co.jp/",
	"potentialAction": {
	 "@type": "SearchAction",
	 "target": "https://www.google.co.jp/search?q=site%3Ahttps%3A%2F%2Fbluesura.github.io%2F+{q}&num=10",
	 "query-input": "required name=q"
	 }
	}
	</script>
{/literal}
	<!---->

