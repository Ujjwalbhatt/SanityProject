"use client";
// Client Component — needs useState to track which item is open
// The data (items) is fetched on the server and passed in as a prop

import { useState } from "react";
import { FAQItem } from "@/types";

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  // Track which accordion item index is open (null = all closed)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, i) => (
        <div
          key={item._id}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900 pr-4">{item.question}</span>
            {/* Rotates + into × when open */}
            <span
              className={`shrink-0 w-5 h-5 text-violet-600 transition-transform duration-200 ${
                openIndex === i ? "rotate-45" : ""
              }`}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>

          {/* Accordion body — only rendered when open */}
          {openIndex === i && (
            <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
