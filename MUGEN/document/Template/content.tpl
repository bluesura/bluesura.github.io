<div id="main-inner"><article class="entry hentry js-entry-article date-first autopagerize_page_element chars-200 words-100 mode-hatena entry-odd">
  <header class="entry-header"{if !empty($content.images)}{foreach $content.images as $array} style="background: url(./media/img/{$array['src']}) no-repeat; background-size: cover;"{/foreach}{/if}><div{if !empty($content.images)}{foreach $content.images as $array} style="height:{$array['height']}px; background-color:rgba(255,255,255,0.4);display: -webkit-flex;"{/foreach}{/if}>{if !empty($content.images)}<span itemprop="image" itemscope itemtype="https://schema.org/ImageObject" style="display: none;"/><meta itemprop="url" content="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}"><meta itemprop="width" content="{$content.images[0].width}"><meta itemprop="height" content="{$content.images[0].height}"></span>{/if}

  <img src="https://bluesura.github.io/MUGEN/document/State/media/img/{$content.images[0].src}" alt="{$content.images[0].alt}" style="display:none;">
  <div class="entry-title" itemprop="name"><div>
  <h1 id="{$content.state}">Type = {$content.state|escape}</h1>
  {if !empty($content.page.category)}<div class="category">{$content.page.category[0]|escape} > {$content.page.category[1]|escape} | {if !empty($content.page.version)}実装されたバージョン: {$content.page.version}{/if} | {if !empty($content.page.target)}対象: {$content.page.target}{/if}</div>
{/if}
</div></div>

</div></header>

  <div class="entry-content">

{include file="./content/Description.tpl"}

{include file="./content/Parameter.tpl"}

{include file="./content/Version.tpl"}

{include file="./content/DefaultParameter.tpl"}

{include file="./content/QandA.tpl"}

{include file="./content/CodeSample.tpl"}

{include file="./content/LoadParameter.tpl"}

{include file="./content/Quote.tpl"}

<div><div><strong>公開日:</strong><time class="published" itemprop="datePublished" datetime="2008-06-05">2008.06.05</time></div>{if !empty($content.page.update)}<div><strong>最終更新日:</strong><time class="updated" itemprop="dateModified" datetime="{$content.page.update|replace:'.':'-'}">{$content.page.update}</time></div>{/if}{if !empty($content.page.contributor)}<div><strong>貢献者:</strong>{foreach $content.page.contributor as $contributor}{$contributor}氏{if $contributor@last != true}, {/if}{/foreach}</div>{/if}</div>

{include file="./nav.tpl"}

<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://https-bluesura-github-io.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-ex+6c-2-c9+mp"
     data-ad-client="ca-pub-9960110085246197"
     data-ad-slot="8121105860"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

  </div>
</article></div>
