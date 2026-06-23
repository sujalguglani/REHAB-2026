"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BUDGET_PREBOOKED, DAILY_ESTIMATES } from "@/lib/data";

type Expense = {
  id: string; label: string; category: string;
  amount: number; date: string;
};

const EXPENSE_CATS = ["🍔 Food", "🚗 Transport", "🎉 Activities", "🛍️ Shopping", "🏷️ Other"];

const CATEGORY_STYLE: Record<string, string> = {
  "Flights": "bg-blue-950 text-blue-400 border-blue-900",
  "Accommodation": "bg-purple-950 text-purple-400 border-purple-900",
};

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({ label: "", category: "🍔 Food", amount: "" });
  const [tab, setTab] = useState<"summary" | "daily" | "log">("summary");

  useEffect(() => {
    const saved = localStorage.getItem("vn-expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  const save = (next: Expense[]) => {
    setExpenses(next);
    localStorage.setItem("vn-expenses", JSON.stringify(next));
  };

  const addExpense = () => {
    if (!form.label || !form.amount) return;
    const exp: Expense = {
      id: Date.now().toString(),
      label: form.label,
      category: form.category,
      amount: parseFloat(form.amount),
      date: new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
    };
    save([...expenses, exp]);
    setForm({ label: "", category: "🍔 Food", amount: "" });
  };

  const removeExpense = (id: string) => save(expenses.filter(e => e.id !== id));

  const bookedTotal = BUDGET_PREBOOKED.reduce((s, b) => s + b.amount, 0);
  const dailyTotal = DAILY_ESTIMATES.reduce((s, d) => s + d.food + d.transport + d.activities + d.other, 0);
  const loggedTotal = expenses.reduce((s, e) => s + e.amount, 0);

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
            <p className="text-zinc-500 text-sm">Pre-booked · estimates · live log</p>
          </div>
        </div>
        <Link href="/" className="text-zinc-500 text-xs border border-zinc-800 rounded-full px-3 py-1.5 hover:text-zinc-300 transition-colors">
          ← Home
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pre-booked", value: bookedTotal, color: "text-purple-400" },
          { label: "Est. on-trip", value: dailyTotal, color: "text-amber-400" },
          { label: "Logged spend", value: loggedTotal, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
            <p className={`font-bold text-base ${s.color}`}>${s.value.toLocaleString()}</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border border-zinc-800 rounded-xl overflow-hidden">
        {(["summary", "daily", "log"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
              tab === t ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t === "summary" ? "Pre-booked" : t === "daily" ? "Daily est." : "Log spend"}
          </button>
        ))}
      </div>

      {/* Summary tab */}
      {tab === "summary" && (
        <div className="space-y-2">
          {BUDGET_PREBOOKED.map(item => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${CATEGORY_STYLE[item.category] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                  {item.category}
                </span>
                <p className="text-zinc-200 text-sm">{item.label}</p>
              </div>
              <p className="text-white font-semibold text-sm shrink-0">${item.amount.toLocaleString()}</p>
            </div>
          ))}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Total pre-booked</p>
            <p className="text-amber-400 font-bold text-base">${bookedTotal.toLocaleString()}</p>
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
                  <p className="text-amber-400 font-semibold text-sm">${total}</p>
                </div>
                {total > 0 && (
                  <div className="flex gap-2 text-[10px] text-zinc-500">
                    {d.food > 0 && <span>🍔 ${d.food}</span>}
                    {d.transport > 0 && <span>🚗 ${d.transport}</span>}
                    {d.activities > 0 && <span>🎉 ${d.activities}</span>}
                    {d.other > 0 && <span>🛍️ ${d.other}</span>}
                  </div>
                )}
              </div>
            );
          })}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Total estimated on-trip</p>
            <p className="text-amber-400 font-bold text-base">${dailyTotal.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Log tab */}
      {tab === "log" && (
        <div className="space-y-4">
          {/* Add form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 space-y-3">
            <p className="text-zinc-400 text-xs uppercase tracking-widest">Add expense</p>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            />
            <div className="flex gap-2">
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="flex-1 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none"
              >
                {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input
                type="number"
                placeholder="AUD"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-24"
              />
            </div>
            <button
              onClick={addExpense}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              Add Expense
            </button>
          </div>

          {/* Logged expenses */}
          {expenses.length === 0 ? (
            <div className="text-center text-zinc-600 text-sm py-6">
              No expenses logged yet. Start spending!
            </div>
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
                    <p className="text-white font-semibold text-sm">${exp.amount.toFixed(2)}</p>
                    <button onClick={() => removeExpense(exp.id)} className="text-zinc-700 hover:text-red-500 transition-colors text-sm">
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-white font-semibold text-sm">Total logged</p>
                <p className="text-emerald-400 font-bold text-base">${loggedTotal.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
