import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Frame } from "../components/Frame";
import { demoNote, formatDuration, recipes, totalSeconds } from "../data/recipes";

export function HomePage() {
  useEffect(() => {
    document.title = "火候";
  }, []);

  return (
    <Frame footer={<p className="text-base leading-relaxed">{demoNote}</p>}>
      <header>
        <h1 className="font-serif text-[2.5rem] leading-none font-medium tracking-[0.12em]">
          火候
        </h1>
        <p className="mt-5 text-lg">先看会怎样，再动手。</p>
      </header>
      <ol className="mt-14 border-t border-ink/15">
        {recipes.map((recipe, index) => (
          <li key={recipe.id} className="border-b border-ink/15">
            <Link to={`/cook/${recipe.id}`} className="block py-7 no-underline active:opacity-60">
              <p className="text-base text-forest">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-serif text-[1.75rem] leading-tight font-medium">
                {recipe.name}
              </h2>
              <p className="mt-2 text-lg leading-relaxed">{recipe.principle}</p>
              <p className="mt-3 text-base">{formatDuration(totalSeconds(recipe))}</p>
            </Link>
          </li>
        ))}
      </ol>
    </Frame>
  );
}
