"use client";

import React from "react";
import { CostCategoryBreakdown, MonthlyCostPoint } from "@/types/finance";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieIcon, BarChart3, Layers } from "lucide-react";

interface CostAnalysisChartProps {
  distribution: CostCategoryBreakdown[];
  monthlyPoints: MonthlyCostPoint[];
}

export function CostAnalysisChart({ distribution, monthlyPoints }: CostAnalysisChartProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalCost = distribution.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Cost Analysis & Overhead Breakdown</h3>
            <p className="text-xs text-slate-600 font-medium">Direct material inputs, labor wages, machine upkeep, utilities & distribution expenses</p>
          </div>
        </div>
        <div className="text-xs text-cyan-800 font-bold bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-300">
          Total Overhead: {formatCurrency(totalCost)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Cost Distribution Donut Chart */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-cyan-600" />
              Cost Distribution Share (%)
            </h4>
            <span className="text-[11px] text-slate-600 font-medium font-mono">Current Month</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cost-cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as CostCategoryBreakdown;
                      return (
                        <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl text-xs space-y-1 text-slate-900">
                          <p className="font-bold text-slate-900">{item.category}</p>
                          <p className="text-cyan-700 font-bold">{formatCurrency(item.amount)}</p>
                          <p className="text-slate-600 font-medium">{item.percentage}% of overall costs</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-200 text-[11px]">
            {distribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.category} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Monthly Cost Comparison Multi-Bar Chart */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              Monthly Cost Category Comparison (₹ Lakhs)
            </h4>
            <span className="text-[11px] text-slate-600 font-medium font-mono">Last 5 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPoints} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as MonthlyCostPoint;
                      return (
                        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1 min-w-[180px] text-slate-900">
                          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{item.month} 2026</p>
                          <p className="text-cyan-700 font-bold">Raw Materials: <span>{formatCurrency(item.rawMaterials)}</span></p>
                          <p className="text-emerald-700 font-bold">Labor: <span>{formatCurrency(item.labor)}</span></p>
                          <p className="text-amber-700 font-bold">Maintenance: <span>{formatCurrency(item.maintenance)}</span></p>
                          <p className="text-blue-700 font-bold">Utilities: <span>{formatCurrency(item.utilities)}</span></p>
                          <p className="text-pink-700 font-bold">Logistics: <span>{formatCurrency(item.logistics)}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="rawMaterials" name="Raw Materials" fill="#0891b2" radius={[3, 3, 0, 0]} />
                <Bar dataKey="labor" name="Labor" fill="#059669" radius={[3, 3, 0, 0]} />
                <Bar dataKey="maintenance" name="Maintenance" fill="#d97706" radius={[3, 3, 0, 0]} />
                <Bar dataKey="utilities" name="Utilities" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="logistics" name="Logistics" fill="#db2777" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Largest Cost Driver: <strong className="text-slate-900 font-bold">Raw Materials (35.7%)</strong></span>
            <span className="text-emerald-800 font-bold">Labor Cost Efficiency: 92.4% Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
