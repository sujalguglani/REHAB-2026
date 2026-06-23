"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { SheetCostItem } from "@/lib/googleSheets";
import { DAILY_ESTIMATES } from "@/lib/data";

type Expense = { id: string; label: string; category: string; amount: number; date: string };

const EXPENSE_CATS = ["🍔 Food", "🚗 Transport", "🎉 Activities", "🛍️ Shopping", "🏷️ Other"];

const CAT_STYLE: Record<string, string> = {
  "Flights":       "bg-blue-950 text-blue-400 border-blue-900",
  "Accommodation": "bg-purple-950 text-purple-400 border-purple-900",
  "Activities":    "bg-amber-950 text-amber-400 border-amber-900",
  "Transport":     "bg-teal-950 text-teal-400 border-teal-900",
  "Food":          "bg-orange-950 text-orange-400 border-orange-900",
};

export default function BudgetClient({
  prebooked,
  currency,
  source,
}: {
  prebooked: SheetCostItem[];
  currency: string;
  source: "sheet" | "mock";
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm]         = useState({ label: "", category: "🍔 Food", amount: "" });
  const [tab, setTab]           = useState<"summary" | "daily" | "log">("summary");

  useEffect(() => {
    const saved = localStorage.getItem("vn-expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  const persist = (next: Expense[]) => {
    setExpenses(next);
    localStorage.setItem("vn-expenses", JSON.stringify(next));
  };

  const addExpense = () => {
    if (!form.label || !form.amount) return;
    persist([...expenses, {
      id:       Date.now().toString(),
      label:    form.label,
      category: form.category,
      amount:   parseFloat(form.amount),
      date:     new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
    }]);
    setForm(f => ({ ...f, label: "", amount: "" }));
  };

  const dailyTotal   = DAILY_ESTIMATES.reduce((s, d) => s + d.food + d.transport + d.activities + d.other, 0);
  const bookedTotal  = prebooked.reduce((s, b) => s + b.amount, 0);
  const loggedTotal  = expenses.reduce((s, e) => s + e.amount, 0);
  const sym          = currency === "AUD" ? "A$" : currency === "USD" ? "$" : currency === "GBP" ? "£" : "$";

  // Group prebooked by category for the bar
  const catTotals = prebooked.reduce<Record<string, number>>((acc, b) => {
    acc[b.category] = (acc[b.category] ?? 0) + b.amount;
    return acc;
  }, {});

  const BAR_COLORS = ["bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-teal-500", "bg-orange-500", "bg-pink-500"];
  const catEntries = Object.entries(catTotals);

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            ¢
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Budget</h1>
            <p className="text-zinc-500 text-sm">Pre-booked · live spend log</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {source === "mock" && (
        <div className="bg-amber-950/40 border border-amber-900/40 rounded-xl px-4 py-2 text-amber-400 text-xs">
          ⚠️ Showing placeholder data — sheet unavailable
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
          <p className="text-purple-400 font-bold text-base">{sym}{bookedTotal.toLocaleString()}</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Pre-booked</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
          <p className="text-amber-400 font-bold text-base">{sym}{dailyTotal.toLocaleString()}</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Est. on-trip</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
          <p className="text-emerald-400 font-bold text-base">{sym}{loggedTotal.toFixed(0)}</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Logged</p>
        </div>
      </div>

      {/* Stacked bar */}
      {catEntries.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 space-y-3">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Breakdown</p>
          <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
            {catEntries.map(([cat, amt], i) => (
              <div
                key={cat}
                className={`${BAR_COLORS[i % BAR_COLORS.length]} rounded-full`}
                style={{ width: `${(amt / bookedTotal) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {catEntries.map(([cat, amt], i) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                <span className="text-zinc-400 text-xs">{cat}</span>
                <span className="text-zinc-500 text-xs">{sym}{amt.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-zinc-800 rounded-xl overflow-hidden">
        {(["summary", "daily", "log"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${tab === t ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            {t === "summary" ? "Pre-booked" : t === "daily" ? "Daily est." : "Log spend"}
          </button>
        ))}
      </div>

      {/* Summary tab */}
      {tab === "summary" && (
        <div className="space-y-2">
          {prebooked.map(item => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${CAT_STYLE[item.category] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                  {item.category}
                </span>
                <p className="text-zinc-200 text-sm truncate">{item.label}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <p className="text-white font-semibold text-sm">{sym}{item.amount.toLocaleString()}</p>
                <span className={`text-[10px] ${item.paid ? "text-emerald-400" : "text-zinc-600"}`}>
                  {item.paid ? "✓" : "○"}
                </span>
              </div>
            </div>
          ))}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Total pre-booked</p>
            <p className="text-amber-400 font-bold text-base">{sym}{bookedTotal.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Daily estimates tab */}
      {tab === "daily" && (
        <div className="space-y-2">
          {DAILY_ESTIMATES.map(d => {
            const total = d.food + d.transport + d.activities + d.other;
            return (
              <div key={d.day} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">{d.day}</span>
                    <p className="text-zinc-200 text-sm">{d.label}</p>
                  </div>
                  <p className="text-amber-400 font-semibold text-sm">{sym}{total}</p>
                </div>
                {total > 0 && (
                  <div className="flex gap-2 text-[10px] text-zinc-500">
                    {d.food > 0 && <span>🍔 {sym}{d.food}</span>}
                    {d.transport > 0 && <span>🚗 {sym}{d.transport}</span>}
                    {d.activities > 0 && <span>🎉 {sym}{d.activities}</span>}
                    {d.other > 0 && <span>🛍️ {sym}{d.other}</span>}
                  </div>
                )}
              </div>
            );
          })}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Total estimated on-trip</p>
            <p className="text-amber-400 font-bold text-base">{sym}{dailyTotal.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Log tab */}
      {tab === "log" && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 space-y-3">
            <p className="text-zinc-400 text-xs uppercase tracking-widest">Add expense</p>
            <input type="text" placeholder="What did you spend on?" value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            <div className="flex gap-2">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="flex-1 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none">
                {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder={currency} value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-24" />
            </div>
            <button onClick={addExpense}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-2.5 rounded-xl transition-colors">
              Add Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center text-zinc-600 text-sm py-6">No expenses logged yet. Start spending!</div>
          ) : (
            <div className="space-y-2">
              {expenses.map(exp => (
                <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{exp.category.split(" ")[0]}</span>
                    <div>
                      <p className="text-zinc-200 text-sm">{exp.label}</p>
                      <p className="text-zinc-600 text-[10px]">{exp.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-semibold text-sm">{sym}{exp.amount.toFixed(2)}</p>
                    <button onClick={() => persist(expenses.filter(e => e.id !== exp.id))}
                      className="text-zinc-700 hover:text-red-500 transition-colors text-sm">×</button>
                  </div>
                </div>
              ))}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-white font-semibold text-sm">Total logged</p>
                <p className="text-emerald-400 font-bold text-base">{sym}{loggedTotal.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
