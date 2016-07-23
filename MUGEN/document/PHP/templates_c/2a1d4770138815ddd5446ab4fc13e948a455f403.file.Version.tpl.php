<?php /* Smarty version Smarty-3.1.12, created on 2016-01-11 18:27:19
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\content\Version.tpl" */ ?>
<?php /*%%SmartyHeaderCode:98555693f407b28e27-13922358%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '2a1d4770138815ddd5446ab4fc13e948a455f403' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\content\\Version.tpl',
      1 => 1452536833,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '98555693f407b28e27-13922358',
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
  'unifunc' => 'content_5693f407bcd6f5_24878422',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5693f407bcd6f5_24878422')) {function content_5693f407bcd6f5_24878422($_smarty_tpl) {?>﻿	<?php if ($_smarty_tpl->tpl_vars['content']->value['version']){?>
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