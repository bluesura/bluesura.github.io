<?php /* Smarty version Smarty-3.1.12, created on 2015-04-11 19:10:43
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\Trigger\content\LoadParameter.tpl" */ ?>
<?php /*%%SmartyHeaderCode:18393552971b388eef8-32298741%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '88f64ba3b0b6c792934986ebf8c4102ec60d9934' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\Trigger\\content\\LoadParameter.tpl',
      1 => 1385218088,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '18393552971b388eef8-32298741',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'parameter' => 0,
    'value' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_552971b38b9bc8_22572480',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_552971b38b9bc8_22572480')) {function content_552971b38b9bc8_22572480($_smarty_tpl) {?>﻿	<section id="LoadParameter"><div class="section">
		<h2>パラメーターの読み込み順</h2>



		<div>
			<p>
<?php  $_smarty_tpl->tpl_vars['parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['parameter']->key => $_smarty_tpl->tpl_vars['parameter']->value){
$_smarty_tpl->tpl_vars['parameter']->_loop = true;
?>
				<?php echo $_smarty_tpl->tpl_vars['parameter']->value['parameter'];?>
(<?php  $_smarty_tpl->tpl_vars['value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['parameter']->value['load_priority']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['value']->key => $_smarty_tpl->tpl_vars['value']->value){
$_smarty_tpl->tpl_vars['value']->_loop = true;
 $_smarty_tpl->tpl_vars['value']->iteration++;
 $_smarty_tpl->tpl_vars['value']->last = $_smarty_tpl->tpl_vars['value']->iteration === $_smarty_tpl->tpl_vars['value']->total;
?><?php echo $_smarty_tpl->tpl_vars['value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['value']->last!=true){?>, <?php }?><?php } ?>) => 
<?php } ?>
			</p>
		</div>

		<div class="supplement">*？は未検証。適当に並べているだけです。<br>*バージョンや実行環境,パラーメーターの指定の仕方によって、読み込まれる順番が変わる可能性があります。参考程度なものだと思ってください。</div>

	</div></section>
<?php }} ?>