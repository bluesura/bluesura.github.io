<?php /* Smarty version Smarty-3.1.12, created on 2013-09-14 04:52:43
         compiled from ".\..\Lifebar\template\LifeBar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:318095233eb9b9801a5-83177986%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1f15299608874532800fa3c71ce0807dcda07f79' => 
    array (
      0 => '.\\..\\Lifebar\\template\\LifeBar.tpl',
      1 => 1365961831,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '318095233eb9b9801a5-83177986',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'all' => 0,
    'code' => 0,
    'array' => 0,
    'value' => 0,
    'type' => 0,
    'video' => 0,
    'image' => 0,
    'qanda' => 0,
    'reference' => 0,
    'code_sample' => 0,
    'quote' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5233eb9bc96755_16145940',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5233eb9bc96755_16145940')) {function content_5233eb9bc96755_16145940($_smarty_tpl) {?>﻿<!DOCTYPE HTML>
<html lang="ja-JP">
<head>

	<!-- 「チェス盤を引っくり返す！」 -->
	<meta charset="UTF-8" />
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
				<li><?php echo $_smarty_tpl->tpl_vars['all']->value['group'];?>
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
				<h1 id="<?php echo $_smarty_tpl->tpl_vars['all']->value['title'];?>
"><?php echo $_smarty_tpl->tpl_vars['all']->value['group'];?>
</h1>
				<p class="description"><?php echo $_smarty_tpl->tpl_vars['all']->value['description'];?>
</p>

	<section id="SampleCode"><div class="section">
		<h2>設定可能なパラメータ一覧</h2>
		<div class="code">
		<ul>
			<?php if ($_smarty_tpl->tpl_vars['all']->value['sample_code']!=array()){?>
				<?php  $_smarty_tpl->tpl_vars['code'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['all']->value['sample_code']['code']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code']->key => $_smarty_tpl->tpl_vars['code']->value){
$_smarty_tpl->tpl_vars['code']->_loop = true;
?>
					<li><?php echo $_smarty_tpl->tpl_vars['code']->value;?>
</li>
				<?php } ?>
			<?php }?>
		</ul>
		</div>
	</div></section>


				<section id="Version"><div class="section">
					<h2>versionごとの変更点・バグ・エラー・仕様</h2>
					<?php if ($_smarty_tpl->tpl_vars['all']->value['version']==array()){?>
						<?php echo '<div>なし</div>';?>

					<?php }else{ ?>
					<table class="version">
					<thead>
						<tr>
							<th class="left">バージョン</th>
							<th class="right">内容</th>
						</tr>
					</thead>
					<tbody>
						<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['all']->value['version']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
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
					<?php }?>
				</div></section>

	<section id="Parameter"><div class="section">
		<h2>パラメーター</h2>
		<?php if ($_smarty_tpl->tpl_vars['all']->value['parameter']==array()){?>
		<div>なし</div>
		<?php }else{ ?>
		<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['all']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?>
		<dl class="parameter">
			<dt>
				<span class="main" id="<?php echo $_smarty_tpl->tpl_vars['array']->value['parameter'];?>
"><?php echo $_smarty_tpl->tpl_vars['array']->value['parameter'];?>
 = <?php  $_smarty_tpl->tpl_vars['value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['value']->key => $_smarty_tpl->tpl_vars['value']->value){
$_smarty_tpl->tpl_vars['value']->_loop = true;
 $_smarty_tpl->tpl_vars['value']->iteration++;
 $_smarty_tpl->tpl_vars['value']->last = $_smarty_tpl->tpl_vars['value']->iteration === $_smarty_tpl->tpl_vars['value']->total;
?><?php echo $_smarty_tpl->tpl_vars['value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['value']->last!=true){?>, <?php }?><?php } ?></span>
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
				<a href="#" onclick="return false;">
					<?php echo $_smarty_tpl->tpl_vars['type']->value;?>
<?php if ($_smarty_tpl->tpl_vars['type']->last!=true){?>, <?php }?>
				</a>
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
						<span class="min-value">最小値: <?php echo $_smarty_tpl->tpl_vars['array']->value['min_value'];?>
</span>
						<?php }?>
						<?php if (($_smarty_tpl->tpl_vars['array']->value['min_value']!='')&&($_smarty_tpl->tpl_vars['array']->value['max_value']!='')){?>,<?php }?>
						<?php if ($_smarty_tpl->tpl_vars['array']->value['max_value']!=''){?>
						<span class="max-value">最大値: <?php echo $_smarty_tpl->tpl_vars['array']->value['max_value'];?>
</span>
						<?php }?>
					</div>
					<?php }?>
					<?php if ($_smarty_tpl->tpl_vars['array']->value['possible_value']!=''){?>
					<div class="possible-value">選択可能な文字列: <?php echo $_smarty_tpl->tpl_vars['array']->value['possible_value'];?>
</div>
					<?php }?>
					<?php if ($_smarty_tpl->tpl_vars['array']->value['default_value']=="required"){?>
					<div class="required-parameter">省略不可</div>
					<?php }elseif($_smarty_tpl->tpl_vars['array']->value['default_value']=="instead"){?>
					<div class="instead-parameter">代替書式</div>
					<?php }else{ ?>
					<div class="default-value">省略時のデフォルト値： <?php echo $_smarty_tpl->tpl_vars['array']->value['default_value'];?>
</div>
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


	<section id="QandA"><div class="section">
		<h2>注意事項</h2>
		<?php if ($_smarty_tpl->tpl_vars['all']->value['qanda']==array()){?>
		<div>なし</div>
		<?php }else{ ?>
		<?php  $_smarty_tpl->tpl_vars['qanda'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['qanda']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['all']->value['qanda']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
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
		<?php }?>
	</div></section>

	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
		<?php if ($_smarty_tpl->tpl_vars['all']->value['code_sample']==array()){?>
		<div>なし</div>
		<?php }else{ ?>
			<?php  $_smarty_tpl->tpl_vars['code_sample'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code_sample']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['all']->value['code_sample']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
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
		<?php }?>
	</div></section>

	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<?php if ($_smarty_tpl->tpl_vars['all']->value['quote']==array()){?>
			<?php echo '<div>なし</div>';?>

		<?php }else{ ?>
		<ul>
		<?php  $_smarty_tpl->tpl_vars['quote'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['quote']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['all']->value['quote']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['quote']->key => $_smarty_tpl->tpl_vars['quote']->value){
$_smarty_tpl->tpl_vars['quote']->_loop = true;
?>
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['quote']->value['url'];?>
" target="_blank"><?php echo $_smarty_tpl->tpl_vars['quote']->value['title'];?>
</a></li>
		<?php } ?>
		</ul>
		<?php }?>
	</div></section>
	</div>


			</div>

		</div>
		<h4 class="footer">(*´ω｀*)</h4>
	</div>
</body>
</html>
<?php }} ?>