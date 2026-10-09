"use client";

import React from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart as PieIcon,
  ShieldCheck,
} from "lucide-react";
import { CostCategoryBreakdown } from "@/types/finance";

interface FinancialOverviewProps {
  revenue?: number;
  expenses?: number;
  profit?: number;
  cashPosition?: number;
  pendingReceivables?: number;
  costBreakdown: CostCategoryBreakdown[];
}

export function FinancialOverview({
  revenue = 8500000,
  expenses = 6870000,
  profit = 1630000,
  cashPosition = 3450000,
  pendingReceivables = 2850000,
  costBreakdown,
}: FinancialOverviewProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const netMargin = ((profit / (revenue || 1)) * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Financial Overview & Fiscal Health Matrix
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Current monthly liquidity, cost distribution, profitability margin & working capital position
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audited Real-Time Ledger</span>
        </div>
      </div>

      {/* Grid of Key Financial Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Inflow vs Outflow */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Total Billed Revenue</span>
              <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-black text-slate-900">{formatCurrency(revenue)}</div>
            <p className="text-[11px] text-emerald-800 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +19.1% Net Operating Profit Margin
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Expenses</span>
              <span className="font-bold text-rose-800">{formatCurrency(expenses)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Profit</span>
              <span className="font-bold text-emerald-800">{formatCurrency(profit)}</span>
            </div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Cash Position & Liquidity</span>
              <span className="p-1.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-black text-cyan-800">{formatCurrency(cashPosition)}</div>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              Working capital reserve & liquid bank balances
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Cash Runway:</span>
            <span className="text-slate-900 font-bold">2.8 Months Operating Burn</span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Pending Receivables</span>
              <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                <ArrowDownLeft className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-black text-purple-800">{formatCurrency(pendingReceivables)}</div>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              Billed customer invoices within 30-day payment term
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Expected Inflow:</span>
            <span className="text-emerald-800 font-bold">₹19,50,000 by Oct 15</span>
          </div>
        </div>
      </div>

      {/* Mini Cost Breakdown Progress Matrix */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2.5">
          <span className="flex items-center gap-1.5">
            <PieIcon className="w-3.5 h-3.5 text-cyan-600" />
            Manufacturing Cost Breakdown Summary
          </span>
          <span className="text-slate-600 font-medium">Total Operating Expenses: {formatCurrency(expenses)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {costBreakdown.slice(0, 4).map((cost, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-900 font-bold truncate">{cost.category}</span>
                <span className="text-slate-900 font-black">{cost.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-1">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${cost.percentage}%`, backgroundColor: cost.color }}
                />
              </div>
              <span className="text-[10px] text-slate-600 font-mono font-medium">{formatCurrency(cost.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
