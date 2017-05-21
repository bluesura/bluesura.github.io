  {if $content.qanda}
  <section id="QandA"><div class="section">
    <h2>Q＆A(よくある質問)</h2>
    <div>
      {foreach $content.qanda as $qanda}
        <h3>{$qanda.q}</h3>
        {$qanda.a}
      {/foreach}
    </div>
  </div></section>
  {/if}