'use client';

import { useEffect, useRef, useState } from 'react';

const TERRAIN: [number, number][] = [
  [0,500],[650,500],[1050,470],[1500,418],
  [2000,368],[2500,315],[3000,238],[3400,170],[3600,152],
];
const SVG_H = 700;

const WAYPOINTS = [
  { x: 350,  icon: '🏘', label: '街',     sub: 'プロフィール',  color: '#c48878' },
  { x: 1050, icon: '🌲', label: '登山口', sub: 'チャンネル実績', color: '#6a8858' },
  { x: 2000, icon: '🏚', label: '山小屋', sub: '案件 & 料金',    color: '#a08060' },
  { x: 3290, icon: '⛰', label: '山頂',   sub: 'お問い合わせ',   color: '#8888a8' },
];

function groundY(x: number) {
  for (let i = 0; i < TERRAIN.length - 1; i++) {
    const [x0,y0]=TERRAIN[i],[x1,y1]=TERRAIN[i+1];
    if (x>=x0&&x<=x1) return y0+(y1-y0)*((x-x0)/(x1-x0));
  }
  return 500;
}

function slopeAngleDeg(x: number, dir: number) {
  const dx = 40;
  const dy = groundY(x + dx * dir) - groundY(x);
  const scaleY = (typeof window !== 'undefined' ? window.innerHeight : 750) / SVG_H;
  return Math.atan2(dy * scaleY, dx) * (180 / Math.PI);
}

export interface HikerConfig {
  id: number;
  startX: number;
  endX: number;
  speed: number;
  jacket: string;
  hat: string;
  pom: string;
  pack: string;
  showBubbles?: boolean;
}

