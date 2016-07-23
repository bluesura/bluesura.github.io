	<div class="description">
<div>{$content.description}</div>



		{if isset($content.associated_state)}<div class="associated-trigger">関連するステートコントローラー： {foreach $content.associated_state as $associated_state}<a href="./../State/{$associated_state}.html"><code>{$associated_state}</code></a>{if $associated_state@last != true}, {/if}{/foreach}</div>{/if}
		{if isset($content.associated_trigger)}<div class="associated-trigger">関連するトリガー： {foreach $content.associated_trigger as $associated_trigger}<a href="./../Trigger/{$associated_trigger}.html"><code>{$associated_trigger}</code></a>{if $associated_trigger@last != true}, {/if}{/foreach}</div>{/if}

	</div>