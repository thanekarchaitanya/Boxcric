import React from 'react';

interface CoinProps {
  side?: 'HEADS' | 'TAILS';
  isFlipping?: boolean;
  isResult?: boolean;
  className?: string;
  size?: string;
  rotationX?: number;
}

const MandalaArt: React.FC<{ type: 'HEADS' | 'TAILS'; isResult?: boolean }> = ({ type, isResult }) => {
  const primary = isResult ? '#000000' : (type === 'HEADS' ? '#00E676' : '#FFFFFF');
  
  return (
    <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 100 100">
      <g opacity="0.6">
        {[...Array(120)].map((_, i) => (
          <line 
            key={`mill-${i}`}
            x1="50" y1="2" x2="50" y2="6.5"
            stroke={primary}
            strokeWidth="0.7"
            transform={`rotate(${i * 3} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="45" fill="none" stroke={primary} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={primary} strokeWidth="1" opacity="0.4" />
      <g transform="translate(50, 50)">
        {[...Array(24)].map((_, i) => (
          <circle key={`dot-out-${i}`} cx="0" cy="-38.5" r="1.3" fill={primary} transform={`rotate(${i * 15})`} />
        ))}
        {[...Array(16)].map((_, i) => (
          <line key={`spoke-${i}`} x1="0" y1="-14" x2="0" y2="-35" stroke={primary} strokeWidth="1" opacity="0.25" transform={`rotate(${i * 22.5})`} />
        ))}
        {[...Array(8)].map((_, i) => (
          <circle key={`petal-${i}`} cx="0" cy="-22" r="11" fill="none" stroke={primary} strokeWidth="1.4" transform={`rotate(${i * 45})`} opacity="0.9" />
        ))}
        <circle r="18" fill="none" stroke={primary} strokeWidth="1" strokeDasharray="1 3" />
        <circle r="14" fill="none" stroke={primary} strokeWidth="2" />
        {type === 'HEADS' ? (
          <g>
            <circle r="7.5" fill={primary} />
            {[...Array(12)].map((_, i) => (
              <circle key={`sun-${i}`} cx="0" cy="-11.5" r="1.4" fill={primary} transform={`rotate(${i * 30})`} />
            ))}
          </g>
        ) : (
          <g transform="rotate(-15)">
            <path d="M-5 -9 A11 11 0 1 1 -5 9 A9 9 0 1 0 -5 -9" fill={primary} />
            <circle cx="5" cy="-3" r="1.8" fill={primary} opacity="0.8" />
            <circle cx="3" cy="5" r="1.2" fill={primary} opacity="0.6" />
          </g>
        )}
      </g>
    </svg>
  );
};

const CoinFace: React.FC<{ isBack?: boolean; isResult?: boolean; side: 'HEADS' | 'TAILS' }> = ({ isBack, isResult, side }) => {
  const baseBg = isResult 
    ? 'bg-[#00E676]' 
    : (side === 'HEADS' ? 'bg-[#2A2A2A]' : 'bg-[#333333]');
  
  const borderColor = isResult ? 'border-white/80' : 'border-white/20';

  return (
    <div className={`
      absolute inset-0 rounded-full border-[3px] flex items-center justify-center transition-all overflow-hidden
      ${baseBg} ${borderColor} ${isResult ? 'text-black shadow-[0_0_120px_rgba(0,230,118,0.7)]' : 'text-white'}
    `} style={{ 
      backfaceVisibility: 'hidden', 
      transform: isBack ? 'rotateY(180deg) translateZ(9px)' : 'translateZ(9px)' 
    }}>
      <MandalaArt type={side} isResult={isResult} />
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-white/10 to-white/20 pointer-events-none opacity-50"></div>
      <div className="absolute w-[60%] h-[60%] border border-white/5 rounded-full pointer-events-none"></div>
    </div>
  );
};

const Coin: React.FC<CoinProps> = ({ side = 'HEADS', isFlipping = false, isResult = false, className = "", size = "w-52 h-52", rotationX = 15 }) => {
  return (
    <div className={`coin-container ${size} flex items-center justify-center ${className}`}>
      <div 
        className={`coin w-full h-full relative ${isFlipping ? 'coin-flipping' : ''}`}
        style={{ transform: !isFlipping ? `rotateX(${rotationX}deg) ${side === 'TAILS' && !isResult ? 'rotateY(180deg)' : ''}` : undefined }}
      >
        <CoinFace side="HEADS" isResult={isResult && side === 'HEADS'} />
        <CoinFace side="TAILS" isBack isResult={isResult && side === 'TAILS'} />

        {[...Array(18)].map((_, i) => (
          <div 
            key={i} 
            className="absolute inset-0 rounded-full border border-black/50" 
            style={{ 
              transform: `translateZ(${(i - 9)}px)`, 
              background: isResult ? '#00A352' : (i % 2 === 0 ? '#1A1A1A' : '#2A2A2A'),
              opacity: isResult ? 0.4 : 1,
              boxShadow: i === 0 || i === 17 ? 'none' : 'inset 0 0 4px rgba(255,255,255,0.05)'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Coin;