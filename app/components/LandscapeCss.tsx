// CSS グラデーション版（SVGなし・div + clip-path のみ）

export default function LandscapeCss() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(175deg, #c8b0d0 0%, #e8d0c8 55%, #f4e4d8 100%)' }}>

      {/* Sun glow */}
      <div className="absolute" style={{
        right: '8%', top: '8%', width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(255,240,210,0.55) 0%, transparent 70%)',
      }}/>

      {/* Clouds */}
      {[
        { left: '6%',  top: '12%', w: 160, h: 40,  op: 0.4 },
        { left: '28%', top: '16%', w: 200, h: 52,  op: 0.35 },
        { left: '52%', top: '10%', w: 170, h: 44,  op: 0.38 },
        { left: '74%', top: '8%',  w: 140, h: 36,  op: 0.32 },
      ].map((c, i) => (
        <div key={i} className="absolute" style={{
          left: c.left, top: c.top, width: c.w, height: c.h,
          borderRadius: '50%',
          background: 'white',
          opacity: c.op,
          filter: 'blur(12px)',
        }}/>
      ))}

      {/* Far mountains layer 1 (pale lavender) */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '62%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: '#c0b4d8',
          opacity: 0.65,
          clipPath: 'polygon(0% 100%, 0% 52%, 5% 48%, 12% 32%, 17% 42%, 22% 24%, 28% 38%, 31% 28%, 35% 38%, 42% 16%, 48% 32%, 54% 20%, 58% 30%, 63% 12%, 68% 26%, 73% 8%, 77% 22%, 82% 14%, 86% 24%, 90% 10%, 94% 20%, 97% 16%, 100% 22%, 100% 100%)',
        }}/>
      </div>

      {/* Far mountains snow caps */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '62%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: '#f5f0ee',
          opacity: 0.85,
          clipPath: 'polygon(9% 100%, 10% 56%, 12% 32%, 14% 38%, 9% 100%, 19% 100%, 21% 38%, 22% 24%, 23% 28%, 19% 100%, 39% 100%, 40% 28%, 42% 16%, 44% 24%, 39% 100%, 60% 100%, 60% 28%, 63% 12%, 65% 22%, 60% 100%, 71% 100%, 72% 24%, 73% 8%, 75% 18%, 71% 100%, 88% 100%, 88% 22%, 90% 10%, 92% 18%, 88% 100%)',
        }}/>
      </div>

      {/* Mid mountains (sage green) */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '55%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #7d9470 0%, #5a7050 100%)',
          opacity: 0.78,
          clipPath: 'polygon(0% 100%, 0% 60%, 8% 42%, 15% 55%, 22% 35%, 30% 50%, 38% 28%, 46% 44%, 55% 22%, 62% 40%, 70% 18%, 77% 36%, 84% 20%, 91% 34%, 100% 24%, 100% 100%)',
        }}/>
      </div>

      {/* Forest strip */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '46%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #2a4535 0%, #1e3028 60%)',
          opacity: 0.72,
          clipPath: 'polygon(0% 100%, 0% 72%, 2% 62%, 4% 72%, 6% 58%, 8% 70%, 10% 55%, 12% 68%, 14% 60%, 16% 72%, 18% 62%, 20% 74%, 22% 65%, 24% 75%, 26% 65%, 28% 74%, 30% 100%, 100% 100%, 100% 80%, 98% 72%, 96% 80%)',
        }}/>
      </div>

      {/* Ground (warm earth) */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '38%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #a08870 0%, #6a5040 100%)',
          clipPath: 'polygon(0% 100%, 0% 28%, 5% 22%, 15% 18%, 25% 14%, 35% 10%, 50% 6%, 65% 3%, 80% 1%, 92% 0%, 100% 0%, 100% 100%)',
        }}/>
      </div>

      {/* Trail line */}
      <div className="absolute" style={{
        bottom: '28%', left: '18%', right: '5%', height: 3,
        background: 'linear-gradient(90deg, transparent, #c4a888 15%, #c4a888 85%, transparent)',
        opacity: 0.55,
        transform: 'rotate(-4deg)',
        borderRadius: 4,
      }}/>

      {/* Town silhouette */}
      <div className="absolute" style={{ bottom: '32%', left: '4%' }}>
        {/* Houses as div shapes */}
        {[
          { l: 0,   w: 28, h: 32, roofH: 18, c: '#c48878' },
          { l: 32,  w: 34, h: 38, roofH: 22, c: '#b87870' },
          { l: 70,  w: 26, h: 28, roofH: 16, c: '#c09080' },
          { l: 100, w: 30, h: 34, roofH: 20, c: '#d4b0a0' },
          { l: 134, w: 22, h: 26, roofH: 15, c: '#b09080' },
        ].map((b, i) => (
          <div key={i} className="absolute" style={{ left: b.l, bottom: 0, width: b.w }}>
            {/* Roof */}
            <div style={{
              width: 0, height: 0,
              borderLeft: `${b.w/2 + 4}px solid transparent`,
              borderRight: `${b.w/2 + 4}px solid transparent`,
              borderBottom: `${b.roofH}px solid #7a4840`,
              marginLeft: -4,
            }}/>
            {/* Wall */}
            <div style={{ width: b.w, height: b.h, background: b.c }}>
              {/* Window glow */}
              <div style={{
                width: 8, height: 8, background: '#f8e8e0',
                opacity: 0.75, margin: '6px auto 0',
                borderRadius: 1,
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Mountain hut */}
      <div className="absolute" style={{ bottom: '40%', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '34px solid transparent',
          borderRight: '34px solid transparent',
          borderBottom: '26px solid #7a5038',
        }}/>
        <div style={{ width: 60, height: 40, background: '#b09070', marginLeft: -8 }}>
          <div style={{
            width: 10, height: 10, background: '#f8e8d8',
            opacity: 0.7, position: 'absolute', top: 6, left: 10,
            borderRadius: 1,
          }}/>
          <div style={{
            width: 10, height: 10, background: '#f8e8d8',
            opacity: 0.7, position: 'absolute', top: 6, right: 10,
            borderRadius: 1,
          }}/>
        </div>
      </div>

      {/* Ambient light overlay (warm vignette) */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 80% 20%, rgba(248,220,180,0.12) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>

      {/* Subtle noise texture via repeating gradient */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.012) 2px, rgba(0,0,0,0.012) 4px)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}
