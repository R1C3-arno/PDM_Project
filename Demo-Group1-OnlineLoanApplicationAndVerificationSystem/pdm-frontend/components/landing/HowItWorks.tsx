"use client";

import { FileText, Upload, ClipboardCheck, CreditCard } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Apply Online",
    desc: "Complete a simple application in under 10 minutes",
    color: "bg-primary-500"
  },
  {
    icon: Upload,
    title: "Upload Documents",
    desc: "Securely upload your ID, income proof & statements",
    color: "bg-primary-600"
  },
  {
    icon: ClipboardCheck,
    title: "Get Verified",
    desc: "Our automated system verifies your information",
    color: "bg-primary-700"
  },
  {
    icon: CreditCard,
    title: "Receive Funds",
    desc: "Accept offer, sign contract, get disbursement",
    color: "bg-primary-800"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Simple Process
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Get from application to approval in 4 simple steps
          </p>
        </div>

        {/* Steps Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                {/* Connector line - only visible on lg+ */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-0.5 bg-neutral-200" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step number + Icon */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center text-sm font-bold text-neutral-700 shadow-sm">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
