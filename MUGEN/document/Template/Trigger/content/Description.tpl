	<section id="summary"><div class="summary section">
		<h2>概要</h2>
		{$content.summary}
	</div></section>

	<section id="syntax"><div class="syntax section">
		<h2>構文</h2>
		<div class="code"><code><ul>
		{foreach $content.syntax as $code}
			<li>{$code}</li>
		{/foreach}
		</ul></code></div>
	</div></section>

	{if !empty($content.description)}
	<section id="description" itemprop="articleBody"><div class="description section">
		<h2>詳細</h2>
		<div>
			{$content.description}
		</div>

		{if isset($content.associated_state)}<div class="associated-trigger">関連するステートコントローラー： {foreach $content.associated_state as $associated_state}<a href="./../State/{$associated_state}.html"><code>{$associated_state}</code></a>{if $associated_state@last != true}, {/if}{/foreach}</div>{/if}
		{if isset($content.associated_trigger)}<div class="associated-trigger">関連するトリガー： {foreach $content.associated_trigger as $associated_trigger}<a href="./../Trigger/{$associated_trigger}.html"><code>{$associated_trigger}</code></a>{if $associated_trigger@last != true}, {/if}{/foreach}</div>{/if}
	</div></section>
	{/if}