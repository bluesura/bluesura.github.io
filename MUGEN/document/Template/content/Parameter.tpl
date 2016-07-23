	<section id="Parameter"><div class="section">
		<h2>パラメーター</h2>
		{if $content.parameter == []}
		<div>なし</div>
		{else}
		{foreach $content.parameter as $array}
		<dl class="parameter">
			<dt>
				<span class="main" id="{$array.parameter}">
				{if $array.main == ""}
					{$array.parameter} = {foreach $array.value as $value}{$value}{if $value@last != true}, {/if}{/foreach}
				{else}
					{$array.main}
				{/if}
				({foreach $array.type as $type}{if $type=="boolean"}0か1{/if}{if $type=="int"}整数{/if}{if $type=="float"}浮動小数点数{/if}{if $type=="string"}文字列{/if}{if $type@last != true}, {/if}{/foreach})
				</span>
			</dt>
			<dd>
				<div class="description">{$array.description}</div>

				<div class="option-value">

					{if $array.possible_value != ""}<div class="possible-value">
					{if is_array($array.possible_value[0])}
          <div>
					<table>
						<tr>
							<th>{$array.possible_value[0][0]}</th>
							<th>{$array.possible_value[0][1]}</th>
						</tr>
						{for $i=1 to $array.possible_value|@count-1}<tr>
							<td>{$array.possible_value[$i][0]}</td>
							<td>{$array.possible_value[$i][1]}</td>
						</tr>{/for}
					</table>
					</div>
						{else}<div>
							選択可能な文字列: {foreach $array.possible_value as $possible_value}{$possible_value}{if $possible_value@last != true}, {/if}{/foreach}
						</div>{/if}
					</div>{/if}

					{if $array.min_value != "" || $array.max_value != ""}
					<div class="range-value">
						{if $array.min_value != [""]}
						<span class="min-value">最小値: {foreach $array.min_value as $min_value}{$min_value}{if $min_value@last != true}, {/if}{/foreach}</span>
						{/if}
						{if ($array.min_value != [""]) && ($array.max_value != [""])},{/if}
						{if $array.max_value != [""]}
						<span class="max-value">最大値: {foreach $array.max_value as $max_value}{$max_value}{if $max_value@last != true}, {/if}{/foreach}</span>
						{/if}
					</div>
					{/if}

					{if $array.parameter_type == "required"}
					<div class="required-parameter">省略不可</div>
					{elseif $array.parameter_type == "instead"}
					<div class="instead-parameter">代替書式</div>
					{else}
					<div class="default-value">省略時のデフォルト値： {foreach $array.default_value as $default_value}{$default_value}{if $default_value@last != true}, {/if}{/foreach}</div>
					{/if}

					{if isset($array.associated_trigger)}<div class="associated-trigger">関連するトリガー： {foreach $array.associated_trigger as $associated_trigger}<code>{$associated_trigger}</code>{if $associated_trigger@last != true}, {/if}{/foreach}</div>{/if}

				{if $array.media != NULL}
				<div class="media">
					{if $array.media.video != []}
					<div class="video-group">
						{foreach $array.media.video as $video}
						<div class="video image-frame">
							<div class="title"><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4">{$video.title}</a></div>
							<video controls="controls">
								<source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4" type="video/mp4" />
							</video>
						</div>
						{/foreach}
					</div>
					{/if}
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

				</div>


			</dd>
		</dl>
		{/foreach}
		{/if}
	</div></section>