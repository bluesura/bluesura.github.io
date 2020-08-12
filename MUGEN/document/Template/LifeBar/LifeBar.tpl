<div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
	<header class="entry-header"{foreach $content.images as $array} style="background-image: url(./media/img/{$array["src"]}); height:{$array["height"]}px;"{/foreach}><div{foreach $content.images as $array} style="height:{$array["height"]}px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"{/foreach}>{if !empty($content.images)}<span itemprop="image" itemscope itemtype="https://schema.org/ImageObject" style="display: none;"/><meta itemprop="url" content="https://bluesura.github.io/MUGEN/document/LifeBar/media/img/{$content.images[0].src}"><meta itemprop="width" content="{$content.images[0].width}"><meta itemprop="height" content="{$content.images[0].height}"></span>{/if}

	<div class="entry-title" itemprop="name"><div>
	<h1 id="{$content.title}">{$content.group}</h1>
	{if !empty($content.page.category)}<div class="category">{$content.page.category[0]|escape} > {$content.page.category[1]|escape} | {if !empty($content.page.version)}実装されたバージョン: {$content.page.version}{/if} | {if !empty($content.page.target)}対象: {$content.page.target}{/if}</div>
{/if}
</div></div>

</div></header>

	<div class="entry-content">

{include file="./content_l.tpl"}

<div><span>公開日:<time class="published" itemprop="datePublished" datetime="2008-06-05">2008.06.05</time></span> | {if !empty($content.page.update)}<span>最終更新日:<time class="updated" itemprop="dateModified" datetime="{$content.page.update|replace:'.':'-'}">{$content.page.update}</time></span>{/if} | {if !empty($content.page.contributor)}<span>貢献者: {foreach $content.page.contributor as $contributor}{$contributor}氏{if $contributor@last != true}, {/if}{/foreach}</span>{/if}</div>

	</div>
</article></div>
