<?php /* Smarty version Smarty-3.1.12, created on 2017-08-05 08:19:03
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\QandA.tpl" */ ?>
<?php /*%%SmartyHeaderCode:101304976859856357088230-34326714%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '0bfb0448c8b293ff102f5da24491dd41cbc5deec' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\QandA.tpl',
      1 => 1495387677,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '101304976859856357088230-34326714',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'qanda' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5985635709fd12_98321267',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5985635709fd12_98321267')) {function content_5985635709fd12_98321267($_smarty_tpl) {?>﻿  <?php if ($_smarty_tpl->tpl_vars['content']->value['qanda']){?>
  <section id="QandA"><div class="section">
    <h2>Q＆A(よくある質問)</h2>
    <div>
      <?php  $_smarty_tpl->tpl_vars['qanda'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['qanda']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['qanda']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['qanda']->key => $_smarty_tpl->tpl_vars['qanda']->value){
$_smarty_tpl->tpl_vars['qanda']->_loop = true;
?>
        <h3><?php echo $_smarty_tpl->tpl_vars['qanda']->value['q'];?>
</h3>
        <?php echo $_smarty_tpl->tpl_vars['qanda']->value['a'];?>

      <?php } ?>
    </div>
  </div></section>
  <?php }?><?php }} ?>