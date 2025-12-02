"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  // Role-based navigation
  const getNavigationForRole = (role: string): NavItem[] => {
    switch (role) {
      case "APPLICANT":
        return [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Apply for Loan", href: "/applications/new" },
          { name: "My Loans", href: "/loans/my-loans" },
          { name: "Wallet", href: "/wallet" },
          { name: "Transactions", href: "/transactions" },
          { name: "Messages", href: "/messages" },
          { name: "Statistics", href: "/statistics" },
          { name: "Profile", href: "/profile" },
        ];
      case "ADMIN":
        return [
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Users", href: "/admin/users" },
          { name: "Applications", href: "/admin/applications" },
          { name: "Loans", href: "/admin/loans" },
          { name: "Transactions", href: "/admin/transactions" },
          { name: "Support Tickets", href: "/admin/support-tickets" },
          { name: "Analytics", href: "/admin/analytics" },
          { name: "Settings", href: "/admin/settings" },
        ];
      case "BANKER":
        return [
          { name: "Dashboard", href: "/banker/dashboard" },
          { name: "Review Applications", href: "/banker/applications/review" },
          { name: "Disbursements", href: "/banker/disbursements" },
          { name: "My Tasks", href: "/banker/tasks" },
        ];
      case "VERIFIER":
        return [
          { name: "Dashboard", href: "/verifier/dashboard" },
          { name: "KYC Verification", href: "/verifier/kyc" },
          { name: "Documents", href: "/verifier/documents" },
        ];
      case "UNDERWRITER":
        return [
          { name: "Dashboard", href: "/underwriter/dashboard" },
          { name: "Risk Assessment", href: "/underwriter/risk-assessment" },
          { name: "Create Offers", href: "/underwriter/offers" },
        ];
      default:
        return [{ name: "Dashboard", href: "/dashboard" }];
    }
  };

  const navigation = user ? getNavigationForRole(user.role) : [];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation Links */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  >
                    O
                  </div>
                  <span className="text-xl font-bold text-blue-600">OLAVS</span>
                </div>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "border-blue-600 text-gray-900"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <span className="font-medium">{user.fullName || user.email}</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
