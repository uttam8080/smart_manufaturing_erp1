"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import { InventoryTrendPoint } from "@/types/inventory";
import { TrendingUp, ArrowDownRight, ArrowUpRight, Boxes } from "lucide-react";

interface InventoryTrendChartProps {
  data: InventoryTrendPoint[];
}

export function InventoryTrendChart({ data }: InventoryTrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const received = payload.find((p: any) => p.dataKey === "stockReceived")?.value || 0;
      const consumed = payload.find((p: any) => p.dataKey === "productionConsumption")?.value || 0;
      const current = payload.find((p: any) => p.dataKey === "currentStock")?.value || 0;

      return (
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xl text-xs space-y-1.5 font-sans min-w-[180px]">
          <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">{label}</p>
          <div className="flex justify-between items-center text-cyan-800">
            <span className="font-medium">Total On-Hand:</span>
            <span className="font-mono font-bold">{current.toLocaleString()} units</span>
          </div>
          <div className="flex justify-between items-center text-emerald-700">
            <span className="font-medium">Stock Received:</span>
            <span className="font-mono font-bold">+{received.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-rose-700">
            <span className="font-medium">Prod. Consumption:</span>
            <span className="font-mono font-bold">-{consumed.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            Inventory Stock Trend
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            7-day stock movements: supplier receipts vs. shop floor production consumption
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Received
          </span>
          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Consumed
          </span>
          <span className="inline-flex items-center gap-1 text-cyan-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            Total Stock
          </span>
        </div>
      </div>

      {/* Recharts Composed Chart */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="currentStockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} vertical={false} />

            <XAxis
              dataKey="dayLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="stockReceived"
              name="Stock Received"
              fill="#059669"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />

            <Bar
              dataKey="productionConsumption"
              name="Production Consumption"
              fill="#e11d48"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />

            <Area
              type="monotone"
              dataKey="currentStock"
              name="Current Stock"
              stroke="#0891b2"
              strokeWidth={3}
              fill="url(#currentStockGrad)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
