	{if $content.quote}
	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<ul>
		{foreach $content.quote as $quote}
			<li><cite><a href="{$quote.url}" target="_blank" rel="external">{$quote.title}</a></cite></li>
		{/foreach}
		</ul>
	</div></section>
	{/if}