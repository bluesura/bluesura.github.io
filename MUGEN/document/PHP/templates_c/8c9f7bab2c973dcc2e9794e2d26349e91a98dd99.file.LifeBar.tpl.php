<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:49
         compiled from "D:\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\LifeBar\LifeBar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:14165705895f33ad2d081538-46519402%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '8c9f7bab2c973dcc2e9794e2d26349e91a98dd99' => 
    array (
      0 => 'D:\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\LifeBar\\LifeBar.tpl',
      1 => 1597221911,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '14165705895f33ad2d081538-46519402',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'content' => 0,
    'array' => 0,
    'contributor' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5f33ad2d1c3584_23038042',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad2d1c3584_23038042')) {function content_5f33ad2d1c3584_23038042($_smarty_tpl) {?><?php if (!is_callable('smarty_modifier_replace')) include 'C:\\libs\\php\\smarty\\plugins\\modifier.replace.php';
?><div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
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
px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"<?php } ?>><?php if (!empty($_smarty_tpl->tpl_vars['content']->value['images'])){?><span itemprop="image" itemscope itemtype="https://schema.org/ImageObject" style="display: none;"/><meta itemprop="url" content="https://bluesura.github.io/MUGEN/document/LifeBar/media/img/<?php echo $_smarty_tpl->tpl_vars['content']->value['images'][0]['src'];?>
"><meta itemprop="width" content="<?php echo $_smarty_tpl->tpl_vars['content']->value['images'][0]['width'];?>
"><meta itemprop="height" content="<?php echo $_smarty_tpl->tpl_vars['content']->value['images'][0]['height'];?>
"></span><?php }?>

	<div class="entry-title" itemprop="name"><div>
	<h1 id="<?php echo $_smarty_tpl->tpl_vars['content']->value['title'];?>
"><?php echo $_smarty_tpl->tpl_vars['content']->value['group'];?>
</h1>
	<?php if (!empty($_smarty_tpl->tpl_vars['content']->value['page']['category'])){?><div class="category"><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['category'][0], ENT_QUOTES, 'UTF-8', true);?>
 > <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['category'][1], ENT_QUOTES, 'UTF-8', true);?>
 | <?php if (!empty($_smarty_tpl->tpl_vars['content']->value['page']['version'])){?>実装されたバージョン: <?php echo $_smarty_tpl->tpl_vars['content']->value['page']['version'];?>
<?php }?> | <?php if (!empty($_smarty_tpl->tpl_vars['content']->value['page']['target'])){?>対象: <?php echo $_smarty_tpl->tpl_vars['content']->value['page']['target'];?>
<?php }?></div>
<?php }?>
</div></div>

</div></header>

	<div class="entry-content">

<?php echo $_smarty_tpl->getSubTemplate ("./content_l.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div><span>公開日:<time class="published" itemprop="datePublished" datetime="2008-06-05">2008.06.05</time></span> | <?php if (!empty($_smarty_tpl->tpl_vars['content']->value['page']['update'])){?><span>最終更新日:<time class="updated" itemprop="dateModified" datetime="<?php echo smarty_modifier_replace($_smarty_tpl->tpl_vars['content']->value['page']['update'],'.','-');?>
"><?php echo $_smarty_tpl->tpl_vars['content']->value['page']['update'];?>
</time></span><?php }?> | <?php if (!empty($_smarty_tpl->tpl_vars['content']->value['page']['contributor'])){?><span>貢献者: <?php  $_smarty_tpl->tpl_vars['contributor'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['contributor']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['page']['contributor']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['contributor']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['contributor']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['contributor']->key => $_smarty_tpl->tpl_vars['contributor']->value){
$_smarty_tpl->tpl_vars['contributor']->_loop = true;
 $_smarty_tpl->tpl_vars['contributor']->iteration++;
 $_smarty_tpl->tpl_vars['contributor']->last = $_smarty_tpl->tpl_vars['contributor']->iteration === $_smarty_tpl->tpl_vars['contributor']->total;
?><?php echo $_smarty_tpl->tpl_vars['contributor']->value;?>
氏<?php if ($_smarty_tpl->tpl_vars['contributor']->last!=true){?>, <?php }?><?php } ?></span><?php }?></div>

	</div>
</article></div>
<?php }} ?>