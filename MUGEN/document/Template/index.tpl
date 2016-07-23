<!DOCTYPE HTML>
<html lang="ja-JP">
<head>
{include file="./head.tpl"}
</head>
<body>

<div id="container">
<div id="container-inner">
{include file="./header.tpl"}

<div id="content" class="hfeed"><div id="content-inner">

<div id="wrapper"><div id="main"><div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">

{if $content.page_category == "State"}
<header class="entry-header"><div class="entry-title"><h1>ステートコントローラー一覧</h1></div></header>

<div class="entry-content">{foreach $content.categories as $temp}
			<div class="section">
			<h2><a href="./{$temp.page_subtitle}.html">{$temp.page_subtitle}</a></h2>
			<div>{$temp.description}</div>
			<div class="code" contenteditable="true">
				<ul>
					{if $temp.category == "state"}
					<li>[State {*,$temp.page_subtitle*}]</li>
					<li>Type                       = {$temp.page_subtitle}</li>
					<li>Trigger1                   = 1</li>
					{elseif $temp.category == "statetype"}
					<li>[StateDef 『正の整数』{*, $temp.page_subtitle*}]</li>
					{/if}

					{foreach $temp.parameter as $parameter}
						<li>{$parameter}</li>
					{/foreach}

					{if $temp.category == "state"}
					<li>Persistent                 = ?</li>
					<li>IgnoreHitPause             = ?</li>
					{/if}
				</ul>
			</div>
		</div>
{/foreach}


{elseif $content.page_category == "Trigger"}
<header class="entry-header"><div class="entry-title"><h1>トリガー一覧</h1></div></header>
<div class="entry-content">{foreach $content.categories as $temp}
		<div class="section">
			<h2><a href="./{$temp.page_subtitle}.html">{$temp.page_subtitle}</a></h2>
			<div>{$temp.description}</div>
			<div class="code" contenteditable="true">
				<ul>
					{foreach $temp.parameter as $syntax}
						<li>{$syntax}</li>
					{/foreach}
				</ul>
			</div>
		</div>
{/foreach}


{/if}
{include file="./thanks.tpl"}</div>

	</div></div></article></div>
		



{include file="./sidebar.tpl"}



</div>
</div></div></div>
{include file="./footer.tpl"}

</body>
</html>
