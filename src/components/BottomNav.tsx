"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PRIMARY_NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/today", label: "Today", icon: "◎" },
  { href: "/bookings", label: "Book", icon: "☑" },
  { href: "/food", label: "Eat", icon: "◆" },
  { href: "/budget", label: "$", icon: "¢" },
];

const MORE_NAV = [
  { href: "/itinerary", label: "All days" },
  { href: "/quests", label: "Quests" },
  { href: "/journal", label: "Journal" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* More overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {MORE_NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center justify-between px-5 py-4 border-b border-zinc-800 last:border-0 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-amber-400"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-zinc-600">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          {PRIMARY_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[44px] ${
                isActive(item.href)
                  ? "text-amber-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setMoreOpen(v => !v)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[44px] ${
              moreOpen ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="text-base leading-none">⋯</span>
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
