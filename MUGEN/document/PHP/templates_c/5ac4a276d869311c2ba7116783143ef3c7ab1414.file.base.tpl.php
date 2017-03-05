<?php /* Smarty version Smarty-3.1.12, created on 2017-03-05 06:40:14
         compiled from ".\..\Template\base.tpl" */ ?>
<?php /*%%SmartyHeaderCode:700351ec0171a88c40-09866654%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '5ac4a276d869311c2ba7116783143ef3c7ab1414' => 
    array (
      0 => '.\\..\\Template\\base.tpl',
      1 => 1488696006,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '700351ec0171a88c40-09866654',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_51ec0171b07443_74798507',
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51ec0171b07443_74798507')) {function content_51ec0171b07443_74798507($_smarty_tpl) {?><!DOCTYPE html>
<html lang="ja" itemscope itemtype="http://schema.org/Article">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
<?php echo $_smarty_tpl->getSubTemplate ("./head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</head>

<body>

<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-MMQSZM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMQSZM');</script>
<!-- End Google Tag Manager -->


<div id="container"><div id="content-inner">
<div id="container-inner">
<?php echo $_smarty_tpl->getSubTemplate ("./header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<div id="content">

	<div id="wrapper"><div id="main">
<?php if ($_smarty_tpl->tpl_vars['content']->value['page_category']=="State"){?>
  <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./content.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

  <?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./index.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

  <?php }?>

<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page_category']=="Trigger"){?>
  <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./Trigger/content.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

  <?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./index.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

  <?php }?>

  <?php }elseif($_smarty_tpl->tpl_vars['content']->value['page_category']=="Lifebar"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./LifeBar/LifeBar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page_category']=="Lifebar_htm"){?><div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd"><div class="entry-content"><?php echo $_smarty_tpl->tpl_vars['content']->value['html'];?>
</div></article></div>
<?php }?>
	</div></div>


<?php echo $_smarty_tpl->getSubTemplate ("./sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>

</div></div></div>



<?php echo $_smarty_tpl->getSubTemplate ("./footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


</body>
</html>
<?php }} ?>