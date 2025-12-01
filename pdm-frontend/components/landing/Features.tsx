"use client";

import {
  FileText, Upload, ClipboardCheck, FileCheck,
  Zap, Eye, BarChart3, DollarSign,
  CreditCard, Database, Lock, Shield
} from "lucide-react";

const systemFeatures = [
  {
    icon: FileText,
    title: "Loan Application",
    desc: "Simple, guided application process",
    color: "bg-primary-500"
  },
  {
    icon: Upload,
    title: "Document Upload",
    desc: "Secure document management",
    color: "bg-primary-600"
  },
  {
    icon: ClipboardCheck,
    title: "Verification",
    desc: "Automated KYC/AML checks",
    color: "bg-primary-700"
  },
  {
    icon: FileCheck,
    title: "Offer & Contract",
    desc: "Digital contract generation",
    color: "bg-primary-800"
  }
];

const powerfulFeatures = [
  { icon: Zap, title: "Automated Verification" },
  { icon: Eye, title: "Real-time Status Tracking" },
  { icon: BarChart3, title: "Credit Risk Analysis" },
  { icon: DollarSign, title: "Smart Offer Generation" },
  { icon: FileCheck, title: "Contract Lifecycle" },
  { icon: CreditCard, title: "Repayment Scheduler" },
  { icon: Database, title: "Data Integrity" },
  { icon: Lock, title: "Secure Storage" }
];

export default function Features() {
  return (
    <>
      {/* System Overview Section */}
      <section id="features" className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
              Complete Solution
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              All Loan Processes in One Platform
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Streamline your entire loan lifecycle from application to repayment
            </p>
          </div>

          {/* System Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Powerful Features Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
              Capabilities
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to manage loans efficiently
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {powerfulFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {feature.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
