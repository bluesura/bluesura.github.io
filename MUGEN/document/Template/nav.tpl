    <nav class="breadcrumb">
      <div>
        <ul>
{if $content.page.level >= "1"}
{if $content.page.level >= "2"}
          <li itemscope><a href="/" target="_top" itemprop="url"><span itemprop="title">Home</span></a></li>
{if $content.page.level >= "3"}
          <li> > </li>
          <li itemscope><a href="./" target="_top" itemprop="url"><span itemprop="title">{$content.page_title}</span></a></li>
          {*<li>{$content.page_subtitle}</li>*}
{/if}
{/if}
{/if}
        </ul>
      </div>
    </nav>