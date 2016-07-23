<?php /* Smarty version Smarty-3.1.12, created on 2015-04-11 19:42:42
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\Trigger\content\Parameter.tpl" */ ?>
<?php /*%%SmartyHeaderCode:19747552971b355faa6-91649823%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '98ed410bb284bdd0442ec9a889d35ba4338b1c0c' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\Trigger\\content\\Parameter.tpl',
      1 => 1428781243,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '19747552971b355faa6-91649823',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_552971b37778b6_99654175',
  'variables' => 
  array (
    'content' => 0,
    'array' => 0,
    'type' => 0,
    'video' => 0,
    'image' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_552971b37778b6_99654175')) {function content_552971b37778b6_99654175($_smarty_tpl) {?>﻿	<section id="Parameter"><div class="section">
		<h2>パラメーター</h2>
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
	</div></section><?php }} ?>