"use client";

import React, { useState } from "react";
import { QualityTrendPoint } from "@/types/quality";
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
import { TrendingUp, Calendar, Layers } from "lucide-react";

interface QualityTrendChartProps {
  data: QualityTrendPoint[];
}

export function QualityTrendChart({ data }: QualityTrendChartProps) {
  const [metricView, setMetricView] = useState<"quantities" | "passRate">("quantities");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Quality Trend</h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            30-day inspection volumes, conforming output, and defect trends
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setMetricView("quantities")}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              metricView === "quantities"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Unit Volumes
          </button>
          <button
            onClick={() => setMetricView("passRate")}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              metricView === "passRate"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pass Rate %
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === "quantities" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="inspectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="passedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
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
                  Number(val).toLocaleString() + " units",
                  name === "inspectedQuantity"
                    ? "Inspected"
                    : name === "passedQuantity"
                    ? "Passed"
                    : "Failed / Defective",
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-700 font-semibold">
                    {value === "inspectedQuantity"
                      ? "Inspected"
                      : value === "passedQuantity"
                      ? "Passed"
                      : "Failed"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="inspectedQuantity"
                name="inspectedQuantity"
                stroke="#0891b2"
                strokeWidth={2}
                fill="url(#inspectedGrad)"
              />
              <Area
                type="monotone"
                dataKey="passedQuantity"
                name="passedQuantity"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#passedGrad)"
              />
              <Area
                type="monotone"
                dataKey="failedQuantity"
                name="failedQuantity"
                stroke="#e11d48"
                strokeWidth={2}
                fill="url(#failedGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis stroke="#64748b" fontSize={11} domain={[92, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#0f172a",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(val: any) => [`${val}%`, "Pass Rate"]}
              />
              <Area
                type="monotone"
                dataKey="passRate"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#rateGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Last 30 Days (Rolling Window)</span>
        </span>
        <span className="text-slate-800">
          Avg Monthly Conformance: <strong className="text-emerald-700 font-bold">96.8%</strong>
        </span>
      </div>
    </div>
  );
}
