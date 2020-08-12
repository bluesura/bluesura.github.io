<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:05
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\nav.tpl" */ ?>
<?php /*%%SmartyHeaderCode:19676683735f33ad01003d21-70731878%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
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
  'nocache_hash' => '19676683735f33ad01003d21-70731878',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5f33ad0102c087_13624202',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad0102c087_13624202')) {function content_5f33ad0102c087_13624202($_smarty_tpl) {?>    <nav class="breadcrumb">
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