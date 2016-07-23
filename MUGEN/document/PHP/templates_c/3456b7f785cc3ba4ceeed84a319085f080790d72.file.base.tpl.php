<?php /* Smarty version Smarty-3.1.12, created on 2013-07-07 13:44:24
         compiled from ".\..\template\base.tpl" */ ?>
<?php /*%%SmartyHeaderCode:9018511917b3982799-15360273%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '3456b7f785cc3ba4ceeed84a319085f080790d72' => 
    array (
      0 => '.\\..\\template\\base.tpl',
      1 => 1373204658,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '9018511917b3982799-15360273',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_511917b3a0dc59_25608539',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_511917b3a0dc59_25608539')) {function content_511917b3a0dc59_25608539($_smarty_tpl) {?><!DOCTYPE html>
<html lang="ja-JP" prefix="og: http://ogp.me/ns# fb: http://www.facebook.com/2008/fbml">
<head>
<?php echo $_smarty_tpl->getSubTemplate ("./head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</head>
<body>

<?php echo $_smarty_tpl->getSubTemplate ("./header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div class="contents clearfix">
	<div class="sidebar">
<?php echo $_smarty_tpl->getSubTemplate ("./sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>

<main>
	<div class="content">
<?php echo $_smarty_tpl->getSubTemplate ("./content.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>
</main>


</div>

<div class="footer"><footer><p>(c) sura （*´ω｀*）</p></footer></div>

</body>
</html>
<?php }} ?>