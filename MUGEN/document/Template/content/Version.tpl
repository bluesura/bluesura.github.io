	{if $content.version}
	<section id="Version"><div class="section">
		<h2>バージョンごとの変更点・バグ・エラー・仕様</h2>
		<table>
			<thead>
				<tr><th></th><th>内容</th></tr>
			</thead>
			<tbody>
				{foreach $content.version as $array}
					<tr><td>{$array.no}</td><td>{$array.content}</td></tr>
				{/foreach}
			</tbody>
		</table>
	</div></section>
	{/if}