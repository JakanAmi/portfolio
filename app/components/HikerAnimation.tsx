import HikerInstance, { type HikerConfig } from './HikerInstance';

const HIKERS: HikerConfig[] = [
  // リード登山者（メイン・吹き出しあり）
  {
    id: 0, startX: 100,  endX: 3490, speed: 22,
    jacket: '#4a6848', hat: '#3a5848', pom: '#c07878', pack: '#8a6040',
    showBubbles: true,
  },
  // ゆっくり組（少し後ろからスタート）
  {
    id: 1, startX: 500,  endX: 3420, speed: 16,
    jacket: '#7a4858', hat: '#5a3848', pom: '#e0a870', pack: '#6a4e50',
  },
  // 速い組（オフスクリーンからスタートして自然に追いつく）
  {
    id: 2, startX: -200, endX: 3460, speed: 27,
    jacket: '#4a5870', hat: '#3a4060', pom: '#d4b0c0', pack: '#7a6850',
  },
];

export default function HikerAnimation() {
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
        @keyframes hk-bubble-in {
          from { opacity: 0; transform: translateY(4px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        .hk-body  { animation: hk-bob 0.27s ease-in-out infinite; }
        .hk-bubble { animation: hk-bubble-in 0.3s ease-out forwards; }
      `}</style>
      {HIKERS.map(cfg => <HikerInstance key={cfg.id} {...cfg} />)}
    </>
  );
}
