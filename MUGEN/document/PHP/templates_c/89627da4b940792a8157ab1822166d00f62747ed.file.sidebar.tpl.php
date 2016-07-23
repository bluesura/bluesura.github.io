<?php /* Smarty version Smarty-3.1.12, created on 2013-07-21 15:14:27
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\template\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1318251ebfad3f36a32-27644546%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '89627da4b940792a8157ab1822166d00f62747ed' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\template\\sidebar.tpl',
      1 => 1373860873,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1318251ebfad3f36a32-27644546',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51ebfad4028449_66892619',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51ebfad4028449_66892619')) {function content_51ebfad4028449_66892619($_smarty_tpl) {?><div class="categories">
<?php if ($_smarty_tpl->tpl_vars['content']->value!=null){?>
	<ul>
<?php  $_smarty_tpl->tpl_vars['temp'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['temp']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['categories']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['temp']->key => $_smarty_tpl->tpl_vars['temp']->value){
$_smarty_tpl->tpl_vars['temp']->_loop = true;
?>
		<li><div class="tooltip">
			<a href="./<?php echo $_smarty_tpl->tpl_vars['temp']->value['title'];?>
.html"><?php echo $_smarty_tpl->tpl_vars['temp']->value['title'];?>
</a>
			
		</div></li>
<?php } ?>
	</ul>
<?php }?>
</div>

<div class="search-engine">
	<gcse:searchbox-only></gcse:searchbox-only>
</div>

<div>

	<a class="twitter-timeline" href="https://twitter.com/bluesura" data-widget-id="283962985054093312">@bluesura からのツイート</a>
	<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

</div>

<div style="word-wrap:break-word;">
ページに何か間違いがございましたら、ツイッターやsuteadddayov+MUGEN@gmail.comまでご連絡ください。
</div>
<?php }} ?>