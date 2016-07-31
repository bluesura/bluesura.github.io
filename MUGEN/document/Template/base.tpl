<!DOCTYPE html>
<html lang="ja" itemscope itemtype="http://schema.org/Article">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
{include file="./head.tpl"}
</head>

<body>
{literal}
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-MMQSZM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMQSZM');</script>
<!-- End Google Tag Manager -->
{/literal}

<div id="container"><div id="content-inner">
<div id="container-inner">
{include file="./header.tpl"}

<div id="content" class="hfeed">

	<div id="wrapper"><div id="main">
{if $content.page_category == "State"}{include file="./content.tpl"}
{elseif $content.page_category == "Trigger"}{include file="./Trigger/content.tpl"}
{elseif $content.page_category == "Lifebar"}{include file="./LifeBar/LifeBar.tpl"}
{/if}
	</div></div>


{include file="./sidebar.tpl"}
	</div>

</div></div></div>



{include file="./footer.tpl"}

</body>
</html>
