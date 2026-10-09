"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ProductionTrendPoint } from "@/types/dashboard";
import { TrendingUp, Layers, Info } from "lucide-react";

interface ProductionTrendChartProps {
  data: ProductionTrendPoint[];
}

export function ProductionTrendChart({ data }: ProductionTrendChartProps) {
  // Custom tooltip for clean enterprise light styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const planned = payload.find((p: any) => p.dataKey === "planned")?.value || 0;
      const actual = payload.find((p: any) => p.dataKey === "actual")?.value || 0;
      const efficiency = planned > 0 ? ((actual / planned) * 100).toFixed(1) : "0";

      return (
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xl text-xs space-y-1.5 font-sans min-w-[190px]">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{label}</p>
          <div className="flex justify-between items-center text-cyan-800">
            <span className="font-medium">Actual Production:</span>
            <span className="font-mono font-bold text-slate-900">{actual.toLocaleString()} u</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Planned Production:</span>
            <span className="font-mono font-semibold text-slate-800">{planned.toLocaleString()} u</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
            <span className="text-slate-600 font-medium">Yield Efficiency:</span>
            <span
              className={`font-mono font-bold ${
                Number(efficiency) >= 95 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {efficiency}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalActual = data.reduce((acc, curr) => acc + curr.actual, 0);
  const totalPlanned = data.reduce((acc, curr) => acc + curr.planned, 0);
  const avgEfficiency = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : "0";

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Production Trend
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono font-bold">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Planned vs. actual units produced across all biscuit production lines
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shadow-xs" />
            <span className="text-slate-800 font-bold">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-400 border-dashed" />
            <span className="text-slate-600 font-medium">Planned</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-300" />
          <span className="text-emerald-700 font-mono font-bold">
            {avgEfficiency}% Avg Yield
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} vertical={false} />

            <XAxis
              dataKey="dayLabel"
              stroke="#64748b"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1" }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="planned"
              name="Planned Production"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#plannedGradient)"
            />

            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Production"
              stroke="#0891b2"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#actualGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
