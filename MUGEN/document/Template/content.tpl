<div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
	<header class="entry-header"{foreach $content.images as $array} style="background: url(./media/img/{$array['src']}) no-repeat; background-size: cover;"{/foreach}><div{foreach $content.images as $array} style="height:{$array['height']}px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"{/foreach}>{if $content.images!=NULL}<span itemprop="image" itemscope itemtype="https://schema.org/ImageObject" style="display: none;"/><meta itemprop="url" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}"><meta itemprop="width" content="{$content.images[0].width}"><meta itemprop="height" content="{$content.images[0].height}"></span>{/if}

	<div class="entry-title" itemprop="name"><div>
	<h1 id="{$content.state}">Type = {$content.state|escape}</h1>
	{if $content.page.category != NULL}<div class="category">{$content.page.category[0]|escape} > {$content.page.category[1]|escape} | {if $content.page.version != NULL}実装されたバージョン: {$content.page.version}{/if} | {if $content.page.target != NULL}対象: {$content.page.target}{/if}</div>
{/if}
</div></div>

</div></header>

	<div class="entry-content">

{include file="./content/Description.tpl"}

{include file="./content/Version.tpl"}

{include file="./content/Parameter.tpl"}

{include file="./content/DefaultParameter.tpl"}

{include file="./content/LoadParameter.tpl"}

{include file="./content/QandA.tpl"}

{include file="./content/CodeSample.tpl"}

{include file="./content/Quote.tpl"}

<div><div><strong>公開日:</strong><time class="published" itemprop="datePublished" datetime="2008-06-05">2008.06.05</time></div>{if $content.page.update != NULL}<div><strong>最終更新日:</strong><time class="updated" itemprop="dateModified" datetime="{$content.page.update|replace:'.':'-'}">{$content.page.update}</time></div>{/if}{if $content.page.contributor != NULL}<div><strong>貢献者:</strong>{foreach $content.page.contributor as $contributor}{$contributor}氏{if $contributor@last != true}, {/if}{/foreach}</div>{/if}</div>

	</div>
</article></div>
