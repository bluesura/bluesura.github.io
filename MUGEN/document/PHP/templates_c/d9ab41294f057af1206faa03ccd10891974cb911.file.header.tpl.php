<?php /* Smarty version Smarty-3.1.12, created on 2013-06-30 18:37:43
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\State\template\header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:249865119186a5d0313-06094878%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'd9ab41294f057af1206faa03ccd10891974cb911' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\State\\template\\header.tpl',
      1 => 1372617460,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '249865119186a5d0313-06094878',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5119186a67d999_98287130',
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5119186a67d999_98287130')) {function content_5119186a67d999_98287130($_smarty_tpl) {?><header>
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