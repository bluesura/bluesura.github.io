<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:08
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\Quote.tpl" */ ?>
<?php /*%%SmartyHeaderCode:7048419515f33ad0418b8e7-03557323%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1affa23f80ba7abaad7eeed332996269b44da4f0' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\Quote.tpl',
      1 => 1502022230,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '7048419515f33ad0418b8e7-03557323',
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
  'unifunc' => 'content_5f33ad041afe08_82857065',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad041afe08_82857065')) {function content_5f33ad041afe08_82857065($_smarty_tpl) {?>	<?php if ($_smarty_tpl->tpl_vars['content']->value['quote']){?>
	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<ul>
		<?php  $_smarty_tpl->tpl_vars['quote'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['quote']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['quote']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['quote']->key => $_smarty_tpl->tpl_vars['quote']->value){
$_smarty_tpl->tpl_vars['quote']->_loop = true;
?>
			<li><cite><a href="<?php echo $_smarty_tpl->tpl_vars['quote']->value['url'];?>
" target="_blank" rel="external"><?php echo $_smarty_tpl->tpl_vars['quote']->value['title'];?>
</a></cite></li>
		<?php } ?>
		</ul>
	</div></section>
	<?php }?><?php }} ?>