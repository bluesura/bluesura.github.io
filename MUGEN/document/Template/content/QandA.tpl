  {if $content.qanda}
  <section id="QandA"><div class="section">
    <h2>Q＆A(よくありそうな質問)</h2>
    <div>
      {foreach $content.qanda as $qanda}
        <h3>{$qanda.title}</h3>
        {$qanda.content}
      {/foreach}
    </div>
  </div></section>
  {/if}