<?php /* Smarty version Smarty-3.1.12, created on 2015-12-19 10:08:02
         compiled from ".\..\Template\index_trigger.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2693656751e345febb7-93121570%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '316cc2dc596a573701ce8828bb2ddec9c601d2e1' => 
    array (
      0 => '.\\..\\Template\\index_trigger.tpl',
      1 => 1450519370,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2693656751e345febb7-93121570',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_56751e346fe085_67976746',
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
    'syntax' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_56751e346fe085_67976746')) {function content_56751e346fe085_67976746($_smarty_tpl) {?><!DOCTYPE HTML>
<html lang="ja-JP">
<head><?php echo $_smarty_tpl->getSubTemplate ("./head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
</head>

<body>
<?php echo $_smarty_tpl->getSubTemplate ("./header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div class="contents clearfix">
	<main><div class="content">
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
<?php } ?>

<?php echo $_smarty_tpl->getSubTemplate ("./thanks.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


	</div></main>

	<div class="sidebar">
<?php echo $_smarty_tpl->getSubTemplate ("./sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>

</div>

<?php echo $_smarty_tpl->getSubTemplate ("./footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


</body>
</html>
<?php }} ?>