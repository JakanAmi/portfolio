'use client';

import { useEffect, useRef } from 'react';

const TERRAIN: [number, number][] = [
  [0,500],[650,500],[1050,470],[1500,418],
  [2000,368],[2500,315],[3000,238],[3400,170],[3600,152],
];
const SVG_H   = 700;
const WORLD_W = 3600;
const START_X = 550;  // 森の手前からスタート
const END_X   = 3500; // 山頂手前でループ

function groundY(x: number) {
  for (let i = 0; i < TERRAIN.length - 1; i++) {
    const [x0,y0]=TERRAIN[i],[x1,y1]=TERRAIN[i+1];
    if (x>=x0&&x<=x1) return y0+(y1-y0)*((x-x0)/(x1-x0));
  }
  return 500;
}

function slopeAngleDeg(x: number) {
  const dx = 40;
  const dy = groundY(x + dx) - groundY(x);
  const scaleY = (typeof window !== 'undefined' ? window.innerHeight : 750) / SVG_H;
  return Math.atan2(dy * scaleY, dx) * (180 / Math.PI);
}

export default function HikerAnimation() {
  const hikerRef = useRef<HTMLDivElement>(null);
  const xRef     = useRef(START_X);
  const rafRef   = useRef(0);

  useEffect(() => {
    const SPEED = 20; // SVG x 単位/秒（ゆっくり登山ペース）
    let lastTs = 0;

    const tick = (ts: number) => {
      const dt    = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
      lastTs = ts;

      xRef.current += SPEED * dt;
      if (xRef.current > END_X) xRef.current = START_X;

      const x     = xRef.current;
      const y     = groundY(x);
      const angle = slopeAngleDeg(x);

      if (hikerRef.current) {
        hikerRef.current.style.left      = `${x}px`;
        hikerRef.current.style.top       = `calc(${(y / SVG_H) * 100}% - 40px)`;
        hikerRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <style>{`
        @keyframes hk-leg-l {
          0%,100% { transform: rotate(-22deg); }
          50%      { transform: rotate(22deg); }
        }
        @keyframes hk-leg-r {
          0%,100% { transform: rotate(22deg); }
          50%      { transform: rotate(-22deg); }
        }
        @keyframes hk-arm-l {
          0%,100% { transform: rotate(18deg); }
          50%      { transform: rotate(-18deg); }
        }
        @keyframes hk-arm-r {
          0%,100% { transform: rotate(-18deg); }
          50%      { transform: rotate(18deg); }
        }
        @keyframes hk-bob {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-1px); }
        }
        .hk-leg-l { animation: hk-leg-l 0.54s ease-in-out infinite; }
        .hk-leg-r { animation: hk-leg-r 0.54s ease-in-out infinite; }
        .hk-arm-l { animation: hk-arm-l 0.54s ease-in-out infinite; }
        .hk-arm-r { animation: hk-arm-r 0.54s ease-in-out infinite; }
        .hk-body  { animation: hk-bob   0.27s ease-in-out infinite; }
      `}</style>

      <div
        ref={hikerRef}
        className="absolute pointer-events-none"
        style={{ width: 28, height: 44 }}
      >
        {/* 地面の影 */}
        <div style={{
          position: 'absolute', bottom: 1, left: '50%',
          transform: 'translateX(-50%)',
          width: 18, height: 4, borderRadius: '50%',
          background: 'rgba(0,0,0,0.22)',
          filter: 'blur(2px)',
        }}/>

        <svg width="28" height="44" viewBox="-14 -44 28 44" overflow="visible">

          {/* ─── 頭 ─── */}
          <circle cx="0" cy="-36" r="4.5" fill="#5a3e28"/>
          {/* ニット帽 */}
          <rect x="-4.5" y="-42" width="9" height="7" rx="2" fill="#3a5848"/>
          <rect x="-5.5" y="-37" width="11" height="2.5" rx="1" fill="#2a4838"/>
          {/* ポンポン */}
          <circle cx="0" cy="-43" r="1.8" fill="#c07878"/>

          {/* ─── 胴体 ─── */}
          <g className="hk-body">
            {/* ジャケット */}
            <rect x="-4.5" y="-31" width="9" height="19" rx="2.5" fill="#4a6848"/>
            {/* ジッパー線 */}
            <line x1="0" y1="-30" x2="0" y2="-13" stroke="#3a5040" strokeWidth="1" opacity="0.5"/>
            {/* バックパック */}
            <rect x="3.5" y="-30" width="7" height="15" rx="2.5" fill="#8a6040"/>
            {/* バックパックの留め具 */}
            <rect x="4" y="-24" width="6" height="2" rx="1" fill="#6a4828" opacity="0.7"/>

            {/* ─── 腕（肩から） ─── */}
            {/* 左腕 */}
            <g className="hk-arm-l" style={{ transformOrigin: '-3.5px -28px' }}>
              <line x1="-3.5" y1="-28" x2="-8" y2="-19"
                stroke="#3a5040" strokeWidth="3.5" strokeLinecap="round"/>
            </g>
            {/* 右腕 + ストック */}
            <g className="hk-arm-r" style={{ transformOrigin: '3.5px -28px' }}>
              <line x1="3.5" y1="-28" x2="8" y2="-19"
                stroke="#3a5040" strokeWidth="3.5" strokeLinecap="round"/>
              {/* ストック本体 */}
              <line x1="8" y1="-19" x2="13" y2="4"
                stroke="#b09060" strokeWidth="1.5" strokeLinecap="round"/>
              {/* ストック先端リング */}
              <circle cx="13" cy="4" r="1.5" fill="none" stroke="#9a8050" strokeWidth="1"/>
            </g>

            {/* ─── 脚 ─── */}
            {/* 左脚 */}
            <g className="hk-leg-l" style={{ transformOrigin: '-2px -12px' }}>
              <line x1="-2" y1="-12" x2="-4.5" y2="0"
                stroke="#2a3820" strokeWidth="4" strokeLinecap="round"/>
              {/* ブーツ */}
              <path d="M-7,0 Q-5,-1.5 -2.5,0 L-2,2 Q-5.5,3.5 -8,2 Z"
                fill="#1e2818"/>
              {/* ブーツのソール */}
              <path d="M-8.5,2 Q-5.5,4 -1.5,2.5"
                fill="none" stroke="#141e10" strokeWidth="1"/>
            </g>
            {/* 右脚 */}
            <g className="hk-leg-r" style={{ transformOrigin: '2px -12px' }}>
              <line x1="2" y1="-12" x2="4.5" y2="0"
                stroke="#2a3820" strokeWidth="4" strokeLinecap="round"/>
              {/* ブーツ */}
              <path d="M2,0 Q4.5,-1.5 7,0 L7.5,2 Q4.5,3.5 1.5,2 Z"
                fill="#1e2818"/>
              {/* ブーツのソール */}
              <path d="M1,2.5 Q4.5,4 8,2"
                fill="none" stroke="#141e10" strokeWidth="1"/>
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}
