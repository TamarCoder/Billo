import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout/AppLayout";
import { WindowTitleBar } from "@/components/WindowTitleBar";
import { SWRProvider } from "@/providers/SWRProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import HomePage from "@/app/home/page";
import InvoicePage from "@/app/invoice/page";
import Companies from "@/app/companies/page";
import History from "@/app/history/page";
import Settings from "@/app/settings/page";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import ForgotPasswordPage from "@/app/forgot-password/page";
import { StartupVideo } from "@/components/StartupVideo/StartupVideo";
import "@/app/globals.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element "#root" was not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <WindowTitleBar />
    <ThemeProvider>
      <SWRProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<StartupVideo />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/invoice/:issuerId" element={<InvoicePage />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </SWRProvider>
    </ThemeProvider>
  </StrictMode>,
);
