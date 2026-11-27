import type { DishId, Level, Recipe } from "../data/recipes";

export type Visual = {
  doneness: number;
  flame: number;
  oil: number;
  showEgg: boolean;
  eggDrop: number;
  white: number;
  yolk: number;
  brown: number;
  lid: number;
  flip: number;
  showLeaves: boolean;
  leafIn: number;
  wilt: number;
  water: number;
  spread: number;
  stirring: boolean;
  motionT: number;
  showNoodles: boolean;
  noodleIn: number;
  boil: number;
  core: number;
  tangle: number;
  bloat: number;
  lift: number;
  sentence: string;
};

export function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t);
}

export function mixHex(from: string, to: string, t: number) {
  const amount = clamp(t);
  const a = hex(from);
  const b = hex(to);
  const channels = a.map((channel, index) =>
    Math.round(channel + (b[index] - channel) * amount),
  );
  return `rgb(${channels[0]} ${channels[1]} ${channels[2]})`;
}

function hex(value: string) {
  const raw = value.replace("#", "");
  return [0, 2, 4].map((start) => Number.parseInt(raw.slice(start, start + 2), 16));
}

function blank(sentence = ""): Visual {
  return {
    doneness: 0,
    flame: 0,
    oil: 0,
    showEgg: false,
    eggDrop: 0,
    white: 0,
    yolk: 0,
    brown: 0,
    lid: 0,
    flip: 0,
    showLeaves: false,
    leafIn: 0,
    wilt: 0,
    water: 0,
    spread: 1,
    stirring: false,
    motionT: 0.35,
    showNoodles: false,
    noodleIn: 0,
    boil: 0,
    core: 0,
    tangle: 0.2,
    bloat: 0,
    lift: 0,
    sentence,
  };
}

const eggWhite = [
  [0.22, 0.48, 0.9],
  [0.3, 0.84, 0.98],
  [0.42, 0.9, 1],
];
const eggYolk = [
  [0.02, 0.22, 0.8],
  [0.04, 0.34, 0.86],
  [0.1, 0.52, 1],
];
const eggBrown = [
  [0, 0.02, 0.08],
  [0, 0.03, 0.16],
  [0.06, 0.22, 0.7],
];

const greensWilt = [
  [0.08, 0.5, 0.94],
  [0.14, 0.36, 0.8],
  [0.24, 0.36, 0.74],
];

const noodleCore = [
  [0.12, 0.28, 0.4],
  [0.22, 0.58, 0.88],
  [0.32, 0.8, 1],
];
const noodleBloat = [
  [0, 0.02, 0.12],
  [0, 0.06, 0.38],
  [0, 0.08, 0.58],
];

export function exploreTarget(recipe: Recipe, heat: Level, time: Level, ratio: Level): Visual {
  if (recipe.id === "egg") return eggTarget(heat, time, ratio);
  if (recipe.id === "greens") return greensTarget(heat, time, ratio);
  return noodleTarget(heat, time, ratio);
}

export function exploreFrame(
  recipe: Recipe,
  heat: Level,
  time: Level,
  ratio: Level,
  progress: number | null,
): Visual {
  const target = exploreTarget(recipe, heat, time, ratio);
  if (progress === null || progress >= 1) return target;
  return mixToward(target, progress);
}

function eggTarget(heat: Level, time: Level, ratio: Level): Visual {
  const oilScale = [1.28, 1, 0.72][ratio];
  const visual = blank();
  visual.showEgg = true;
  visual.eggDrop = 1;
  visual.flame = [0.34, 0.62, 1][heat];
  visual.oil = [0.34, 0.68, 1][ratio];
  visual.white = eggWhite[heat][time];
  visual.yolk = eggYolk[heat][time];
  visual.brown = clamp(eggBrown[heat][time] * oilScale);
  visual.doneness = clamp(visual.white * 0.62 + visual.yolk * 0.38);
  visual.sentence = describeEgg(visual);
  return visual;
}

