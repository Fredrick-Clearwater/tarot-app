import type { SpreadType } from '../types';
import { SPREADS } from '../constants/spreads';

interface SpreadSelectorProps {
  onSelect: (type: SpreadType) => void;
}

export default function SpreadSelector({ onSelect }: SpreadSelectorProps) {
  const spreads = Object.values(SPREADS);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-gradient mb-3">
          选择你的牌阵
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
          静心凝神，选择你想要与宇宙对话的方式
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {spreads.map((spread) => (
          <button
            key={spread.type}
            onClick={() => onSelect(spread.type)}
            className="group glass-panel p-6 text-left transition-all duration-300
                       hover:bg-white/10 hover:border-mystic-500/30
                       hover:shadow-lg hover:shadow-mystic-500/10
                       hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">
                {spread.cardCount === 1 ? '☀️' : spread.cardCount === 3 ? '🌓' : '✧'}
              </span>
              <div>
                <h3 className="font-serif font-semibold text-white text-lg">
                  {spread.nameZh}
                </h3>
                <p className="text-xs text-mystic-300">{spread.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {spread.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-mystic-400">
              <span className="bg-mystic-600/20 px-2 py-1 rounded-full">
                {spread.cardCount} 张牌
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