export default function HikerInstance({
  startX, endX, speed, jacket, hat, pom, pack, showBubbles = false,
}: HikerConfig) {
  const hikerRef  = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const xRef      = useRef(startX);
  const dirRef    = useRef(1);
  const rafRef    = useRef(0);
  const nearRef   = useRef<number | null>(null);
  const pauseRef  = useRef<{ flipAt: number; walkAt: number } | null>(null);
  const [nearIdx,   setNearIdx]   = useState<number | null>(null);
  const [isWalking, setIsWalking] = useState(true);

  useEffect(() => {
    let lastTs = 0;
    const tick = (ts: number) => {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
      lastTs = ts;

      const pause = pauseRef.current;
      if (pause) {
        if (ts >= pause.flipAt && dirRef.current === 1) {
          dirRef.current = -1;
          if (svgRef.current) svgRef.current.style.transform = 'scaleX(-1)';
        }
        if (ts >= pause.walkAt) {
          pauseRef.current = null;
          setIsWalking(true);
        }
      } else {
        xRef.current += speed * dt * dirRef.current;
        if (xRef.current >= endX) {
          xRef.current = endX;
          pauseRef.current = { flipAt: ts + 400, walkAt: ts + 800 };
          setIsWalking(false);
        } else if (xRef.current <= startX) {
          xRef.current = startX;
          dirRef.current = 1;
          if (svgRef.current) svgRef.current.style.transform = '';
        }
      }

      const x     = xRef.current;
      const y     = groundY(x);
      const angle = slopeAngleDeg(x, dirRef.current);

      if (hikerRef.current) {
        hikerRef.current.style.left      = `${x}px`;
        hikerRef.current.style.top       = `calc(${(y / SVG_H) * 100}% - 42px)`;
        hikerRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      }

      if (showBubbles) {
        let newNear: number | null = null;
        for (let i = 0; i < WAYPOINTS.length; i++) {
          if (Math.abs(x - WAYPOINTS[i].x) < 90) { newNear = i; break; }
        }
        if (newNear !== nearRef.current) {
          nearRef.current = newNear;
          setNearIdx(newNear);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wp = showBubbles && nearIdx !== null ? WAYPOINTS[nearIdx] : null;
  const ws = isWalking ? 'running' : 'paused';
  const anim = (name: string) => ({
    animation: `${name} 0.54s ease-in-out infinite`,
    animationPlayState: ws,
  } as React.CSSProperties);

  return (
    <div ref={hikerRef} className="absolute pointer-events-none" style={{ width: 28, height: 44, zIndex: 10 }}>
      {/* 吹き出し */}
      {wp && (
        <div key={nearIdx} className="hk-bubble absolute" style={{
          bottom: 50, left: '50%', transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          background: 'rgba(250,244,240,0.93)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8, padding: '6px 10px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          borderLeft: `3px solid ${wp.color}`,
          fontFamily: 'var(--font-serif-jp), serif',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5a3c2c' }}>{wp.icon} {wp.label}</div>
          <div style={{ fontSize: 9, color: '#9a7868', marginTop: 1 }}>{wp.sub}</div>
          <div style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '6px solid rgba(250,244,240,0.93)',
          }}/>
        </div>
      )}

      {/* 地面の影 */}
      <div style={{
        position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)',
        width: 18, height: 4, borderRadius: '50%',
        background: 'rgba(0,0,0,0.22)', filter: 'blur(2px)',
      }}/>

      <svg ref={svgRef} width="28" height="44" viewBox="-14 -44 28 44" overflow="visible"
        style={{ transformOrigin: '50% 100%', transition: 'transform 0.28s ease-in-out' }}>

        {/* 頭 */}
        <circle cx="0" cy="-36" r="4.5" fill="#5a3e28"/>
        <rect x="-4.5" y="-42" width="9" height="7" rx="2" fill={hat}/>
        <rect x="-5.5" y="-37" width="11" height="2.5" rx="1" fill={hat}/>
        <circle cx="0" cy="-43" r="1.8" fill={pom}/>

        <g style={{ animationPlayState: ws } as React.CSSProperties} className="hk-body">
          <rect x="-4.5" y="-31" width="9" height="19" rx="2.5" fill={jacket}/>
          <line x1="0" y1="-30" x2="0" y2="-13" stroke="#0000001a" strokeWidth="1"/>
          {/* バックパック（左＝背中） */}
          <rect x="-10" y="-30" width="7" height="15" rx="2.5" fill={pack}/>
          <rect x="-9.5" y="-24" width="6" height="2" rx="1" fill="#0000002a"/>

          {/* 左腕 */}
          <g style={{ transformOrigin: '-3.5px -28px', ...anim('hk-arm-l') }}>
            <line x1="-3.5" y1="-28" x2="-8" y2="-19" stroke="#3a302888" strokeWidth="3.5" strokeLinecap="round"/>
          </g>
          {/* 右腕 + ストック */}
          <g style={{ transformOrigin: '3.5px -28px', ...anim('hk-arm-r') }}>
            <line x1="3.5" y1="-28" x2="8" y2="-19" stroke="#3a302888" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="8" y1="-19" x2="13" y2="4" stroke="#b09060" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="13" cy="4" r="1.5" fill="none" stroke="#9a8050" strokeWidth="1"/>
          </g>

          {/* 左脚 */}
          <g style={{ transformOrigin: '-2px -12px', ...anim('hk-leg-l') }}>
            <line x1="-2" y1="-12" x2="-4.5" y2="0" stroke="#2a3820" strokeWidth="4" strokeLinecap="round"/>
            <path d="M-7,0 Q-5,-1.5 -2.5,0 L-2,2 Q-5.5,3.5 -8,2 Z" fill="#1e2818"/>
          </g>
          {/* 右脚 */}
          <g style={{ transformOrigin: '2px -12px', ...anim('hk-leg-r') }}>
            <line x1="2" y1="-12" x2="4.5" y2="0" stroke="#2a3820" strokeWidth="4" strokeLinecap="round"/>
            <path d="M2,0 Q4.5,-1.5 7,0 L7.5,2 Q4.5,3.5 1.5,2 Z" fill="#1e2818"/>
          </g>
        </g>
      </svg>
    </div>
  );
}
