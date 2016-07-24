<?php /* Smarty version Smarty-3.1.12, created on 2016-07-24 05:11:49
         compiled from "F:\bluesura\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1139157944e153ee1a2-42734368%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '9225a0fda6a5d0e907f9301c0adb1db25c9a1e0d' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\sidebar.tpl',
      1 => 1469197141,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1139157944e153ee1a2-42734368',
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
  'unifunc' => 'content_57944e1541d067_49952077',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57944e1541d067_49952077')) {function content_57944e1541d067_49952077($_smarty_tpl) {?>	<div id="box2" class="slideout-sidebar">
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




<iframe src="https://docs.google.com/forms/d/1UmHOKn96QQogYHWl_WrxdYyUaeYV8gBwvec52bxjDPk/viewform?embedded=true" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます...</iframe>
</div><?php }} ?>