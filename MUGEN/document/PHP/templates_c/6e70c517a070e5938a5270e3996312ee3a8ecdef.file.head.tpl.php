<?php /* Smarty version Smarty-3.1.12, created on 2016-07-22 16:09:05
         compiled from "F:\bluesura\Dropbox\Public\www\MUGEN\document\Template\head.tpl" */ ?>
<?php /*%%SmartyHeaderCode:26649571cfaaee012b3-19389283%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6e70c517a070e5938a5270e3996312ee3a8ecdef' => 
    array (
      0 => 'F:\\bluesura\\Dropbox\\Public\\www\\MUGEN\\document\\Template\\head.tpl',
      1 => 1469203638,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '26649571cfaaee012b3-19389283',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_571cfaaeeec234_29072261',
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_571cfaaeeec234_29072261')) {function content_571cfaaeeec234_29072261($_smarty_tpl) {?><?php if (!is_callable('smarty_modifier_date_format')) include 'C:\\libs\\php\\smarty\\plugins\\modifier.date_format.php';
?>  <meta charset="UTF-8" />
  <!-- （*´ω｀*）＜ソースコードを見るなんてえっちぃ人ですね！ -->

<?php if ($_smarty_tpl->tpl_vars['content']->value['page']['level']=="1"){?>
  <title>Name = sura</title>
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="2"){?>
  <title><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page_title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 - Name = sura</title>
<?php }elseif($_smarty_tpl->tpl_vars['content']->value['page']['level']=="3"){?>
  <title><?php echo $_smarty_tpl->tpl_vars['content']->value['page_subtitle'];?>
 <?php if ($_smarty_tpl->tpl_vars['content']->value['page']['category'][1]){?>【<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page']['category'][1], ENT_QUOTES, 'ISO-8859-1', true);?>
】 <?php }?>| <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['content']->value['page_title'], ENT_QUOTES, 'ISO-8859-1', true);?>
 - Name = sura</title>
<?php }?>
  <link rel="shortcut icon" href="/media/img/favicon.png" type="image/png">
  <link rel="icon" href="/media/img/icon-192x192.png" sizes="192x192" />
  <link rel="icon" sizes="192x192" href="/media/img/icon-192x192.png">
  <link rel="icon" sizes="128x128" href="/media/img/icon-128x128.png">
  <link rel="apple-touch-icon" sizes="128x128" href="/media/img/icon-128x128.png">
  <link rel="apple-touch-icon-precomposed" sizes="128x128" href="/media/img/icon-128x128.png">


  <!-- 「チェス盤を引っくり返す！」 -->
  <meta name="theme-color" content="#1E88E5">
  <meta name="robots" content="INDEX,FOLLOW" />
  <meta name="viewport" content="width=device-width" />
  <meta name="author" content="sura" />
  <meta name="generator" content="Smarty" />
  <meta name="description" content="" />
  <meta name="keywords" content="MUGEN, M.U.G.E.N, むげん, 無限, 夢幻" />
  <!-- 「駄目ね、全然駄目だわ」 -->

<!-- ジョインジョイン OGP -->
  <meta property="og:url" content="http://analyticsfile.web.fc2.com/MUGEN/document/State/index.html" />
  <meta property="og:title" content="M.U.G.E.N ステートコントローラ一覧 - Name = sura" />
  <meta property="og:description" content="" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="http://analyticsfile.web.fc2.com/media/img/profile_200.png" />
  <meta property="og:locale" content="ja_JP" />
  <meta property="og:site_name" content="Name = sura" />
<!-- もういい、ここまでだっ・・・ -->

  <link rel="author" title="sura" href="https://twitter.com/bluesura" />

  <link rel="stylesheet" href="/lib/css/material.css?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

  <script type="text/javascript" src="//code.jquery.com/jquery-2.2.0.min.js"></script>
  <script type="text/javascript" src="/lib/js/code.min.js?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
"></script>
  <script type="text/javascript" src="/lib/js/js-ctrl.js?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
"></script>
  <script type="text/javascript" src="/lib/js/jquery.touchSwipe.min.js?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
"></script>
  <script type="text/javascript" src="/lib/js/isMobile.min.js?<?php echo smarty_modifier_date_format(time(),"%Y%m%d%H%M%S");?>
"></script>
<?php }} ?>