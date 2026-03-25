'use client';

// Canvas 2D API 版 — requestAnimationFrame でゆっくり雲が動く

import { useEffect, useRef } from 'react';

const WORLD_W = 3600;
const WORLD_H = 700;

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

// Seeded RNG
function makeRng(seed: number) {
  let s = seed;
  return () => { s^=s<<13; s^=s>>17; s^=s<<5; return (s>>>0)/4294967296; };
}

type Cloud = { x: number; y: number; rx: number; ry: number; speed: number };
const CLOUDS: Cloud[] = [
  {x:380,  y:100, rx:90,  ry:30, speed:0.08},
  {x:450,  y:90,  rx:65,  ry:24, speed:0.06},
  {x:1100, y:130, rx:110, ry:35, speed:0.10},
  {x:1190, y:118, rx:75,  ry:26, speed:0.07},
  {x:1950, y:85,  rx:95,  ry:30, speed:0.09},
  {x:2020, y:76,  rx:60,  ry:22, speed:0.05},
  {x:2700, y:65,  rx:80,  ry:26, speed:0.08},
  {x:2760, y:58,  rx:50,  ry:18, speed:0.06},
];

type Tree = { x:number; y:number; h:number; w:number; dark:boolean };
const TREES: Tree[] = (()=>{
  const rng = makeRng(9876);
  const arr: Tree[] = [];
  for(let x=570;x<1800;x+=11+Math.floor(rng()*13)){
    arr.push({x,y:groundY(x),h:26+rng()*24,w:13+rng()*7,dark:rng()>0.5});
  }
  return arr;
})();

