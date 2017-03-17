<!DOCTYPE html>
<html lang="ja-JP" prefix="og: http://ogp.me/ns# fb: http://www.facebook.com/2008/fbml">
<head>
{include file="./head.tpl"}
</head>

<body>

<div id="container">
<div id="container-inner">
{include file="./header.tpl"}

<div id="content" class="hfeed"><div id="content-inner">

	<div id="wrapper"><div id="main">

<div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
	<header class="entry-header"{foreach $content.images as $array} style="background-image: url(./media/img/{$array["src"]}); height:{$array["height"]}px;"{/foreach}><div{foreach $content.images as $array} style="height:{$array["height"]}px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"{/foreach}>

</div></header>

	<div class="entry-content">
{$content.html}
	</div>
</article></div>

	</div></div>


{include file="./sidebar.tpl"}
	</div>

</div></div></div>



{include file="./footer.tpl"}

</body>
</html>