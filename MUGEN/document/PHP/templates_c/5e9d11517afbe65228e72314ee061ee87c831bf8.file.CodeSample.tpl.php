<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:07
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\CodeSample.tpl" */ ?>
<?php /*%%SmartyHeaderCode:7873257685f33ad03814980-33824473%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '5e9d11517afbe65228e72314ee061ee87c831bf8' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\CodeSample.tpl',
      1 => 1597219652,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '7873257685f33ad03814980-33824473',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'code_sample' => 0,
    'code' => 0,
    'video' => 0,
    'youtube' => 0,
    'image' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5f33ad03981586_51743346',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad03981586_51743346')) {function content_5f33ad03981586_51743346($_smarty_tpl) {?>	<?php if (!empty($_smarty_tpl->tpl_vars['content']->value['code_sample'])){?>
	<section id="CodeSample"><div class="section">
		<h2>コードサンプル</h2>
			<?php  $_smarty_tpl->tpl_vars['code_sample'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['code_sample']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['code_sample']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['code_sample']->key => $_smarty_tpl->tpl_vars['code_sample']->value){
$_smarty_tpl->tpl_vars['code_sample']->_loop = true;
?>
<div>
			<h3><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['title'];?>
</h3>
			<?php if (!empty($_smarty_tpl->tpl_vars['code_sample']->value['description'])){?>
			<div class="description"><?php echo $_smarty_tpl->tpl_vars['code_sample']->value['description'];?>
</div>
			<?php }?>
			<div class="code"><code>
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
			</code></div>
			<?php if (!empty($_smarty_tpl->tpl_vars['code_sample']->value['media'])){?>
			<div class="media">
				<?php if (!empty($_smarty_tpl->tpl_vars['code_sample']->value['media']['youtube'])){?>
				<div>
					<?php  $_smarty_tpl->tpl_vars['youtube'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['youtube']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['youtube']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['youtube']->key => $_smarty_tpl->tpl_vars['youtube']->value){
$_smarty_tpl->tpl_vars['youtube']->_loop = true;
?>
					<div><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</div>
					<div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;"><iframe style="position: absolute; top: 0;  left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/<?php echo $_smarty_tpl->tpl_vars['youtube']->value['file'];?>
" frameborder="0" allowfullscreen></iframe></div>
					<?php } ?>
				</div>
				<?php }?>
				<?php if (!empty($_smarty_tpl->tpl_vars['code_sample']->value['media']['video'])){?>
				<div class="video-group">
					<?php  $_smarty_tpl->tpl_vars['video'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['video']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['video']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['video']->key => $_smarty_tpl->tpl_vars['video']->value){
$_smarty_tpl->tpl_vars['video']->_loop = true;
?>
					<div><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</div>
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
				<?php if (!empty($_smarty_tpl->tpl_vars['code_sample']->value['media']['image'])){?>
				<div class="image-group">
					<?php  $_smarty_tpl->tpl_vars['image'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['image']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['image']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['image']->key => $_smarty_tpl->tpl_vars['image']->value){
$_smarty_tpl->tpl_vars['image']->_loop = true;
?>
					<div class="image">
						<div><?php echo $_smarty_tpl->tpl_vars['image']->value['title'];?>
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
</div><br>
			<?php } ?>
	</div></section>
	<?php }?><?php }} ?>