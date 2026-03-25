'use client';

import { useRef, useState, useEffect } from 'react';
import LandscapeOriginal from './components/LandscapeOriginal';
import LandscapeWinter from './components/LandscapeWinter';

type LandscapeId = 'original' | 'winter';
const LANDSCAPES: { id: LandscapeId; label: string }[] = [
  { id: 'original', label: '春〜秋' },
  { id: 'winter',   label: '冬' },
];

// ── World dimensions ──────────────────────────────────────────────
const WORLD_W = 3600;
const SVG_H   = 700;   // viewBox height

// ── Terrain keypoints [x, svgY] (lower svgY = higher elevation) ──
const TERRAIN: [number, number][] = [
  [0,    500], [650,  500], [1050, 470],
  [1500, 418], [2000, 368], [2500, 315],
  [3000, 238], [3400, 170], [3600, 152],
];

function groundY(x: number): number {
  for (let i = 0; i < TERRAIN.length - 1; i++) {
    const [x0, y0] = TERRAIN[i];
    const [x1, y1] = TERRAIN[i + 1];
    if (x >= x0 && x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
  }
  return 500;
}

// ── Locations ────────────────────────────────────────────────────
const LOCATIONS = [
  { id: 'town'    as const, x: 350,  label: '街',     sub: 'プロフィール' },
  { id: 'trail'   as const, x: 1050, label: '登山口', sub: 'チャンネル実績' },
  { id: 'hut'     as const, x: 2000, label: '山小屋', sub: '案件 & 料金' },
  { id: 'summit'  as const, x: 3290, label: '山頂',   sub: 'お問い合わせ' },
];
type Loc = typeof LOCATIONS[number]['id'];

// ── Main ─────────────────────────────────────────────────────────
export default function Page() {
  const worldRef  = useRef<HTMLDivElement>(null);
  const offsetX   = useRef(0);
  const drag      = useRef({ on: false, sx: 0, ox: 0 });
  const vel       = useRef(0);
  const lastX     = useRef({ x: 0, t: 0 });
  const raf       = useRef(0);
  const [active,    setActive]    = useState<Loc | null>(null);
  const [ready,     setReady]     = useState(false);
  const [landscape, setLandscape] = useState<LandscapeId>('original');

  const clamp = (v: number) => Math.max(-(WORLD_W - window.innerWidth), Math.min(0, v));

  const applyX = (x: number) => {
    offsetX.current = clamp(x);
    if (worldRef.current) worldRef.current.style.transform = `translateX(${offsetX.current}px)`;
  };

  const flyTo = (locX: number, id: Loc) => {
    cancelAnimationFrame(raf.current);
    const target = clamp(-(locX - window.innerWidth / 2));
    const s0 = offsetX.current;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const go = (now: number) => {
      const t = Math.min((now - t0) / 700, 1);
      applyX(s0 + (target - s0) * ease(t));
      if (t < 1) raf.current = requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
    setActive(id);
  };

  // Init position
  useEffect(() => {
    applyX(-(LOCATIONS[0].x - window.innerWidth * 0.35));
    setTimeout(() => setReady(true), 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag / wheel
  useEffect(() => {
    const vp = document.getElementById('vp')!;

    const down = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.noscroll')) return;
      cancelAnimationFrame(raf.current);
      drag.current = { on: true, sx: e.clientX, ox: offsetX.current };
      lastX.current = { x: e.clientX, t: Date.now() };
      vel.current = 0;
    };
    const move = (e: MouseEvent) => {
      if (!drag.current.on) return;
      const now = Date.now(); const dt = now - lastX.current.t;
      if (dt > 0) vel.current = (e.clientX - lastX.current.x) / dt * 16;
      lastX.current = { x: e.clientX, t: now };
      applyX(drag.current.ox + (e.clientX - drag.current.sx));
    };
    const up = () => {
      if (!drag.current.on) return;
      drag.current.on = false;
      const glide = () => {
        vel.current *= 0.91;
        applyX(offsetX.current + vel.current);
        if (Math.abs(vel.current) > 0.3) raf.current = requestAnimationFrame(glide);
      };
      requestAnimationFrame(glide);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      applyX(offsetX.current - e.deltaY * 2.5);
    };

    vp.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    vp.addEventListener('wheel', wheel, { passive: false });
    return () => {
      vp.removeEventListener('mousedown', down);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      vp.removeEventListener('wheel', wheel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serif = { fontFamily: 'var(--font-serif-jp), serif' };

  return (
    <>
      <div id="vp" className="fixed inset-0 overflow-hidden"
        style={{ background: landscape === 'winter' ? '#0a0e1a' : '#b8a0c0', cursor: 'grab', transition: 'background 0.8s' }}>

        {/* ── World ── */}
        <div
          ref={worldRef}
          className="absolute top-0 left-0 h-full"
          style={{ width: WORLD_W, willChange: 'transform', opacity: ready ? 1 : 0, transition: 'opacity 0.8s' }}
        >
          {/* SVG landscape */}
          {landscape === 'original' && <LandscapeOriginal />}
          {landscape === 'winter'   && <LandscapeWinter />}

          {/* ── Location markers (inside world) ── */}
          {LOCATIONS.map((loc) => {
            const svgY = groundY(loc.x);
            const pct  = svgY / SVG_H;
            const isActive = active === loc.id;
            return (
              <button
                key={loc.id}
                className="noscroll absolute flex flex-col items-center gap-1 group"
                style={{ left: loc.x, top: `calc(${pct * 100}% - 88px)`, transform: 'translateX(-50%)' }}
                onClick={() => flyTo(loc.x, loc.id)}
              >
                {/* Label */}
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: isActive ? 'var(--rose-dark)' : 'rgba(250,244,240,0.88)',
                    color: isActive ? 'var(--warm-white)' : 'var(--rose-dark)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-serif-jp), serif' }}>{loc.label}</span>
                  <span className="ml-1 opacity-60">/ {loc.sub}</span>
                </div>
                {/* Pin */}
                <div className="relative flex items-center justify-center">
                  {isActive && (
                    <div
                      className="absolute w-8 h-8 rounded-full animate-ping"
                      style={{ background: 'var(--rose-light)', opacity: 0.5 }}
                    />
                  )}
                  <div
                    className="w-4 h-4 rounded-full border-2 transition-all"
                    style={{
                      background: isActive ? 'var(--rose-dark)' : 'var(--warm-white)',
                      borderColor: 'var(--rose-dark)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
                {/* Connector line */}
                <div className="w-px h-4" style={{ background: 'var(--rose-dark)', opacity: 0.4 }}/>
              </button>
            );
          })}
        </div>

        {/* ── Fixed UI ── */}

        {/* Logo */}
        <button
          className="noscroll fixed top-6 left-6 z-20"
          onClick={() => flyTo(LOCATIONS[0].x, 'town')}
        >
          <span style={{ fontFamily: 'var(--font-serif-jp), serif', color: 'var(--rose-dark)' }}
            className="text-lg font-bold bg-[rgba(250,244,240,0.85)] backdrop-blur px-3 py-1.5 rounded-full shadow-sm"
          >
            443iwasaki
          </span>
        </button>

        {/* Location nav dots */}
        <div className="noscroll fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3
          bg-[rgba(250,244,240,0.8)] backdrop-blur px-4 py-2.5 rounded-full shadow-md">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => flyTo(loc.x, loc.id)}
              className="flex items-center gap-1.5 text-xs transition-all"
              style={{ color: active === loc.id ? 'var(--rose-dark)' : 'var(--taupe)' }}
            >
              <div
                className="rounded-full transition-all"
                style={{
                  width:  active === loc.id ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: active === loc.id ? 'var(--rose-dark)' : 'var(--rose-light)',
                }}
              />
              <span style={{ fontFamily: 'var(--font-serif-jp), serif' }}
                className={active === loc.id ? 'inline' : 'hidden md:inline'}>
                {loc.label}
              </span>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none
          text-xs px-4 py-2 rounded-full bg-[rgba(250,244,240,0.7)] backdrop-blur"
          style={{ color: 'var(--taupe)' }}
        >
          ← ドラッグして山を歩く →
        </div>

        {/* Landscape toggle */}
        <div className="noscroll fixed top-6 right-6 z-20 flex items-center gap-1
          bg-[rgba(250,244,240,0.8)] backdrop-blur px-2 py-1.5 rounded-full shadow-sm">
          {LANDSCAPES.map((ls) => (
            <button
              key={ls.id}
              onClick={() => setLandscape(ls.id)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                background: landscape === ls.id ? 'var(--rose-dark)' : 'transparent',
                color: landscape === ls.id ? 'var(--warm-white)' : 'var(--taupe)',
                fontFamily: 'var(--font-serif-jp), serif',
              }}
            >
              {ls.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          className="noscroll fixed bottom-0 left-0 right-0 z-30 transition-all duration-500"
          style={{ transform: active ? 'translateY(0)' : 'translateY(100%)' }}
        >
          <ContentPanel id={active} onClose={() => setActive(null)} />
        </div>
      </div>
    </>
  );
}

// ── Content Panel ─────────────────────────────────────────────────
function ContentPanel({ id, onClose }: { id: Loc | null; onClose: () => void }) {
  const serif = { fontFamily: 'var(--font-serif-jp), serif' };
  if (!id) return null;

  const panels: Record<Loc, React.ReactNode> = {
    town: (
      <div className="flex gap-8 items-start">
        <div
          className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl"
          style={{ background: 'var(--rose-pale)' }}
        >🏔</div>
        <div className="flex-1 min-w-0">
          <h2 style={{ ...serif, color: 'var(--rose-dark)' }} className="text-2xl font-bold mb-2">岩崎さん</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#6a5050' }}>
            登山歴10年以上。年間50山以上を歩くアクティブなハイカー。
            「買う前に必ず見るチャンネル」として視聴者から信頼されるチャンネルを運営。
            GH5・DJI Pocket 3・Mini 4 Pro で没入感ある映像を制作。
          </p>
          <div className="flex flex-wrap gap-2">
            {['登山女子', '年間50山+', 'ギアレビュー', 'コーデ', '映像制作'].map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'var(--rose-pale)', color: 'var(--rose-dark)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),

    trail: (
      <div>
        <h2 style={{ ...serif, color: 'var(--rose-dark)' }} className="text-xl font-bold mb-4">チャンネル実績</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: '12,800', l: '登録者数' }, { v: '190万', l: '総再生数' },
            { v: '161本',  l: '公開動画数' }, { v: '348K', l: '最高再生数' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl p-4" style={{ background: 'var(--rose-pale)' }}>
              <div style={{ ...serif, color: 'var(--rose-dark)' }} className="text-3xl font-bold">{s.v}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--taupe)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    hut: (
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 style={{ ...serif, color: 'var(--rose-dark)' }} className="text-xl font-bold mb-4">案件実績</h2>
          <div className="space-y-2">
            {[
              { brand: 'mont-bell',  result: '348,080 再生', tag: '商品レビュー' },
              { brand: 'Suunto',     result: '協賛案件',     tag: 'タイアップ' },
              { brand: 'Fastlane',   result: '協賛案件',     tag: 'タイアップ' },
              { brand: 'Snow Peak',  result: '71,200 再生',  tag: '商品レビュー' },
              { brand: 'HOKA',       result: '38,400 再生',  tag: '商品レビュー' },
            ].map((w) => (
              <div key={w.brand} className="flex justify-between items-center py-2 border-b"
                style={{ borderColor: 'var(--rose-pale)' }}>
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{w.brand}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--rose-pale)', color: 'var(--rose-dark)' }}>{w.tag}</span>
                </div>
                <span style={{ ...serif, color: 'var(--rose-dark)' }} className="text-sm font-bold">{w.result}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ ...serif, color: 'var(--rose-dark)' }} className="text-xl font-bold mb-4">料金の目安</h2>
          <div className="space-y-2">
            {[
              { n: '専用レビュー動画',  p: '¥150,000〜', hi: false },
              { n: '商品提供レビュー',  p: '応相談',      hi: true  },
              { n: '概要欄リンク掲載',  p: '¥30,000〜',  hi: false },
            ].map((pl) => (
              <div key={pl.n} className="flex justify-between items-center p-3 rounded-xl"
                style={{ background: pl.hi ? 'var(--rose-dark)' : 'var(--rose-pale)' }}>
                <span className="text-sm font-medium"
                  style={{ color: pl.hi ? 'var(--warm-white)' : 'var(--text-dark)' }}>{pl.n}</span>
                <span style={{ ...{ fontFamily: 'var(--font-serif-jp), serif' }, color: pl.hi ? 'var(--warm-white)' : 'var(--rose-dark)' }}
                  className="text-lg font-bold">{pl.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    summit: (
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 style={{ ...serif, color: 'var(--rose-dark)' }} className="text-2xl font-bold mb-3">一緒に作りましょう。</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#6a5050' }}>
            タイアップ・商品提供・コラボ等、お気軽にご連絡ください。2営業日以内にご返信します。
          </p>
          <div className="space-y-2 text-sm" style={{ color: 'var(--taupe)' }}>
            <p>📹 YouTube @443iwasaki</p>
            <p>📷 Instagram @443iwasaki</p>
          </div>
        </div>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            {['会社名', 'お名前'].map((ph) => (
              <input key={ph} type="text" placeholder={ph}
                className="rounded-xl px-4 py-3 text-sm outline-none w-full"
                style={{ background: 'var(--rose-pale)', color: 'var(--text-dark)' }}/>
            ))}
          </div>
          <input type="email" placeholder="メールアドレス"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'var(--rose-pale)', color: 'var(--text-dark)' }}/>
          <textarea placeholder="お問い合わせ内容" rows={3} className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{ background: 'var(--rose-pale)', color: 'var(--text-dark)' }}/>
          <button type="submit" className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--rose-dark)', color: 'var(--warm-white)' }}>
            送信する ✦
          </button>
        </form>
      </div>
    ),
  };

  const titles: Record<Loc, string> = {
    town: '街 — プロフィール', trail: '登山口 — チャンネル実績',
    hut: '山小屋 — 案件 & 料金', summit: '山頂 — お問い合わせ',
  };

  return (
    <div className="bg-[rgba(250,244,240,0.96)] backdrop-blur-xl border-t shadow-2xl"
      style={{ borderColor: 'var(--rose-pale)', maxHeight: '60vh', overflowY: 'auto' }}>
      <div className="max-w-5xl mx-auto px-6 pt-5 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <p style={{ fontFamily: 'var(--font-serif-jp), serif', color: 'var(--rose-dark)' }}
            className="text-sm font-bold tracking-wide">{titles[id]}</p>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
            style={{ background: 'var(--rose-pale)', color: 'var(--rose-dark)' }}>×</button>
        </div>
        {panels[id]}
      </div>
    </div>
  );
}
