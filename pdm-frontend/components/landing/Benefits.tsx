"use client";

import { Users, Building2, Settings, CheckCircle, Shield, Eye, Lock, Zap } from "lucide-react";

const roles = [
  {
    icon: Users,
    title: "Applicant",
    color: "bg-primary-500",
    features: [
      "Apply for loans",
      "Upload documents",
      "Track application status",
      "View offers & contracts",
      "Manage repayments"
    ]
  },
  {
    icon: Building2,
    title: "Banker",
    color: "bg-primary-600",
    features: [
      "Verify applications",
      "Score risk levels",
      "Approve/reject offers",
      "Generate contracts",
      "Monitor portfolio"
    ]
  },
  {
    icon: Settings,
    title: "Admin",
    color: "bg-primary-700",
    features: [
      "Manage user roles",
      "View audit logs",
      "System configuration",
      "Product management",
      "Analytics & reports"
    ]
  }
];

const trustItems = [
  { icon: Shield, text: "Secure KYC/AML" },
  { icon: Eye, text: "Real-time Tracking" },
  { icon: Lock, text: "Bank-grade Security" },
  { icon: Zap, text: "Automated Workflow" }
];

export default function Benefits() {
  return (
    <>
      {/* Trust Bar */}
      <section className="bg-white py-8 lg:py-12 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
              Role-Based Access
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Designed for Every Stakeholder
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Tailored interfaces for each role in the loan process
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 ${role.color} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {role.title}
                  </h3>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {role.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-center gap-3 text-sm text-neutral-600"
                      >
                        <CheckCircle size={16} className="text-status-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
