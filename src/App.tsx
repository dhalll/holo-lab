
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RoleSelection from "./pages/RoleSelection";
import SupplierStart from "./pages/SupplierStart";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierScan from "./pages/SupplierScan";
import SupplierScanResults from "./pages/SupplierScanResults";
import DesignerLocationSelect from "./pages/DesignerLocationSelect";
import DesignerCustomization from "./pages/DesignerCustomization";
import DesignerOutput from "./pages/DesignerOutput";
import DesignerFinalOutput from "./pages/DesignerFinalOutput";
import DesignerVRView from "./pages/DesignerVRView";
import FinalRendering from "./pages/FinalRendering";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/supplier/start" element={<SupplierStart />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/scan" element={<SupplierScan />} />
          <Route path="/supplier/scan-results" element={<SupplierScanResults />} />
          <Route path="/designer/location" element={<DesignerLocationSelect />} />
          <Route path="/designer/customization" element={<DesignerCustomization />} />
          <Route path="/designer/output" element={<DesignerOutput />} />
          <Route path="/designer/final-output" element={<DesignerFinalOutput />} />
          <Route path="/designer/vr-view" element={<DesignerVRView />} />
          <Route path="/designer/final-rendering" element={<FinalRendering />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
