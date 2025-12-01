"use client";

import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Applications", value: "1,247", icon: FileText, color: "bg-primary-100 text-primary-600" },
  { label: "Pending Review", value: "89", icon: Clock, color: "bg-yellow-100 text-yellow-600" },
  { label: "Approved", value: "856", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { label: "Active Loans", value: "302", icon: TrendingUp, color: "bg-purple-100 text-purple-600" }
];

const pipelineStages = [
  { stage: "Submitted", count: 142 },
  { stage: "Review", count: 89 },
  { stage: "Verification", count: 67 },
  { stage: "Offer", count: 45 },
  { stage: "Contract", count: 32 }
];

export default function Statistics() {
  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Dashboard Preview
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Real-time Analytics
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Unified dashboard for applicants, verifiers, underwriters, and admins
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Browser Chrome */}
          <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-white rounded px-3 py-1 text-xs text-neutral-400 max-w-[180px]">
                  olavs.app/dashboard
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary-50 to-white">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-neutral-500 leading-normal">{stat.label}</p>
                        <p className="text-xl font-bold text-neutral-900 leading-tight">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Pipeline */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 leading-tight">
                Application Pipeline
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {pipelineStages.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-50 rounded-lg p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-primary-600 leading-tight">{item.count}</p>
                    <p className="text-xs text-neutral-500 mt-1 leading-normal">{item.stage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
