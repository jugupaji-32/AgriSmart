import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Eager load critical pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

// Lazy load secondary pages for better initial load performance
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Weather = lazy(() => import("./pages/Weather"));
const CropRecommender = lazy(() => import("./pages/CropRecommender"));
const FertilizerPrediction = lazy(() => import("./pages/FertilizerPrediction"));
const Results = lazy(() => import("./pages/Results"));
const SoilReports = lazy(() => import("./pages/SoilReports"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Contact = lazy(() => import("./pages/Contact"));
const MarketRates = lazy(() => import("./pages/MarketRates"));
const KhataBook = lazy(() => import("./pages/KhataBook"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback for public routes only (kept minimal)
const PublicPageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  return (
    <Suspense fallback={<PublicPageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/crop-recommender" element={<CropRecommender />} />
          <Route path="/fertilizer-prediction" element={<FertilizerPrediction />} />
          <Route path="/results" element={<Results />} />
          <Route path="/soil-reports" element={<SoilReports />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/market-rates" element={<MarketRates />} />
          <Route path="/khata-book" element={<KhataBook />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" expand={true} richColors />
      <AppRoutes />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
