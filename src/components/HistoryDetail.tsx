import { useRef, useEffect } from 'react';
import type { ReadingRecord } from '../types';
import { SPREADS } from '../constants/spreads';
import CardFace from './CardFace';

interface HistoryDetailProps {
  record: ReadingRecord;
  onClose: () => void;
}

export default function HistoryDetail({ record, onClose }: HistoryDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const spread = SPREADS[record.spreadType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        className="relative glass-panel bg-mystic-950/95 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif font-semibold text-white">
              {spread?.nameZh ?? record.spreadType}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(record.date).toLocaleString('zh-CN')}
            </p>
            {record.question && (
              <p className="text-sm text-gray-400 mt-2 italic">问题：{record.question}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cards */}
        <div className={record.spreadType === 'celtic-cross'
          ? 'grid grid-cols-2 sm:grid-cols-5 gap-4'
          : 'flex flex-wrap justify-center gap-4'}>
          {record.cards.map((dc, i) => (
            <div key={i} className="text-center">
              <CardFace drawnCard={{ ...dc, isRevealed: true }} />
              <p className="text-xs text-gray-400 mt-1">{dc.position}</p>
              {dc.isReversed && (
                <span className="text-[10px] text-red-400">逆位</span>
              )}
            </div>
          ))}
        </div>

        {/* Quick meanings */}
        <div className="mt-8 border-t border-white/5 pt-6">
          <h3 className="text-sm font-medium text-mystic-300 mb-4">牌意速览</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {record.cards.map((dc, i) => {
              const meanings = dc.isReversed
                ? dc.card.meanings.reversed.general
                : dc.card.meanings.upright.general;
              return (
                <div key={i} className="bg-white/3 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">
                      {dc.card.name}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      · {dc.position}
                    </span>
                    {dc.isReversed && (
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                        逆
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{meanings}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
