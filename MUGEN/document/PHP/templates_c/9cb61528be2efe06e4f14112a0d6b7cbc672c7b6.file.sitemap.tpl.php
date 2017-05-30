<?php /* Smarty version Smarty-3.1.12, created on 2017-05-30 13:31:28
         compiled from ".\..\..\..\sitemap.tpl" */ ?>
<?php /*%%SmartyHeaderCode:76815794d92f4bfe50-10390019%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '9cb61528be2efe06e4f14112a0d6b7cbc672c7b6' => 
    array (
      0 => '.\\..\\..\\..\\sitemap.tpl',
      1 => 1496150944,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '76815794d92f4bfe50-10390019',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5794d92f56abf5_68733639',
  'variables' => 
  array (
    'urls' => 0,
    'url' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5794d92f56abf5_68733639')) {function content_5794d92f56abf5_68733639($_smarty_tpl) {?>
<?php echo '<?xml';?> version="1.0" encoding="UTF-8"<?php echo '?>';?>

 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
<?php  $_smarty_tpl->tpl_vars['url'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['url']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['urls']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['url']->key => $_smarty_tpl->tpl_vars['url']->value){
$_smarty_tpl->tpl_vars['url']->_loop = true;
?>
  <url>
    <loc><?php echo $_smarty_tpl->tpl_vars['url']->value;?>
</loc>
    <xhtml:link 
                 rel="alternate"
                 hreflang="ja"
                 href="<?php echo $_smarty_tpl->tpl_vars['url']->value;?>
"
                 />
    <xhtml:link 
                 rel="alternate"
                 hreflang="ja-jp"
                 href="<?php echo $_smarty_tpl->tpl_vars['url']->value;?>
"
                 />
    <changefreq>monthly</changefreq>
    
    
  </url>
<?php } ?>
</urlset><?php }} ?>