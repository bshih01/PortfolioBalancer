import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import ContributionPage from "./pages/ContributionPage";
import BalancesPage from "./pages/BalancesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contributions" element={<ContributionPage />} />
        <Route path="/balances" element={<BalancesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
