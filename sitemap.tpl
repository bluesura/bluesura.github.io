{* https://www.sitemaps.org/ja/protocol.html *}
<?xml version="1.0" encoding="UTF-8"?>
 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
{foreach $urls as $url}
  <url>
    <loc>{$url}</loc>
    <xhtml:link 
                 rel="alternate"
                 hreflang="ja"
                 href="{$url}"
                 />
    <xhtml:link 
                 rel="alternate"
                 hreflang="ja-jp"
                 href="{$url}"
                 />
    <changefreq>monthly</changefreq>
    {*<lastmod>2005-01-01</lastmod>*}
    {*<priority>1.0</priority>Googleが不必要と述べていたため*}
  </url>
{/foreach}
</urlset>