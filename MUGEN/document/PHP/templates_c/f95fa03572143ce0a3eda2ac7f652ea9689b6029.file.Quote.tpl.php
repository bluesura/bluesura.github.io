<?php /* Smarty version Smarty-3.1.12, created on 2013-07-21 15:42:42
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\content\Quote.tpl" */ ?>
<?php /*%%SmartyHeaderCode:948551ec01721fcdf2-57812887%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f95fa03572143ce0a3eda2ac7f652ea9689b6029' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\content\\Quote.tpl',
      1 => 1373839040,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '948551ec01721fcdf2-57812887',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'quote' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51ec017221bd94_99095710',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51ec017221bd94_99095710')) {function content_51ec017221bd94_99095710($_smarty_tpl) {?>﻿	<?php if ($_smarty_tpl->tpl_vars['content']->value['quote']){?>
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