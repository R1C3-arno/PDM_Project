"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const footerSections = [
  {
    title: "System Navigation",
    items: ["Dashboard", "Applications", "Documents", "Offers"]
  },
  {
    title: "Documentation",
    items: ["API Docs", "User Guide", "Developer Docs", "Architecture"]
  },
  {
    title: "Legal",
    items: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Contact"]
  }
];

export default function CTA() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Start Your Application Today
            </h2>
            <p className="text-base sm:text-lg text-primary-100 mb-8 leading-relaxed">
              Join thousands of applicants who have streamlined their loan process with OLAVS
            </p>
            <button
              onClick={() => router.push("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-primary-700 px-8 py-4 rounded-lg font-semibold text-base transition-colors shadow-lg"
            >
              Apply Now - It&apos;s Free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 pt-12 lg:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.png"
                  alt="OLAVS Logo"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-white font-bold text-xl">OLAVS</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Online Loan Application & Verification System
              </p>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-semibold mb-4 text-sm leading-normal">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors leading-normal"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-neutral-800 text-center">
            <p className="text-sm text-neutral-500 leading-normal">
              © {currentYear} OLAVS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
