	{if !empty($content.qanda)}
	<section id="QandA"><div class="section">
		<h2>注意事項</h2>
		{foreach $content.qanda as $qanda}
		<table class="qanda">
			{if !empty($qanda.q)}<tr>
				<th class="question">問</th>
				<td>{$qanda.q}</td>
			</tr>{/if}
			{if !empty($qanda.c)}<tr>
				<th class="problem">原</th>
				<td>{$qanda.c}</td>
			</tr>{/if}
			{if !empty($qanda.a)}<tr>
				<th class="answer">答</th>
				<td>{$qanda.a}</td>
			</tr>{/if}
			{if !empty($qanda.r)}<tr>
				<th class="quote">参</th>
				<td>
				{foreach $qanda.r as $reference}
					<a href="{$reference.url}" target="_blank">{$reference.title}</a>
					{if $reference@last != true}<br>{/if}
				{/foreach}
				</td>
			</tr>{/if}
		</table>
		{/foreach}
	</div></section>
	{/if}