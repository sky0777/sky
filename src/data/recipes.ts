/**
 * 演示用原创菜法。
 * 只写家庭烹饪里常见的受热、水分和时间。
 * 不是引自任何书、专栏或菜谱站点。
 */

export type DishId = "egg" | "greens" | "noodles";
export type Level = 0 | 1 | 2;
export type ParamKey = "heat" | "time" | "ratio";
export type Motion = "pour" | "add" | "flip" | "stir" | "heat" | "off" | "rest" | "boil" | "lift";

export type Step = {
  title: string;
  detail: string;
  motion: Motion;
  seconds: number;
};

export type ParamDef = {
  key: ParamKey;
  label: string;
  options: [string, string, string];
};

export type Recipe = {
  id: DishId;
  name: string;
  principle: string;
  why: string;
  note: string;
  outcome: string;
  remember: string;
  params: ParamDef[];
  steps: Step[];
};

export const demoNote = "演示用原创内容。讲受热、水分和时间，不是引自任何书。";

export const exploreSeconds: Record<Level, number> = {
  0: 12,
  1: 20,
  2: 30,
};

export const recipes: Recipe[] = [
  {
    id: "egg",
    name: "嫩煎蛋",
    principle: "蛋白先白，蛋黄后熟。",
    why: "蛋白比蛋黄先熟。火不用大，边缘定住就少动。",
    note: "盖上锅，热气从上面把蛋白收干。翻面后马上离火，余温还会再熟一点。",
    outcome: "边缘熟，蛋黄还软。",
    remember: "蛋白先白。翻面后马上离火。",
    params: [
      { key: "heat", label: "火力", options: ["小", "中", "大"] },
      { key: "time", label: "时间", options: ["短", "正好", "久"] },
      { key: "ratio", label: "油量", options: ["少", "正好", "多"] },
    ],
    steps: [
      {
        title: "热锅，倒薄油",
        detail: "油铺开就行。油面轻轻流动，不必等到冒烟。",
        motion: "pour",
        seconds: 15,
      },
      {
        title: "磕进去，先别动",
        detail: "蛋液摊开后停手。边缘开始发白，中间还是透的。",
        motion: "add",
        seconds: 20,
      },
      {
        title: "盖上，小火等",
        detail: "热气留在上面。蛋白慢慢变白，蛋黄先不动。",
        motion: "rest",
        seconds: 70,
      },
      {
        title: "轻翻一面",
        detail: "翻过来只煎一会儿。这一面只要薄薄定住。",
        motion: "flip",
        seconds: 12,
      },
      {
        title: "关火，马上盛出",
        detail: "离开锅底。再停几秒，蛋黄就会变硬。",
        motion: "off",
        seconds: 6,
      },
    ],
  },
  {
    id: "greens",
    name: "清炒青菜",
    principle: "火要高，时间要短。",
    why: "叶子薄。火不够，或者炒太久，水会先出来。",
    note: "菜要散开。堆在一起会闷出很多水。刚变软就关火。",
    outcome: "颜色还绿，咬起来还脆。",
    remember: "先热锅。看到出水，就是久了。",
    params: [
      { key: "heat", label: "火力", options: ["小", "中", "大"] },
      { key: "time", label: "时间", options: ["短", "正好", "久"] },
      { key: "ratio", label: "分量", options: ["少", "正好", "多"] },
    ],
    steps: [
      {
        title: "空锅烧热",
        detail: "先不放油。锅边发烫，再进行下一步。",
        motion: "heat",
        seconds: 20,
      },
      {
        title: "倒油，转一圈",
        detail: "油热了，叶子才不容易贴锅出水。",
        motion: "pour",
        seconds: 8,
      },
      {
        title: "下菜，快翻",
        detail: "一次铺开，不停翻。堆着会闷出水。",
        motion: "stir",
        seconds: 45,
      },
      {
        title: "关火装盘",
        detail: "叶子刚塌一点就出锅。余热还会再软一点。",
        motion: "off",
        seconds: 6,
      },
    ],
  },
  {
    id: "noodles",
    name: "煮好一碗面",
    principle: "水要大开，面才一起软。",
    why: "水没翻滚就下面，外面糊，里面还硬。",
    note: "下锅后拨散。关火再闷一下，芯会透，又不容易断。",
    outcome: "外面软，里面也透。",
    remember: "水不开，不下面。闷一下就捞。",
    params: [
      { key: "heat", label: "水", options: ["没开", "刚开", "大开"] },
      { key: "time", label: "时间", options: ["短", "正好", "久"] },
      { key: "ratio", label: "水量", options: ["少", "正好", "多"] },
    ],
    steps: [
      {
        title: "等水大开",
        detail: "水面大翻滚再下面。小泡还不够。",
        motion: "boil",
        seconds: 20,
      },
      {
        title: "下面，拨散",
        detail: "马上搅开。粘在一起的地方会先烂。",
        motion: "stir",
        seconds: 12,
      },
      {
        title: "保持沸腾",
        detail: "只冒小泡，就等它重新大开。",
        motion: "boil",
        seconds: 80,
      },
      {
        title: "关火，闷一下",
        detail: "盖上。热水还在，芯会慢慢透。",
        motion: "rest",
        seconds: 20,
      },
      {
        title: "捞出",
        detail: "别在汤里再泡。泡久了会发胀。",
        motion: "lift",
        seconds: 8,
      },
    ],
  },
];

export function getRecipe(id: string | undefined) {
  return recipes.find((recipe) => recipe.id === id);
}

export function totalSeconds(recipe: Recipe) {
  return recipe.steps.reduce((sum, step) => sum + step.seconds, 0);
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest} 秒`;
  if (rest === 0) return `${minutes} 分钟`;
  return `${minutes} 分 ${rest} 秒`;
}
