<?php /* Smarty version Smarty-3.1.12, created on 2014-10-04 15:06:19
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\content\QandA.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1524651ec145e6650f9-99486842%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '77488e8ca9fb4faa8c260d4852808d29321f6431' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\content\\QandA.tpl',
      1 => 1412435172,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1524651ec145e6650f9-99486842',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51ec145e6ad2c8_90572454',
  'variables' => 
  array (
    'content' => 0,
    'qanda' => 0,
    'reference' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51ec145e6ad2c8_90572454')) {function content_51ec145e6ad2c8_90572454($_smarty_tpl) {?>﻿	<?php if ($_smarty_tpl->tpl_vars['content']->value['qanda']){?>
	<section id="QandA"><div class="section">
		<h2>注意事項</h2>
		<?php  $_smarty_tpl->tpl_vars['qanda'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['qanda']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['qanda']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['qanda']->key => $_smarty_tpl->tpl_vars['qanda']->value){
$_smarty_tpl->tpl_vars['qanda']->_loop = true;
?>
		<table class="qanda">
			<?php if ($_smarty_tpl->tpl_vars['qanda']->value['q']!=null){?><tr>
				<th class="question">問</th>
				<td><?php echo $_smarty_tpl->tpl_vars['qanda']->value['q'];?>
</td>
			</tr><?php }?>
			<?php if ($_smarty_tpl->tpl_vars['qanda']->value['c']!=null){?><tr>
				<th class="problem">原</th>
				<td><?php echo $_smarty_tpl->tpl_vars['qanda']->value['c'];?>
</td>
			</tr><?php }?>
			<?php if ($_smarty_tpl->tpl_vars['qanda']->value['a']!=null){?><tr>
				<th class="answer">答</th>
				<td><?php echo $_smarty_tpl->tpl_vars['qanda']->value['a'];?>
</td>
			</tr><?php }?>
			<?php if ($_smarty_tpl->tpl_vars['qanda']->value['r']!=null){?><tr>
				<th class="quote">参</th>
				<td>
				<?php  $_smarty_tpl->tpl_vars['reference'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['reference']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['qanda']->value['r']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['reference']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['reference']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['reference']->key => $_smarty_tpl->tpl_vars['reference']->value){
$_smarty_tpl->tpl_vars['reference']->_loop = true;
 $_smarty_tpl->tpl_vars['reference']->iteration++;
 $_smarty_tpl->tpl_vars['reference']->last = $_smarty_tpl->tpl_vars['reference']->iteration === $_smarty_tpl->tpl_vars['reference']->total;
?>
					<a href="<?php echo $_smarty_tpl->tpl_vars['reference']->value['url'];?>
" target="_blank"><?php echo $_smarty_tpl->tpl_vars['reference']->value['title'];?>
</a>
					<?php if ($_smarty_tpl->tpl_vars['reference']->last!=true){?><br><?php }?>
				<?php } ?>
				</td>
			</tr><?php }?>
		</table>
		<?php } ?>
	</div></section>
	<?php }?><?php }} ?>