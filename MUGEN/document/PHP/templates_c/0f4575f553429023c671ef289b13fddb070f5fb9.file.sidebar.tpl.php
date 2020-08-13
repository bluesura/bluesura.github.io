<?php /* Smarty version Smarty-3.1.12, created on 2020-08-13 10:02:34
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:13805206095f33acffcf56d0-08050607%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '0f4575f553429023c671ef289b13fddb070f5fb9' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\sidebar.tpl',
      1 => 1597305741,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '13805206095f33acffcf56d0-08050607',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5f33acffd33067_31890571',
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33acffd33067_31890571')) {function content_5f33acffd33067_31890571($_smarty_tpl) {?><div id="box2" style="padding:0;width:324px;height:100%;">
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-89+1m-dq+ei+hz"
     data-ad-client="ca-pub-9960110085246197"
     data-ad-slot="1427349786"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>

<div id="box2">

<div class="article-survey-container">
<div class="toc" id="toc">
<div class="title">目次</div>
<ul style="">

	<script>
var a = document.getElementsByTagName("section");
for(var i = 0; i < a.length; i++) {
	document.write("<li style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\"><a href=\"#"+a[i].id+"\">" + a[i].getElementsByTagName("h2")[0].innerText + "</a></li>");
	var b = a[i].getElementsByTagName("h3");
	if (b.length == 0) {b = a[i].getElementsByTagName("dt");}
	document.write("<ul>");
	for(var j = 0; j < b.length; j++) {
		b[j].id=i+"-"+j;
		document.write("<li style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\"><a href=\"#"+i+"-"+j+"\">" + b[j].innerText.replace(/\s+.*$/,"") + "</a></li>");
	}
	document.write("</ul>");
}
	</script>

</ul></div>
</div>

</div>


<div id="box2">
<div class="article-survey-container">
  <div class="menu">
  <?php if (!empty($_smarty_tpl->tpl_vars['content']->value)){?>
    
  <?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['sidebar']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
        <?php echo $_smarty_tpl->tpl_vars['temp']->value;?>

  <?php } ?>
      
  <?php }?>
  </div>
</div>

</div>

<div id="box2">

<div class="mamewaza_blog"><div><div class="mamewaza_blog_exp"><span class="mamewaza_assembled">powered by <a href="http://mamewaza.com/tools/" target="_blank" rel="nofollow">まめわざ</a></span></div></div></div><script type="text/javascript" src="https://mamewaza.net/blog.js?200311"></script><script type="text/javascript">mamewaza_blog({selector:"#mamewaza_blog",feed:"https://github.com/bluesura/bluesura.github.io/commits/master.atom",rpp:"5",height:"auto",exp:true,url:false,date:"0",style:"div.mamewaza_blog > div{background-color:transparent;}div.mamewaza_blog ul.mamewaza_blog{background-color:transparent;}div.mamewaza_blog h5.mamewaza_blog,div.mamewaza_blog li,div.mamewaza_blog div.mamewaza_blog_exp{padding:10px;}div.mamewaza_blog > div{padding:0px;border:1px solid #eeeeee;font-size:12px;}div.mamewaza_blog h5.mamewaza_blog,div.mamewaza_blog ul.mamewaza_blog,div.mamewaza_blog li{border-bottom:1px solid #eeeeee;}div.mamewaza_blog h5.mamewaza_blog a,div.mamewaza_blog a.mamewaza_blog_title{color:#000;font-size:14px;text-shadow:none;}div.mamewaza_blog a.mamewaza_blog_title{font-weight:normal;}div.mamewaza_blog,div.mamewaza_blog a{color:#999999;}div.mamewaza_blog a.mamewaza_blog_url{color:#999999;}"})</script>

</div>






<div id="box2">
<div id="survey" class="article-survey-container">
<div class="as"><div class="title">この記事は役に立ちましたか？</div><button id="survey-yes" class="as-button" type="button" onclick="document.getElementById('survey').innerHTML = '<div class=\'as\'><div class=\'title\'>貴重なご意見をお寄せいただきありがとうございます。</div></div>';">はい</button><button id="survey-no" class="as-button" type="button" onclick="document.getElementById('survey').innerHTML='<iframe src=\'https://docs.google.com/forms/d/1UmHOKn96QQogYHWl_WrxdYyUaeYV8gBwvec52bxjDPk/viewform?embedded=true\' width=\'100%\' height=\'1000\' frameborder=\'0\' marginheight=\'0\' marginwidth=\'0\'>読み込んでいます...</iframe>';">いいえ</button></div>
</div>

<div id="feedback" class="article-survey-container">
<div class="as"><div class="title">ご意見・ご要望はございますか？</div><button id="feedback-yes" class="as-button" type="button" onclick="document.getElementById('feedback').innerHTML = '<iframe id=\'feedback\' src=\'https://docs.google.com/forms/d/1dafgc1TPGiLt4h9Mx_nlikml4QxKWL8a4PkMBCOMqi8/viewform?embedded=true\' width=\'100%\' height=\'900\' frameborder=\'0\' marginheight=\'0\' marginwidth=\'0\'>読み込んでいます...</iframe>';">はい</button><button id="feedback-no" class="as-button" type="button" onclick="document.getElementById('feedback').innerHTML = '<div class=\'as\'><div class=\'title\'>(*´ω｀*)</div></div>';">いいえ</button></div>
</div>



<div id="recruit" class="article-survey-container">
<div class="title">プロフィール</div>
<p>管理者：SURA(すら)</p>
<p>M.U.G.E.Nのリファレンスほそぼそと更新。本サイトは「なるべくわかりやすい」と「ない情報を集める」を目標にしています。詳しい動作を調べたい場合は<a href="https://www49.atwiki.jp/mugencns/">MUGEN CNS WIKI CHAOS@予定</a>をオススメします。</p>
<p>Twitter：<a href="https://twitter.com/bluesura">@bluesura</a></p>

<div class="title">記事に不備があった場合</div>
<p>不備があれば<a href="https://github.com/bluesura/bluesura.github.io/issues">Github</a>・<a href="https://twitter.com/bluesura">Twitter</a>・<a href="mailto:suteadddayov@gmail.com">suteadddayov@gmail.com</a>にご報告下さい。</p>

<div class="title">記事を編集してみませんか？</div>
<p>ページ編集・翻訳にご協力いただける方を募集しております。お気軽に<a href="https://twitter.com/bluesura">ご連絡</a>下さい。</p>
</div>

</div><?php }} ?>