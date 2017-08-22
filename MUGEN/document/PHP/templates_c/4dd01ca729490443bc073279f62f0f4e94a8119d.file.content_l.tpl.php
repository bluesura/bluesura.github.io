<?php /* Smarty version Smarty-3.1.12, created on 2017-08-22 16:02:47
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\LifeBar\content_l.tpl" */ ?>
<?php /*%%SmartyHeaderCode:6743301295985635dd2b294-46261695%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4dd01ca729490443bc073279f62f0f4e94a8119d' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\LifeBar\\content_l.tpl',
      1 => 1503410540,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '6743301295985635dd2b294-46261695',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5985635dd7edf4_67003630',
  'variables' => 
  array (
    'content' => 0,
    'code' => 0,
    'array' => 0,
    'value' => 0,
    'type' => 0,
    'video' => 0,
    'image' => 0,
    'quote' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5985635dd7edf4_67003630')) {function content_5985635dd7edf4_67003630($_smarty_tpl) {?>  <p class="description" itemprop="articleBody"><?php echo $_smarty_tpl->tpl_vars['content']->value['description'];?>
</p>

<?php if ($_smarty_tpl->tpl_vars['content']->value['sample_code']!=null){?>
	<section id="SampleCode"><div class="section">
		<h2>設定可能なパラメータ一覧</h2>
		<div class="code">
		<ul>
				<?php  $_smarty_tpl->tpl_vars['code'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['sample_code']['code']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code']->key => $_smarty_tpl->tpl_vars['code']->value){
$_smarty_tpl->tpl_vars['code']->_loop = true;
?>
					<li><?php echo $_smarty_tpl->tpl_vars['code']->value;?>
</li>
				<?php } ?>
		</ul>
		</div>
	</div></section>
<?php }?>

<?php if ($_smarty_tpl->tpl_vars['content']->value['parameter']!=null){?>
	<section id="Parameter"><div class="section">
		<h2>パラメーター</h2>
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
				(<?php  $_smarty_tpl->tpl_vars['type'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['type']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['array']->value['type']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['type']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['type']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['type']->key => $_smarty_tpl->tpl_vars['type']->value){
$_smarty_tpl->tpl_vars['type']->_loop = true;
 $_smarty_tpl->tpl_vars['type']->iteration++;
 $_smarty_tpl->tpl_vars['type']->last = $_smarty_tpl->tpl_vars['type']->iteration === $_smarty_tpl->tpl_vars['type']->total;
?><?php if ($_smarty_tpl->tpl_vars['type']->value=="boolean"){?>0か1<?php }?><?php if ($_smarty_tpl->tpl_vars['type']->value=="int"){?>整数<?php }?><?php if ($_smarty_tpl->tpl_vars['type']->value=="float"){?>浮動小数点数<?php }?><?php if ($_smarty_tpl->tpl_vars['type']->value=="string"){?>文字列<?php }?><?php if ($_smarty_tpl->tpl_vars['type']->last!=true){?>, <?php }?><?php } ?>)
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
					<?php }elseif($_smarty_tpl->tpl_vars['array']->value['default_value']!=''){?>
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
	</div></section>
<?php }?>

<?php if ($_smarty_tpl->tpl_vars['content']->value['quote']!=null){?>
	<section id="Quote"><div class="section">
		<h2>引用記事</h2>
		<ul>
		<?php  $_smarty_tpl->tpl_vars['quote'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['quote']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['quote']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
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


<?php echo $_smarty_tpl->getSubTemplate ("./nav.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<?php }} ?>