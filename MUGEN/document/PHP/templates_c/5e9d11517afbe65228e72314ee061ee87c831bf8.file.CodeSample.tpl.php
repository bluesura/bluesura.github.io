<?php /* Smarty version Smarty-3.1.12, created on 2017-08-06 14:24:53
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\CodeSample.tpl" */ ?>
<?php /*%%SmartyHeaderCode:296031832598563570e44c1-23673423%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '5e9d11517afbe65228e72314ee061ee87c831bf8' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\CodeSample.tpl',
      1 => 1502022278,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '296031832598563570e44c1-23673423',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5985635711bde0_78637150',
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
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5985635711bde0_78637150')) {function content_5985635711bde0_78637150($_smarty_tpl) {?>	<?php if ($_smarty_tpl->tpl_vars['content']->value['code_sample']){?>
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
			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['description']!=''){?>
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
			<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']!=null){?>
			<div class="media">
				<?php if ($_smarty_tpl->tpl_vars['code_sample']->value['media']['youtube']!=array()){?>
				<div>
					<?php  $_smarty_tpl->tpl_vars['youtube'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['youtube']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['code_sample']->value['media']['youtube']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['youtube']->key => $_smarty_tpl->tpl_vars['youtube']->value){
$_smarty_tpl->tpl_vars['youtube']->_loop = true;
?>
					<h4><?php echo $_smarty_tpl->tpl_vars['video']->value['title'];?>
</h4>
					<div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;"><iframe style="position: absolute; top: 0;  left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/<?php echo $_smarty_tpl->tpl_vars['youtube']->value['file'];?>
" frameborder="0" allowfullscreen></iframe></div>
					<?php } ?>
				</div>
				<?php }?>
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
</div><br>
			<?php } ?>
	</div></section>
	<?php }?><?php }} ?>