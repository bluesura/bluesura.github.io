<?php /* Smarty version Smarty-3.1.12, created on 2013-07-18 16:32:01
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\State\template\head.tpl" */ ?>
<?php /*%%SmartyHeaderCode:298585119184ab5f714-47112203%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '56ecabe7b5998f643f7a05f1fe70236648ffff3f' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\State\\template\\head.tpl',
      1 => 1374165117,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '298585119184ab5f714-47112203',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5119184ac22922_75079371',
  'variables' => 
  array (
    'content' => 0,
    'state' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5119184ac22922_75079371')) {function content_5119184ac22922_75079371($_smarty_tpl) {?><?php if (!is_callable('smarty_modifier_date_format')) include 'C:\\libs\\php\\smarty\\plugins\\modifier.date_format.php';
?>	<meta charset="UTF-8" />

<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="1"){?>
	<title>Name = sura</title>
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
	<title><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 - Name = sura</title>
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
	<title>Type = <?php echo $_smarty_tpl->tpl_vars['content']->value['page']['subtitle'];?>
 | <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 - Name = sura</title>
<?php }?>
	<link rel="shortcut icon" href="./../../../media/img/favicon.ico" type="image/x-icon">

	<!-- 「チェス盤を引っくり返す！」 -->
	<meta name="robots" content="INDEX,FOLLOW" />
	<meta name="viewport" content="width=device-width" />
	<meta name="author" content="sura" />
	<meta name="generator" content="Notepad++ v6.2.2(UNICODE)" />
	<meta name="description" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['description'], ENT_QUOTES, 'ISO-8859-1', true);?>
" />
	<meta name="keywords" content="MUGEN, M.U.G.E.N, むげん, 無限, 夢幻" />
	<!-- 「駄目ね、全然駄目だわ」 -->

	<!-- ジョインジョイン OGP -->
	<meta property="og:url" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/<?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
.html" />
	<meta property="og:image" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/img/profile_200.png" />
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="1"){?>
	<meta property="og:title" content="Name = sura" />
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
	<meta property="og:title" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 - Name = sura" />
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
	<meta property="og:title" content="<?php echo $_smarty_tpl->tpl_vars['content']->value['page']['subtitle'];?>
 | <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 - Name = sura" />
<?php }?>
	<meta property="og:description" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['description'], ENT_QUOTES, 'ISO-8859-1', true);?>
" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:site_name" content="Name = sura" />
	<!-- もういい、ここまでだっ・・・ -->

	<!-- ドロー！ Twitter Cards --><!--
	<meta name="twitter:card" value="player" />
	<meta name="twitter:site" value="@bluesura" />
	--><!-- ターンエンドだ！ -->

	<link rel="author" title="sura" href="https://twitter.com/bluesura" />

	<link rel="stylesheet" href="./../lib/css/main.css?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
">
	<script type="text/javascript" src="./../lib/js/google.js?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
"></script>
	<script type="text/javascript" src="//code.jquery.com/jquery-git2.js"></script>
	<script type="text/javascript" src="./../lib/js/jquery.lazyload.min.js?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
"></script><?php }} ?>