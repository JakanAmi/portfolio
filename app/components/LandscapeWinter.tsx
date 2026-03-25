// 冬バージョン（雪景色・夕暮れ）

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

// Stars
const STARS = (()=>{
  let seed=1234;
  const rng=()=>{seed^=seed<<13;seed^=seed>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
  const arr:{ x:number;y:number;r:number;op:number }[]=[];
  for(let i=0;i<180;i++){
    arr.push({x:rng()*3600,y:rng()*280,r:0.5+rng()*1.5,op:0.3+rng()*0.7});
  }
  return arr;
})();

export default function LandscapeWinter() {
  return (
    <svg width={WORLD_W} height="100%" viewBox={`0 0 ${WORLD_W} ${SVG_H}`}
      preserveAspectRatio="none" className="absolute inset-0">
      <defs>
        <linearGradient id="skyW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a"/>
          <stop offset="45%" stopColor="#1a2340"/>
          <stop offset="100%" stopColor="#3a4870"/>
        </linearGradient>
        <linearGradient id="groundW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8e8f0"/>
          <stop offset="100%" stopColor="#8aacbe"/>
        </linearGradient>
        <radialGradient id="moon" cx="78%" cy="18%" r="6%">
          <stop offset="0%" stopColor="#f0f4e8" stopOpacity="1"/>
          <stop offset="40%" stopColor="#e8f0d8" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#c8d8c0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="moonGlow" cx="78%" cy="18%" r="18%">
          <stop offset="0%" stopColor="#c0d0e8" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#c0d0e8" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="townGlow" cx="10%" cy="72%" r="12%">
          <stop offset="0%" stopColor="#f8d898" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#f8d898" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="hutGlow" cx="56%" cy="55%" r="10%">
          <stop offset="0%" stopColor="#f8d070" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#f8d070" stopOpacity="0"/>
        </radialGradient>
        <filter id="starBlur">
          <feGaussianBlur stdDeviation="0.4"/>
        </filter>
      </defs>

      {/* Sky */}
      <rect width={WORLD_W} height={SVG_H} fill="url(#skyW)"/>

      {/* Moon glow */}
      <rect width={WORLD_W} height={SVG_H} fill="url(#moonGlow)"/>

      {/* Moon */}
      <circle cx="2808" cy="126" r="32" fill="#f0f4e8" opacity="0.95"/>
      <circle cx="2808" cy="126" r="32" fill="url(#moon)"/>
      {/* Moon craters subtle */}
      <circle cx="2798" cy="118" r="5" fill="#e0ecd8" opacity="0.3"/>
      <circle cx="2820" cy="132" r="3" fill="#e0ecd8" opacity="0.2"/>

      {/* Stars */}
      <g filter="url(#starBlur)">
        {STARS.map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op}/>
        ))}
      </g>

      {/* Far mountains (snowy peaks - dark blue) */}
      <g fill="#1e2d50" opacity="0.9">
        <path d="M-50,330 Q200,115 460,330 Z"/>
        <path d="M360,320 Q780,82 1120,320 Z"/>
        <path d="M920,305 Q1520,58 2070,305 Z"/>
        <path d="M1820,288 Q2450,38 2980,288 Z"/>
        <path d="M2720,270 Q3220,18 3660,270 Z"/>
      </g>

      {/* Snow caps on far mountains */}
      <g fill="#d8e8f4" opacity="0.85">
        <path d="M168,188 Q200,115 232,188 Z"/>
        <path d="M698,155 Q780,82 862,155 Z"/>
        <path d="M1390,126 Q1520,58 1648,126 Z"/>
        <path d="M2278,108 Q2450,38 2622,108 Z"/>
        <path d="M3085,88 Q3220,18 3355,88 Z"/>
      </g>

      {/* Mid mountains (dark teal-blue) */}
      <g fill="#2a4060" opacity="0.88">
        <path d="M250,430 Q800,235 1320,430 Z"/>
        <path d="M880,415 Q1520,208 2060,415 Z"/>
        <path d="M1600,392 Q2250,175 2780,392 Z"/>
        <path d="M2300,362 Q2920,145 3450,362 Z"/>
        <path d="M3050,328 Q3370,108 3700,328 Z"/>
      </g>

      {/* Snow on mid mountains */}
      <g fill="#c0d8ec" opacity="0.55">
        <path d="M490,306 Q800,235 1110,306 Z"/>
        <path d="M1120,290 Q1520,208 1920,290 Z"/>
        <path d="M1840,268 Q2250,175 2660,268 Z"/>
        <path d="M2540,240 Q2920,145 3300,240 Z"/>
        <path d="M3190,215 Q3370,108 3550,215 Z"/>
      </g>

      {/* Town warm glow */}
      <rect width={WORLD_W} height={SVG_H} fill="url(#townGlow)"/>
      {/* Hut warm glow */}
      <rect width={WORLD_W} height={SVG_H} fill="url(#hutGlow)"/>

      {/* Snow ground base (before terrain cut) */}
      <path d="M 0,490 C 300,490 550,490 650,490 C 790,490 880,474 1050,460 C 1240,446 1390,426 1500,408 C 1638,390 1830,372 2000,358 C 2188,344 2368,320 2500,305 C 2660,288 2840,258 3000,228 C 3165,198 3290,174 3400,160 C 3510,148 3570,143 3600,142 L 3600,700 L 0,700 Z"
        fill="#c0d8ec" opacity="0.3"/>

      {/* Snow trees (white-tipped conifers) */}
      <g>
        {TREES.map((t,i)=>(
          <g key={i}>
            {/* Tree body */}
            <polygon points={`${t.x},${t.y} ${t.x-t.w/2},${t.y+t.h} ${t.x+t.w/2},${t.y+t.h}`}
              fill={t.dark?'#1a2e40':'#243848'} opacity={0.85+i*0.003%0.15}/>
            {/* Snow on top */}
            <polygon points={`${t.x},${t.y} ${t.x-t.w*0.32},${t.y+t.h*0.38} ${t.x+t.w*0.32},${t.y+t.h*0.38}`}
              fill="#d8eaf4" opacity={0.65}/>
          </g>
        ))}
      </g>

      {/* Ground (snowy) */}
      <path d="M 0,500 C 300,500 550,500 650,500 C 790,500 880,484 1050,470 C 1240,456 1390,436 1500,418 C 1638,400 1830,382 2000,368 C 2188,354 2368,330 2500,315 C 2660,298 2840,268 3000,238 C 3165,208 3290,184 3400,170 C 3510,158 3570,153 3600,152 L 3600,700 L 0,700 Z" fill="url(#groundW)"/>

      {/* Snow drifts on ground surface */}
      <path d="M 0,500 C 200,496 400,498 650,500 C 900,500 1000,472 1050,470 C 1150,466 1350,438 1500,418 C 1650,400 1850,382 2000,368 C 2200,352 2400,320 2500,315"
        fill="none" stroke="#e8f4fc" strokeWidth="3" opacity="0.5"/>

      {/* Frozen trail */}
      <path d="M 760,498 C 880,490 970,476 1050,469 C 1200,458 1380,434 1560,412 C 1750,390 1900,375 2080,362 C 2300,348 2520,316 2720,290 C 2900,268 3060,240 3260,190"
        fill="none" stroke="#a0c8e0" strokeWidth="4" strokeDasharray="14 9" opacity="0.5"/>

      {/* Town */}
      {/* Building 1 */}
      <rect x="108" y="438" width="56" height="62" fill="#2a3a50" rx="2"/>
      <polygon points="104,438 136,404 168,438" fill="#1a2838"/>
      {/* Snow on roof */}
      <path d="M104,438 Q136,408 168,438" fill="none" stroke="#d8eaf4" strokeWidth="4" opacity="0.8"/>
      {/* Warm windows */}
      <rect x="120" y="450" width="13" height="13" fill="#f8d890" opacity="0.9" rx="1"/>
      <rect x="141" y="450" width="13" height="13" fill="#f8e0a0" opacity="0.85" rx="1"/>
      <rect x="122" y="468" width="20" height="32" fill="#1a2030" rx="1"/>

      {/* Building 2 */}
      <rect x="182" y="426" width="68" height="74" fill="#243040" rx="2"/>
      <polygon points="177,426 216,388 255,426" fill="#162030"/>
      <path d="M177,426 Q216,392 255,426" fill="none" stroke="#d8eaf4" strokeWidth="4.5" opacity="0.8"/>
      <rect x="192" y="438" width="14" height="14" fill="#f8d070" opacity="0.95" rx="1"/>
      <rect x="218" y="438" width="14" height="14" fill="#f8e090" opacity="0.9" rx="1"/>
      <rect x="200" y="458" width="24" height="42" fill="#0e1828" rx="1"/>

      {/* Building 3 */}
      <rect x="268" y="443" width="52" height="57" fill="#2e3e54" rx="2"/>
      <polygon points="264,443 294,413 324,443" fill="#1a2838"/>
      <path d="M264,443 Q294,416 324,443" fill="none" stroke="#d8eaf4" strokeWidth="3.5" opacity="0.75"/>
      <rect x="277" y="455" width="12" height="12" fill="#f8d888" opacity="0.88" rx="1"/>
      <rect x="297" y="455" width="12" height="12" fill="#f8e098" opacity="0.85" rx="1"/>

      {/* Building 4 (church/tall) */}
      <rect x="348" y="432" width="58" height="68" fill="#263650" rx="2"/>
      <polygon points="344,432 377,395 410,432" fill="#182838"/>
      <path d="M344,432 Q377,398 410,432" fill="none" stroke="#d8eaf4" strokeWidth="4" opacity="0.75"/>
      {/* Steeple cross */}
      <rect x="373" y="412" width="8" height="28" fill="#102030"/>
      <rect x="366" y="420" width="22" height="8" fill="#102030"/>
      <rect x="370" y="450" width="15" height="50" fill="#0a1828" rx="1"/>

      {/* Building 5 */}
      <rect x="428" y="449" width="44" height="51" fill="#2a3a50" rx="2"/>
      <polygon points="424,449 450,422 476,449" fill="#182838"/>
      <path d="M424,449 Q450,424 476,449" fill="none" stroke="#d8eaf4" strokeWidth="3" opacity="0.75"/>
      <rect x="436" y="460" width="12" height="12" fill="#f8d888" opacity="0.9" rx="1"/>

      {/* Snow-covered trees near town */}
      {[[510,490,34,16],[530,462,22,12],[548,488,38,17],[570,492,32,15],[592,468,28,13]].map(([x,y,h,w],i)=>(
        <g key={i}>
          <polygon points={`${x},${y-h} ${x-w/2},${y} ${x+w/2},${y}`} fill="#1a2e40"/>
          <polygon points={`${x},${y-h} ${x-w*0.35},${y-h*0.58} ${x+w*0.35},${y-h*0.58}`} fill="#c8e0f0" opacity="0.7"/>
        </g>
      ))}

      {/* Street lamp near town */}
      <rect x="540" y="462" width="3" height="28" fill="#4a5a70"/>
      <ellipse cx="541" cy="462" rx="6" ry="3" fill="#f8e090" opacity="0.6"/>
      <ellipse cx="541" cy="462" rx="14" ry="8" fill="#f8d870" opacity="0.15"/>

      {/* Trailhead */}
      <rect x="1042" y="432" width="7" height="38" fill="#506070"/>
      <rect x="1022" y="432" width="42" height="20" fill="#3a5060" rx="3"/>
      {/* Snow on sign */}
      <rect x="1022" y="432" width="42" height="5" fill="#d8eaf4" opacity="0.8" rx="2"/>
      <rect x="990" y="464" width="36" height="5" fill="#7090a0" rx="2"/>
      <rect x="993" y="469" width="5" height="8" fill="#608090"/>
      <rect x="1018" y="469" width="5" height="8" fill="#608090"/>

      {/* Mountain hut */}
      <rect x="1958" y="328" width="84" height="52" fill="#2a3e58" rx="2"/>
      <polygon points="1951,328 2000,294 2049,328" fill="#182840"/>
      {/* Heavy snow on roof */}
      <path d="M1951,328 Q2000,298 2049,328" fill="none" stroke="#d8eaf4" strokeWidth="6" opacity="0.85"/>
      <path d="M1953,328 Q2000,300 2047,328" fill="#e0f0fc" opacity="0.3"/>
      {/* Chimney */}
      <rect x="2010" y="285" width="13" height="24" fill="#364e68"/>
      {/* Warm smoke */}
      <ellipse cx="2016" cy="278" rx="6" ry="5" fill="#f8d898" opacity="0.25"/>
      <ellipse cx="2020" cy="266" rx="5" ry="4" fill="#f8e0a0" opacity="0.18"/>
      <ellipse cx="2025" cy="255" rx="4" ry="3.5" fill="#f0d890" opacity="0.12"/>
      {/* Warm lit windows */}
      <rect x="1973" y="340" width="15" height="14" fill="#f8d070" opacity="0.95" rx="1"/>
      <rect x="2000" y="340" width="15" height="14" fill="#f8e088" opacity="0.9" rx="1"/>
      {/* Window glow halos */}
      <rect x="1970" y="337" width="21" height="20" fill="#f8d070" opacity="0.12" rx="2"/>
      <rect x="1997" y="337" width="21" height="20" fill="#f8d070" opacity="0.10" rx="2"/>
      <rect x="1984" y="354" width="20" height="26" fill="#0e1a2c" rx="1"/>

      {/* Snow-covered trees near hut */}
      {[[1930,370,38,16],[1910,375,30,14],[2060,372,35,15]].map(([x,y,h,w],i)=>(
        <g key={i}>
          <polygon points={`${x},${y-h} ${x-w/2},${y} ${x+w/2},${y}`} fill="#1a2e40" opacity="0.95"/>
          <polygon points={`${x},${y-h} ${x-w*0.38},${y-h*0.5} ${x+w*0.38},${y-h*0.5}`} fill="#c0ddf0" opacity="0.65"/>
        </g>
      ))}

      {/* Summit rocky area */}
      <path d="M 3220,210 Q 3280,162 3330,178 Q 3362,148 3405,168 Q 3435,188 3470,198 L 3600,192 L 3600,700 Z" fill="#1e2e48" opacity="0.6"/>
      {/* Summit snow */}
      <path d="M 3220,210 Q 3280,162 3330,178 Q 3362,148 3405,168 Q 3435,188 3470,198 L 3490,195 Q 3440,182 3408,162 Q 3366,140 3336,168 Q 3282,152 3228,202 Z" fill="#d0e8f8" opacity="0.7"/>

      {/* Summit flag */}
      <rect x="3288" y="146" width="5" height="48" fill="#4a5a78"/>
      <polygon points="3293,146 3326,157 3293,170" fill="#c07080"/>

      {/* Summit cairn (snow-covered) */}
      <ellipse cx="3286" cy="196" rx="18" ry="9" fill="#c0d8ee"/>
      <ellipse cx="3286" cy="190" rx="13" ry="7" fill="#d0e4f4"/>
      <ellipse cx="3286" cy="185" rx="8" ry="5" fill="#e0f0fc"/>

      {/* Stars near summit (brighter at higher elevation feel) */}
      <text x="3345" y="115" fontSize="14" fill="#d8f0ff" opacity="0.7">✦</text>
      <text x="3245" y="100" fontSize="10" fill="#d8f0ff" opacity="0.5">✦</text>
      <text x="3180" y="130" fontSize="8" fill="#d0e8ff" opacity="0.4">✦</text>

      {/* Moonlight reflection on snow trail */}
      <path d="M 760,498 C 880,490 970,476 1050,469 C 1200,458 1380,434 1560,412 C 1750,390 1900,375 2080,362 C 2300,348 2520,316 2720,290 C 2900,268 3060,240 3260,190"
        fill="none" stroke="#a0c8e0" strokeWidth="3" strokeDasharray="14 9" opacity="0.4"/>
    </svg>
  );
}
