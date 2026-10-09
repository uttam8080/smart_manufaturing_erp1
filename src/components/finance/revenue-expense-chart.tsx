"use client";

import React from "react";
import { MonthlyFinancialTrend } from "@/types/finance";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, IndianRupee, ArrowUpRight } from "lucide-react";

interface RevenueExpenseChartProps {
  data: MonthlyFinancialTrend[];
}

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentMonth = data[data.length - 1];
  const prevMonth = data[data.length - 2];
  const revenueGrowth = currentMonth && prevMonth
    ? (((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
    : "1.2";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue vs Expenses Trend</h3>
              <p className="text-xs text-slate-600 font-medium">12-Month historical fiscal turnover, operating burn & net margin performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              +{revenueGrowth}% MoM Revenue
            </span>
          </div>
        </div>

        {/* 12-Month Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as MonthlyFinancialTrend;
                    return (
                      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px] text-slate-900">
                        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{item.month}</p>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Revenue:</span>
                          <span>{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-rose-700 font-bold">
                          <span>Expenses:</span>
                          <span>{formatCurrency(item.expenses)}</span>
                        </div>
                        <div className="flex justify-between text-cyan-700 font-bold border-t border-slate-100 pt-1">
                          <span>Net Profit:</span>
                          <span>{formatCurrency(item.profit)} ({item.margin}%)</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Total Revenue"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Operational Expenses"
                stroke="#e11d48"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Profit"
                stroke="#0891b2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium gap-2">
        <span>Target Annual Profitability: <strong className="text-slate-900 font-bold">20.0% Net Margin</strong></span>
        <span className="text-emerald-800 font-bold">12-Month Average Margin: 19.8%</span>
      </div>
    </div>
  );
}
