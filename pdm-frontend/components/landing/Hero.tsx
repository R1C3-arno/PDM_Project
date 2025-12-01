"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

const trustPoints = [
  "Bank-grade security",
  "1-3 day processing",
  "No hidden fees"
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className="min-h-[90vh] flex items-center bg-gradient-to-b from-neutral-50 to-white pt-20 pb-12 lg:pt-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              Trusted by 10,000+ applicants
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Get Your Loan
              <span className="text-primary-600 block">Approved Faster</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 mb-8 max-w-lg leading-relaxed">
              Streamlined application process with automated verification.
              Apply in minutes, get approved in days.
            </p>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                  <CheckCircle2 size={16} className="text-status-success flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/register')}
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-lg font-semibold text-base transition-colors shadow-lg shadow-primary-600/25"
              >
                Apply Now - It&apos;s Free
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => router.push('/staff/login')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 px-6 py-3.5 rounded-lg font-semibold text-base border border-neutral-200 transition-colors"
              >
                <Play size={18} />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-primary-600/20">
              {/* Mock Dashboard */}
              <div className="bg-white rounded-xl overflow-hidden">
                {/* Browser bar */}
                <div className="bg-neutral-100 px-4 py-3 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-status-error"></div>
                    <div className="w-3 h-3 rounded-full bg-status-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-status-success"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-white rounded px-3 py-1 text-xs text-neutral-400 max-w-[200px]">
                      olavs.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-xs text-neutral-500 mb-1">Applications</p>
                      <p className="text-xl font-bold text-neutral-900">142</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-neutral-500 mb-1">Approved</p>
                      <p className="text-xl font-bold text-status-success">89</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    {[
                      { id: "1024", status: "Approved", color: "bg-green-100 text-green-700" },
                      { id: "1023", status: "In Review", color: "bg-yellow-100 text-yellow-700" },
                      { id: "1022", status: "Pending", color: "bg-neutral-100 text-neutral-600" }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-sm font-medium text-neutral-700">Application #{item.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3 border">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-status-success" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">$2.4M</p>
                <p className="text-xs text-neutral-500">Disbursed this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
