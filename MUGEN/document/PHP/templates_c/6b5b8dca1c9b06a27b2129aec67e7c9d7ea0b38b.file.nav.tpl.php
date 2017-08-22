<?php /* Smarty version Smarty-3.1.12, created on 2017-08-22 15:52:52
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\nav.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2090228434599c3734b545b3-04018218%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6b5b8dca1c9b06a27b2129aec67e7c9d7ea0b38b' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\nav.tpl',
      1 => 1469198976,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2090228434599c3734b545b3-04018218',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_599c3734b5cb22_56332355',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_599c3734b5cb22_56332355')) {function content_599c3734b5cb22_56332355($_smarty_tpl) {?>    <nav class="breadcrumb">
      <div>
        <ul>
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']>="1"){?>
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']>="2"){?>
          <li itemscope><a href="/" target="_top" itemprop="url"><span itemprop="title">Home</span></a></li>
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']>="3"){?>
          <li> > </li>
          <li itemscope><a href="./" target="_top" itemprop="url"><span itemprop="title"><?php echo $_smarty_tpl->tpl_vars['content']->value['page_title'];?>
</span></a></li>
          
<?php }?>
<?php }?>
<?php }?>
        </ul>
      </div>
    </nav><?php }} ?>