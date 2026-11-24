import React, { useEffect } from "react";
import { AuthBrandPanel, AuthBrandPanelProps } from "./AuthBrandPanel";

interface AuthLayoutProps extends AuthBrandPanelProps {
  pageTitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  pageTitle,
  headlinePrefix,
  headlineOutlined,
  headlineSuffix,
  subhead,
  children,
}) => {
  useEffect(() => {
    document.title = `${pageTitle} – Checking`;
  }, [pageTitle]);

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-[#F5F0E6] font-satoshi antialiased selection:bg-[#C8FF00] selection:text-[#0A0A0A] grid grid-cols-1 lg:grid-cols-[55%_45%]">
      {/* Left 55% Brand Poster (collapses to compact top hero on <1024px) */}
      <AuthBrandPanel
        headlinePrefix={headlinePrefix}
        headlineOutlined={headlineOutlined}
        headlineSuffix={headlineSuffix}
        subhead={subhead}
      />

      {/* Right 45% Auth Form Column */}
      <main className="relative flex flex-col justify-between bg-[#0A0A0A] px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 min-h-[calc(100vh-200px)] lg:min-h-screen">
        <div className="w-full max-w-[440px] mx-auto my-auto">{children}</div>

        {/* Auth footer */}
        <footer className="mt-10 pt-4 text-center font-satoshi text-xs text-[#A1A1A1]">
          Checking – Your event co-pilot.
        </footer>
      </main>
    </div>
  );
};
