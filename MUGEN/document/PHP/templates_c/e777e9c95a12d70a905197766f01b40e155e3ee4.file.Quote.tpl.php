<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:24
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\Trigger\content\Quote.tpl" */ ?>
<?php /*%%SmartyHeaderCode:15065863485f33ad14cb1641-06228697%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e777e9c95a12d70a905197766f01b40e155e3ee4' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\Trigger\\content\\Quote.tpl',
      1 => 1502022141,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '15065863485f33ad14cb1641-06228697',
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
  'unifunc' => 'content_5f33ad14ce4857_51634068',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad14ce4857_51634068')) {function content_5f33ad14ce4857_51634068($_smarty_tpl) {?>	<?php if ($_smarty_tpl->tpl_vars['content']->value['quote']){?>
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