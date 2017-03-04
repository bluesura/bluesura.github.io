<?php /* Smarty version Smarty-3.1.12, created on 2017-03-04 20:30:23
         compiled from "F:\bluesura\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2873258bb1af93837d7-79848856%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '9225a0fda6a5d0e907f9301c0adb1db25c9a1e0d' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\sidebar.tpl',
      1 => 1488659419,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2873258bb1af93837d7-79848856',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_58bb1af9406160_47494731',
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_58bb1af9406160_47494731')) {function content_58bb1af9406160_47494731($_smarty_tpl) {?><div id="box2" class="slideout-sidebar">

<div class="article-survey-container">
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
</div>


<div class="article-survey-container">
<!-- start feedwind code --><script type="text/javascript">(function() {var params = {rssmikle_url: "https://github.com/bluesura/bluesura.github.io/commits/master.atom",rssmikle_frame_width: "100%",rssmikle_frame_height: "100%",frame_height_by_article: "5",rssmikle_target: "_blank",rssmikle_font: "'Roboto', '游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Verdana, 'メイリオ', Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;",rssmikle_font_size: "",rssmikle_border: "off",responsive: "on",rssmikle_css_url: "",text_align: "left",text_align2: "left",corner: "off",scrollbar: "off",autoscroll: "off",scrolldirection: "up",scrollstep: "3",mcspeed: "20",sort: "New",rssmikle_title: "on",rssmikle_title_sentence: "更新履歴",rssmikle_title_link: "",rssmikle_title_bgcolor: "#1E88E5",rssmikle_title_color: "#FFFFFF",rssmikle_title_bgimage: "",rssmikle_item_bgcolor: "#FFFFFF",rssmikle_item_bgimage: "",rssmikle_item_title_length: "55",rssmikle_item_title_color: "#3367D6",rssmikle_item_border_bottom: "off",rssmikle_item_description: "on",item_link: "on",rssmikle_item_description_length: "150",rssmikle_item_description_color: "#383838",rssmikle_item_date: "ja",rssmikle_timezone: "Etc/GMT",datetime_format: "",item_description_style: "text",item_thumbnail: "full",item_thumbnail_selection: "auto",article_num: "5",rssmikle_item_podcast: "off",keyword_inc: "",keyword_exc: ""};feedwind_show_widget_iframe(params);})();</script><!--  end  feedwind code -->
</div>






<div id="survey" class="article-survey-container">
<div class="as"><div class="title">この記事は役に立ちましたか？</div><button id="survey-yes" class="as-button" type="button" onclick="document.getElementById('survey').innerHTML = '<div class=\'as\'><div class=\'title\'>貴重なご意見をお寄せいただきありがとうございます。</div></div>';">はい</button><button id="survey-no" class="as-button" type="button" onclick="document.getElementById('survey').innerHTML='<iframe src=\'https://docs.google.com/forms/d/1UmHOKn96QQogYHWl_WrxdYyUaeYV8gBwvec52bxjDPk/viewform?embedded=true\' width=\'100%\' height=\'1000\' frameborder=\'0\' marginheight=\'0\' marginwidth=\'0\'>読み込んでいます...</iframe>';">いいえ</button></div>
</div>

<div id="feedback" class="article-survey-container">
<div class="as"><div class="title">ご意見・ご要望はございますか？</div><button id="feedback-yes" class="as-button" type="button" onclick="document.getElementById('feedback').innerHTML = '<iframe id=\'feedback\' src=\'https://docs.google.com/forms/d/1dafgc1TPGiLt4h9Mx_nlikml4QxKWL8a4PkMBCOMqi8/viewform?embedded=true\' width=\'100%\' height=\'900\' frameborder=\'0\' marginheight=\'0\' marginwidth=\'0\'>読み込んでいます...</iframe>';">はい</button><button id="feedback-no" class="as-button" type="button" onclick="document.getElementById('feedback').innerHTML = '<div class=\'as\'><div class=\'title\'>(*´ω｀*)</div></div>';">いいえ</button></div>
</div>



<div id="recruit" class="article-survey-container">
<div class="title">記事を編集してみませんか？</div>
<p>問題点があれば<a href="https://github.com/bluesura/bluesura.github.io/issues">Github</a>・<a href="https://twitter.com/bluesura">Twitter</a>・<a href="mailto:suteadddayov@gmail.com">suteadddayov@gmail.com</a>にご報告下さい。また、ページ編集にご協力いただける方を募集しております。お気軽にご連絡下さい。Please report any problems to the <a href="https://github.com/bluesura/bluesura.github.io/issues">Github</a> · <a href="https://twitter.com/bluesura">Twitter</a> · <a href="mailto:suteadddayov@gmail.com">suteadddayov@gmail.com</a>. In addition, we are looking for the person who cooperate with page editing and translation. Please do not hesitate to contact me.</p>
</div>

</div><?php }} ?>