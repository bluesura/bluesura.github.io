				<p class="description">{$content.description}</p>

{if $content.sample_code != NULL}
	<section id="SampleCode"><div class="section">
		<h2>設定可能なパラメータ一覧</h2>
		<div class="code">
		<ul>
				{foreach $content.sample_code.code as $code}
					<li>{$code}</li>
				{/foreach}
		</ul>
		</div>
	</div></section>
{/if}

{if $content.parameter != NULL}
	<section id="Parameter"><div class="section">
		<h2>パラメーター</h2>
		{foreach $content.parameter as $array}
		<dl class="parameter">
			<dt>
				<span class="main" id="{$array.parameter}">{$array.parameter} = {foreach $array.value as $value}{$value}{if $value@last != true}, {/if}{/foreach}</span>
				<span class="type">
				{foreach $array.type as $type}
				<a href="#" onclick="return false;">
					{$type}{if $type@last != true}, {/if}
				</a>
				{/foreach}
				</span>
			</dt>
			<dd>
				<div class="description">{$array.description}</div>
				<div class="option-value">
					{if $array.min_value != "" || $array.max_value != ""}
					<div class="range-value">
						{if $array.min_value != ""}
						<span class="min-value">最小値: {$array.min_value}</span>
						{/if}
						{if ($array.min_value != "") && ($array.max_value != "")},{/if}
						{if $array.max_value != ""}
						<span class="max-value">最大値: {$array.max_value}</span>
						{/if}
					</div>
					{/if}
					{if $array.possible_value != ""}
					<div class="possible-value">選択可能な文字列: {$array.possible_value}</div>
					{/if}
					{if $array.default_value == "required"}
					<div class="required-parameter">省略不可</div>
					{elseif $array.default_value == "instead"}
					<div class="instead-parameter">代替書式</div>
					{else}
					<div class="default-value">省略時のデフォルト値： {$array.default_value}</div>
					{/if}
				</div>
				{if $array.media != NULL}
				<div class="media">
					{if $array.media.video != []}
					<div class="video-group">
						{foreach $array.media.video as $video}
						<div class="video">
							<div class="title">{$video.title}</div>
							<video controls="controls">
								<source src="./video/{$video.file}.mp4" type="video/mp4" />
								<source src="./video/{$video.file}.webm" type="video/webm" />
								<source src="./video/{$video.file}.ogg" type="video/ogg" />
								<a href="./video/{$video.file}.mp4">動画</a>
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
							<div class="image-frame"><img src="./img/{$image.file}" alt="{$image.title}" width="{$image.width}" height="{$image.height}" /></div>
						</div>
						{/foreach}
					</div>
					{/if}
				</div>
				{/if}
			</dd>
		</dl>
		{/foreach}
	</div></section>
{/if}

{if $content.quote != NULL}
	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<ul>
		{foreach $content.quote as $quote}
			<li><a href="{$quote.url}" target="_blank">{$quote.title}</a></li>
		{/foreach}
		</ul>
	</div></section>
{/if}
