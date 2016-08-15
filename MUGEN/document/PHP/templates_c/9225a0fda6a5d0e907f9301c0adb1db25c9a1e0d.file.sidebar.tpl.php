<?php /* Smarty version Smarty-3.1.12, created on 2016-08-15 04:17:56
         compiled from "F:\bluesura\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:276857b142743027d8-94391724%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '9225a0fda6a5d0e907f9301c0adb1db25c9a1e0d' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\sidebar.tpl',
      1 => 1471234670,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '276857b142743027d8-94391724',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_57b14274380d26_41912591',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57b14274380d26_41912591')) {function content_57b14274380d26_41912591($_smarty_tpl) {?>	<div id="box2" class="slideout-sidebar">
<div class="menu">
<?php if ($_smarty_tpl->tpl_vars['content']->value!=null){?>
	
<?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['sidebar']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
			<?php echo $_smarty_tpl->tpl_vars['temp']->value;?>

<?php } ?>
		
<?php }?>
</div>


<!-- start feedwind code --><script type="text/javascript">document.write('\x3Cscript type="text/javascript" src="' + ('https:' == document.location.protocol ? 'https://' : 'http://') + 'feed.mikle.com/js/rssmikle.js">\x3C/script>');</script><script type="text/javascript">(function() {var params = {rssmikle_url: "https://github.com/bluesura/bluesura.github.io/commits/master.atom",rssmikle_frame_width: "100%",rssmikle_frame_height: "100%",frame_height_by_article: "5",rssmikle_target: "_blank",rssmikle_font: "'Roboto', '游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Verdana, 'メイリオ', Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;",rssmikle_font_size: "",rssmikle_border: "off",responsive: "on",rssmikle_css_url: "",text_align: "left",text_align2: "left",corner: "off",scrollbar: "off",autoscroll: "off",scrolldirection: "up",scrollstep: "3",mcspeed: "20",sort: "New",rssmikle_title: "on",rssmikle_title_sentence: "New",rssmikle_title_link: "",rssmikle_title_bgcolor: "#1E88E5",rssmikle_title_color: "#FFFFFF",rssmikle_title_bgimage: "",rssmikle_item_bgcolor: "#FFFFFF",rssmikle_item_bgimage: "",rssmikle_item_title_length: "55",rssmikle_item_title_color: "#3367D6",rssmikle_item_border_bottom: "off",rssmikle_item_description: "on",item_link: "on",rssmikle_item_description_length: "150",rssmikle_item_description_color: "#383838",rssmikle_item_date: "ja",rssmikle_timezone: "Etc/GMT",datetime_format: "",item_description_style: "text",item_thumbnail: "full",item_thumbnail_selection: "auto",article_num: "5",rssmikle_item_podcast: "off",keyword_inc: "",keyword_exc: ""};feedwind_show_widget_iframe(params);})();</script><div style="font-size:10px; text-align:center; width:200px;"><a href="http://feed.mikle.com/" target="_blank" style="color:#CCCCCC;">RSS Feed Widget</a><!--Please display the above link in your web page according to Terms of Service.--></div><!--  end  feedwind code -->



<style>
.title {
  font-weight: bold;
}
.as .as-button {
  background-color: #fafafa;
  border: 0;
  border-radius: 3px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
  display: inline-block;
  line-height: 16px;
  margin: 6px 8px 6px 0;
  min-width: 88px;
  padding: 10px 0;
  text-align: center;
  text-transform: uppercase;
}
</style>
<div id="survey" class="article-survey-container">
<div class="as"><div class="title">この記事は役に立ちましたか？</div><button id="yes" class="as-button" type="button">はい</button><button id="no" class="as-button" type="button">いいえ</button></div>
</div>

<iframe id="feedback" src="https://docs.google.com/forms/d/1dafgc1TPGiLt4h9Mx_nlikml4QxKWL8a4PkMBCOMqi8/viewform?embedded=true" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます...</iframe>

<div><strong>問題点があれば<a href="https://github.com/bluesura/bluesura.github.io/issues">Github</a>・<a href="https://twitter.com/bluesura">Twitter</a>・<a href="mailto:suteadddayov@gmail.com">suteadddayov@gmail.com</a>にご報告下さい。また、ページ編集にご協力いただける方を募集しております。お気軽にご連絡下さい。Please report any problems to the <a href="https://github.com/bluesura/bluesura.github.io/issues">Github</a> · <a href="https://twitter.com/bluesura">Twitter</a> · <a href="mailto:suteadddayov@gmail.com">suteadddayov@gmail.com</a>. In addition, we are looking for the person who cooperate with page editing and translation. Please do not hesitate to contact me.</strong></div>

</div><?php }} ?>