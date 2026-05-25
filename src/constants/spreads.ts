import type { SpreadConfig } from '../types';

export const SPREADS: Record<string, SpreadConfig> = {
  single: {
    type: 'single',
    name: 'Single Card',
    nameZh: '单张抽牌',
    description: '快速获得宇宙给你的指引，适合每日运势或简单问题',
    cardCount: 1,
    positions: ['当下指引'],
    layoutClass: 'single-layout',
  },
  three: {
    type: 'three',
    name: 'Past · Present · Future',
    nameZh: '三牌阵 · 过去现在未来',
    description: '揭示时间的流动，看清过去的影响、现在的状态与未来的可能',
    cardCount: 3,
    positions: ['过去', '现在', '未来'],
    layoutClass: 'three-layout',
  },
  'celtic-cross': {
    type: 'celtic-cross',
    name: 'Celtic Cross',
    nameZh: '凯尔特十字牌阵',
    description: '最经典的塔罗牌阵，深入探索问题的各个层面，适合重大决策',
    cardCount: 10,
    positions: [
      '现状核心',
      '阻碍/助力',
      '根源/基础',
      '过去',
      '潜在/目标',
      '近期未来',
      '自我态度',
      '外部环境',
      '希望与恐惧',
      '最终结果',
    ],
    layoutClass: 'celtic-layout',
  },
};
