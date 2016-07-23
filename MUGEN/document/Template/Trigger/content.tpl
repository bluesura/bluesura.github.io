<div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
	<header class="entry-header"{foreach $content.images as $array} style="background-image: url(./media/img/{$array["src"]}); height:{$array["height"]}px;"{/foreach}>
	<div{foreach $content.images as $array} style="height:{$array["height"]}px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"{/foreach}>

	<div class="entry-title"><div>
	<h1 id="{$content.trigger}">{$content.trigger|escape}</h1>
	{if $content.page.category != NULL}<div class="category">{$content.page.category[0]|escape} > {$content.page.category[1]|escape} | {if $content.page.version != NULL}実装されたバージョン: {$content.page.version}{/if} | {if $content.page.target != NULL}対象: {$content.page.target}{/if}</div>
{/if}
</div></div>

</div></header>
	<div class="entry-content">



{include file="./../Trigger/content/Description.tpl"}

{include file="./../Trigger/content/Version.tpl"}

{*include file="./../Trigger/content/Parameter.tpl"*}

{include file="./../Trigger/content/QandA.tpl"}

{include file="./../Trigger/content/CodeSample.tpl"}

{include file="./../Trigger/content/Quote.tpl"}

	</div>
</article></div>