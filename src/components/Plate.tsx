import { mixHex, type Visual } from "../sim/visual";
import type { DishId } from "../data/recipes";

const LEAVES = [
  { x: -18, y: 8, rot: -28, lean: -1 },
  { x: 10, y: -20, rot: 16, lean: 1 },
  { x: 24, y: 16, rot: 46, lean: 1 },
  { x: -28, y: -14, rot: -60, lean: -1 },
  { x: 0, y: 24, rot: 4, lean: 0.2 },
];

const STRANDS = [
  "M104 118 C118 104 126 150 140 128",
  "M112 142 C128 116 142 154 158 130",
  "M96 130 C118 156 146 108 170 132",
  "M108 110 C124 132 150 126 168 116",
  "M100 136 C122 112 148 148 166 124",
];

export function Plate({
  dish,
  visual,
  settled,
}: {
  dish: DishId;
  visual: Visual;
  settled: boolean;
}) {
  const ease = settled ? "0.45s ease" : "none";
  return (
    <figure className="mx-auto w-full max-w-[280px]" aria-hidden="true">
      <svg viewBox="0 0 280 248" className="block h-auto w-full overflow-visible">
        <title>示意</title>
        <Ring doneness={visual.doneness} ease={ease} />
        {dish === "noodles" ? <Pot /> : <Skillet />}
        {dish !== "noodles" && visual.oil > 0.02 ? (
          <ellipse
            cx="140"
            cy="146"
            rx={16 + visual.oil * 30}
            ry={7 + visual.oil * 8}
            fill="#EFA927"
            opacity={0.22 + visual.oil * 0.38}
            style={{ transition: `opacity ${ease}, rx ${ease}, ry ${ease}` }}
          />
        ) : null}
        {dish === "egg" ? <Egg visual={visual} ease={ease} /> : null}
        {dish === "greens" ? <Greens visual={visual} ease={ease} /> : null}
        {dish === "noodles" ? <Noodles visual={visual} ease={ease} /> : null}
        <Lid visual={visual} ease={ease} />
        <Flames level={visual.flame} ease={ease} />
      </svg>
    </figure>
  );
}

function Ring({ doneness, ease }: { doneness: number; ease: string }) {
  const radius = 104;
  const length = 2 * Math.PI * radius;
  return (
    <g transform="rotate(-90 140 124)">
      <circle cx="140" cy="124" r={radius} fill="none" stroke="#45563F" strokeOpacity="0.18" strokeWidth="3" />
      <circle
        cx="140"
        cy="124"
        r={radius}
        fill="none"
        stroke="#EFA927"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - Math.min(1, Math.max(0, doneness)))}
        opacity={doneness < 0.03 ? 0 : 1}
        style={{ transition: ease === "none" ? "none" : `stroke-dashoffset ${ease}, opacity ${ease}` }}
      />
    </g>
  );
}

