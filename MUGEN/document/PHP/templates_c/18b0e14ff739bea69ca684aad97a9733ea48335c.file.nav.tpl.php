<?php /* Smarty version Smarty-3.1.12, created on 2016-07-22 14:48:41
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\nav.tpl" */ ?>
<?php /*%%SmartyHeaderCode:781357923249cc22f1-20906162%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '18b0e14ff739bea69ca684aad97a9733ea48335c' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\nav.tpl',
      1 => 1469198913,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '781357923249cc22f1-20906162',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_57923249d50503_03044736',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57923249d50503_03044736')) {function content_57923249d50503_03044736($_smarty_tpl) {?>		<nav class="breadcrumb">
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