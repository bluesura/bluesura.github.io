	<section id="Parameter"><div class="section">
		<h2>パラメーター</h2>
		{if $content.parameter == []}
		<div>なし</div>
		{else}
		{foreach $content.parameter as $array}
		<dl class="parameter">
			<dt>
				<span class="main">
				{if $array.main == ""}
					{$array.parameter}
				{else}
					{$array.main}
				{/if}
				</span>
				<span class="type">
				{foreach $array.type as $type}
					<a href="#" onclick="return false;">{$type}{if $type@last != true}, {/if}</a>
				{/foreach}
				</span>
			</dt>
			<dd>
				<div class="description">{$array.description}</div>
				{if $array.media != NULL}
				<div class="media">
					{if $array.media.image != []}
					<div class="image-group">
						{foreach $array.media.image as $image}
						<div class="image">
							<div class="title">{$image.title}</div>
							<div class="image-frame"><img src="./media/img/{$image.file}" alt="{$image.title}" width="{$image.width}" height="{$image.height}" /></div>
						</div>
						{/foreach}
					</div>
					{/if}
				</div>
				{/if}

			</dd>
		</dl>
		{/foreach}
		{/if}
	</div></section>