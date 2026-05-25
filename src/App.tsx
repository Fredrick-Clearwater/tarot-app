import { useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import type { AppPage, SpreadType, DrawnCard, ReadingRecord } from './types';
import { SPREADS } from './constants/spreads';
import { useDeck } from './hooks/useDeck';
import { useReading } from './hooks/useReading';
import { useHistory } from './hooks/useHistory';
import Header from './components/Header';
import SpreadSelector from './components/SpreadSelector';
import SpreadLayout from './components/SpreadLayout';
import ReadingResult from './components/ReadingResult';
import HistoryPanel from './components/HistoryPanel';
import HistoryDetail from './components/HistoryDetail';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const [page, setPage] = useState<AppPage>('home');
  const [viewingRecord, setViewingRecord] = useState<ReadingRecord | null>(null);
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);

  const { shuffled, isShuffling, shuffle, reset: resetDeck } = useDeck();
  const {
    phase,
    spreadType,
    cards,
    question,
    selectSpread,
    setQuestion,
    setCards,
    revealCard,
    revealAll,
    goToReading,
    reset: resetReading,
    goToSelect,
  } = useReading();

  const { records, save, remove, clear } = useHistory();

  // Reset all when going home
  const goHome = useCallback(() => {
    setPage('home');
    resetReading();
    resetDeck();
    setViewingRecord(null);
    setSelectedCard(null);
    setQuestion('');
  }, [resetReading, resetDeck, setQuestion]);

  // Auto-shuffle when entering shuffling phase
  useEffect(() => {
    if (phase === 'shuffling') {
      shuffle();
    }
  }, [phase, shuffle]);

  // Animate on shuffled state change
  useEffect(() => {
    if (shuffled.length > 0 && phase === 'shuffling') {
      gsap.fromTo(
        '#deck-pile',
        { scale: 0.97, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [shuffled, phase]);

  const handleSelectSpread = useCallback(
    (type: SpreadType) => {
      selectSpread(type);
    },
    [selectSpread]
  );

  const handleDraw = useCallback(() => {
    if (!spreadType) return;
    const count = SPREADS[spreadType].cardCount;
    const drawn = shuffled.slice(0, count).map((card, i) => ({
      card,
      isReversed: Math.random() < 0.5,
      position: SPREADS[spreadType].positions[i],
      positionIndex: i,
      isRevealed: false,
    }));
    setCards(drawn);

    // Animate cards appearing
    setTimeout(() => {
      const cardEls = document.querySelectorAll('.spread-card');
      gsap.fromTo(
        cardEls,
        { scale: 0, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' }
      );
    }, 100);
  }, [spreadType, shuffled, setCards]);

  const handleRevealCard = useCallback(
    (index: number) => {
      if (!cards[index] || cards[index].isRevealed) return;
      revealCard(index);

      // Check if all revealed after this one
      const allRevealed = cards.every(
        (c, i) => c.isRevealed || i === index
      );
      if (allRevealed) {
        setTimeout(() => goToReading(), 1000);
      }
    },
    [cards, revealCard, goToReading]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      const card = cards[index];
      if (!card) return;
      if (!card.isRevealed) {
        handleRevealCard(index);
      } else {
        setSelectedCard(card);
      }
    },
    [cards, handleRevealCard]
  );

  const handleSaveReading = useCallback(() => {
    if (!spreadType || cards.length === 0) return;
    const record: ReadingRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(),
      spreadType,
      question,
      cards,
    };
    save(record);
    goHome();
  }, [spreadType, cards, question, save, goHome]);

  return (
    <div id="tarot-app" className="min-h-screen flex flex-col">
      <Header onNavigate={setPage} currentPage={page} />

      <main className="flex-1">
        {/* ===== HOME PAGE ===== */}
        {page === 'home' && (
          <>
            {/* Spread selection */}
            {(phase === 'idle' || phase === 'selecting-spread') && (
              <div>
                <SpreadSelector onSelect={handleSelectSpread} />

                {/* Question input */}
                <div className="max-w-md mx-auto px-4 -mt-4 mb-8">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="（可选）写下你想问的问题..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                               text-sm text-white placeholder-gray-600
                               focus:outline-none focus:border-mystic-500/40 focus:bg-white/8
                               transition-all"
                  />
                </div>
              </div>
            )}

            {/* Shuffling phase */}
            {phase === 'shuffling' && (
              <div className="max-w-xl mx-auto px-4 py-12 text-center">
                <h3 className="text-xl font-serif text-white mb-2">
                  {spreadType ? SPREADS[spreadType].nameZh : ''}
                </h3>

                {question && (
                  <p className="text-sm text-gray-500 italic mb-6">"{question}"</p>
                )}

                {/* Deck pile visual */}
                <div
                  id="deck-pile"
                  className="relative mx-auto mb-10"
                  style={{ width: 180, height: 280 }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-2xl bg-gradient-to-br from-mystic-700 via-mystic-800 to-mystic-900
                                 border-2 border-mystic-500/30"
                      style={{
                        width: 160,
                        height: 250,
                        left: 10 + i * 2,
                        top: 15 - i * 2,
                        transform: `rotate(${(i - 2) * 1.5}deg)`,
                        animation: isShuffling ? `float ${2 + i * 0.3}s ease-in-out infinite` : 'none',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}

                  {/* Glow */}
                  <div className="absolute inset-0 bg-mystic-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
                </div>

                {/* Status */}
                <div className="mb-8">
                  {isShuffling ? (
                    <div className="space-y-2">
                      <p className="text-mystic-300 text-sm animate-pulse">宇宙正在为你洗牌...</p>
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-mystic-400"
                            style={{
                              animation: `float 1s ease-in-out infinite`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">牌已洗好，请开始抽牌</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button onClick={goToSelect} className="mystic-btn text-sm">
                    重新选择牌阵
                  </button>
                  <button
                    onClick={handleDraw}
                    disabled={isShuffling}
                    className="mystic-btn-primary text-sm px-8"
                  >
                    ✨ 抽牌
                  </button>
                </div>
              </div>
            )}

            {/* Drawing / Revealing phase */}
            {(phase === 'drawing' || phase === 'revealing') && spreadType && (
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  点击牌面翻牌解读 · 已翻开{' '}
                  {cards.filter((c) => c.isRevealed).length}/{cards.length}
                </p>

                <SpreadLayout
                  cards={cards}
                  spreadType={spreadType}
                  onCardClick={handleCardClick}
                />

                <div className="flex items-center justify-center gap-4 pb-8">
                  {cards.some((c) => !c.isRevealed) && (
                    <button onClick={revealAll} className="mystic-btn text-sm">
                      全部翻开
                    </button>
                  )}
                  <button
                    onClick={() => resetReading()}
                    className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    重新开始
                  </button>
                </div>
              </div>
            )}

            {/* Reading phase */}
            {phase === 'reading' && spreadType && (
              <div className="text-center">
                <div className="mb-6 mt-4">
                  <h3 className="text-2xl font-serif text-gradient mb-1">你的解读已就绪</h3>
                  <p className="text-sm text-gray-400">点击牌面查看详细牌意</p>
                </div>

                <SpreadLayout
                  cards={cards}
                  spreadType={spreadType}
                  onCardClick={handleCardClick}
                />

                <div className="flex items-center justify-center gap-4 pb-12 pt-4">
                  <button onClick={() => resetReading()} className="mystic-btn text-sm">
                    重新占卜
                  </button>
                  <button onClick={handleSaveReading} className="mystic-btn-primary text-sm">
                    💾 保存记录
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== HISTORY PAGE ===== */}
        {page === 'history' && !viewingRecord && (
          <HistoryPanel
            records={records}
            onView={(rec) => setViewingRecord(rec)}
            onDelete={remove}
            onBack={goHome}
          />
        )}
        {viewingRecord && (
          <HistoryDetail record={viewingRecord} onClose={() => setViewingRecord(null)} />
        )}

        {/* ===== SETTINGS PAGE ===== */}
        {page === 'settings' && (
          <SettingsPanel
            onBack={goHome}
            onClearHistory={clear}
            historyCount={records.length}
          />
        )}
      </main>

      {/* Card detail modal */}
      {selectedCard && (
        <ReadingResult card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
