	{if $content.code_sample}
	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
			{foreach $content.code_sample as $code_sample}
<div>
			{if $code_sample.title != NULL}<h3>{$code_sample.title}</h3>{/if}
			{if $code_sample.description != ""}
			<div class="description">{$code_sample.description}</div>
			{/if}
			<div class="code"><code><ul>
			{foreach $code_sample.code as $code}
				<li>{$code}</li>
			{/foreach}
			</ul></code></div>

			{if $code_sample.media != NULL}
			<div class="media">
				{if $code_sample.media.video != []}
				<div class="video-group">
					{foreach $code_sample.media.video as $video}
					<h4>{$video.title}</h4>
					<div class="video image-frame">
						<video controls="controls">
							<source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
						</video>
						<div><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4">動画が再生できない時はここをクリック。</a></div>
					</div>
					{/foreach}
				</div>
				{/if}
				{if $code_sample.media.image != []}
				<div class="image-group">
					{foreach $code_sample.media.image as $image}
					<div class="image">
						<h4>{$image.title}</h4>
						<div class="image-frame"><img src="./media/img/{$image.file}" alt="{$image.title}" width="{$image.width}" height="{$image.height}" /></div>
					</div>
					{/foreach}
				</div>
				{/if}
			</div>
			{/if}
</div>
			{/foreach}
	</div></section>
	{/if}