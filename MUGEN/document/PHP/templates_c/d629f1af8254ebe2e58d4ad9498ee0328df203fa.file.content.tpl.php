<?php /* Smarty version Smarty-3.1.12, created on 2016-08-02 14:24:15
         compiled from "F:\bluesura\Dropbox\Public\www\mugen.github.io\MUGEN\document\Template\content.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2500257944e155e1c36-62291719%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'd629f1af8254ebe2e58d4ad9498ee0328df203fa' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\mugen.github.io\\MUGEN\\document\\Template\\content.tpl',
      1 => 1470147771,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2500257944e155e1c36-62291719',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_57944e156a4df0_80037659',
  'variables' => 
  array (
    'content' => 0,
    'array' => 0,
    'contributor' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57944e156a4df0_80037659')) {function content_57944e156a4df0_80037659($_smarty_tpl) {?><?php if (!is_callable('smarty_modifier_replace')) include 'C:\\libs\\php\\smarty\\plugins\\modifier.replace.php';
?><div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
	<header class="entry-header"<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['images']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?> style="background: url(./media/img/<?php echo $_smarty_tpl->tpl_vars['array']->value['src'];?>
) no-repeat; background-size: cover;"<?php } ?>><div<?php  $_smarty_tpl->tpl_vars['array'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['array']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['content']->value['images']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['array']->key => $_smarty_tpl->tpl_vars['array']->value){
$_smarty_tpl->tpl_vars['array']->_loop = true;
?> style="height:<?php echo $_smarty_tpl->tpl_vars['array']->value['height'];?>
px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"<?php } ?>><?php if ($_smarty_tpl->tpl_vars['content']->value['images']!=null){?><span itemprop="image" itemscope itemtype="https://schema.org/ImageObject" style="display: none;"/><meta itemprop="url" content="https://bluesura.github.io/MUGEN/document/State/media/img/<?php echo $_smarty_tpl->tpl_vars['content']->value['images'][0]['src'];?>
"><meta itemprop="width" content="<?php echo $_smarty_tpl->tpl_vars['content']->value['images'][0]['width'];?>
"><meta itemprop="height" content="<?php echo $_smarty_tpl->tpl_vars['content']->value['images'][0]['height'];?>
"></span><?php }?>

	<div class="entry-title" itemprop="name"><div>
	<h1 id="<?php echo $_smarty_tpl->tpl_vars['content']->value['state'];?>
">Type = <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['state'], ENT_QUOTES, 'ISO-8859-1', true);?>
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

<?php echo $_smarty_tpl->getSubTemplate ("./content/Description.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/Version.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/Parameter.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/DefaultParameter.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/LoadParameter.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/QandA.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/CodeSample.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate ("./content/Quote.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div><span>公開日:<time class="published" itemprop="datePublished" datetime="2008-06-05">2008.06.05</time></span> | <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['update']!=null){?><span>最終更新日:<time class="updated" itemprop="dateModified" datetime="<?php echo smarty_modifier_replace($_smarty_tpl->tpl_vars['content']->value['page']['update'],'.','-');?>
"><?php echo $_smarty_tpl->tpl_vars['content']->value['page']['update'];?>
</time></span><?php }?> | <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['contributor']!=null){?><span>貢献者: <?php  $_smarty_tpl->tpl_vars['contributor'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['contributor']->_loop = false;
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