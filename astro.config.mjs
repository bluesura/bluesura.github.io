// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

const PUBLIC_PAGES = [
  'https://bluesura.github.io/Tools/cnslint.html',
  'https://bluesura.github.io/Tools/image-ratio-adjuster.html',
  'https://bluesura.github.io/Tools/emoji-art-generator.html',
];

// https://astro.build/config
export default defineConfig({
    site: 'https://bluesura.github.io',
    // trailingSlash: 'never', 
    build: {
        format: 'preserve'
    },
    integrations: [starlight({
        title: 'MUGEN Reference',
        social: [
            { icon: 'github', label: 'GitHub', href: 'https://github.com/bluesura/bluesura.github.io' }
        ],
        // サイドバーの設定を、現在のdocsディレクトリの中身に合わせて自動生成するように変更
        sidebar: [
            {
                label: 'ドキュメント',
                // src/content/docs/ ディレクトリ内のファイルを自動でメニュー化します
                autogenerate: { directory: '/' },
            },
        ],
		}),sitemap({
      customPages: PUBLIC_PAGES,
      serialize(item) {
        const url = new URL(item.url);

        // ルート (https://bluesura.github.io/) はそのまま
        if (url.pathname === '/' || url.pathname === '') {
          return item;
        }

        // すでに拡張子が付いているもの（.html / .xml / .txt など）はそのまま
        if (/\.[a-z0-9]+$/i.test(url.pathname)) {
          return item;
        }

        // console.log(url.pathname)
        if (/\/(State|Trigger|Lifebar)$/i.test(url.pathname)) {
            url.pathname = url.pathname.replace(/\/$/, '') + '\/';
            item.url = url.toString();
          return item;
        }

        // 末尾の / を削ってから .html を付ける
        url.pathname = url.pathname.replace(/\/$/, '') + '.html';
        item.url = url.toString();

        return item;
      },
    })],
});