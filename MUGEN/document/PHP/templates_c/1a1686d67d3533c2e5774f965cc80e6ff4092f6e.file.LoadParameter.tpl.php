<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:07
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\LoadParameter.tpl" */ ?>
<?php /*%%SmartyHeaderCode:14396515245f33ad03e5b829-35905639%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1a1686d67d3533c2e5774f965cc80e6ff4092f6e' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\LoadParameter.tpl',
      1 => 1597218903,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '14396515245f33ad03e5b829-35905639',
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
  'unifunc' => 'content_5f33ad03e80ba5_25569958',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad03e80ba5_25569958')) {function content_5f33ad03e80ba5_25569958($_smarty_tpl) {?>	<section id="LoadParameter"><div class="section">
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

		<div class="supplement"><br>*バージョンや実行環境,パラーメーターの指定の仕方によって、読み込まれる順番が変わる可能性があります。参考程度なものだと思ってください。</div>

	</div></section>
<?php }} ?>