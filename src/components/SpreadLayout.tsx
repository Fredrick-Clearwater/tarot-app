import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import type { DrawnCard, SpreadType } from '../types';
import { SPREADS } from '../constants/spreads';
import CardFace from './CardFace';

interface SpreadLayoutProps {
  cards: DrawnCard[];
  spreadType: SpreadType;
  onCardClick: (index: number) => void;
}

export default function SpreadLayout({ cards, spreadType, onCardClick }: SpreadLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spread = SPREADS[spreadType];

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.spread-card');
      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, stagger: 0.15,
          ease: 'back.out(1.4)',
        }
      );
    }
  }, [cards]);

  return (
    <div className="w-full py-8 px-4">
      {spreadType === 'single' && (
        <div ref={containerRef} className="flex items-center justify-center min-h-[350px]">
          {cards.map((dc, i) => (
            <div key={i} className="spread-card flex flex-col items-center gap-3">
              <CardFace drawnCard={dc} onClick={() => onCardClick(i)} />
              <span className="text-sm text-gray-400 font-medium">{spread.positions[i]}</span>
              {dc.isReversed && dc.isRevealed && (
                <span className="text-[10px] text-red-400">逆位</span>
              )}
            </div>
          ))}
        </div>
      )}

      {spreadType === 'three' && (
        <div ref={containerRef} className="flex flex-wrap items-start justify-center gap-6 sm:gap-12 min-h-[350px]">
          {cards.map((dc, i) => (
            <div key={i} className="spread-card flex flex-col items-center gap-3">
              <CardFace drawnCard={dc} onClick={() => onCardClick(i)} />
              <span className="text-sm text-gray-400 font-medium">{spread.positions[i]}</span>
              {dc.isReversed && dc.isRevealed && (
                <span className="text-[10px] text-red-400">逆位</span>
              )}
            </div>
          ))}
        </div>
      )}

      {spreadType === 'celtic-cross' && (
        <div className="flex flex-col items-center gap-6 overflow-x-auto pb-4">
          <p className="text-xs text-gray-500 sm:hidden">← 横向滑动查看完整牌阵 →</p>
          {/* Celtic Cross grid — uses absolute positioning within a container */}
          <div
            ref={containerRef}
            className="relative mx-auto flex-shrink-0"
            style={{ width: 700, height: 780 }}
          >
            {cards.slice(0, 10).map((dc, i) => {
              const pos = getCelticPosition(i);
              return (
                <div
                  key={i}
                  className="spread-card absolute flex flex-col items-center gap-1"
                  style={{ left: pos.x, top: pos.y }}
                >
                  <CardFace drawnCard={dc} onClick={() => onCardClick(i)} />
                  <span className="text-[10px] text-gray-400 max-w-[140px] text-center leading-tight">
                    {spread.positions[i]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Position legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-gray-500 w-full max-w-2xl">
            {spread.positions.slice(0, 10).map((pos, i) => (
              <div key={i} className="text-center px-2 py-1 bg-white/5 rounded">
                {i + 1}. {pos}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Returns pixel positions for Celtic Cross layout */
function getCelticPosition(index: number): { x: number; y: number } {
  // Classic Celtic Cross: cross on the left, staff on the right
  const positions: { x: number; y: number }[] = [
    { x: 200, y: 200 },  // 0: Present (center of cross)
    { x: 215, y: 200 },  // 1: Crossing (overlaps present)
    { x: 200, y: 390 },  // 2: Foundation (below)
    { x: 30,  y: 200 },  // 3: Past (left)
    { x: 200, y: 10 },   // 4: Crown (above)
    { x: 370, y: 200 },  // 5: Near Future (right)
    { x: 540, y: 10 },   // 6: Self (staff top)
    { x: 540, y: 180 },  // 7: Environment
    { x: 540, y: 350 },  // 8: Hopes & Fears
    { x: 540, y: 520 },  // 9: Outcome (staff bottom)
  ];
  return positions[index] ?? { x: 0, y: 0 };
}