function greensTarget(heat: Level, time: Level, ratio: Level): Visual {
  const visual = blank();
  visual.showLeaves = true;
  visual.leafIn = 1;
  visual.flame = [0.3, 0.66, 1][heat];
  visual.oil = 0.72;
  visual.spread = [1, 0.66, 0.3][ratio];
  visual.wilt = clamp(greensWilt[heat][time] + (ratio === 2 ? 0.2 : ratio === 0 ? -0.04 : 0));
  visual.water = clamp((visual.wilt - 0.52) * 1.55 + (ratio === 2 ? 0.16 : 0));
  visual.doneness = visual.wilt;
  visual.sentence = describeGreens(visual);
  return visual;
}

function noodleTarget(heat: Level, time: Level, ratio: Level): Visual {
  const visual = blank();
  visual.showNoodles = true;
  visual.noodleIn = 1;
  visual.boil = [0, 0.55, 1][heat];
  visual.core = noodleCore[heat][time];
  visual.bloat = clamp(noodleBloat[heat][time] + (ratio === 0 ? 0.22 : ratio === 2 ? -0.06 : 0));
  visual.tangle = [0.88, 0.34, 0.12][ratio];
  visual.doneness = visual.core;
  visual.motionT = 0.42;
  visual.sentence = describeNoodles(visual);
  return visual;
}

function mixToward(target: Visual, t: number): Visual {
  const gesture = clamp(t / 0.2);
  const cook = clamp((t - 0.12) / 0.88);
  const visual: Visual = {
    ...target,
    doneness: lerp(0.02, target.doneness, cook),
    flame: target.flame,
    oil: lerp(target.oil * 0.15, target.oil, gesture),
    showEgg: t > 0.01 ? target.showEgg : false,
    eggDrop: lerp(0, target.eggDrop, gesture),
    white: lerp(0.04, target.white, cook),
    yolk: lerp(0, target.yolk, cook),
    brown: lerp(0, target.brown, cook),
    lid: 0,
    flip: 0,
    showLeaves: t > 0.01 ? target.showLeaves : false,
    leafIn: lerp(0, target.leafIn, gesture),
    wilt: lerp(0.02, target.wilt, cook),
    water: lerp(0, target.water, cook),
    spread: target.spread,
    stirring: false,
    motionT: t,
    showNoodles: t > 0.02 ? target.showNoodles : false,
    noodleIn: lerp(0, target.noodleIn, gesture),
    boil: lerp(0, target.boil, gesture),
    core: lerp(0.05, target.core, cook),
    tangle: target.tangle,
    bloat: lerp(0, target.bloat, cook),
    lift: 0,
    sentence: "",
  };
  visual.sentence = describe(target, visual);
  return visual;
}

function describe(target: Visual, visual: Visual) {
  if (target.showEgg) return describeEgg(visual);
  if (target.showLeaves) return describeGreens(visual);
  return describeNoodles(visual);
}

function describeEgg(visual: Visual) {
  if (visual.brown > 0.34) return "边缘焦了，蛋黄也跟着硬。";
  if (visual.yolk > 0.72) return "蛋黄已经硬了。";
  if (visual.brown > 0.14) return "火偏大，底开始上色。";
  if (visual.white < 0.4) return "蛋白还是透的。";
  if (visual.white > 0.7 && visual.yolk < 0.5) return "蛋白收干，蛋黄还软。";
  if (visual.yolk < 0.28) return "边缘刚白，中间还流。";
  return "还在变熟，可以准备离火。";
}

function describeGreens(visual: Visual) {
  if (visual.water > 0.28 || visual.wilt > 0.75) return "出水了，颜色发暗。";
  if (visual.wilt < 0.16) return "还是生叶子。";
  if (visual.wilt < 0.5) return "颜色还绿，咬起来还脆。";
  return "开始发软，再炒就要出水。";
}

function describeNoodles(visual: Visual) {
  if (visual.bloat > 0.42) return "煮太久，面发胀了。";
  if (visual.core < 0.45) return "芯还是硬的。";
  if (visual.tangle > 0.7 && visual.core < 0.9) return "水少，挤在一起，熟得不匀。";
  if (visual.core < 0.7) return "熟得不太匀。";
  return "外面软，里面也透。";
}