function drawFrame(ctx: CanvasRenderingContext2D, t: number, clouds: Cloud[]) {
  const W = WORLD_W, H = WORLD_H;
  ctx.clearRect(0,0,W,H);

  // Sky gradient
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0, '#b090b8');
  sky.addColorStop(1, '#f0dcd4');
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H);

  // Sun glow
  const sun = ctx.createRadialGradient(W*0.82, H*0.18, 0, W*0.82, H*0.18, W*0.18);
  sun.addColorStop(0, 'rgba(248,232,216,0.55)');
  sun.addColorStop(1, 'rgba(248,232,216,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0,0,W,H);

  // Clouds (animated)
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = 'white';
  for (const c of clouds) {
    const ox = (t * c.speed) % (W + c.rx*2) - c.rx;
    ctx.beginPath();
    ctx.ellipse(c.x + ox, c.y, c.rx, c.ry, 0, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // Helper: draw mountain range
  function drawMountains(
    peaks: [number,number][],
    fillColor: string,
    alpha: number,
  ) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(peaks[0][0], peaks[0][1]);
    for (let i=1;i<peaks.length;i++) {
      const [px,py]=peaks[i],[lx,ly]=peaks[i-1];
      const mx=(lx+px)/2, my=(ly+py)/2;
      ctx.quadraticCurveTo(lx,ly,mx,my);
    }
    const last=peaks[peaks.length-1];
    ctx.lineTo(last[0],last[1]);
    ctx.lineTo(W,H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Far mountains (lavender)
  const farPeaks: [number,number][] = [
    [-50,330],[200,115],[460,330],[780,82],[1120,320],
    [1520,58],[2070,305],[2450,38],[2980,288],[3220,18],[3660,270],
  ];
  drawMountains(farPeaks, '#bfb8d4', 0.75);

  // Snow caps on far mountains
  const snowPeaks: [number,number][][] = [
    [[-50,330],[168,188],[200,115],[232,188],[460,330]],
    [[360,320],[698,155],[780,82],[862,155],[1120,320]],
    [[920,305],[1390,126],[1520,58],[1648,126],[2070,305]],
    [[1820,288],[2278,108],[2450,38],[2622,108],[2980,288]],
    [[2720,270],[3085,88],[3220,18],[3355,88],[3660,270]],
  ];
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = '#f5f0ee';
  for (const sp of snowPeaks) {
    ctx.beginPath();
    ctx.moveTo(sp[0][0],sp[0][1]);
    for (let i=1;i<sp.length;i++) ctx.lineTo(sp[i][0],sp[i][1]);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Mid mountains (sage)
  const midPeaks: [number,number][] = [
    [0,460],[250,430],[800,235],[1320,430],
    [1520,208],[2060,415],[2250,175],[2780,392],
    [2920,145],[3450,362],[3700,328],[3700,700],[0,700],
  ];
  ctx.save();
  ctx.globalAlpha = 0.82;
  const mid = ctx.createLinearGradient(0,200,0,500);
  mid.addColorStop(0,'#7d9470');
  mid.addColorStop(1,'#5a7050');
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.moveTo(0,H);
  for (const [px,py] of midPeaks) ctx.lineTo(px,py);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Trees
  for (const t of TREES) {
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = t.dark ? '#1e3828' : '#2a4535';
    ctx.beginPath();
    ctx.moveTo(t.x, t.y);
    ctx.lineTo(t.x - t.w/2, t.y + t.h);
    ctx.lineTo(t.x + t.w/2, t.y + t.h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Ground
  const ground = ctx.createLinearGradient(0,500,0,H);
  ground.addColorStop(0,'#9a8070');
  ground.addColorStop(1,'#5a4838');
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0,H);
  ctx.lineTo(0,500);
  const pts: [number,number][] = [
    [0,500],[300,500],[550,500],[650,500],[790,500],[880,484],
    [1050,470],[1240,456],[1390,436],[1500,418],[1638,400],[1830,382],
    [2000,368],[2188,354],[2368,330],[2500,315],[2660,298],[2840,268],
    [3000,238],[3165,208],[3290,184],[3400,170],[3510,158],[3570,153],[3600,152],
  ];
  for (const [px,py] of pts) ctx.lineTo(px,py);
  ctx.lineTo(W,H);
  ctx.closePath();
  ctx.fill();

  // Trail
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = '#c4a888';
  ctx.lineWidth = 4;
  ctx.setLineDash([14,9]);
  ctx.beginPath();
  ctx.moveTo(760,498);
  ctx.bezierCurveTo(900,488,980,474,1050,469);
  ctx.bezierCurveTo(1200,458,1380,434,1560,412);
  ctx.bezierCurveTo(1750,390,1900,375,2080,362);
  ctx.bezierCurveTo(2300,348,2520,316,2720,290);
  ctx.bezierCurveTo(2900,268,3060,240,3260,190);
  ctx.stroke();
  ctx.restore();

  // Town buildings
  function drawBuilding(x:number,y:number,w:number,h:number,roofH:number,wallC:string,roofC:string) {
    // Roof
    ctx.fillStyle = roofC;
    ctx.beginPath();
    ctx.moveTo(x-4,y);
    ctx.lineTo(x+w/2,y-roofH);
    ctx.lineTo(x+w+4,y);
    ctx.closePath();
    ctx.fill();
    // Wall
    ctx.fillStyle = wallC;
    ctx.fillRect(x,y,w,h);
    // Window
    ctx.fillStyle = 'rgba(248,232,224,0.7)';
    ctx.fillRect(x+5,y+8,8,8);
    ctx.fillRect(x+w-13,y+8,8,8);
  }
  drawBuilding(108,438,56,62,34,'#c48878','#7a4840');
  drawBuilding(182,426,68,74,38,'#b87870','#8a5040');
  drawBuilding(268,443,52,57,30,'#c09080','#7a4840');
  drawBuilding(348,432,58,68,37,'#d4b0a0','#8a5848');
  drawBuilding(428,449,44,51,27,'#b09080','#7a4840');

  // Trailhead sign
  ctx.fillStyle = '#8a6848';
  ctx.fillRect(1042,432,7,38);
  ctx.fillStyle = '#a08060';
  ctx.beginPath();
  ctx.roundRect(1022,432,42,20,3);
  ctx.fill();

  // Mountain hut
  ctx.fillStyle = '#7a5038';
  ctx.beginPath();
  ctx.moveTo(1951,328);
  ctx.lineTo(2000,294);
  ctx.lineTo(2049,328);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b09070';
  ctx.fillRect(1958,328,84,52);
  ctx.fillStyle = '#8a6048';
  ctx.fillRect(2010,285,13,24);
  // Smoke
  for (let i=0;i<3;i++) {
    const sg = ctx.createRadialGradient(2016+i*4,278-i*12,0,2016+i*4,278-i*12,7-i);
    sg.addColorStop(0,'rgba(232,216,208,0.28)');
    sg.addColorStop(1,'rgba(232,216,208,0)');
    ctx.fillStyle=sg;
    ctx.beginPath();
    ctx.ellipse(2016+i*4,278-i*12,7-i,5-i,0,0,Math.PI*2);
    ctx.fill();
  }
  // Hut windows
  ctx.fillStyle = 'rgba(248,232,216,0.7)';
  ctx.fillRect(1973,340,15,14);
  ctx.fillRect(2000,340,15,14);

  // Summit rocky area
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#9a9088';
  ctx.beginPath();
  ctx.moveTo(3220,210);
  ctx.quadraticCurveTo(3280,162,3330,178);
  ctx.quadraticCurveTo(3362,148,3405,168);
  ctx.quadraticCurveTo(3435,188,3470,198);
  ctx.lineTo(3600,192);
  ctx.lineTo(3600,H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Summit flag
  ctx.fillStyle = '#6a5848';
  ctx.fillRect(3288,146,5,48);
  ctx.fillStyle = '#c07878';
  ctx.beginPath();
  ctx.moveTo(3293,146);
  ctx.lineTo(3326,157);
  ctx.lineTo(3293,170);
  ctx.closePath();
  ctx.fill();

  // Cairn
  for (const [rx,ry,cy,c] of [[18,9,196,'#a09080'],[13,7,190,'#b0a090'],[8,5,185,'#c0b0a0']] as [number,number,number,string][]) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(3286,cy,rx,ry,0,0,Math.PI*2);
    ctx.fill();
  }
}

export default function LandscapeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(0);
  const clouds    = useRef<Cloud[]>(CLOUDS.map(c => ({...c})));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = WORLD_W;
    canvas.height = WORLD_H;

    const loop = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const elapsed = (ts - t0Ref.current) / 1000;
      drawFrame(ctx, elapsed, clouds.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'auto' }}
    />
  );
}
