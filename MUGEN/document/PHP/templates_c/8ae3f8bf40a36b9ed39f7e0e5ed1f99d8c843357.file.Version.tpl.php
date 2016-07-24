<?php /* Smarty version Smarty-3.1.12, created on 2016-07-24 05:11:49
         compiled from "F:\bluesura\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\Version.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2693657944e15775234-54673040%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '8ae3f8bf40a36b9ed39f7e0e5ed1f99d8c843357' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\Version.tpl',
      1 => 1452536833,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2693657944e15775234-54673040',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'array' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_57944e157932c1_68886399',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57944e157932c1_68886399')) {function content_57944e157932c1_68886399($_smarty_tpl) {?>﻿	<?php if ($_smarty_tpl->tpl_vars['content']->value['version']){?>
	<section id="Version"><div class="section">
		<h2>バージョンごとの変更点・バグ・エラー・仕様</h2>
		<table>
			<thead>
				<tr><th></th><th>内容</th></tr>
			</thead>
			<tbody>
				<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['version']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?>
					<tr><td><?php echo $_smarty_tpl->tpl_vars['array']->value['no'];?>
</td><td><?php echo $_smarty_tpl->tpl_vars['array']->value['content'];?>
</td></tr>
				<?php } ?>
			</tbody>
		</table>
	</div></section>
	<?php }?><?php }} ?>