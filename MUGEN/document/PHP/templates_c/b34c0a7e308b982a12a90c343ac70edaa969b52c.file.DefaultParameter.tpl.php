<?php /* Smarty version Smarty-3.1.12, created on 2015-04-11 19:10:43
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\Trigger\content\DefaultParameter.tpl" */ ?>
<?php /*%%SmartyHeaderCode:12832552971b379a419-92476571%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'b34c0a7e308b982a12a90c343ac70edaa969b52c' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\Trigger\\content\\DefaultParameter.tpl',
      1 => 1380984699,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '12832552971b379a419-92476571',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'parameter' => 0,
    'value' => 0,
    'required_parameter' => 0,
    'instead_parameter' => 0,
    'optional_parameter' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_552971b386a493_07505083',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_552971b386a493_07505083')) {function content_552971b386a493_07505083($_smarty_tpl) {?>﻿	<section id="DefaultParameter"><div class="section">
		<h2>省略した時のデフォルト値</h2>
		<div class="code" contenteditable="true">
		<ul>
			<?php if ($_smarty_tpl->tpl_vars['content']->value['category']=="state"){?>
			<li>[State ,<?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
]</li>
			<li>Type                       = <?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
</li>
			<li>Trigger1                   = 1</li>
			<?php }elseif($_smarty_tpl->tpl_vars['content']->value['category']=="statetype"){?>
			<li>[StateDef 『正の整数』]</li>
			<?php }?>
			<?php if (isset($_smarty_tpl->tpl_vars['content']->value['parameter'][0]['parameter_type'])){?>
				<?php  $_smarty_tpl->tpl_vars['parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['parameter']->key => $_smarty_tpl->tpl_vars['parameter']->value){
$_smarty_tpl->tpl_vars['parameter']->_loop = true;
?>
					<li class="<?php echo $_smarty_tpl->tpl_vars['parameter']->value['parameter_type'];?>
-parameter"><?php echo $_smarty_tpl->tpl_vars['parameter']->value['parameter'];?>
<?php $_smarty_tpl->tpl_vars['loop'] = new Smarty_Variable;$_smarty_tpl->tpl_vars['loop']->step = 1;$_smarty_tpl->tpl_vars['loop']->total = (int)ceil(($_smarty_tpl->tpl_vars['loop']->step > 0 ? 27+1 - (1+preg_match_all('/[^\s]/',$_smarty_tpl->tpl_vars['parameter']->value['parameter'], $tmp)) : 1+preg_match_all('/[^\s]/',$_smarty_tpl->tpl_vars['parameter']->value['parameter'], $tmp)-(27)+1)/abs($_smarty_tpl->tpl_vars['loop']->step));
if ($_smarty_tpl->tpl_vars['loop']->total > 0){
for ($_smarty_tpl->tpl_vars['loop']->value = 1+preg_match_all('/[^\s]/',$_smarty_tpl->tpl_vars['parameter']->value['parameter'], $tmp), $_smarty_tpl->tpl_vars['loop']->iteration = 1;$_smarty_tpl->tpl_vars['loop']->iteration <= $_smarty_tpl->tpl_vars['loop']->total;$_smarty_tpl->tpl_vars['loop']->value += $_smarty_tpl->tpl_vars['loop']->step, $_smarty_tpl->tpl_vars['loop']->iteration++){
$_smarty_tpl->tpl_vars['loop']->first = $_smarty_tpl->tpl_vars['loop']->iteration == 1;$_smarty_tpl->tpl_vars['loop']->last = $_smarty_tpl->tpl_vars['loop']->iteration == $_smarty_tpl->tpl_vars['loop']->total;?> <?php }} ?>= <?php  $_smarty_tpl->tpl_vars['value'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['value']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['parameter']->value['default_value']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['value']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['value']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['value']->key => $_smarty_tpl->tpl_vars['value']->value){
$_smarty_tpl->tpl_vars['value']->_loop = true;
 $_smarty_tpl->tpl_vars['value']->iteration++;
 $_smarty_tpl->tpl_vars['value']->last = $_smarty_tpl->tpl_vars['value']->iteration === $_smarty_tpl->tpl_vars['value']->total;
?><?php echo $_smarty_tpl->tpl_vars['value']->value;?>
<?php if ($_smarty_tpl->tpl_vars['value']->last!=true){?>, <?php }?><?php } ?></li>
				<?php } ?>

			<?php }else{ ?>
				<?php if ($_smarty_tpl->tpl_vars['content']->value['default_parameter']['required_parameter']!=array()){?>
					<?php  $_smarty_tpl->tpl_vars['required_parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['required_parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['default_parameter']['required_parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['required_parameter']->key => $_smarty_tpl->tpl_vars['required_parameter']->value){
$_smarty_tpl->tpl_vars['required_parameter']->_loop = true;
?>
						<li class="required-parameter"><?php echo $_smarty_tpl->tpl_vars['required_parameter']->value;?>
</li>
					<?php } ?>
				<?php }?>
				<?php if ($_smarty_tpl->tpl_vars['content']->value['default_parameter']['instead_parameter']!=array()){?>
					<?php  $_smarty_tpl->tpl_vars['instead_parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['instead_parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['default_parameter']['instead_parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['instead_parameter']->key => $_smarty_tpl->tpl_vars['instead_parameter']->value){
$_smarty_tpl->tpl_vars['instead_parameter']->_loop = true;
?>
						<li class="instead-parameter"><?php echo $_smarty_tpl->tpl_vars['instead_parameter']->value;?>
</li>
					<?php } ?>
				<?php }?>
				<?php if ($_smarty_tpl->tpl_vars['content']->value['default_parameter']['optional_parameter']!=array()){?>
					<?php  $_smarty_tpl->tpl_vars['optional_parameter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['optional_parameter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['default_parameter']['optional_parameter']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['optional_parameter']->key => $_smarty_tpl->tpl_vars['optional_parameter']->value){
$_smarty_tpl->tpl_vars['optional_parameter']->_loop = true;
?>
						<li class="optional-parameter"><?php echo $_smarty_tpl->tpl_vars['optional_parameter']->value;?>
</li>
					<?php } ?>
				<?php }?>

			<?php }?>

		</ul>
		</div>
		<div class="supplement">*<span class="optional-parameter">緑=記述が省略可能なパラメーター</span>, <span class="required-parameter">赤=省略できないパラメーター、省略するとエラー</span>, <span class="instead-parameter">紫=パラメーターの代わりに使用できる別のパラメーター</span></div>
	</div></section><?php }} ?>