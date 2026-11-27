import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Frame } from "../components/Frame";
import { Plate } from "../components/Plate";
import { ScienceNote } from "../components/ScienceNote";
import { Segmented } from "../components/Segmented";
import { StepTimer } from "../components/StepTimer";
import {
  exploreSeconds,
  getRecipe,
  type Level,
  type Recipe,
} from "../data/recipes";
import { useStepTimer } from "../hooks/useStepTimer";
import { cookVisual, exploreFrame } from "../sim/visual";
import { MissingPage } from "./MissingPage";

export function StagePage({ mode }: { mode: "explore" | "cook" }) {
  const { id } = useParams();
  const recipe = getRecipe(id);
  const [takeaway, setTakeaway] = useState<string | null>(null);

  useEffect(() => {
    if (!recipe) {
      document.title = "火候";
      return;
    }
    document.title = takeaway
      ? `记住 · ${recipe.name}`
      : `${mode === "explore" ? "探索" : "实战"} · ${recipe.name}`;
  }, [recipe, mode, takeaway]);

  if (!recipe) return <MissingPage />;
  if (takeaway) {
    return <Takeaway recipe={recipe} line={takeaway} mode={mode} />;
  }

  return mode === "explore" ? (
    <Explore recipe={recipe} onKeep={setTakeaway} />
  ) : (
    <Cook recipe={recipe} onDone={setTakeaway} />
  );
}

function Explore({
  recipe,
  onKeep,
}: {
  recipe: Recipe;
  onKeep: (line: string) => void;
}) {
  const [heat, setHeat] = useState<Level>(recipe.id === "noodles" ? 2 : 1);
  const [time, setTime] = useState<Level>(1);
  const [ratio, setRatio] = useState<Level>(1);

  return (
    <ExploreRun
      key={exploreSeconds[time]}
      recipe={recipe}
      heat={heat}
      time={time}
      ratio={ratio}
      onHeat={setHeat}
      onTime={setTime}
      onRatio={setRatio}
      onKeep={onKeep}
    />
  );
}

function ExploreRun({
  recipe,
  heat,
  time,
  ratio,
  onHeat,
  onTime,
  onRatio,
  onKeep,
}: {
  recipe: Recipe;
  heat: Level;
  time: Level;
  ratio: Level;
  onHeat: (value: Level) => void;
  onTime: (value: Level) => void;
  onRatio: (value: Level) => void;
  onKeep: (line: string) => void;
}) {
  const timer = useStepTimer(exploreSeconds[time], false);
  const progress =
    timer.phase === "idle" ? null : timer.phase === "done" ? 1 : 1 - timer.remaining / timer.duration;
  const visual = exploreFrame(recipe, heat, time, ratio, progress);
  const playing = timer.phase === "running" || timer.phase === "paused";

  return (
    <Frame>
      <StageHeader recipe={recipe} mode="探索" />
      <div className="mt-6">
        <Plate dish={recipe.id} visual={visual} settled={!playing} />
      </div>
      <h1
        className="mt-4 text-center font-serif text-[1.65rem] leading-snug font-medium"
        aria-live="polite"
      >
        {visual.sentence}
      </h1>
      <div className="mt-8 space-y-3">
        {recipe.params.map((param) => (
          <Segmented
            key={param.key}
            label={param.label}
            options={param.options}
            value={param.key === "heat" ? heat : param.key === "time" ? time : ratio}
            onChange={param.key === "heat" ? onHeat : param.key === "time" ? onTime : onRatio}
          />
        ))}
      </div>
      <StepTimer
        remaining={timer.remaining}
        duration={timer.duration}
        phase={timer.phase}
        idleLabel="播放"
        note="模拟时钟，不必真下锅。"
        onPause={timer.pause}
        onStart={timer.start}
        onReset={timer.reset}
      />
      <div className="mt-8">
        <ScienceNote detail={recipe.note} />
      </div>
      <button type="button" className="action mt-8" onClick={() => onKeep(visual.sentence)}>
        记下这一条
      </button>
    </Frame>
  );
}

function Cook({ recipe, onDone }: { recipe: Recipe; onDone: (line: string) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const last = stepIndex === recipe.steps.length - 1;

  return (
    <Frame>
      <StageHeader recipe={recipe} mode="实战" meta={`${stepIndex + 1}/${recipe.steps.length}`} />
      <CookStep key={`${recipe.id}-${stepIndex}`} recipe={recipe} index={stepIndex} />
      <button
        type="button"
        className="action mt-4"
        onClick={() => {
          if (last) onDone(recipe.outcome);
          else setStepIndex((index) => index + 1);
        }}
      >
        {last ? "完成" : "下一步"}
      </button>
    </Frame>
  );
}

function CookStep({ recipe, index }: { recipe: Recipe; index: number }) {
  const step = recipe.steps[index];
  const timer = useStepTimer(step.seconds, true);
  const progress = timer.phase === "done" ? 1 : 1 - timer.remaining / timer.duration;
  const visual = cookVisual(recipe.id, index, progress);

  return (
    <>
      <div className="mt-6">
        <Plate dish={recipe.id} visual={visual} settled={false} />
      </div>
      <h1 className="mt-4 text-[1.65rem] leading-snug font-medium">{step.title}</h1>
      <p className="mt-3 min-h-[3.7rem] text-lg leading-relaxed">{step.detail}</p>
      <StepTimer
        remaining={timer.remaining}
        duration={timer.duration}
        phase={timer.phase}
        idleLabel="开始"
        onPause={timer.pause}
        onStart={timer.start}
        onReset={timer.reset}
      />
      <div className="mt-6">
        <ScienceNote detail={recipe.note} />
      </div>
    </>
  );
}

function StageHeader({
  recipe,
  mode,
  meta,
}: {
  recipe: Recipe;
  mode: string;
  meta?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Link to={`/cook/${recipe.id}`} className="back">
        返回
      </Link>
      <p className="text-base">
        {recipe.name} · {mode}
        {meta ? ` ${meta}` : ""}
      </p>
    </div>
  );
}

function Takeaway({
  recipe,
  line,
  mode,
}: {
  recipe: Recipe;
  line: string;
  mode: "explore" | "cook";
}) {
  return (
    <Frame
      footer={
        <Link to="/" className="action">
          回到首页
        </Link>
      }
    >
      <p className="text-base">{mode === "cook" ? "做成了" : "看到的是"}</p>
      <h1 className="mt-3 font-serif text-[2.25rem] leading-tight font-medium">{recipe.name}</h1>
      <p className="mt-8 text-lg leading-relaxed">{line}</p>
      <p className="mt-10 text-base">记住</p>
      <p className="mt-3 text-lg leading-relaxed">{recipe.remember}</p>
    </Frame>
  );
}
