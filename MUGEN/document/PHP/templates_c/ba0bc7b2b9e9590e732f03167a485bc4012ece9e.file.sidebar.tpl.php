<?php /* Smarty version Smarty-3.1.12, created on 2013-07-15 04:24:23
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\State\template\sidebar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:3253751494f92a96394-20282326%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ba0bc7b2b9e9590e732f03167a485bc4012ece9e' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\State\\template\\sidebar.tpl',
      1 => 1373860873,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '3253751494f92a96394-20282326',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51494f92ac2196_25343227',
  'variables' => 
  array (
    'content' => 0,
    'temp' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51494f92ac2196_25343227')) {function content_51494f92ac2196_25343227($_smarty_tpl) {?><div class="categories">
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