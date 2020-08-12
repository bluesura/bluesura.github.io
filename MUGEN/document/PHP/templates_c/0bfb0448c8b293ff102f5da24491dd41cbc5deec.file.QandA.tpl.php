<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:07
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content\QandA.tpl" */ ?>
<?php /*%%SmartyHeaderCode:12200819195f33ad035a9276-01862647%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '0bfb0448c8b293ff102f5da24491dd41cbc5deec' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content\\QandA.tpl',
      1 => 1597217579,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '12200819195f33ad035a9276-01862647',
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
  'unifunc' => 'content_5f33ad035cb4b6_31373840',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad035cb4b6_31373840')) {function content_5f33ad035cb4b6_31373840($_smarty_tpl) {?>  <?php if (!empty($_smarty_tpl->tpl_vars['content']->value['qanda'])){?>
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