<?php /* Smarty version Smarty-3.1.12, created on 2017-05-21 17:28:55
         compiled from "F:\bluesura\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\QandA.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2480457944e15b0b153-26677743%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '5390fd84eba3cb286f5f2fd2bff4bcb325e16b21' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\QandA.tpl',
      1 => 1495387677,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2480457944e15b0b153-26677743',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_57944e15b845c4_34392015',
  'variables' => 
  array (
    'content' => 0,
    'qanda' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57944e15b845c4_34392015')) {function content_57944e15b845c4_34392015($_smarty_tpl) {?>﻿  <?php if ($_smarty_tpl->tpl_vars['content']->value['qanda']){?>
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