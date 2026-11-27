import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MissingPage } from "./pages/MissingPage";
import { PrinciplePage } from "./pages/PrinciplePage";
import { StagePage } from "./pages/StagePage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cook/:id" element={<PrinciplePage />} />
        <Route path="/cook/:id/explore" element={<StagePage mode="explore" />} />
        <Route path="/cook/:id/play" element={<StagePage mode="cook" />} />
        <Route path="*" element={<MissingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
