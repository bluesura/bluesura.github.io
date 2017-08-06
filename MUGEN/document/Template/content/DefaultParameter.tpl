	<section id="DefaultParameter"><div class="section">
		<h2>省略した時のデフォルト値</h2>
		<div class="code" contenteditable="true">
		<ul>
			{if $content.category == "state"}
			<li>[State ,{$content.state}]</li>
			<li>Type                       = {$content.state}</li>
			<li>Trigger1                   = 1</li>
			{elseif $content.category == "statetype"}
			<li>[StateDef 『正の整数』]</li>
			{/if}
			{if isset($content.parameter[0].parameter_type)}
				{foreach $content.parameter as $parameter}
					<li class="{$parameter.parameter_type}-parameter">{$parameter.parameter}{for $loop=1+$parameter.parameter|count_characters to 27} {/for}= {foreach $parameter.default_value as $value}{$value}{if $value@last != true}, {/if}{/foreach}</li>
				{/foreach}

			{else}
				{if $content.default_parameter.required_parameter != []}
					{foreach $content.default_parameter.required_parameter as $required_parameter}
						<li class="required-parameter">{$required_parameter}</li>
					{/foreach}
				{/if}
				{if $content.default_parameter.instead_parameter != []}
					{foreach $content.default_parameter.instead_parameter as $instead_parameter}
						<li class="instead-parameter">{$instead_parameter}</li>
					{/foreach}
				{/if}
				{if $content.default_parameter.optional_parameter != []}
					{foreach $content.default_parameter.optional_parameter as $optional_parameter}
						<li class="optional-parameter">{$optional_parameter}</li>
					{/foreach}
				{/if}

			{/if}

		</ul>
		</div>
		{*<div class="supplement">*<span class="optional-parameter">緑=記述が省略可能なパラメーター</span>, <span class="required-parameter">赤=省略できないパラメーター、省略するとエラー</span>, <span class="instead-parameter">紫=パラメーターの代わりに使用できる別のパラメーター</span></div>*}
	</div></section>