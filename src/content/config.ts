// src/content/config.ts

import { defineCollection, z } from 'astro:content';

// ステートコントローラーのコレクション
const stateControllerCollection = defineCollection({
  type: 'data',
  schema: z.object({
    state: z.string(),
  }).passthrough(), 
});

// Triggerのコレクション
const triggerCollection = defineCollection({
  type: 'data',
  schema: z.object({
    trigger: z.string(),
  }).passthrough(),
});

// LifebarのJSONコレクションを定義し、エクスポートする
export const lifebarsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    group: z.string().optional(), // groupプロパティは任意
  }).passthrough(),
});

// 定義したコレクションをAstroに登録
export const collections = {
  'state-controllers': stateControllerCollection,
  'triggers': triggerCollection,
  'lifebars': lifebarsCollection, // ここでエクスポートしたlifebarsCollectionを使用
};