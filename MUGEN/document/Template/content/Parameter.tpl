  <section id="Parameter"><div class="section">
    <h2>パラメーター</h2>
    {if $content.parameter == []}
    <div>なし</div>
    {else}
    {foreach $content.parameter as $array}
    <dl class="parameter">
      <dt class="main">
          {$array.parameter} = {foreach $array.value as $value}{$value}{if $value@last != true}, {/if}{/foreach}
        ({foreach $array.type as $type}{if $type=="boolean"}0か1{/if}{if $type=="int"}整数{/if}{if $type=="float"}浮動小数点数{/if}{if $type=="string"}文字列{/if}{if $type@last != true}, {/if}{/foreach})
      </dt>
      <dd>
        <div class="description">{$array.description}</div>

        <div class="option-value">

          {if !empty($array.possible_value)}<div class="possible-value">
          {if is_array($array.possible_value[0])}
          <div>
          <table>
            <tr>
              <th>{$array.possible_value[0][0]}</th>
              <th>{$array.possible_value[0][1]}</th>
            </tr>
            {for $i=1 to $array.possible_value|@count-1}<tr>
              <td>{$array.possible_value[$i][0]}</td>
              <td>{$array.possible_value[$i][1]}</td>
            </tr>{/for}
          </table>
          </div>
            {else}<div>
              選択可能な文字列: {foreach $array.possible_value as $possible_value}{$possible_value}{if $possible_value@last != true}, {/if}{/foreach}
            </div>{/if}
          </div>{/if}

          {if !empty($array.min_value) || !empty($array.max_value)}
          <div class="range-value">
            {if !empty($array.min_value)}
            <span class="min-value">最小値: {foreach $array.min_value as $min_value}{$min_value}{if $min_value@last != true}, {/if}{/foreach}</span>
            {/if}
            {if !empty($array.min_value) && !empty($array.max_value)},{/if}
            {if !empty($array.max_value)}
            <span class="max-value">最大値: {foreach $array.max_value as $max_value}{$max_value}{if $max_value@last != true}, {/if}{/foreach}</span>
            {/if}
          </div>
          {/if}

          {if $array.parameter_type == "required"}
          <div class="required-parameter">省略不可</div>
          {elseif $array.parameter_type == "instead"}
          <div class="instead-parameter">代替書式</div>
          {elseif $array.default_value != [""]}
          <div class="default-value">省略時のデフォルト値： {foreach $array.default_value as $default_value}{$default_value}{if $default_value@last != true}, {/if}{/foreach}</div>
          {else}
          {/if}

          {if isset($array.associated_trigger)}<div class="associated-trigger">関連するトリガー： {foreach $array.associated_trigger as $associated_trigger}<code>{$associated_trigger}</code>{if $associated_trigger@last != true}, {/if}{/foreach}</div>{/if}

        {if !empty($array.media)}
        <div class="media">
          {if !empty($array.media.youtube)}
          <div class="video-group">
            {foreach $array.media.youtube as $youtube}
            <div>{$youtube.title}</div>
            <div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;"><iframe style="position: absolute; top: 0;  left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/{$youtube.file}" frameborder="0" allowfullscreen></iframe></div>
            {/foreach}
          </div>
          {/if}
          {if !empty($array.media.video)}
          <div class="video-group">
            {foreach $array.media.video as $video}
            <div class="video image-frame">
              <div class="title"><a href="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4">{$video.title}</a></div>
              <video controls="controls">
                <source src="https://dl.dropboxusercontent.com/u/103321845/www/MUGEN/document/State/media/video/{$video.file}.mp4" type="video/mp4" />
              </video>
            </div>
            {/foreach}
          </div>
          {/if}
          {if !empty($array.media.image)}
          <div class="image-group">
            {foreach $array.media.image as $image}
            <div class="image">
              <div>{$image.title}</div>
              <div class="image-frame"><img src="./media/img/{$image.file}" alt="{$image.title}" width="{$image.width}" height="{$image.height}" /></div>
            </div>
            {/foreach}
          </div>
          {/if}
        </div>
        {/if}

        </div>


      </dd>
    </dl>
    {/foreach}
    {/if}
  </div></section>