"use client";

import { Shield, Lock, Eye, Database, UserCheck, FileCheck } from "lucide-react";

const securityFeatures = [
  { icon: UserCheck, text: "KYC & AML workflow" },
  { icon: Lock, text: "Encrypted document storage" },
  { icon: Eye, text: "Verification audit-trail" },
  { icon: Shield, text: "Role-based access control" },
  { icon: Database, text: "Transaction integrity" },
  { icon: FileCheck, text: "Bank-grade encryption" }
];

export default function Testimonials() {
  return (
    <section id="security" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Security First
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
            Enterprise-Grade Security
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Your data is protected with industry-leading security measures
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-neutral-700 leading-normal">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