function Skillet() {
  return (
    <g>
      <circle cx="140" cy="128" r="74" fill="#E7DCC4" stroke="#45563F" strokeWidth="1.75" />
      <circle cx="140" cy="128" r="66" fill="none" stroke="#F5F1E7" strokeWidth="1.25" opacity="0.85" />
      <path d="M206 122 h38" stroke="#45563F" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function Pot() {
  return (
    <g>
      <circle cx="140" cy="128" r="78" fill="none" stroke="#45563F" strokeWidth="8" />
      <circle cx="140" cy="128" r="70" fill="#E7DCC4" />
      <circle cx="140" cy="128" r="62" fill="none" stroke="#F5F1E7" strokeWidth="1.25" opacity="0.8" />
    </g>
  );
}

function Egg({ visual, ease }: { visual: Visual; ease: string }) {
  const flipScale = Math.max(0.08, Math.abs(Math.cos(visual.flip * Math.PI)));
  const drop = (1 - visual.eggDrop) * -78;
  return (
    <g
      style={{
        transform: `translateY(${drop}px) scaleY(${flipScale})`,
        transformOrigin: "140px 132px",
        transformBox: "view-box",
        opacity: visual.showEgg ? 1 : 0,
        transition: `transform ${ease}, opacity ${ease}`,
      }}
    >
      <path
        d="M140 96c28-2 56 16 58 40 2 28-20 48-50 46-34-2-60-20-58-48 2-24 22-36 50-38z"
        fill={mixHex("#F4E6C0", "#F7F4EC", visual.white)}
        stroke={mixHex("#45563F", "#A86832", visual.brown)}
        strokeWidth={1.6 + visual.brown * 2.2}
        style={{ transition: `fill ${ease}, stroke ${ease}, stroke-width ${ease}` }}
      />
      <path
        d="M140 96c28-2 56 16 58 40 2 28-20 48-50 46-34-2-60-20-58-48 2-24 22-36 50-38z"
        fill="none"
        stroke="#A86832"
        strokeWidth="7"
        opacity={visual.brown}
        style={{ transition: `opacity ${ease}` }}
      />
      <circle
        cx="150"
        cy="136"
        r={16 - visual.yolk * 2}
        fill={mixHex("#EFA927", "#7A3E10", visual.yolk)}
        style={{ transition: `fill ${ease}` }}
      />
      <circle cx="146" cy="131" r="4" fill="#F5F1E7" opacity={0.9 * (1 - visual.yolk)} />
    </g>
  );
}

function Greens({ visual, ease }: { visual: Visual; ease: string }) {
  const color = mixHex("#45563F", "#A8843A", Math.max(0, visual.wilt - 0.18) / 0.82);
  const reach = 0.42 + visual.spread;
  return (
    <g style={{ opacity: visual.showLeaves ? visual.leafIn : 0, transition: `opacity ${ease}` }}>
      <ellipse
        cx="140"
        cy="156"
        rx="34"
        ry="9"
        fill="#C4B48A"
        opacity={visual.water}
        style={{ transition: `opacity ${ease}` }}
      />
      {LEAVES.map((leaf) => (
        <g
          key={`${leaf.x}-${leaf.y}`}
          style={{
            transform: `translate(${140 + leaf.x * reach}px, ${128 + leaf.y * reach}px) rotate(${leaf.rot + visual.wilt * leaf.lean * 42}deg)`,
            transformOrigin: "0px 0px",
            transition: `transform ${ease}`,
          }}
        >
          <path
            d="M0 12C-14-4-10-34 0-48 10-34 14-4 0 12Z"
            fill={color}
            style={{ transition: `fill ${ease}` }}
          />
          <path d="M0 6V-34" stroke="#F5F1E7" strokeWidth="1.2" />
        </g>
      ))}
      <g
        style={{
          transform: `rotate(${Math.sin(visual.motionT * Math.PI * 18) * 32}deg)`,
          transformOrigin: "140px 128px",
          transformBox: "view-box",
          opacity: visual.stirring ? 1 : 0,
        }}
      >
        <path d="M140 128 L198 86" stroke="#363A32" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M188 78 L208 94" stroke="#363A32" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Noodles({ visual, ease }: { visual: Visual; ease: string }) {
  const color = mixHex("#8C7348", "#C6A15A", visual.core);
  const width = 2.3 + visual.bloat * 2.6;
  return (
    <g>
      <ellipse
        cx="140"
        cy="136"
        rx={42 + (1 - visual.tangle) * 8}
        ry="24"
        fill={mixHex("#E6D7B8", "#D2CDC2", visual.bloat)}
        opacity={0.55}
      />
      <Bubbles boil={visual.boil} motionT={visual.motionT} />
      <g
        style={{
          opacity: visual.showNoodles ? visual.noodleIn : 0,
          transform: `translateY(${(1 - visual.noodleIn) * 18 - visual.lift * 36}px) scale(${1.05 - visual.tangle * 0.28})`,
          transformOrigin: "140px 128px",
          transformBox: "view-box",
          transition: `transform ${ease}, opacity ${ease}`,
        }}
      >
        {STRANDS.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeDasharray={visual.bloat > 0.48 ? "9 6" : undefined}
            style={{ transition: `stroke ${ease}, stroke-width ${ease}` }}
          />
        ))}
      </g>
    </g>
  );
}

function Bubbles({ boil, motionT }: { boil: number; motionT: number }) {
  if (boil < 0.08) return null;
  return (
    <g>
      {[0, 1, 2, 3, 4].map((index) => {
        const phase = (motionT * 8 + index * 0.21) % 1;
        const opacity = boil * Math.sin(phase * Math.PI);
        return (
          <circle
            key={index}
            cx={106 + index * 16}
            cy={156 - phase * 36 * boil}
            r={2.1 + (index % 2)}
            fill="#F5F1E7"
            stroke="#45563F"
            strokeWidth="1"
            opacity={opacity}
          />
        );
      })}
    </g>
  );
}

function Lid({ visual, ease }: { visual: Visual; ease: string }) {
  return (
    <g
      style={{
        opacity: visual.lid,
        transform: `translateY(${(1 - visual.lid) * -22}px)`,
        transition: `opacity ${ease}, transform ${ease}`,
      }}
    >
      <circle cx="140" cy="128" r="4" fill="#45563F" />
      <path d="M112 92c8-12 4-18 12-28" fill="none" stroke="#45563F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M168 92c-8-12-4-18-12-28" fill="none" stroke="#45563F" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function Flames({ level, ease }: { level: number; ease: string }) {
  const scale = 0.35 + level * 0.95;
  return (
    <g
      stroke="#EFA927"
      strokeWidth="2.4"
      strokeLinecap="round"
      fill="none"
      opacity={level < 0.05 ? 0 : Math.min(1, 0.45 + level)}
      transform={`translate(140 230) scale(1 ${scale})`}
      style={{ transition: `opacity ${ease}` }}
    >
      <path d="M-22 -2 v-12" />
      <path d="M0 2 v-20" />
      <path d="M22 -2 v-12" />
    </g>
  );
}
