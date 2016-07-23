<?php /* Smarty version Smarty-3.1.12, created on 2015-04-11 17:51:03
         compiled from ".\..\Template\base_trigger.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2913755295b00a5b431-69203368%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f2ff3f57e2bdfcdd92edf23419f74b3e0d4be38b' => 
    array (
      0 => '.\\..\\Template\\base_trigger.tpl',
      1 => 1428774522,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2913755295b00a5b431-69203368',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_55295b00aecd37_42053456',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_55295b00aecd37_42053456')) {function content_55295b00aecd37_42053456($_smarty_tpl) {?><!DOCTYPE html>
<html lang="ja-JP" prefix="og: http://ogp.me/ns# fb: http://www.facebook.com/2008/fbml">
<head>
<?php echo $_smarty_tpl->getSubTemplate ("./head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</head>
<body>

<?php echo $_smarty_tpl->getSubTemplate ("./header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div class="contents clearfix">
<main>
	<div class="content">
<?php echo $_smarty_tpl->getSubTemplate ("./Trigger/content.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>
</main>

	<div class="sidebar">
<?php echo $_smarty_tpl->getSubTemplate ("./sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>


</div>

<?php echo $_smarty_tpl->getSubTemplate ("./footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


</body>
</html>
<?php }} ?>