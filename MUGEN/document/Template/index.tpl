<div id="main-inner">
<article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">

{if $content.page_category == "State"}
<header class="entry-header"><div class="entry-title"><h1>ステートコントローラー一覧</h1></div></header>

<div class="entry-content">{foreach $content.categories as $temp}
			<div class="section">
			<h2><a href="./{$temp.page_subtitle}.html">{$temp.page_subtitle}</a></h2>
			<div>{$temp.description}</div>
			<div class="code" contenteditable="true">
				<ul>
					{if $temp.category == "state"}
					<li>[State {*,$temp.page_subtitle*}]</li>
					<li>Type                       = {$temp.page_subtitle}</li>
					<li>Trigger1                   = 1</li>
					{elseif $temp.category == "statetype"}
					<li>[StateDef 『正の整数』{*, $temp.page_subtitle*}]</li>
					{/if}

					{foreach $temp.parameter as $parameter}
						<li>{$parameter}</li>
					{/foreach}

					{if $temp.category == "state"}
					<li>Persistent                 = ?</li>
					<li>IgnoreHitPause             = ?</li>
					{/if}
				</ul>
			</div>
		</div>
{/foreach}{include file="./thanks.tpl"}{include file="./nav.tpl"}</div>


{elseif $content.page_category == "Trigger"}
<header class="entry-header"><div class="entry-title"><h1>トリガー一覧</h1></div></header>
<div class="entry-content">
{foreach $content.categories as $temp}
		<div class="section">
			<h2><a href="./{$temp.page_subtitle}.html">{$temp.page_subtitle}</a></h2>
			<div>{$temp.description}</div>
			<div class="code" contenteditable="true">
				<ul>
					{foreach $temp.parameter as $syntax}
						<li>{$syntax}</li>
					{/foreach}
				</ul>
			</div>
		</div>
{/foreach}{include file="./thanks.tpl"}{include file="./nav.tpl"}</div>

{elseif $content.page_category == "Lifebar"}
<div class="entry-content">
<div class="section">
{$content.html}
{include file="./nav.tpl"}
</div>
</div>
{/if}

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-ex+6c-2-c9+mp"
     data-ad-client="ca-pub-9960110085246197"
     data-ad-slot="8121105860"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

</article></div>