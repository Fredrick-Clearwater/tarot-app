import type { DrawnCard } from '../types';

interface ReadingResultProps {
  card: DrawnCard;
  onClose: () => void;
}

export default function ReadingResult({ card, onClose }: ReadingResultProps) {
  const { card: c, isReversed, position } = card;
  const meanings = isReversed ? c.meanings.reversed : c.meanings.upright;
  const orientationLabel = isReversed ? '逆位' : '正位';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel bg-mystic-950/95 w-full max-w-lg max-h-[85vh] overflow-y-auto
                      animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`p-5 border-b ${isReversed ? 'border-red-500/20' : 'border-mystic-500/20'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                            ${isReversed ? 'bg-red-500/10 text-red-400' : 'bg-mystic-500/10 text-mystic-300'}`}>
              {orientationLabel}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-serif font-semibold text-white">
            {c.name} <span className="text-sm text-gray-500 font-normal">· {c.nameEn}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">牌阵位置：{position}</p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {c.keywords.map((kw) => (
              <span key={kw} className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-300">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Meanings */}
        <div className="p-5 space-y-4">
          <ReadingSection title="🃏 总体解读" content={meanings.general} />
          <ReadingSection title="💕 感情" content={meanings.love} />
          <ReadingSection title="💼 事业" content={meanings.career} />
          <ReadingSection title="🌿 健康" content={meanings.health} />
        </div>

        {/* Description */}
        <div className="px-5 pb-5">
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-gray-600 italic leading-relaxed">{c.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-mystic-300 mb-1">{title}</h4>
      <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
}
