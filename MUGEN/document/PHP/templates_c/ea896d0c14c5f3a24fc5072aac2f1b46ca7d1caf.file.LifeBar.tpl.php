<?php /* Smarty version Smarty-3.1.12, created on 2016-07-22 15:10:48
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\LifeBar\LifeBar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2525956967907abbbe9-01040085%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ea896d0c14c5f3a24fc5072aac2f1b46ca7d1caf' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\LifeBar\\LifeBar.tpl',
      1 => 1469200242,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2525956967907abbbe9-01040085',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_56967907c59654_50961510',
  'variables' => 
  array (
    'content' => 0,
    'array' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_56967907c59654_50961510')) {function content_56967907c59654_50961510($_smarty_tpl) {?><div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
	<header class="entry-header"<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['images']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?> style="background-image: url(./media/img/<?php echo $_smarty_tpl->tpl_vars['array']->value["src"];?>
); height:<?php echo $_smarty_tpl->tpl_vars['array']->value["height"];?>
px;"<?php } ?>><div<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['images']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?> style="height:<?php echo $_smarty_tpl->tpl_vars['array']->value["height"];?>
px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"<?php } ?>>

	<div class="entry-title"><div>
	<h1 id="<?php echo $_smarty_tpl->tpl_vars['content']->value['title'];?>
"><?php echo $_smarty_tpl->tpl_vars['content']->value['group'];?>
</h1>
	<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['category']!=null){?><div class="category"><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['category'][0], ENT_QUOTES, 'ISO-8859-1', true);?>
 > <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['category'][1], ENT_QUOTES, 'ISO-8859-1', true);?>
 | <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['version']!=null){?>実装されたバージョン: <?php echo $_smarty_tpl->tpl_vars['content']->value['page']['version'];?>
<?php }?> | <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['target']!=null){?>対象: <?php echo $_smarty_tpl->tpl_vars['content']->value['page']['target'];?>
<?php }?></div>
<?php }?>
</div></div>

</div></header>

	<div class="entry-content">

<?php echo $_smarty_tpl->getSubTemplate ("./content_l.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


	</div>
</article></div>
<?php }} ?>