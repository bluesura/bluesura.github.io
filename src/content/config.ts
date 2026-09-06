// src/content/config.ts

import { defineCollection, z } from 'astro:content';
import { createDocumentSchema } from '../lib/mugen/schema.mjs';
import registry from '../data/engine-versions.json';

// ステートコントローラーのコレクション
const stateControllerCollection = defineCollection({
  type: 'data',
  schema: createDocumentSchema('state-controllers', registry),
});

// Triggerのコレクション
const triggerCollection = defineCollection({
  type: 'data',
  schema: createDocumentSchema('triggers', registry),
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
