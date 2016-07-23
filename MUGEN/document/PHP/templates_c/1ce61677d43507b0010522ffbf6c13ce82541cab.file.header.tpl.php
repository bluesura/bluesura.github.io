<?php /* Smarty version Smarty-3.1.12, created on 2013-07-21 15:14:27
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\template\header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:850551ebfad3ec4b18-97688370%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1ce61677d43507b0010522ffbf6c13ce82541cab' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\template\\header.tpl',
      1 => 1372617460,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '850551ebfad3ec4b18-97688370',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51ebfad3f26138_90368569',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51ebfad3f26138_90368569')) {function content_51ebfad3f26138_90368569($_smarty_tpl) {?><header>
	<div class="header">

		<div class="title">
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="1"){?>
			<h1>Name = sura</h1>
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
			<h1><?php echo $_smarty_tpl->tpl_vars['content']->value['page']['title'];?>
</h1>
			<h2>Name = sura</h2>
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
			<h1><?php echo $_smarty_tpl->tpl_vars['content']->value['page']['title'];?>
 | <?php echo $_smarty_tpl->tpl_vars['content']->value['page']['subtitle'];?>
</h1>
			<h2>Name = sura</h2>
<?php }?>
		</div>

		<nav>
			<div class="breadcrumb">
				<ul>
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']>="1"){?>
					<li><a href="/index.html" target="_top">Home</a></li>
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']>="2"){?>
					<li><span> &gt;&gt; </span></li>
					<li><a href="./index.html" target="_top"><?php echo $_smarty_tpl->tpl_vars['content']->value['page']['title'];?>
</a></li>
<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']>="3"){?>
					<li><span> &gt;&gt; </span></li>
					<li><?php echo $_smarty_tpl->tpl_vars['content']->value['page']['subtitle'];?>
</li>
<?php }?>
<?php }?>
<?php }?>
				</ul>
			</div>
		</nav>

	</div>
</header><?php }} ?>