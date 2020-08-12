<?php /* Smarty version Smarty-3.1.12, created on 2020-08-12 10:49:53
         compiled from ".\..\..\..\sitemap.tpl" */ ?>
<?php /*%%SmartyHeaderCode:19307269905f33ad31cadf38-39547301%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
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
  'nocache_hash' => '19307269905f33ad31cadf38-39547301',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'urls' => 0,
    'url' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5f33ad31cfc6a9_45450759',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5f33ad31cfc6a9_45450759')) {function content_5f33ad31cfc6a9_45450759($_smarty_tpl) {?>
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