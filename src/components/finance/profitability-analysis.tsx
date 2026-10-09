"use client";

import React from "react";
import { ProductProfitability } from "@/types/finance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Award, IndianRupee, Percent } from "lucide-react";

interface ProfitabilityAnalysisProps {
  products: ProductProfitability[];
}

export function ProfitabilityAnalysis({ products }: ProfitabilityAnalysisProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = products.reduce((sum, p) => sum + p.profit, 0);
  const avgMargin = ((totalProfit / (totalRevenue || 1)) * 100).toFixed(1);

  const chartData = products.map((p) => ({
    name: p.productName.replace(" Biscuit", ""),
    fullName: p.productName,
    revenue: p.revenue,
    cost: p.productionCost,
    profit: p.profit,
    margin: p.profitMargin,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Product Profitability Analysis</h3>
            <p className="text-xs text-slate-600 font-medium">SKU-level gross realization, direct margin contributions & return on production</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-600 font-medium">Batch Revenue: <strong className="text-slate-900 font-bold">{formatCurrency(totalRevenue)}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">Gross Margin: <strong className="text-emerald-800 font-bold">{avgMargin}%</strong></span>
        </div>
      </div>

      {/* Grid of Product Cards and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">
              Revenue vs Production Cost & Net Profit (₹ Lakhs)
            </h4>
            <span className="text-[10px] text-slate-600 font-medium font-mono">By Biscuit Product Line</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={formatLakhs} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl text-xs space-y-1 min-w-[190px] text-slate-900">
                          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{item.fullName}</p>
                          <p className="text-emerald-700 font-bold">Revenue: <span>{formatCurrency(item.revenue)}</span></p>
                          <p className="text-rose-700 font-bold">Prod Cost: <span>{formatCurrency(item.cost)}</span></p>
                          <p className="text-cyan-700 font-bold">Net Profit: <span>{formatCurrency(item.profit)}</span> ({item.margin}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#059669" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cost" name="Production Cost" fill="#e11d48" radius={[3, 3, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#0891b2" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Profitability Matrix Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {products.map((p, idx) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900">{p.productName}</span>
                  {idx === 0 && (
                    <span className="p-0.5 rounded bg-amber-50 text-amber-800 text-[10px]" title="Top Margin Performer">
                      ⭐
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-2">
                  <span>Rev: {formatCurrency(p.revenue)}</span>
                  <span>•</span>
                  <span>Cost: {formatCurrency(p.productionCost)}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-black text-xs text-emerald-800">+{formatCurrency(p.profit)}</div>
                <span className="inline-block px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                  {p.profitMargin}% Margin
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
