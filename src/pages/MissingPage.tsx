import { Link } from "react-router-dom";
import { Frame } from "../components/Frame";

export function MissingPage() {
  return (
    <Frame>
      <h1 className="text-[2rem] font-medium">没有这道菜</h1>
      <p className="mt-4 text-lg">回到首页，挑一个菜法。</p>
      <Link
        to="/"
        className="mt-10 w-fit text-lg underline decoration-ink/30 underline-offset-4"
      >
        回首页
      </Link>
    </Frame>
  );
}
