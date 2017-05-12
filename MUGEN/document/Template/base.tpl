<!DOCTYPE html>
<html lang="ja" itemscope itemtype="http://schema.org/Article">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
{include file="./head.tpl"}

{literal}
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMQSZM');</script>
<!-- End Google Tag Manager -->
{/literal}
</head>

<body>
{literal}
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMQSZM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
{/literal}

<div id="container"><div id="content-inner">
<div id="container-inner">
{include file="./header.tpl"}

<div id="content">

	<div id="wrapper"><div id="main">
{if $content.page_category == "State"}
  {if $content.page.level == "3"}
    {include file="./content.tpl"}
  {elseif $content.page.level == "2"}
    {include file="./index.tpl"}
  {/if}

{elseif $content.page_category == "Trigger"}
  {if $content.page.level == "3"}
    {include file="./Trigger/content.tpl"}
  {elseif $content.page.level == "2"}
    {include file="./index.tpl"}
  {/if}

{elseif $content.page_category == "Lifebar"}
  {if $content.page.level == "3"}
    {include file="./LifeBar/LifeBar.tpl"}
  {elseif $content.page.level == "2"}
    {include file="./index.tpl"}
  {/if}
    
{/if}
	</div></div>


{include file="./sidebar.tpl"}
	</div>

</div></div></div>



{include file="./footer.tpl"}

{*<script src="/lib/js/classie.js"></script>
<script src="/lib/js/sidebarEffects.js"></script>*}
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/lib/js/service-worker.js')
           .then(function() { /*console.log();*/ });
}
</script>

</body>
</html>
