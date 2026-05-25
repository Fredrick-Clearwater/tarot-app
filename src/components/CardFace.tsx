import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import type { DrawnCard } from '../types';

interface CardFaceProps {
  drawnCard: DrawnCard;
  onClick?: () => void;
  className?: string;
}

const MAJOR_NUMERALS: Record<number, string> = {
  0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
  11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV',
  16: 'XVI', 17: 'XVII', 18: 'XVIII', 19: 'XIX', 20: 'XX', 21: 'XXI',
};

export default function CardFace({ drawnCard, onClick, className = '' }: CardFaceProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const { card, isReversed, isRevealed } = drawnCard;

  // Flips the inner card element to reveal the front
  useEffect(() => {
    if (isRevealed && innerRef.current) {
      gsap.to(innerRef.current, {
        rotateY: 180,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }
  }, [isRevealed]);

  const cardNumber =
    card.arcana === 'major'
      ? MAJOR_NUMERALS[card.number] ?? card.number
      : ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'P', 'K', 'Q', 'K'][card.number] ?? card.number;

  return (
    <div
      onClick={onClick}
      className={`perspective-1000 cursor-pointer ${className}`}
      style={{ width: 160, height: 260 }}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT FACE — hidden when face-down, visible after 180deg flip */}
        <div
          className="absolute inset-0 rounded-2xl border-2 overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className={`h-full flex flex-col items-center justify-center text-center p-3
                          bg-gradient-to-b from-mystic-900 to-mystic-950
                          ${isReversed ? 'border-red-500/30' : 'border-gold-400/30'}`}>
            <span className={`text-[10px] uppercase tracking-widest mb-1
                            ${card.arcana === 'major' ? 'text-gold-400' : 'text-mystic-300'}`}>
              {card.arcana === 'major' ? 'Major Arcana' : card.suit}
            </span>

            <span className="text-2xl font-serif font-bold text-white mb-1">
              {cardNumber}
            </span>

            <h3 className="font-serif font-semibold text-white text-xs mb-0.5">
              {card.name}
            </h3>
            <p className="text-[9px] text-gray-500 mb-1">{card.nameEn}</p>

            <div className="flex flex-wrap justify-center gap-0.5">
              {card.keywords.slice(0, 3).map((kw) => (
                <span key={kw} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded-full text-gray-400">
                  {kw}
                </span>
              ))}
            </div>

            {isReversed && (
              <div className="mt-1.5 text-[10px] text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded-full">
                逆位 ↑
              </div>
            )}
          </div>
        </div>

        {/* BACK FACE — visible initially (no pre-rotation), hidden after flip */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-mystic-700 via-mystic-800 to-mystic-900
                     border-2 border-mystic-500/40 card-shadow overflow-hidden backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-2 rounded-xl border border-mystic-500/20" />
          <div className="absolute inset-4 rounded-lg border border-mystic-500/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">🌙</div>
              <div className="w-16 h-16 mx-auto rounded-full
                              bg-gradient-to-br from-mystic-400/20 to-gold-400/20
                              flex items-center justify-center
                              border border-mystic-400/30">
                <span className="text-2xl">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
