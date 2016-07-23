<?php /* Smarty version Smarty-3.1.12, created on 2013-07-15 03:44:08
         compiled from ".\..\template\index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:190455117b35dd237d7-73307106%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '3022ad27ccaf8b50846dc85ad3d41b93910e83e7' => 
    array (
      0 => '.\\..\\template\\index.tpl',
      1 => 1373839949,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '190455117b35dd237d7-73307106',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5117b35ddd14c6_74887232',
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5117b35ddd14c6_74887232')) {function content_5117b35ddd14c6_74887232($_smarty_tpl) {?><!DOCTYPE HTML>
<html lang="ja-JP">
<head>
<?php echo $_smarty_tpl->getSubTemplate ("./head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</head>
<body>

<?php echo $_smarty_tpl->getSubTemplate ("./header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div class="contents clearfix">
	<div class="sidebar">
<?php echo $_smarty_tpl->getSubTemplate ("./sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>

	<div class="content">

		<h1>ステートコントローラー一覧</h1>
		<p></p>

<?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['categories']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
		<div>
			<h2><a href="./<?php echo $_smarty_tpl->tpl_vars['temp']->value['title'];?>
.html"><?php echo $_smarty_tpl->tpl_vars['temp']->value['title'];?>
</a></h2>
			<div><?php echo $_smarty_tpl->tpl_vars['temp']->value['description'];?>
</div>
		</div>
<?php } ?>

		<h2>お世話になったリンク一覧</h2>
		<div><ul>
			<li><a href="http://homotaro.s44.xrea.com/scr.htm" target="_blank">ステートコントローラー一覧</a><br /></li>
			<li><a href="http://homotaro.s44.xrea.com/etc.htm" target="_blank">その他</a><br /></li>
			<li><a href="http://homotaro.s44.xrea.com/tr.htm" target="_blank">Trigger reference</a><br /></li>
			<li><a href="http://homepage3.nifty.com/andil/mugen/" target="_blank">ADIのMUGENメモ</a><br /></li>
			<li><a href="http://mugenbinran.web.fc2.com/" target="_blank">MUGENの便覧</a><br /></li>
			<li><a href="http://kyoakumugenirc.blog61.fc2.com/" target="_blank">凶悪MUGEN_IRC_ログ倉庫</a><br /></li>
			<li><a href="http://kurogane452.g.ribbon.to/Filefyx/sctrls.html" target="_blank">東方夢幻館</a><br /></li>
			<li><a href="http://elecbyte.com/wiki/index.php/Category:State_Controllers" target="_blank">elecbyte</a><br /></li>
			<li><a href="http://www.purple.dti.ne.jp/earth/mugen/statebook/entranse.htm" target="_blank">地球の応接間</a><br /></li>
			<li><a href="http://web.archive.org/web/20090220031609/http://tukiken.hp.infoseek.co.jp/muge/cr/cns/cnsdef.html" target="_blank">CNSを作ってみよう…</a><br /></li>
			<li><a href="http://lunatic284.blog90.fc2.com/" target="_blank">lunaの倉庫</a><br /></li>
			<li><a href="http://yurusanae.blog98.fc2.com" target="_blank">絶対許早苗</a><br /></li>
			<li><a href="http://www.2500loops.com/lec-process.html" target="_blank">2500loops</a><br /></li>
			<li><a href="http://oki6761.blog23.fc2.com/blog-entry-1492.html" target="_blank">MUGENでやってはいけないこと　by熄癈人</a><br /></li>
		</ul></div>

	</div>



</div>

<div class="footer"><footer><p>(c) sura （*´ω｀*）</p></footer></div>

</body>
</html>
<?php }} ?>