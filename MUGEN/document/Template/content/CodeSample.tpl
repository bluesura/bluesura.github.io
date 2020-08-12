	{if !empty($content.code_sample)}
	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
			{foreach $content.code_sample as $code_sample}
<div>
			<h3>{$code_sample.title}</h3>
			{if !empty($code_sample.description)}
			<div class="description">{$code_sample.description}</div>
			{/if}
			<div class="code"><code>
			<ul>
			{foreach $code_sample.code as $code}
				<li>{$code}</li>
			{/foreach}
			</ul>
			</code></div>
			{if !empty($code_sample.media)}
			<div class="media">
				{if !empty($code_sample.media.youtube)}
				<div>
					{foreach $code_sample.media.youtube as $youtube}
					<div>{$video.title}</div>
					<div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;"><iframe style="position: absolute; top: 0;  left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/{$youtube.file}" frameborder="0" allowfullscreen></iframe></div>
					{/foreach}
				</div>
				{/if}
				{if !empty($code_sample.media.video)}
				<div class="video-group">
					{foreach $code_sample.media.video as $video}
					<div>{$video.title}</div>
					<div class="video image-frame">
						<video controls="controls">
							<source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
						</video>
						<div><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4">動画が再生できない時はここをクリック。</a></div>
					</div>
					{/foreach}
				</div>
				{/if}
				{if !empty($code_sample.media.image)}
				<div class="image-group">
					{foreach $code_sample.media.image as $image}
					<div class="image">
						<div>{$image.title}</div>
						<div class="image-frame"><img src="./media/img/{$image.file}" alt="{$image.title}" width="{$image.width}" height="{$image.height}" /></div>
					</div>
					{/foreach}
				</div>
				{/if}
			</div>
			{/if}
</div><br>
			{/foreach}
	</div></section>
	{/if}