	{if $content.version}
	<section id="Version"><div class="section">
		<h2>仕様・バグ・エラー・変更点</h2>
		<table>
{*			<thead>
				<tr><th></th><th>内容</th></tr>
			</thead>*}
			<tbody>
				{foreach $content.version as $array}
				<tr>
					<td>{$array.no}</td>
					<td>
					{if $array.blockquote!=""}<blockquote cite="{{$array.blockquote}}">{/if}
					{$array.content}
					{if $array.blockquote!=""}</blockquote>{/if}
					</td>
				</tr>
				{/foreach}
			</tbody>
		</table>
	</div></section>
	{/if}