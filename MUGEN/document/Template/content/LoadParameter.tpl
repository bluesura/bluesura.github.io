	<section id="LoadParameter"><div class="section">
		<h2>パラメーターの読み込み順</h2>

{*
		<div class="code" contenteditable="true">
		<ul>

			{if $content.category == "state"}
			<li>[State ,{$content.state}]</li>
			<li>Type                       = {$content.state}</li>
			<li>Trigger1                   = 0</li>

			{elseif $content.category == "statetype"}
			<li>[StateDef 『正の整数』,{$content.state}]</li>
			{/if}

			{if isset($content.parameter[0].parameter_type)}
				{foreach $content.parameter as $parameter}
					<li>{$parameter.parameter}{for $loop=1+$parameter.parameter|count_characters to 27} {/for}= {foreach $parameter.load_priority as $value}{$value}{if $value@last != true}, {/if}{/foreach}</li>
				{/foreach}

			{elseif $content.load_parameter.parameter != []}
				{foreach $content.load_parameter.parameter as $parameter}
					<li>{$parameter}</li>
				{/foreach}
			{/if}

		</ul>
		</div>
*}

		<div>
			<p>
{foreach $content.parameter as $parameter}
				{$parameter.parameter}({foreach $parameter.load_priority as $value}{$value}{if $value@last != true}, {/if}{/foreach}) => 
{/foreach}
			</p>
		</div>

		<div class="supplement">{*？は未検証。適当に並べているだけです。*}<br>*バージョンや実行環境,パラーメーターの指定の仕方によって、読み込まれる順番が変わる可能性があります。参考程度なものだと思ってください。</div>

	</div></section>
