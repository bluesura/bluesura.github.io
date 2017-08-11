	{if $content.version}
	<section id="Version"><div class="section">
		<h2>仕様・バグ・エラー・変更点</h2>
		<table class="version">
{*		<thead>
			<tr>
				<th class="left">バージョン</th>
				<th class="right">内容</th>
			</tr>
		</thead>*}
		<tbody>
			{foreach $content.version as $array}
				<tr>
					<td>{$array.no}</td>
					<td>{$array.content}</td>
				</tr>
			{/foreach}
		</tbody>
		</table>
	</div></section>
	{/if}