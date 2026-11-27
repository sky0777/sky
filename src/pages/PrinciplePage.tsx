import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Frame } from "../components/Frame";
import { ScienceNote } from "../components/ScienceNote";
import { formatDuration, getRecipe, totalSeconds } from "../data/recipes";
import { MissingPage } from "./MissingPage";

export function PrinciplePage() {
  const { id } = useParams();
  const recipe = getRecipe(id);

  useEffect(() => {
    document.title = recipe ? `${recipe.name} · 火候` : "火候";
  }, [recipe]);

  if (!recipe) return <MissingPage />;

  return (
    <Frame>
      <Link to="/" className="back w-fit">
        返回
      </Link>
      <h1 className="mt-8 font-serif text-[2.25rem] leading-tight font-medium">{recipe.name}</h1>
      <p className="mt-6 text-lg leading-relaxed">{recipe.why}</p>
      <div className="mt-8">
        <ScienceNote detail={recipe.note} />
      </div>
      <div className="mt-auto space-y-3 pt-12">
        <Link to={`/cook/${recipe.id}/explore`} className="choice action-line">
          <span className="block text-lg">探索</span>
          <span className="mt-1 block text-base">调火、时间和多少，看它怎么变。</span>
        </Link>
        <Link to={`/cook/${recipe.id}/play`} className="choice action">
          <span className="block text-lg">实战</span>
          <span className="mt-1 block text-base">
            按步骤做，大约 {formatDuration(totalSeconds(recipe))}。
          </span>
        </Link>
      </div>
    </Frame>
  );
}
