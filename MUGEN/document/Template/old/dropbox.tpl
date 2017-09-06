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