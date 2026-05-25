import type { ReadingRecord } from '../types';
import { SPREADS } from '../constants/spreads';

interface HistoryPanelProps {
  records: ReadingRecord[];
  onView: (record: ReadingRecord) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export default function HistoryPanel({ records, onView, onDelete, onBack }: HistoryPanelProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors p-2 -ml-2"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-serif font-semibold text-gradient">历史记录</h2>
      </div>

      {records.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🃏</div>
          <p className="text-gray-400">还没有占卜记录</p>
          <p className="text-sm text-gray-600 mt-1">去首页开始你的第一次抽牌吧</p>
        </div>
      )}

      <div className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className="glass-panel p-4 flex items-center gap-4 group
                       hover:bg-white/8 transition-all cursor-pointer"
            onClick={() => onView(record)}
          >
            <div className="text-2xl shrink-0">
              {record.spreadType === 'single' ? '☀️' : record.spreadType === 'three' ? '🌓' : '✧'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white truncate">
                  {SPREADS[record.spreadType]?.nameZh ?? record.spreadType}
                </h3>
                <span className="text-[10px] text-gray-500">
                  {record.cards.length} 张
                </span>
              </div>
              {record.question && (
                <p className="text-xs text-gray-500 truncate mt-0.5">"{record.question}"</p>
              )}
              <p className="text-[10px] text-gray-600 mt-1">
                {new Date(record.date).toLocaleString('zh-CN')}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(record.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity
                         text-gray-600 hover:text-red-400 p-1.5"
              aria-label="Delete record"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
