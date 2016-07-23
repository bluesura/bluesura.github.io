<?php /* Smarty version Smarty-3.1.12, created on 2013-09-14 04:52:44
         compiled from ".\..\Lifebar\template\LifeBar_html.tpl" */ ?>
<?php /*%%SmartyHeaderCode:260865233eb9c3874c3-27225083%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '224d4525375f1517cf9051d7cc59684e1e96ad82' => 
    array (
      0 => '.\\..\\Lifebar\\template\\LifeBar_html.tpl',
      1 => 1365961794,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '260865233eb9c3874c3-27225083',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'all' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5233eb9c3e4bb9_97639313',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5233eb9c3e4bb9_97639313')) {function content_5233eb9c3e4bb9_97639313($_smarty_tpl) {?>﻿<!DOCTYPE HTML>
<html lang="ja-JP">
<head>

	<!-- 「チェス盤を引っくり返す！」 -->
	<meta charset="UTF-8">
	<meta name="robots" content="INDEX,FOLLOW" />
	<meta name="author" content="sura" />
	<meta name="title" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['all']->value['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 | M.U.G.E.N ライフバー 設定項目一覧 - Name = sura" />
	<meta name="description" content="" />
	<meta name="keywords" content="MUGEN" />
	<!-- 「駄目ね、全然駄目だわ」 -->

	<!-- ジョインジョイン OGP -->
	<meta property="og:url" content="http://analyticsfile.web.fc2.com/MUGEN/document/LifeBar/<?php echo $_smarty_tpl->tpl_vars['all']->value['title'];?>
.html" />
	<meta property="og:title" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['all']->value['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 | M.U.G.E.N ライフバー 設定項目一覧 - Name = sura" />
	<meta property="og:description" content="#" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="http://analyticsfile.web.fc2.com/MUGEN/document/LifeBar/img/profile_200.png" />
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:site_name" content="Name = sura" />
	<!-- もういい、ここまでだっ・・・ -->

	<!-- ドロー！ Twitter Cards -->
	<meta name="twitter:card" value="player" />
	<meta name="twitter:site" value="@bluesura" />
	<!-- ターンエンドだ！ -->

	<title><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['all']->value['title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 | M.U.G.E.N ライフバー 設定項目一覧</title>

	<link rel="shortcut icon" href="./../../../media/img/favicon.ico" />
	<link rel="stylesheet" href="./../lib/css/main.css?201303200000" />
	<script type="text/javascript" src="./../lib/js/google.js?201303200000"></script>

</head>
<body>
	<div class="body-container">
<header><div class="header">
	<hgroup>
		<div>
			<h1>M.U.G.E.N ライフバー設定項目一覧</h1>
			<h2>Name = sura</h2>
		</div>
	</hgroup>
	<nav>
		<div class="breadcrumb">
			<ul>
				<li><a href="/index.html" target="_top">Top Page</a></li>
				<span> >> </span>
				<li><a href="index.html" target="_top">LifeBar Document</a></li>
				<span> >> </span>
				<li><?php echo $_smarty_tpl->tpl_vars['all']->value['title'];?>
</li>
			</ul>
		</div>
	</nav>
</div></header>


		<div class="contents clearfix">
			<div class="sidebar">
				<?php echo $_smarty_tpl->tpl_vars['all']->value['categories'];?>


				<div class="search-engine">
					<gcse:searchbox-only></gcse:searchbox-only>
				</div>

					<div>
					
						<a class="twitter-timeline" href="https://twitter.com/bluesura" data-widget-id="283962985054093312">@bluesura からのツイート</a>
						<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
					
					</div>
			</div>

			<div class="content">
				<?php echo $_smarty_tpl->tpl_vars['all']->value['html'];?>

			</div>

		</div>
		<h4 class="footer">(*´ω｀*)</h4>
	</div>
</body>
</html>
<?php }} ?>