{*
	<!-- ジョインジョイン OGP -->
	<meta property="og:url" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/{$state.state}.html" />
	<meta property="og:image" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/img/profile_200.png" />
{if $content.page.level == "1"}
	<meta property="og:title" content="Name = sura" />
{elseif $content.page.level == "2"}
	<meta property="og:title" content="{$content.page.title|escape} - Name = sura" />
{elseif $content.page.level == "3"}
	<meta property="og:title" content="{$content.page.subtitle} | {$content.page.title|escape} - Name = sura" />
{/if}
	<meta property="og:description" content="{$content.description|strip_tags:false|escape}" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:site_name" content="Name = sura" />
	<!-- もういい、ここまでだっ・・・ -->

	<!-- ドロー！ Twitter Cards --><!--
	<meta name="twitter:card" value="player" />
	<meta name="twitter:site" value="@bluesura" />
	--><!-- ターンエンドだ！ -->
*}

{*
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.0/jquery.lazyload.min.js"></script>
{literal}
<script>
$("img").show().lazyload({
effect: 'fadeIn',
effectspeed: 1000
});
</script>
{/literal}
*}