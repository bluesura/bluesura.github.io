<?php /* Smarty version Smarty-3.1.12, created on 2013-02-11 18:05:01
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\State\template\content\quote.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1457451192ad864fe83-82318136%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '908d962acf4b120b38054e2b23344e492afa26b4' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\State\\template\\content\\quote.tpl',
      1 => 1360604614,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1457451192ad864fe83-82318136',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51192ad866c428_05504602',
  'variables' => 
  array (
    'content' => 0,
    'quote' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51192ad866c428_05504602')) {function content_51192ad866c428_05504602($_smarty_tpl) {?>﻿	<?php if ($_smarty_tpl->tpl_vars['content']->value['quote']){?>
	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<ul>
		<?php  $_smarty_tpl->tpl_vars['quote'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['quote']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['quote']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['quote']->key => $_smarty_tpl->tpl_vars['quote']->value){
$_smarty_tpl->tpl_vars['quote']->_loop = true;
?>
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['quote']->value['url'];?>
" target="_blank" rel="external"><?php echo $_smarty_tpl->tpl_vars['quote']->value['title'];?>
</a></li>
		<?php } ?>
		</ul>
	</div></section>
	<?php }?><?php }} ?>