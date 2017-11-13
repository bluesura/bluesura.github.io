<?php /* Smarty version Smarty-3.1.12, created on 2017-11-13 17:18:15
         compiled from ".\..\Template\base.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2963558cd8974caeb00-16025641%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '5ac4a276d869311c2ba7116783143ef3c7ab1414' => 
    array (
      0 => '.\\..\\Template\\base.tpl',
      1 => 1510589678,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2963558cd8974caeb00-16025641',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_58cd8974da6617_17254143',
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_58cd8974da6617_17254143')) {function content_58cd8974da6617_17254143($_smarty_tpl) {?><!DOCTYPE html>
<html lang="ja" itemscope itemtype="http://schema.org/Article">
<head>
<?php echo $_smarty_tpl->getSubTemplate ("./head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>



  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MMQSZM');</script>
  <!-- End Google Tag Manager -->

</head>

<body>

  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMQSZM"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
	<script src="https://embed.small.chat/T0F4QF673G6M8EPAEN.js" async></script>


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
  <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./LifeBar/LifeBar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

  <?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
    <?php echo $_smarty_tpl->getSubTemplate ("./index.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

  <?php }?>
    
<?php }?>


<ul class="sosial_buttons">
    <li class="sb_facebook">
        <a href="" onclick="window.open('https://www.facebook.com/share.php?u='+encodeURIComponent(document.location.href), 'FBwindow', 'width=320, height=320, menubar=no, toolbar=no, scrollbars=yes'); return false;" target="_blank">
            <i class="fa fa-facebook"></i>
        </a>
    </li>

    <li class="sb_twitter">
        <a href="" onclick="window.open('http://twitter.com/share?count=horizontal&amp;original_referer=http%3A%2F%2Frokaru.jp%2Fmatome%2F28227&amp;text='+encodeURIComponent((function(){if((''+document.getSelection()).length){return document.getSelection()}else{return document.title.slice(0,30)}})()+' @bluesuraさんから')+'&amp;url='+document.location.href, 'tweetwindow', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1'); return false;" title="このページをツイートする" target="_blank">
            <i class="fa fa-twitter"></i>
        </a>
    </li>
    <li class="sb_hatena">
        <a href="" onclick="window.open('http://b.hatena.ne.jp/entry/'+encodeURIComponent(document.location.href))" class="hatena-bookmark-button" title="このページをはてなブックマークに追加する" target="_blank">
            <i class="fa fa-hatena"></i>
        </a>
    </li>
    <li class="sb_gplus">
        <a href="" onclick="window.open('https://plus.google.com/share?url='+encodeURIComponent(document.location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" target="_blank">
            <i class="fa fa-google-plus"></i>
        </a>
    </li>
</ul>

	</div></div>


<?php echo $_smarty_tpl->getSubTemplate ("./sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

	</div>

</div></div></div>



<?php echo $_smarty_tpl->getSubTemplate ("./footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>



<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/lib/js/service-worker.js')
           .then(function() { /*console.log();*/ });
}
</script>

</body>
</html>
<?php }} ?>