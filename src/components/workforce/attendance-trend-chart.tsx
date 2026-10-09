"use client";

import React, { useState } from "react";
import { AttendanceTrendPoint } from "@/types/workforce";
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
import { Calendar, TrendingUp } from "lucide-react";

interface AttendanceTrendChartProps {
  data: AttendanceTrendPoint[];
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<"headcount" | "rate">("headcount");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Attendance Trend (Last 30 Days)
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Daily floor presence, unplanned absenteeism, and planned leave variations
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveMetric("headcount")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeMetric === "headcount"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Staff Headcount
          </button>
          <button
            onClick={() => setActiveMetric("rate")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeMetric === "rate"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Attendance Rate %
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "headcount" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="leaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 90]} />
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
                  `${val} staff`,
                  name === "present"
                    ? "Present Today"
                    : name === "absent"
                    ? "Absent (Unplanned)"
                    : "On Leave (Approved)",
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => (
                  <span className="text-slate-700 font-bold">
                    {value === "present"
                      ? "Present"
                      : value === "absent"
                      ? "Absent"
                      : "Leave"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="present"
                name="present"
                stroke="#059669"
                strokeWidth={2.5}
                fill="url(#presentGrad)"
              />
              <Area
                type="monotone"
                dataKey="leave"
                name="leave"
                stroke="#d97706"
                strokeWidth={2}
                fill="url(#leaveGrad)"
              />
              <Area
                type="monotone"
                dataKey="absent"
                name="absent"
                stroke="#e11d48"
                strokeWidth={2}
                fill="url(#absentGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attRateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis stroke="#64748b" fontSize={11} domain={[75, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#0f172a",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(val: any) => [`${val}%`, "Attendance Rate"]}
              />
              <Area
                type="monotone"
                dataKey="attendanceRate"
                stroke="#0891b2"
                strokeWidth={2.5}
                fill="url(#attRateGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Last 30 Days Plant Log</span>
        </span>
        <span className="text-slate-700 font-bold">
          Monthly Conformance: <strong className="text-emerald-800 font-mono font-black">90.4%</strong>
        </span>
      </div>
    </div>
  );
}
