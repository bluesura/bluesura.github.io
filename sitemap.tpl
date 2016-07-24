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
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
{/foreach}
</urlset>