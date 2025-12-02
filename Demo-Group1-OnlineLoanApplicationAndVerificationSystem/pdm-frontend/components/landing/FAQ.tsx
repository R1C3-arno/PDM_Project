"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I apply?",
    answer: "Simply click 'Apply Now' to create an account, fill out the application form, and upload required documents. Our system will guide you through each step."
  },
  {
    question: "How long does verification take?",
    answer: "Verification typically takes 1-3 business days. Our automated KYC/AML checks and risk assessment tools accelerate the process significantly."
  },
  {
    question: "What documents do I need?",
    answer: "You'll need a valid ID, proof of income, employment verification, and any additional documents specific to your loan product. The system will show you exactly what's required."
  },
  {
    question: "Is my data safe?",
    answer: "Absolutely. We use bank-grade encryption, secure document storage, role-based access control, and maintain full audit trails. Your data is protected with enterprise-level security."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Quick answers to common questions about our platform
          </p>
        </div>

        {/* FAQ List - Full Width */}
        <div className="w-full max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="w-full bg-white rounded-xl border border-neutral-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-base sm:text-lg font-semibold text-neutral-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-neutral-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <div className="pt-2 border-t border-neutral-100">
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
