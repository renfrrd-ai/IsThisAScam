import { Link, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { ScamDetailPage } from "./pages/ScamDetailPage";
import { ReportPage } from "./pages/ReportPage";
import { CheckPage } from "./pages/CheckPage";
import { GuidesPage } from "./pages/GuidesPage";
import { GuideDetailPage } from "./pages/GuideDetailPage";
import { ScamTypesPage } from "./pages/ScamTypesPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ModeratorApplicationPage } from "./pages/ModeratorApplicationPage";
import { TrendsPage } from "./pages/TrendsPage";

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/scam/:slug" element={<ScamDetailPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/check" element={<CheckPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/guides/:slug" element={<GuideDetailPage />} />
        <Route path="/scam-types" element={<ScamTypesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/moderator-application" element={<ModeratorApplicationPage />} />
        <Route path="/trends" element={<TrendsPage />} />
      </Routes>
    </Layout>
  );
}
