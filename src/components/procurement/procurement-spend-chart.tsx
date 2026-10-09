"use client";

import React, { useState } from "react";
import { ProcurementSpendTrendPoint } from "@/types/procurement";
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
import { IndianRupee, TrendingUp, Calendar } from "lucide-react";

interface ProcurementSpendChartProps {
  data: ProcurementSpendTrendPoint[];
}

export function ProcurementSpendChart({ data }: ProcurementSpendChartProps) {
  const [activeMetric, setActiveMetric] = useState<"stacked" | "comparison">("stacked");

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Procurement Spend Trend
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            6-month capital outflow, committed purchase orders, and pending approval allocations
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveMetric("stacked")}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMetric === "stacked"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Total Spend
          </button>
          <button
            onClick={() => setActiveMetric("comparison")}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMetric === "comparison"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Approved vs Pending
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickMargin={8} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={formatLakhs} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#cbd5e1",
                borderRadius: "10px",
                fontSize: "12px",
                color: "#0f172a",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(val: any, name: any) => [
                `₹${Number(val).toLocaleString()}`,
                name === "purchaseSpend"
                  ? "Total Purchase Spend"
                  : name === "approvedSpend"
                  ? "Approved Spend"
                  : "Pending Spend",
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
              formatter={(value) => (
                <span className="text-slate-700 font-semibold">
                  {value === "purchaseSpend"
                    ? "Purchase Spend"
                    : value === "approvedSpend"
                    ? "Approved"
                    : "Pending"}
                </span>
              )}
            />
            {activeMetric === "stacked" ? (
              <Area
                type="monotone"
                dataKey="purchaseSpend"
                name="purchaseSpend"
                stroke="#9333ea"
                strokeWidth={2.5}
                fill="url(#spendGrad)"
              />
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="approvedSpend"
                  name="approvedSpend"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#approvedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="pendingSpend"
                  name="pendingSpend"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#pendingGrad)"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>FY 2026-27 Rolling Trend</span>
        </span>
        <span className="text-slate-700">
          Monthly Avg Run-rate: <strong className="text-purple-700 font-bold">₹27.9L</strong>
        </span>
      </div>
    </div>
  );
}
