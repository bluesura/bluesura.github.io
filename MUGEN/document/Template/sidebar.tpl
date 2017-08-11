<div id="box2" class="slideout-sidebar">

<div class="article-survey-container">
  <div class="menu">
  {if $content != NULL}
    {*<ul><li><div>*}
  {foreach $content.sidebar as $temp}
        {$temp}
  {/foreach}
      {*</div></li></ul>*}
  {/if}
  </div>
</div>

{literal}
<div class="article-survey-container">
<div class="toc" id="toc">
<div class="title">目次</div>
<ul>
	<script>
var a = document.getElementsByTagName("section");
for(var i = 0; i < a.length; i++) {
	document.write("<li><a href=\"#"+a[i].id+"\">" + a[i].getElementsByTagName("h2")[0].innerText + "</a></li>");
	var b = a[i].getElementsByTagName("h3");
	document.write("<ul>");
	for(var j = 0; j < b.length; j++) {
		b[j].id=i+"-"+j;
		document.write("<li><a href=\"#"+i+"-"+j+"\">" + b[j].innerText + "</a></li>");
	}
	document.write("</ul>");
}
	</script>
</ul></div>
</div>
{/literal}
</a>
{literal}
<div class="article-survey-container">
<!-- start feedwind code --><script type="text/javascript">(function() {var params = {rssmikle_url: "https://github.com/bluesura/bluesura.github.io/commits/master.atom",rssmikle_frame_width: "100%",rssmikle_frame_height: "100%",frame_height_by_article: "5",rssmikle_target: "_blank",rssmikle_font: "'Roboto', '游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Verdana, 'メイリオ', Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;",rssmikle_font_size: "",rssmikle_border: "off",responsive: "on",rssmikle_css_url: "",text_align: "left",text_align2: "left",corner: "off",scrollbar: "off",autoscroll: "off",scrolldirection: "up",scrollstep: "3",mcspeed: "20",sort: "New",rssmikle_title: "on",rssmikle_title_sentence: "更新履歴",rssmikle_title_link: "",rssmikle_title_bgcolor: "#FFFFFF",rssmikle_title_color: "#383838",rssmikle_title_bgimage: "",rssmikle_item_bgcolor: "#FFFFFF",rssmikle_item_bgimage: "",rssmikle_item_title_length: "55",rssmikle_item_title_color: "#3367D6",rssmikle_item_border_bottom: "off",rssmikle_item_description: "off",item_link: "off",rssmikle_item_description_length: "150",rssmikle_item_description_color: "#383838",rssmikle_item_date: "ja",rssmikle_timezone: "Etc/GMT",datetime_format: "",item_description_style: "text",item_thumbnail: "full",item_thumbnail_selection: "auto",article_num: "5",rssmikle_item_podcast: "off",keyword_inc: "",keyword_exc: ""};feedwind_show_widget_iframe(params);})();</script><!--  end  feedwind code -->
</div>
{/literal}



{*<!--
<div>
{literal}
	<a class="twitter-timeline" href="https://twitter.com/bluesura" data-widget-id="283962985054093312">@bluesura からのツイート</a>
	<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
{/literal}
</div>
-->*}

<div id="survey" class="article-survey-container">
<div class="as"><div class="title">この記事は役に立ちましたか？</div><button id="survey-yes" class="as-button" type="button" onclick="document.getElementById('survey').innerHTML = '<div class=\'as\'><div class=\'title\'>貴重なご意見をお寄せいただきありがとうございます。</div></div>';">はい</button><button id="survey-no" class="as-button" type="button" onclick="document.getElementById('survey').innerHTML='<iframe src=\'https://docs.google.com/forms/d/1UmHOKn96QQogYHWl_WrxdYyUaeYV8gBwvec52bxjDPk/viewform?embedded=true\' width=\'100%\' height=\'1000\' frameborder=\'0\' marginheight=\'0\' marginwidth=\'0\'>読み込んでいます...</iframe>';">いいえ</button></div>
</div>

<div id="feedback" class="article-survey-container">
<div class="as"><div class="title">ご意見・ご要望はございますか？</div><button id="feedback-yes" class="as-button" type="button" onclick="document.getElementById('feedback').innerHTML = '<iframe id=\'feedback\' src=\'https://docs.google.com/forms/d/1dafgc1TPGiLt4h9Mx_nlikml4QxKWL8a4PkMBCOMqi8/viewform?embedded=true\' width=\'100%\' height=\'900\' frameborder=\'0\' marginheight=\'0\' marginwidth=\'0\'>読み込んでいます...</iframe>';">はい</button><button id="feedback-no" class="as-button" type="button" onclick="document.getElementById('feedback').innerHTML = '<div class=\'as\'><div class=\'title\'>(*´ω｀*)</div></div>';">いいえ</button></div>
</div>



<div id="recruit" class="article-survey-container">

<div class="title">記事に不備があった場合</div>
<p>不備があれば<a href="https://github.com/bluesura/bluesura.github.io/issues">Github</a>・<a href="https://twitter.com/bluesura">Twitter</a>・<a href="mailto:suteadddayov@gmail.com">suteadddayov@gmail.com</a>にご報告下さい。</p>

<div class="title">記事を編集してみませんか？</div>
<p>ページ編集・翻訳にご協力いただける方を募集しております。お気軽にご連絡下さい。</p><p>We are looking for someone who can cooperate on page editing / translation. Please feel free to contact us.</p>
</div>

</div>