<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:04
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:20081718095f33ad00931432-38397407%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '33585fb215b8b4267688cb8335aa3cb04157802c' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\index.tpl',
      1 => 1510590123,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '20081718095f33ad00931432-38397407',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
    'parameter' => 0,
    'syntax' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5f33ad009c8790_73642855',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad009c8790_73642855')) {function content_5f33ad009c8790_73642855($_smarty_tpl) {?><div id="main-inner">
<article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">

<?php if ($_smarty_tpl->tpl_vars['content']->value['page_category']=="State"){?>
<header class="entry-header"><div class="entry-title"><h1>ステートコントローラー一覧</h1></div></header>

<div class="entry-content"><?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['categories']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
			<div class="section">
			<h2><a href="./<?php echo $_smarty_tpl->tpl_vars['temp']->value['page_subtitle'];?>
.html"><?php echo $_smarty_tpl->tpl_vars['temp']->value['page_subtitle'];?>
</a></h2>
			<div><?php echo $_smarty_tpl->tpl_vars['temp']->value['description'];?>
</div>
			<div class="code" contenteditable="true">
				<ul>
					<?php if ($_smarty_tpl->tpl_vars['temp']->value['category']=="state"){?>
					<li>[State ]</li>
					<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['temp']->value['page_subtitle'];?>
</li>
					<li>Trigger1                   = 1</li>
					<?php }elseif($_smarty_tpl->tpl_vars['temp']->value['category']=="statetype"){?>
					<li>[StateDef 『正の整数』]</li>
					<?php }?>

					<?php  $_smarty_tpl->tpl_vars['parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['temp']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['parameter']->key => $_smarty_tpl->tpl_vars['parameter']->value){
$_smarty_tpl->tpl_vars['parameter']->_loop = true;
?>
						<li><?php echo $_smarty_tpl->tpl_vars['parameter']->value;?>
</li>
					<?php } ?>

					<?php if ($_smarty_tpl->tpl_vars['temp']->value['category']=="state"){?>
					<li>Persistent                 = ?</li>
					<li>IgnoreHitPause             = ?</li>
					<?php }?>
				</ul>
			</div>
		</div>
<?php } ?><?php echo $_smarty_tpl->getSubTemplate ("./thanks.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php echo $_smarty_tpl->getSubTemplate ("./nav.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
</div>


<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page_category']=="Trigger"){?>
<header class="entry-header"><div class="entry-title"><h1>トリガー一覧</h1></div></header>
<div class="entry-content">
<?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['categories']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
		<div class="section">
			<h2><a href="./<?php echo $_smarty_tpl->tpl_vars['temp']->value['page_subtitle'];?>
.html"><?php echo $_smarty_tpl->tpl_vars['temp']->value['page_subtitle'];?>
</a></h2>
			<div><?php echo $_smarty_tpl->tpl_vars['temp']->value['description'];?>
</div>
			<div class="code" contenteditable="true">
				<ul>
					<?php  $_smarty_tpl->tpl_vars['syntax'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['syntax']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['temp']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['syntax']->key => $_smarty_tpl->tpl_vars['syntax']->value){
$_smarty_tpl->tpl_vars['syntax']->_loop = true;
?>
						<li><?php echo $_smarty_tpl->tpl_vars['syntax']->value;?>
</li>
					<?php } ?>
				</ul>
			</div>
		</div>
<?php } ?><?php echo $_smarty_tpl->getSubTemplate ("./thanks.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php echo $_smarty_tpl->getSubTemplate ("./nav.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
</div>

<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page_category']=="Lifebar"){?>
<div class="entry-content">
<div class="section">
<?php echo $_smarty_tpl->tpl_vars['content']->value['html'];?>

<?php echo $_smarty_tpl->getSubTemplate ("./nav.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</div>
</div>
<?php }?>

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-ex+6c-2-c9+mp"
     data-ad-client="ca-pub-9960110085246197"
     data-ad-slot="8121105860"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

</article></div><?php }} ?>