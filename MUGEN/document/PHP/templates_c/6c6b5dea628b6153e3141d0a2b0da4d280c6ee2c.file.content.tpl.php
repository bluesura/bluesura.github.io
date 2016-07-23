<?php /* Smarty version Smarty-3.1.12, created on 2013-07-14 21:58:53
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\State\template\content.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2063351192961703589-63162005%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6c6b5dea628b6153e3141d0a2b0da4d280c6ee2c' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\State\\template\\content.tpl',
      1 => 1373839129,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2063351192961703589-63162005',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51192961a186a2_39616050',
  'variables' => 
  array (
    'content' => 0,
    'array' => 0,
    'value' => 0,
    'type' => 0,
    'min_value' => 0,
    'max_value' => 0,
    'possible_value' => 0,
    'default_value' => 0,
    'video' => 0,
    'image' => 0,
    'parameter' => 0,
    'qanda' => 0,
    'reference' => 0,
    'code_sample' => 0,
    'code' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51192961a186a2_39616050')) {function content_51192961a186a2_39616050($_smarty_tpl) {?>	<h1 id="<?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
">Type = <?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
</h1>
	<div class="description">
		<?php echo $_smarty_tpl->tpl_vars['content']->value['description'];?>

<?php if ($_smarty_tpl->tpl_vars['content']->value['images']!=array()){?>
<div class="image-frame"><im>
<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['images']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?>
<img src="./media/img/<?php echo $_smarty_tpl->tpl_vars['array']->value["src"];?>
" alt="<?php echo $_smarty_tpl->tpl_vars['array']->value["alt"];?>
" width="<?php echo $_smarty_tpl->tpl_vars['array']->value["width"];?>
" height="<?php echo $_smarty_tpl->tpl_vars['array']->value["height"];?>
">
<?php } ?>
</div>
<?php }?>
	</div>

	<?php if ($_smarty_tpl->tpl_vars['content']->value['version']){?>
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
 $_from = $_smarty_tpl->tpl_vars['content']->value['version']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?>
				<tr>
					<td><?php echo $_smarty_tpl->tpl_vars['array']->value['no'];?>
</td>
					<td><?php echo $_smarty_tpl->tpl_vars['array']->value['content'];?>
</td>
				</tr>
			<?php } ?>
		</tbody>
		</table>
	</div></section>
	<?php }?>


	<section id="Parameter"><div class="section">
		<h2>パラメータ</h2>
		<?php if ($_smarty_tpl->tpl_vars['content']->value['parameter']==array()){?>
		<div>なし</div>
		<?php }else{ ?>
		<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
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
						<?php if ($_smarty_tpl->tpl_vars['array']->value['min_value']!=array('')){?>
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
						<?php if (($_smarty_tpl->tpl_vars['array']->value['min_value']!=array(''))&&($_smarty_tpl->tpl_vars['array']->value['max_value']!=array(''))){?>,<?php }?>
						<?php if ($_smarty_tpl->tpl_vars['array']->value['max_value']!=array('')){?>
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
					<?php if ($_smarty_tpl->tpl_vars['array']->value['parameter_type']=="required"){?>
					<div class="required-parameter">省略不可</div>
					<?php }elseif($_smarty_tpl->tpl_vars['array']->value['parameter_type']=="instead"){?>
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
						<div class="video image-frame">
							<div class="title"><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4"><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</a></div>
							<video controls="controls">
								<source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4" type="video/mp4" />
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
							<div class="image-frame"><img src="./media/img/<?php echo $_smarty_tpl->tpl_vars['image']->value['file'];?>
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

<?php echo $_smarty_tpl->getSubTemplate ("./content/DefaultParameter.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


	<section id="LoadParameter"><div class="section">
		<h2>パラメータの読み込み順</h2>
		<div class="code" contenteditable="true">
		<ul>
			<?php if ($_smarty_tpl->tpl_vars['content']->value['category']=="state"){?>
			<li>[State ,<?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
]</li>
			<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
</li>
			<li>Trigger1                   = 0</li>
			<?php }elseif($_smarty_tpl->tpl_vars['content']->value['category']=="statetype"){?>
			<li>[StateDef 『正の整数』,<?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
]</li>
			<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
</li>
			<?php }?>

			<?php if (isset($_smarty_tpl->tpl_vars['content']->value['parameter'][0]['parameter_type'])){?>
				<?php  $_smarty_tpl->tpl_vars['parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['parameter']->key => $_smarty_tpl->tpl_vars['parameter']->value){
$_smarty_tpl->tpl_vars['parameter']->_loop = true;
?>
					<li><?php echo $_smarty_tpl->tpl_vars['parameter']->value['parameter'];?>
<?php $_smarty_tpl->tpl_vars['loop'] = new Smarty_Variable;$_smarty_tpl->tpl_vars['loop']->step = 1;$_smarty_tpl->tpl_vars['loop']->total = (int)ceil(($_smarty_tpl->tpl_vars['loop']->step > 0 ? 27+1 - (1+preg_match_all('/[^\s]/',$_smarty_tpl->tpl_vars['parameter']->value['parameter'], $tmp)) : 1+preg_match_all('/[^\s]/',$_smarty_tpl->tpl_vars['parameter']->value['parameter'], $tmp)-(27)+1)/abs($_smarty_tpl->tpl_vars['loop']->step));
if ($_smarty_tpl->tpl_vars['loop']->total > 0){
for ($_smarty_tpl->tpl_vars['loop']->value = 1+preg_match_all('/[^\s]/',$_smarty_tpl->tpl_vars['parameter']->value['parameter'], $tmp), $_smarty_tpl->tpl_vars['loop']->iteration = 1;$_smarty_tpl->tpl_vars['loop']->iteration <= $_smarty_tpl->tpl_vars['loop']->total;$_smarty_tpl->tpl_vars['loop']->value += $_smarty_tpl->tpl_vars['loop']->step, $_smarty_tpl->tpl_vars['loop']->iteration++){
$_smarty_tpl->tpl_vars['loop']->first = $_smarty_tpl->tpl_vars['loop']->iteration == 1;$_smarty_tpl->tpl_vars['loop']->last = $_smarty_tpl->tpl_vars['loop']->iteration == $_smarty_tpl->tpl_vars['loop']->total;?> <?php }} ?>= <?php  $_smarty_tpl->tpl_vars['value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['parameter']->value['load_priority']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['value']->key => $_smarty_tpl->tpl_vars['value']->value){
$_smarty_tpl->tpl_vars['value']->_loop = true;
 $_smarty_tpl->tpl_vars['value']->iteration++;
 $_smarty_tpl->tpl_vars['value']->last = $_smarty_tpl->tpl_vars['value']->iteration === $_smarty_tpl->tpl_vars['value']->total;
?><?php echo $_smarty_tpl->tpl_vars['value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['value']->last!=true){?>, <?php }?><?php } ?></li>
				<?php } ?>

			<?php }elseif($_smarty_tpl->tpl_vars['content']->value['load_parameter']['parameter']!=array()){?>
				<?php  $_smarty_tpl->tpl_vars['parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['load_parameter']['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['parameter']->key => $_smarty_tpl->tpl_vars['parameter']->value){
$_smarty_tpl->tpl_vars['parameter']->_loop = true;
?>
					<li><?php echo $_smarty_tpl->tpl_vars['parameter']->value;?>
</li>
				<?php } ?>
			<?php }?>

			<?php if ($_smarty_tpl->tpl_vars['content']->value['category']=="state"){?>
			<li>Persistent                 = ?</li>
			<li>IgnoreHitPause             = ?</li>
			<?php }?>
		</ul>
		</div>
		<div class="supplement">*バージョンや実行環境,パラーメータの指定の仕方によって、読み込まれる順番が変わる可能性があります。参考程度なものだと思ってください。</div>
	</div></section>



	<?php if ($_smarty_tpl->tpl_vars['content']->value['qanda']){?>
	<section id="QandA"><div class="section">
		<h2>注意事項</h2>
		<?php  $_smarty_tpl->tpl_vars['qanda'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['qanda']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['qanda']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
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

	<?php if ($_smarty_tpl->tpl_vars['content']->value['code_sample']){?>
	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
			<?php  $_smarty_tpl->tpl_vars['code_sample'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code_sample']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['code_sample']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code_sample']->key => $_smarty_tpl->tpl_vars['code_sample']->value){
$_smarty_tpl->tpl_vars['code_sample']->_loop = true;
?>
			<h3><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['title'];?>
</h3>
			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['description']!=''){?>
			<div class="description"><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['description'];?>
</div>
			<?php }?>
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
					<div class="video image-frame">
						<div class="title"><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4"><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</a></div>
						<video controls="controls">
							<source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
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
						<div class="image-frame"><img src="./media/img/<?php echo $_smarty_tpl->tpl_vars['image']->value['file'];?>
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
	

<?php echo $_smarty_tpl->getSubTemplate ("./content/Quote.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


	<section><div>
	<!--別にシェアして欲しいわけじゃないんだからねッ！-->
		<h2>(/ω・＼)</h2>
		<div>
<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_16x16_style">
<a class="addthis_button_twitter"></a>
<a class="addthis_button_hatena"></a>
<a class="addthis_button_facebook"></a>
<a class="addthis_button_tumblr"></a>
<a class="addthis_button_evernote"></a>
<a class="addthis_button_pocket"></a>
<a class="addthis_button_favorites"></a>
<a class="addthis_button_compact"></a><a class="addthis_counter addthis_bubble_style"></a>
</div>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=undefined"></script>
<!-- AddThis Button END -->
		</div>
	</div></section>
<?php }} ?>