export function cookVisual(id: DishId, index: number, progress: number): Visual {
  const t = clamp(progress);
  if (id === "egg") return cookEgg(index, t);
  if (id === "greens") return cookGreens(index, t);
  return cookNoodles(index, t);
}

function cookEgg(index: number, t: number): Visual {
  const visual = blank();
  visual.showEgg = index > 0;
  visual.oil = 0.7;
  visual.flame = 0.55;
  visual.motionT = t;

  if (index === 0) {
    visual.showEgg = false;
    visual.oil = lerp(0.05, 0.72, t);
    visual.flame = lerp(0.2, 0.7, t);
    visual.doneness = 0.04;
  } else if (index === 1) {
    visual.eggDrop = clamp(t / 0.42);
    visual.white = clamp((t - 0.4) / 0.6) * 0.36;
    visual.yolk = 0.04;
    visual.doneness = visual.white;
  } else if (index === 2) {
    visual.eggDrop = 1;
    visual.lid = clamp(t / 0.18);
    visual.white = lerp(0.36, 0.9, t);
    visual.yolk = lerp(0.04, 0.3, t);
    visual.flame = 0.42;
    visual.doneness = lerp(0.2, 0.62, t);
  } else if (index === 3) {
    visual.eggDrop = 1;
    visual.flip = t;
    visual.white = 0.92;
    visual.yolk = lerp(0.3, 0.42, t);
    visual.flame = 0.6;
    visual.doneness = lerp(0.62, 0.78, t);
  } else {
    visual.eggDrop = 1;
    visual.white = 0.94;
    visual.yolk = 0.4;
    visual.flame = lerp(0.55, 0, t);
    visual.doneness = 0.8;
  }
  return visual;
}

function cookGreens(index: number, t: number): Visual {
  const visual = blank();
  visual.spread = 0.85;
  visual.motionT = t;
  visual.flame = 0.8;

  if (index === 0) {
    visual.flame = lerp(0.15, 1, t);
    visual.oil = 0;
    visual.doneness = 0.02;
  } else if (index === 1) {
    visual.oil = lerp(0, 0.8, t);
    visual.flame = 0.9;
    visual.doneness = 0.05;
  } else if (index === 2) {
    visual.showLeaves = true;
    visual.leafIn = clamp(t / 0.22);
    visual.oil = 0.75;
    visual.stirring = true;
    visual.wilt = lerp(0.04, 0.36, t);
    visual.flame = 0.95;
    visual.doneness = visual.wilt;
    visual.spread = 0.9;
  } else {
    visual.showLeaves = true;
    visual.leafIn = 1;
    visual.oil = 0.6;
    visual.wilt = 0.4;
    visual.flame = lerp(0.8, 0, t);
    visual.doneness = 0.4;
  }
  return visual;
}

function cookNoodles(index: number, t: number): Visual {
  const visual = blank();
  visual.motionT = t;
  visual.tangle = index >= 1 ? lerp(0.8, 0.28, index === 1 ? t : 1) : 0.2;

  if (index === 0) {
    visual.boil = lerp(0.05, 1, t);
    visual.doneness = 0.04;
  } else if (index === 1) {
    visual.boil = 1;
    visual.showNoodles = true;
    visual.noodleIn = clamp(t / 0.45);
    visual.stirring = true;
    visual.core = 0.08;
    visual.tangle = lerp(0.9, 0.3, t);
    visual.doneness = 0.1;
  } else if (index === 2) {
    visual.boil = 1;
    visual.showNoodles = true;
    visual.noodleIn = 1;
    visual.core = lerp(0.12, 0.82, t);
    visual.tangle = 0.28;
    visual.doneness = visual.core;
  } else if (index === 3) {
    visual.showNoodles = true;
    visual.noodleIn = 1;
    visual.boil = lerp(0.7, 0.05, t);
    visual.lid = clamp(t / 0.25);
    visual.core = lerp(0.82, 0.94, t);
    visual.doneness = visual.core;
  } else {
    visual.showNoodles = true;
    visual.noodleIn = 1;
    visual.boil = 0;
    visual.core = 0.96;
    visual.lift = t;
    visual.doneness = 0.96;
  }
  return visual;
}
