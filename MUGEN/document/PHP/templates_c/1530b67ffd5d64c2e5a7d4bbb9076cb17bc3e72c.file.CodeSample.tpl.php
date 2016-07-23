<?php /* Smarty version Smarty-3.1.12, created on 2015-04-29 11:51:49
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\Trigger\content\CodeSample.tpl" */ ?>
<?php /*%%SmartyHeaderCode:89555296d45ef8233-03243992%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1530b67ffd5d64c2e5a7d4bbb9076cb17bc3e72c' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\Trigger\\content\\CodeSample.tpl',
      1 => 1430308298,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '89555296d45ef8233-03243992',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_55296d4608dff3_75689324',
  'variables' => 
  array (
    'content' => 0,
    'code_sample' => 0,
    'code' => 0,
    'video' => 0,
    'image' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_55296d4608dff3_75689324')) {function content_55296d4608dff3_75689324($_smarty_tpl) {?>﻿	<?php if ($_smarty_tpl->tpl_vars['content']->value['code_sample']){?>
	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
			<?php  $_smarty_tpl->tpl_vars['code_sample'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code_sample']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['code_sample']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code_sample']->key => $_smarty_tpl->tpl_vars['code_sample']->value){
$_smarty_tpl->tpl_vars['code_sample']->_loop = true;
?>
<div>
			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['title']!=null){?><h3><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['title'];?>
</h3><?php }?>
			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['description']!=''){?>
			<div class="description"><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['description'];?>
</div>
			<?php }?>
			<div class="code"><code><ul>
			<?php  $_smarty_tpl->tpl_vars['code'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['code']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code']->key => $_smarty_tpl->tpl_vars['code']->value){
$_smarty_tpl->tpl_vars['code']->_loop = true;
?>
				<li><?php echo $_smarty_tpl->tpl_vars['code']->value;?>
</li>
			<?php } ?>
			</ul></code></div>

			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']!=null){?>
			<div class="media">
				<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']['video']!=array()){?>
				<div class="video-group">
					<?php  $_smarty_tpl->tpl_vars['video'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['video']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['video']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['video']->key => $_smarty_tpl->tpl_vars['video']->value){
$_smarty_tpl->tpl_vars['video']->_loop = true;
?>
					<h4><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</h4>
					<div class="video image-frame">
						<video controls="controls">
							<source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
						</video>
						<div><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/<?php echo $_smarty_tpl->tpl_vars['video']->value['file'];?>
.mp4">動画が再生できない時はここをクリック。</a></div>
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
						<h4><?php echo $_smarty_tpl->tpl_vars['image']->value['title'];?>
</h4>
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
</div>
			<?php } ?>
	</div></section>
	<?php }?><?php }} ?>