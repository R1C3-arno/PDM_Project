"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#faq", label: "FAQ" }
];

export default function LandingHeader() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return '/login';
    if (user.role === 'APPLICANT') {
      return `/user/${user.id}/dashboard`;
    } else if (user.role === 'ADMIN') {
      return `/admin/system/${user.id}`;
    } else {
      return `/staff/${user.role.toLowerCase()}/${user.id}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="OLAVS Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-neutral-900 font-bold text-xl">OLAVS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => router.push(getDashboardUrl())}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Apply Now
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40">
          <div className="px-4 py-6 space-y-6">
            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              {isAuthenticated && user ? (
                <button
                  onClick={() => {
                    router.push(getDashboardUrl());
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      router.push("/login");
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/register");
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
