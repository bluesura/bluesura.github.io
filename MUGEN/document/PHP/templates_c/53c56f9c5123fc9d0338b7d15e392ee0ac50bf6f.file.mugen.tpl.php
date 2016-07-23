<?php /* Smarty version Smarty-3.1.12, created on 2013-02-10 14:47:37
         compiled from ".\..\template\mugen.tpl" */ ?>
<?php /*%%SmartyHeaderCode:141725117b309894150-38305758%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '53c56f9c5123fc9d0338b7d15e392ee0ac50bf6f' => 
    array (
      0 => '.\\..\\template\\mugen.tpl',
      1 => 1360505228,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '141725117b309894150-38305758',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'state' => 0,
    'temp' => 0,
    'array' => 0,
    'required_parameter' => 0,
    'instead_parameter' => 0,
    'optional_parameter' => 0,
    'parameter' => 0,
    'value' => 0,
    'type' => 0,
    'min_value' => 0,
    'max_value' => 0,
    'possible_value' => 0,
    'default_value' => 0,
    'video' => 0,
    'image' => 0,
    'qanda' => 0,
    'reference' => 0,
    'code_sample' => 0,
    'code' => 0,
    'quote' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5117b309c86b40_43514141',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5117b309c86b40_43514141')) {function content_5117b309c86b40_43514141($_smarty_tpl) {?>﻿<!DOCTYPE HTML>
<html lang="ja-JP">
<head>

	<!-- 「チェス盤を引っくり返す！」 -->
	<meta charset="UTF-8">
	<meta name="robots" content="INDEX,FOLLOW">
	<meta name="viewport" content="width=device-width">
	<meta name="author" content="sura" />
	<meta name="copyright" content="sura">
	<meta name="generator" content="Notepad++ v6.2.2(UNICODE)">
	<meta name="title" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['state']->value['state'], ENT_QUOTES, 'ISO-8859-1', true);?>
 | M.U.G.E.N State Controller - Name = sura">
	<meta name="description" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['state']->value['description'], ENT_QUOTES, 'ISO-8859-1', true);?>
">
	<meta name="keywords" content="MUGEN">
	<!-- 「駄目ね、全然駄目だわ」 -->

	<!-- ジョインジョイン OGP -->
	<meta property="og:url" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/<?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
.html">
	<meta property="og:title" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['state']->value['state'], ENT_QUOTES, 'ISO-8859-1', true);?>
 | M.U.G.E.N State Controller - Name = sura">
	<meta property="og:description" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['state']->value['description'], ENT_QUOTES, 'ISO-8859-1', true);?>
">
	<meta property="og:type" content="website">
	<meta property="og:image" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/img/profile_200.png">
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:site_name" content="Name = sura">
	<!-- もういい、ここまでだっ・・・ -->

	<!-- ドロー！ Twitter Cards -->
	<meta name="twitter:card" value="player">
	<meta name="twitter:site" value="@bluesura">
	<!-- ターンエンドだ！ -->

	<title><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['state']->value['state'], ENT_QUOTES, 'ISO-8859-1', true);?>
 | M.U.G.E.N State Controller</title>

	<link rel="shortcut icon" href="./../../../media/img/favicon.ico">
	<link rel="stylesheet" href="./../lib/css/main.css?201302032143" />
	<script type="text/javascript" src="./lib/js/google.js?201302032143"></script>

</head>
<body>

<header><div class="header">
	<hgroup>
		<div>
			<h1>M.U.G.E.N State Controller</h1>
			<h2>Name = sura</h2>
		</div>
	</hgroup>
	<nav>
		<div class="breadcrumb">
			<ul>
				<li><a href="/index.html" target="_top">Top Page</a></li>
				<span> >> </span>
				<li><a href="./index.html" target="_top">State Controller Document</a></li>
				<span> >> </span>
				<li><?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
</li>
			</ul>
		</div>
	</nav>
</div></header>

<div class="contents clearfix">
	<div class="sidebar">

		<div class="categories">
			<?php if ($_smarty_tpl->tpl_vars['state']->value!=null){?>
			<ul>
			<?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['categories']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
				<li><a href="./<?php echo $_smarty_tpl->tpl_vars['temp']->value;?>
.html"><?php echo $_smarty_tpl->tpl_vars['temp']->value;?>
</a></li>
			<?php } ?>
			</ul>
			<?php }?>
		</div>

		<div class="search-engine">
			<gcse:searchbox-only></gcse:searchbox-only>
		</div>

		<div>
		
			<a class="twitter-timeline" href="https://twitter.com/bluesura" data-widget-id="283962985054093312">@bluesura からのツイート</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
		
		</div>

	</div>

	<div class="content">
	<h1 id="<?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
">Type = <?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
</h1>
	<p class="description"><?php echo $_smarty_tpl->tpl_vars['state']->value['description'];?>
</p>

	<?php if ($_smarty_tpl->tpl_vars['state']->value['version']){?>
	<section id="Version"><div class="section">
		<h2>versionごとの変更点・バグ・エラー・仕様</h2>
		<table class="version">
		<thead>
			<tr>
				<th class="left">バージョン</th>
				<th class="right">内容</th>
			</tr>
		</thead>
		<tbody>
			<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['version']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?>
				<?php echo '<tr>';?>

					<?php echo '<td>';?>
<?php echo $_smarty_tpl->tpl_vars['array']->value['no'];?>
<?php echo '</td>';?>

					<?php echo '<td>';?>
<?php echo $_smarty_tpl->tpl_vars['array']->value['content'];?>
<?php echo '</td>';?>

				<?php echo '</tr>';?>

			<?php } ?>
		</tbody>
		</table>
	</div></section>
	<?php }?>

	<section id="DefaultParameter"><div class="section">
		<h2>省略した時のデフォルト値</h2>
		<div class="code" contenteditable="true">
		<ul>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['category']=="state"){?>
			<li>[State ,<?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
]</li>
			<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
</li>
			<li>Trigger1                   = 1</li>
			<?php }elseif($_smarty_tpl->tpl_vars['state']->value['category']=="statetype"){?>
			<li>[StateDef 『正の整数』]</li>
			<?php }?>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['default_parameter']['required_parameter']!=array()){?>
				<?php  $_smarty_tpl->tpl_vars['required_parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['required_parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['default_parameter']['required_parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['required_parameter']->key => $_smarty_tpl->tpl_vars['required_parameter']->value){
$_smarty_tpl->tpl_vars['required_parameter']->_loop = true;
?>
					<li class="required-parameter"><?php echo $_smarty_tpl->tpl_vars['required_parameter']->value;?>
</li>
				<?php } ?>
			<?php }?>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['default_parameter']['instead_parameter']!=array()){?>
				<?php  $_smarty_tpl->tpl_vars['instead_parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['instead_parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['default_parameter']['instead_parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['instead_parameter']->key => $_smarty_tpl->tpl_vars['instead_parameter']->value){
$_smarty_tpl->tpl_vars['instead_parameter']->_loop = true;
?>
					<li class="instead-parameter"><?php echo $_smarty_tpl->tpl_vars['instead_parameter']->value;?>
</li>
				<?php } ?>
			<?php }?>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['default_parameter']['optional_parameter']!=array()){?>
				<?php  $_smarty_tpl->tpl_vars['optional_parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['optional_parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['default_parameter']['optional_parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['optional_parameter']->key => $_smarty_tpl->tpl_vars['optional_parameter']->value){
$_smarty_tpl->tpl_vars['optional_parameter']->_loop = true;
?>
					<li class="optional-parameter"><?php echo $_smarty_tpl->tpl_vars['optional_parameter']->value;?>
</li>
				<?php } ?>
			<?php }?>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['category']=="state"){?>
			<li class="optional-parameter">Persistent                 = 1</li>
			<li class="optional-parameter">IgnoreHitPause             = 0</li>
			<?php }?>
		</ul>
		</div>
		<div class="supplement">*<span class="optional-parameter">緑=記述が省略可能なパラメータ</span>, <span class="required-parameter">赤=省略できないパラメータ、省略するとエラー</span>, <span class="instead-parameter">紫=パラメータの代わりに使用出来る別のパラメータ</span></div>
	</div></section>

	<section id="LoadParameter"><div class="section">
		<h2>パラメータの読み込み順</h2>
		<div class="code" contenteditable="true">
		<ul>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['category']=="state"){?>
			<li>[State ,<?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
]</li>
			<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
</li>
			<li>Trigger1                   = 0</li>
			<?php }elseif($_smarty_tpl->tpl_vars['state']->value['category']=="statetype"){?>
			<li>[StateDef 『正の整数』,<?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
]</li>
			<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['state']->value['state'];?>
</li>
			<?php }?>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['load_parameter']['parameter']!=array()){?>
				<?php  $_smarty_tpl->tpl_vars['parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['load_parameter']['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['parameter']->key => $_smarty_tpl->tpl_vars['parameter']->value){
$_smarty_tpl->tpl_vars['parameter']->_loop = true;
?>
					<li><?php echo $_smarty_tpl->tpl_vars['parameter']->value;?>
</li>
				<?php } ?>
			<?php }?>
			<?php if ($_smarty_tpl->tpl_vars['state']->value['category']=="state"){?>
			<li class="optional-parameter">Persistent                 = ?</li>
			<li class="optional-parameter">IgnoreHitPause             = ?</li>
			<?php }?>
		</ul>
		</div>
		<div class="supplement">*バージョンや実行環境,パラーメータの指定の仕方によって、読み込まれる順番が変わる可能性があります。参考程度なものだと思ってください。</div>
	</div></section>


	<section id="Parameter"><div class="section">
		<h2>パラメータ</h2>
		<?php if ($_smarty_tpl->tpl_vars['state']->value['parameter']==array()){?>
		<div>なし</div>
		<?php }else{ ?>
		<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?>
		<dl class="parameter">
			<dt>
				<span class="main" id="<?php echo $_smarty_tpl->tpl_vars['array']->value['parameter'];?>
">
				<?php if ($_smarty_tpl->tpl_vars['array']->value['main']==''){?>
					<?php echo $_smarty_tpl->tpl_vars['array']->value['parameter'];?>
 = <?php  $_smarty_tpl->tpl_vars['value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['value']->key => $_smarty_tpl->tpl_vars['value']->value){
$_smarty_tpl->tpl_vars['value']->_loop = true;
 $_smarty_tpl->tpl_vars['value']->iteration++;
 $_smarty_tpl->tpl_vars['value']->last = $_smarty_tpl->tpl_vars['value']->iteration === $_smarty_tpl->tpl_vars['value']->total;
?><?php echo $_smarty_tpl->tpl_vars['value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['value']->last!=true){?>, <?php }?><?php } ?>
				<?php }else{ ?>
					<?php echo $_smarty_tpl->tpl_vars['array']->value['main'];?>

				<?php }?>
				</span>
				<span class="type">
				<?php  $_smarty_tpl->tpl_vars['type'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['type']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['type']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['type']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['type']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['type']->key => $_smarty_tpl->tpl_vars['type']->value){
$_smarty_tpl->tpl_vars['type']->_loop = true;
 $_smarty_tpl->tpl_vars['type']->iteration++;
 $_smarty_tpl->tpl_vars['type']->last = $_smarty_tpl->tpl_vars['type']->iteration === $_smarty_tpl->tpl_vars['type']->total;
?>
					<a href="#" onclick="return false;"><?php echo $_smarty_tpl->tpl_vars['type']->value;?>
<?php if ($_smarty_tpl->tpl_vars['type']->last!=true){?>, <?php }?></a>
				<?php } ?>
				</span>
			</dt>
			<dd>
				<div class="description"><?php echo $_smarty_tpl->tpl_vars['array']->value['description'];?>
</div>
				<div class="option-value">
					<?php if ($_smarty_tpl->tpl_vars['array']->value['min_value']!=''||$_smarty_tpl->tpl_vars['array']->value['max_value']!=''){?>
					<div class="range-value">
						<?php if ($_smarty_tpl->tpl_vars['array']->value['min_value']!=''){?>
						<span class="min-value">最小値: <?php  $_smarty_tpl->tpl_vars['min_value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['min_value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['min_value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['min_value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['min_value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['min_value']->key => $_smarty_tpl->tpl_vars['min_value']->value){
$_smarty_tpl->tpl_vars['min_value']->_loop = true;
 $_smarty_tpl->tpl_vars['min_value']->iteration++;
 $_smarty_tpl->tpl_vars['min_value']->last = $_smarty_tpl->tpl_vars['min_value']->iteration === $_smarty_tpl->tpl_vars['min_value']->total;
?><?php echo $_smarty_tpl->tpl_vars['min_value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['min_value']->last!=true){?>, <?php }?><?php } ?></span>
						<?php }?>
						<?php if (($_smarty_tpl->tpl_vars['array']->value['min_value']!='')&&($_smarty_tpl->tpl_vars['array']->value['max_value']!='')){?>,<?php }?>
						<?php if ($_smarty_tpl->tpl_vars['array']->value['max_value']!=''){?>
						<span class="max-value">最大値: <?php  $_smarty_tpl->tpl_vars['max_value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['max_value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['max_value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['max_value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['max_value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['max_value']->key => $_smarty_tpl->tpl_vars['max_value']->value){
$_smarty_tpl->tpl_vars['max_value']->_loop = true;
 $_smarty_tpl->tpl_vars['max_value']->iteration++;
 $_smarty_tpl->tpl_vars['max_value']->last = $_smarty_tpl->tpl_vars['max_value']->iteration === $_smarty_tpl->tpl_vars['max_value']->total;
?><?php echo $_smarty_tpl->tpl_vars['max_value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['max_value']->last!=true){?>, <?php }?><?php } ?></span>
						<?php }?>
					</div>
					<?php }?>
					<?php if ($_smarty_tpl->tpl_vars['array']->value['possible_value']!=''){?>
					<div class="possible-value">選択可能な文字列: <?php  $_smarty_tpl->tpl_vars['possible_value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['possible_value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['possible_value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['possible_value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['possible_value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['possible_value']->key => $_smarty_tpl->tpl_vars['possible_value']->value){
$_smarty_tpl->tpl_vars['possible_value']->_loop = true;
 $_smarty_tpl->tpl_vars['possible_value']->iteration++;
 $_smarty_tpl->tpl_vars['possible_value']->last = $_smarty_tpl->tpl_vars['possible_value']->iteration === $_smarty_tpl->tpl_vars['possible_value']->total;
?><?php echo $_smarty_tpl->tpl_vars['possible_value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['possible_value']->last!=true){?>, <?php }?><?php } ?></div>
					<?php }?>
					<?php if ($_smarty_tpl->tpl_vars['array']->value['default_value']=="required"){?>
					<div class="required-parameter">省略不可</div>
					<?php }elseif($_smarty_tpl->tpl_vars['array']->value['default_value']=="instead"){?>
					<div class="instead-parameter">代替書式</div>
					<?php }else{ ?>
					<div class="default-value">省略時のデフォルト値： <?php  $_smarty_tpl->tpl_vars['default_value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['default_value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['default_value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['default_value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['default_value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['default_value']->key => $_smarty_tpl->tpl_vars['default_value']->value){
$_smarty_tpl->tpl_vars['default_value']->_loop = true;
 $_smarty_tpl->tpl_vars['default_value']->iteration++;
 $_smarty_tpl->tpl_vars['default_value']->last = $_smarty_tpl->tpl_vars['default_value']->iteration === $_smarty_tpl->tpl_vars['default_value']->total;
?><?php echo $_smarty_tpl->tpl_vars['default_value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['default_value']->last!=true){?>, <?php }?><?php } ?></div>
					<?php }?>
				</div>
				<?php if ($_smarty_tpl->tpl_vars['array']->value['media']!=null){?>
				<div class="media">
					<?php if ($_smarty_tpl->tpl_vars['array']->value['media']['video']!=array()){?>
					<div class="video-group">
						<?php  $_smarty_tpl->tpl_vars['video'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['video']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['media']['video']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['video']->key => $_smarty_tpl->tpl_vars['video']->value){
$_smarty_tpl->tpl_vars['video']->_loop = true;
?>
						<div class="video">
							<div class="title"><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</div>
							<video controls="controls">
								<source src="./video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4" type="video/mp4" />
								<source src="./video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.webm" type="video/webm" />
								<source src="./video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.ogg" type="video/ogg" />
								<a href="./video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4">動画</a>
							</video>
						</div>
						<?php } ?>
					</div>
					<?php }?>					
					<?php if ($_smarty_tpl->tpl_vars['array']->value['media']['image']!=array()){?>
					<div class="image-group">
						<?php  $_smarty_tpl->tpl_vars['image'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['image']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['media']['image']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['image']->key => $_smarty_tpl->tpl_vars['image']->value){
$_smarty_tpl->tpl_vars['image']->_loop = true;
?>
						<div class="image">
							<div class="title"><?php echo $_smarty_tpl->tpl_vars['image']->value['title'];?>
</div>
							<div class="image-frame"><img src="./img/<?php echo $_smarty_tpl->tpl_vars['image']->value['file'];?>
" alt="<?php echo $_smarty_tpl->tpl_vars['image']->value['title'];?>
" width="<?php echo $_smarty_tpl->tpl_vars['image']->value['width'];?>
" height="<?php echo $_smarty_tpl->tpl_vars['image']->value['height'];?>
" /></div>
						</div>
						<?php } ?>
					</div>
					<?php }?>
				</div>
				<?php }?>
			</dd>
		</dl>
		<?php } ?>
		<?php }?>
	</div></section>

	<?php if ($_smarty_tpl->tpl_vars['state']->value['qanda']){?>
	<section id="QandA"><div class="section">
		<h2>注意事項</h2>
		<?php  $_smarty_tpl->tpl_vars['qanda'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['qanda']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['qanda']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['qanda']->key => $_smarty_tpl->tpl_vars['qanda']->value){
$_smarty_tpl->tpl_vars['qanda']->_loop = true;
?>
		<table class="qanda">
			<tr>
				<th class="question">Q</th>
				<td><?php echo $_smarty_tpl->tpl_vars['qanda']->value['q'];?>
</td>
			</tr>
			<tr>
				<th class="problem">?</th>
				<td><?php echo $_smarty_tpl->tpl_vars['qanda']->value['c'];?>
</td>
			</tr>
			<tr>
				<th class="answer">A</th>
				<td><?php echo $_smarty_tpl->tpl_vars['qanda']->value['a'];?>
</td>
			</tr>
			<tr>
				<th class="quote">"</th>
				<td>
				<?php if ($_smarty_tpl->tpl_vars['qanda']->value['r']!=null){?>
				<?php  $_smarty_tpl->tpl_vars['reference'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['reference']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['qanda']->value['r']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['reference']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['reference']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['reference']->key => $_smarty_tpl->tpl_vars['reference']->value){
$_smarty_tpl->tpl_vars['reference']->_loop = true;
 $_smarty_tpl->tpl_vars['reference']->iteration++;
 $_smarty_tpl->tpl_vars['reference']->last = $_smarty_tpl->tpl_vars['reference']->iteration === $_smarty_tpl->tpl_vars['reference']->total;
?>
					<a href="<?php echo $_smarty_tpl->tpl_vars['reference']->value['url'];?>
" target="_blank"><?php echo $_smarty_tpl->tpl_vars['reference']->value['title'];?>
</a>
					<?php if ($_smarty_tpl->tpl_vars['reference']->last!=true){?><br><?php }?>
				<?php } ?>
				<?php }?>
				</td>
			</tr>		
		</table>
		<?php } ?>
	</div></section>
	<?php }?>

	<?php if ($_smarty_tpl->tpl_vars['state']->value['code_sample']){?>
	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
			<?php  $_smarty_tpl->tpl_vars['code_sample'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code_sample']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['code_sample']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code_sample']->key => $_smarty_tpl->tpl_vars['code_sample']->value){
$_smarty_tpl->tpl_vars['code_sample']->_loop = true;
?>
			<h3><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['title'];?>
</h3>
			<div class="code">
			<ul>
			<?php  $_smarty_tpl->tpl_vars['code'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['code']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code']->key => $_smarty_tpl->tpl_vars['code']->value){
$_smarty_tpl->tpl_vars['code']->_loop = true;
?>
				<li><?php echo $_smarty_tpl->tpl_vars['code']->value;?>
</li>
			<?php } ?>
			</ul>
			</div>
			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']!=null){?>
			<div class="media">
				<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']['video']!=array()){?>
				<div class="video-group">
					<?php  $_smarty_tpl->tpl_vars['video'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['video']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['video']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['video']->key => $_smarty_tpl->tpl_vars['video']->value){
$_smarty_tpl->tpl_vars['video']->_loop = true;
?>
					<div class="video">
						<div class="title"><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</div>
						<video controls="controls">
							<source src="" type="video/webm; codecs='vp8, vorbis'" />
							<source src="./video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
							<source src="" type="video/ogg; codecs='theora, vorbis'" />
							<a href="./video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4">動画</a>
						</video>
					</div>
					<?php } ?>
				</div>
				<?php }?>					
				<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']['image']!=array()){?>
				<div class="image-group">
					<?php  $_smarty_tpl->tpl_vars['image'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['image']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['image']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['image']->key => $_smarty_tpl->tpl_vars['image']->value){
$_smarty_tpl->tpl_vars['image']->_loop = true;
?>
					<div class="image">
						<div class="title"><?php echo $_smarty_tpl->tpl_vars['image']->value['title'];?>
</div>
						<div class="image-frame"><img src="./img/<?php echo $_smarty_tpl->tpl_vars['image']->value['file'];?>
" alt="<?php echo $_smarty_tpl->tpl_vars['image']->value['title'];?>
" width="<?php echo $_smarty_tpl->tpl_vars['image']->value['width'];?>
" height="<?php echo $_smarty_tpl->tpl_vars['image']->value['height'];?>
" /></div>
					</div>
					<?php } ?>
				</div>
				<?php }?>
			</div>
			<?php }?>
			<?php } ?>
	</div></section>
	<?php }?>

	<?php if ($_smarty_tpl->tpl_vars['state']->value['quote']){?>
	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<ul>
		<?php  $_smarty_tpl->tpl_vars['quote'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['quote']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['state']->value['quote']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['quote']->key => $_smarty_tpl->tpl_vars['quote']->value){
$_smarty_tpl->tpl_vars['quote']->_loop = true;
?>
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['quote']->value['url'];?>
" target="_blank"><?php echo $_smarty_tpl->tpl_vars['quote']->value['title'];?>
</a></li>
		<?php } ?>
		</ul>
	</div></section>
	<?php }?>


	</div>


</div>

<div class="footer"><footer><p>(c) sura （*´ω｀*）</p></footer></div>

</body>
</html>
<?php }} ?>