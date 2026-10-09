"use client";

import React from "react";
import { QualityDefect, DefectTypeName } from "@/types/quality";
import { DEFECT_COLORS } from "@/lib/mock-data/quality";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon, AlertTriangle } from "lucide-react";

interface DefectDistributionChartProps {
  defects: QualityDefect[];
}

export function DefectDistributionChart({ defects }: DefectDistributionChartProps) {
  const defectCounts: Record<DefectTypeName, number> = {
    "Burnt Product": 0,
    "Broken Product": 0,
    "Incorrect Weight": 0,
    "Packaging Defect": 0,
  };

  defects.forEach((d) => {
    if (defectCounts[d.defectType] !== undefined) {
      defectCounts[d.defectType] += d.defectQuantity;
    }
  });

  const totalDefects = Object.values(defectCounts).reduce((a, b) => a + b, 0);

  const data = (Object.keys(defectCounts) as DefectTypeName[]).map((type) => {
    const count = defectCounts[type];
    const percentage = totalDefects > 0 ? Number(((count / totalDefects) * 100).toFixed(1)) : 0;
    return {
      name: type,
      count,
      percentage,
      color: DEFECT_COLORS[type],
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Defect Distribution</h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          {totalDefects.toLocaleString()} Defective Units
        </span>
      </div>

      {/* Donut Chart & Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
        <div className="sm:col-span-6 h-52 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#0f172a",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${val.toLocaleString()} units (${item.payload.percentage}%)`,
                  name,
                ]}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute flex flex-col items-center pointer-events-none">
            <span className="text-xl font-extrabold text-slate-900">{totalDefects}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend with percentages */}
        <div className="sm:col-span-6 space-y-2.5">
          {data.map((item) => (
            <div
              key={item.name}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-800 font-bold truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-600 font-medium">{item.count}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[11px] font-bold border"
                  style={{
                    color: item.color,
                    backgroundColor: `${item.color}15`,
                    borderColor: `${item.color}40`,
                  }}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Top mode: <strong className="text-slate-900">Burnt Product (36.6%)</strong></span>
        </span>
        <span className="text-slate-600 font-semibold">Pareto Priority: High</span>
      </div>
    </div>
  );
}
