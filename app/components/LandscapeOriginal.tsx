// 春〜秋 バージョン（オリジナル）

const WORLD_W = 3600;
const SVG_H   = 700;

const TERRAIN: [number, number][] = [
  [0,500],[650,500],[1050,470],[1500,418],
  [2000,368],[2500,315],[3000,238],[3400,170],[3600,152],
];

function groundY(x: number) {
  for (let i = 0; i < TERRAIN.length - 1; i++) {
    const [x0,y0]=TERRAIN[i],[x1,y1]=TERRAIN[i+1];
    if (x>=x0&&x<=x1) return y0+(y1-y0)*((x-x0)/(x1-x0));
  }
  return 500;
}

const TREES = (()=>{
  let seed=9876;
  const rng=()=>{seed^=seed<<13;seed^=seed>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
  const arr:{ x:number;y:number;h:number;w:number;dark:boolean }[]=[];
  for(let x=570;x<1800;x+=11+Math.floor(rng()*13)){
    arr.push({x,y:groundY(x),h:26+rng()*24,w:13+rng()*7,dark:rng()>0.5});
  }
  return arr;
})();

export default function LandscapeOriginal() {
  return (
    <svg width={WORLD_W} height="100%" viewBox={`0 0 ${WORLD_W} ${SVG_H}`}
      preserveAspectRatio="none" className="absolute inset-0">
      <defs>
        <style>{`
          @keyframes smoke-orig {
            0%   { transform: translate(0px,  0px) scale(0.4); opacity: 0.55; }
            40%  { transform: translate(2px, -20px) scale(0.9); opacity: 0.35; }
            100% { transform: translate(5px, -52px) scale(1.8); opacity: 0; }
          }
          .sm-orig {
            transform-box: fill-box;
            transform-origin: center;
            animation: smoke-orig 2.8s ease-out infinite;
          }
        `}</style>
        <linearGradient id="skyV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b090b8"/>
          <stop offset="100%" stopColor="#f0dcd4"/>
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a8070"/>
          <stop offset="100%" stopColor="#5a4838"/>
        </linearGradient>
        <radialGradient id="sun" cx="80%" cy="20%" r="15%">
          <stop offset="0%" stopColor="#f8e8d8" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f8e8d8" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width={WORLD_W} height={SVG_H} fill="url(#skyV)"/>
      <rect width={WORLD_W} height={SVG_H} fill="url(#sun)"/>
      {[{cx:380,cy:100,rx:90,ry:30},{cx:450,cy:90,rx:65,ry:24},{cx:1100,cy:130,rx:110,ry:35},{cx:1190,cy:118,rx:75,ry:26},{cx:1950,cy:85,rx:95,ry:30},{cx:2020,cy:76,rx:60,ry:22},{cx:2700,cy:65,rx:80,ry:26},{cx:2760,cy:58,rx:50,ry:18}]
        .map((c,i)=><ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="white" opacity="0.35"/>)}
      <g fill="#bfb8d4" opacity="0.75">
        <path d="M-50,330 Q200,115 460,330 Z"/>
        <path d="M360,320 Q780,82 1120,320 Z"/>
        <path d="M920,305 Q1520,58 2070,305 Z"/>
        <path d="M1820,288 Q2450,38 2980,288 Z"/>
        <path d="M2720,270 Q3220,18 3660,270 Z"/>
      </g>
      <g fill="#f5f0ee" opacity="0.9">
        <path d="M168,188 Q200,115 232,188 Z"/>
        <path d="M698,155 Q780,82 862,155 Z"/>
        <path d="M1390,126 Q1520,58 1648,126 Z"/>
        <path d="M2278,108 Q2450,38 2622,108 Z"/>
        <path d="M3085,88 Q3220,18 3355,88 Z"/>
      </g>
      <g fill="#7d9470" opacity="0.82">
        <path d="M250,430 Q800,235 1320,430 Z"/>
        <path d="M880,415 Q1520,208 2060,415 Z"/>
        <path d="M1600,392 Q2250,175 2780,392 Z"/>
        <path d="M2300,362 Q2920,145 3450,362 Z"/>
        <path d="M3050,328 Q3370,108 3700,328 Z"/>
      </g>
      <g>
        {TREES.map((t,i)=>(
          <polygon key={i} points={`${t.x},${t.y} ${t.x-t.w/2},${t.y+t.h} ${t.x+t.w/2},${t.y+t.h}`}
            fill={t.dark?'#1e3828':'#2a4535'} opacity={0.7+i*0.004%0.3}/>
        ))}
      </g>
      <path d="M 0,500 C 300,500 550,500 650,500 C 790,500 880,484 1050,470 C 1240,456 1390,436 1500,418 C 1638,400 1830,382 2000,368 C 2188,354 2368,330 2500,315 C 2660,298 2840,268 3000,238 C 3165,208 3290,184 3400,170 C 3510,158 3570,153 3600,152 L 3600,700 L 0,700 Z" fill="url(#ground)"/>
      <path d="M 760,498 C 880,490 970,476 1050,469 C 1200,458 1380,434 1560,412 C 1750,390 1900,375 2080,362 C 2300,348 2520,316 2720,290 C 2900,268 3060,240 3260,190"
        fill="none" stroke="#c4a888" strokeWidth="4.5" strokeDasharray="14 9" opacity="0.65"/>
      {/* Town */}
      <rect x="108" y="438" width="56" height="62" fill="#c48878" rx="2"/>
      <polygon points="104,438 136,404 168,438" fill="#7a4840"/>
      <rect x="120" y="450" width="13" height="13" fill="#f8e8e0" opacity="0.75" rx="1"/>
      <rect x="141" y="450" width="13" height="13" fill="#f8e8e0" opacity="0.75" rx="1"/>
      <rect x="122" y="468" width="20" height="32" fill="#5a3028" rx="1"/>
      <rect x="182" y="426" width="68" height="74" fill="#b87870" rx="2"/>
      <polygon points="177,426 216,388 255,426" fill="#8a5040"/>
      <rect x="192" y="438" width="14" height="14" fill="#f8e8e0" opacity="0.75" rx="1"/>
      <rect x="218" y="438" width="14" height="14" fill="#f8e8e0" opacity="0.75" rx="1"/>
      <rect x="200" y="458" width="24" height="42" fill="#5a3028" rx="1"/>
      <rect x="268" y="443" width="52" height="57" fill="#c09080" rx="2"/>
      <polygon points="264,443 294,413 324,443" fill="#7a4840"/>
      <rect x="277" y="455" width="12" height="12" fill="#f8e8e0" opacity="0.75" rx="1"/>
      <rect x="297" y="455" width="12" height="12" fill="#f8e8e0" opacity="0.75" rx="1"/>
      <rect x="348" y="432" width="58" height="68" fill="#d4b0a0" rx="2"/>
      <polygon points="344,432 377,395 410,432" fill="#8a5848"/>
      <rect x="373" y="412" width="8" height="28" fill="#8a5848"/>
      <rect x="366" y="420" width="22" height="8" fill="#8a5848"/>
      <rect x="370" y="450" width="15" height="50" fill="#5a3828" rx="1"/>
      <rect x="428" y="449" width="44" height="51" fill="#b09080" rx="2"/>
      <polygon points="424,449 450,422 476,449" fill="#7a4840"/>
      <rect x="436" y="460" width="12" height="12" fill="#f8e8e0" opacity="0.75" rx="1"/>
      {[[510,490,34,16],[530,462,22,12],[548,488,38,17],[570,492,32,15],[592,468,28,13]].map(([x,y,h,w],i)=>(
        <polygon key={i} points={`${x},${y-h} ${x-w/2},${y} ${x+w/2},${y}`} fill="#3a5540"/>
      ))}
      {/* Trailhead */}
      <rect x="1042" y="432" width="7" height="38" fill="#8a6848"/>
      <rect x="1022" y="432" width="42" height="20" fill="#a08060" rx="3"/>
      <rect x="990" y="464" width="36" height="5" fill="#9a7858" rx="2"/>
      <rect x="993" y="469" width="5" height="8" fill="#9a7858"/>
      <rect x="1018" y="469" width="5" height="8" fill="#9a7858"/>
      {/* Hut */}
      <rect x="1958" y="328" width="84" height="52" fill="#b09070" rx="2"/>
      <polygon points="1951,328 2000,294 2049,328" fill="#7a5038"/>
      <rect x="2010" y="285" width="13" height="24" fill="#8a6048"/>
      {/* 煙アニメーション（4パフ、0.7s ずつずれ） */}
      {[0, 0.7, 1.4, 2.1].map((delay, i) => (
        <ellipse key={i} cx="2016" cy="283" rx="5" ry="4"
          fill="#e8d8d0" className="sm-orig"
          style={{ animationDelay: `${delay}s` }}/>
      ))}
      <rect x="1973" y="340" width="15" height="14" fill="#f8e8d8" opacity="0.7" rx="1"/>
      <rect x="2000" y="340" width="15" height="14" fill="#f8e8d8" opacity="0.7" rx="1"/>
      <rect x="1984" y="354" width="20" height="26" fill="#5a3828" rx="1"/>
      {[[1930,370,38,16],[1910,375,30,14],[2060,372,35,15]].map(([x,y,h,w],i)=>(
        <polygon key={i} points={`${x},${y-h} ${x-w/2},${y} ${x+w/2},${y}`} fill="#2a4535" opacity="0.9"/>
      ))}
      {/* Summit */}
      <path d="M 3220,210 Q 3280,162 3330,178 Q 3362,148 3405,168 Q 3435,188 3470,198 L 3600,192 L 3600,700 Z" fill="#9a9088" opacity="0.5"/>
      <rect x="3288" y="146" width="5" height="48" fill="#6a5848"/>
      <polygon points="3293,146 3326,157 3293,170" fill="#c07878"/>
      <ellipse cx="3286" cy="196" rx="18" ry="9" fill="#a09080"/>
      <ellipse cx="3286" cy="190" rx="13" ry="7" fill="#b0a090"/>
      <ellipse cx="3286" cy="185" rx="8" ry="5" fill="#c0b0a0"/>
      <text x="3345" y="115" fontSize="14" fill="#f0d8d0" opacity="0.5">✦</text>
      <text x="3245" y="100" fontSize="10" fill="#f0d8d0" opacity="0.35">✦</text>
    </svg>
  );
}
