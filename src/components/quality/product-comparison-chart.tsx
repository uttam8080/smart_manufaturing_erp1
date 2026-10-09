"use client";

import React, { useState } from "react";
import { ProductQualityComparison } from "@/types/quality";
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
import { BarChart3, Award, Layers } from "lucide-react";

interface ProductComparisonChartProps {
  data: ProductQualityComparison[];
}

export function ProductComparisonChart({ data }: ProductComparisonChartProps) {
  const [activeMetric, setActiveMetric] = useState<"rates" | "defectCount">("rates");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Product Quality Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Benchmark pass rate, rejection percentage, and defect volumes across SKU families
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveMetric("rates")}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMetric === "rates"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pass vs Rejection %
          </button>
          <button
            onClick={() => setActiveMetric("defectCount")}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMetric === "defectCount"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Defect Units
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "rates" ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="product"
                stroke="#64748b"
                fontSize={11}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={45}
              />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
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
                  `${val}%`,
                  name === "passRate" ? "Pass Rate" : "Rejection Rate",
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-700 font-semibold">
                    {value === "passRate" ? "Pass Rate (%)" : "Rejection Rate (%)"}
                  </span>
                )}
              />
              <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Bar dataKey="rejectionRate" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={38} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="product"
                stroke="#64748b"
                fontSize={11}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={45}
              />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#0f172a",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(val: any) => [`${Number(val).toLocaleString()} units`, "Defects"]}
              />
              <Bar dataKey="defectCount" name="Defect Units" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Banner */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Top Performer: <strong className="text-emerald-700">Classic Butter Biscuit (98.6% Pass Rate)</strong></span>
        </span>
        <span className="text-slate-700">
          Focus SKU: <strong className="text-rose-700 font-bold">Chocolate Biscuit (5.8% Rejection Rate)</strong>
        </span>
      </div>
    </div>
  );
}
