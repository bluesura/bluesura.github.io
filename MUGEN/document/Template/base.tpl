<!DOCTYPE html>
<html lang="ja" itemscope itemtype="http://schema.org/Article">
<head>
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
	<script src="https://embed.small.chat/T0F4QF673G6M8EPAEN.js" async></script>
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


<ul class="sosial_buttons">
    <li class="sb_facebook">
        <a href="" onclick="window.open('https://www.facebook.com/share.php?u='+encodeURIComponent(document.location.href), 'FBwindow', 'width=320, height=320, menubar=no, toolbar=no, scrollbars=yes'); return false;" target="_blank">
            <i class="fa fa-facebook"></i>
        </a>
    </li>

    <li class="sb_twitter">
        {literal}<a href="" onclick="window.open('http://twitter.com/share?count=horizontal&amp;original_referer=http%3A%2F%2Frokaru.jp%2Fmatome%2F28227&amp;text='+encodeURIComponent((function(){if((''+document.getSelection()).length){return document.getSelection()}else{return document.title.slice(0,30)}})()+' @bluesuraさんから')+'&amp;url='+document.location.href, 'tweetwindow', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1'); return false;" title="このページをツイートする" target="_blank">{/literal}
            <i class="fa fa-twitter"></i>
        </a>
    </li>
    <li class="sb_hatena">
        <a href="" onclick="window.open('http://b.hatena.ne.jp/entry/'+encodeURIComponent(document.location.href))" class="hatena-bookmark-button" title="このページをはてなブックマークに追加する" target="_blank">
            <i class="fa fa-hatena"></i>
        </a>
    </li>
    <li class="sb_gplus">
        <a href="" onclick="window.open('https://plus.google.com/share?url='+encodeURIComponent(document.location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" target="_blank">
            <i class="fa fa-google-plus"></i>
        </a>
    </li>
</ul>

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
