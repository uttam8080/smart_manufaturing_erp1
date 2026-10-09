"use client";

import React from "react";
import { DepartmentProductivityItem } from "@/types/workforce";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Zap, TrendingUp, Package, Clock, Timer } from "lucide-react";

interface ProductivityChartProps {
  data: DepartmentProductivityItem[];
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  // Aggregate stats
  const avgProductivity = (data.reduce((sum, d) => sum + d.productivity, 0) / (data.length || 1)).toFixed(1);
  const totalOtHours = data.reduce((sum, d) => sum + d.overtimeHours, 0);
  const avgWorkingHours = (data.reduce((sum, d) => sum + d.avgHours, 0) / (data.length || 1)).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Workforce Productivity</h3>
              <p className="text-xs text-slate-600 font-medium">Departmental efficiency index & output performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300">
              Avg Index: {avgProductivity}%
            </span>
          </div>
        </div>

        {/* Highlight Micro-metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Avg Productivity</div>
              <div className="text-sm font-black text-slate-900">{avgProductivity}%</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Units/Worker</div>
              <div className="text-sm font-black text-cyan-800">1,250 u/shift</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Avg Work Time</div>
              <div className="text-sm font-black text-amber-800">{avgWorkingHours} hrs</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Total Dept OT</div>
              <div className="text-sm font-black text-purple-800">{totalOtHours} hrs</div>
            </div>
          </div>
        </div>

        {/* Department Productivity Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="department"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                domain={[70, 100]}
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DepartmentProductivityItem;
                    return (
                      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1 text-slate-900">
                        <p className="font-bold text-slate-900">{item.department}</p>
                        <p className="text-emerald-700 font-bold">
                          Productivity: <span>{item.productivity}%</span>
                        </p>
                        {item.unitsPerWorker > 0 && (
                          <p className="text-cyan-700 font-bold">
                            Units per worker: <span>{item.unitsPerWorker}</span>
                          </p>
                        )}
                        <p className="text-slate-600 font-medium">
                          Avg Work Hours: <span className="text-slate-900 font-bold">{item.avgHours}h</span>
                        </p>
                        <p className="text-amber-700 font-bold">
                          Overtime Logged: <span>{item.overtimeHours}h</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="productivity"
                radius={[6, 6, 0, 0]}
                name="Productivity %"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#059669"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>Target Efficiency Standard: <strong className="text-slate-900 font-bold">88.0%</strong></span>
        <span className="text-emerald-800 font-bold">All 5 Departments Operational</span>
      </div>
    </div>
  );
}
