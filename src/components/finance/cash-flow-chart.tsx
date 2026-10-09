"use client";

import React from "react";
import { CashFlowPoint } from "@/types/finance";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts";
import { Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalIncoming = data.reduce((sum, d) => sum + d.incoming, 0);
  const totalOutgoing = data.reduce((sum, d) => sum + d.outgoing, 0);
  const netCashFlow = totalIncoming - totalOutgoing;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cash Flow Overview & Realization</h3>
              <p className="text-xs text-slate-600 font-medium">Monthly receivables collection velocity vs. vendor and payroll disbursements</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              Net Liquidity: +{formatCurrency(netCashFlow)}
            </span>
          </div>
        </div>

        {/* Highlight Micro-metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Total Incoming Collections</div>
              <div className="text-base font-black text-emerald-800">{formatCurrency(totalIncoming)}</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Total Outgoing Disbursements</div>
              <div className="text-base font-black text-rose-800">{formatCurrency(totalOutgoing)}</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-600 font-medium">Cumulative Net Surplus</div>
              <div className="text-base font-black text-cyan-800">+{formatCurrency(netCashFlow)}</div>
            </div>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Composed Cash Flow Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={formatLakhs} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CashFlowPoint;
                    return (
                      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[190px] text-slate-900">
                        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{item.month} 2026</p>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Incoming:</span>
                          <span>{formatCurrency(item.incoming)}</span>
                        </div>
                        <div className="flex justify-between text-rose-700 font-bold">
                          <span>Outgoing:</span>
                          <span>{formatCurrency(item.outgoing)}</span>
                        </div>
                        <div className="flex justify-between text-cyan-700 font-bold border-t border-slate-100 pt-1">
                          <span>Net Cash Flow:</span>
                          <span>+{formatCurrency(item.netCashFlow)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }} />
              <Bar dataKey="incoming" name="Incoming Collections" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" name="Outgoing Outflows" fill="#e11d48" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="netCashFlow"
                name="Net Cash Flow"
                stroke="#0891b2"
                strokeWidth={3}
                dot={{ fill: "#0891b2", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>Average Monthly Operating Cash Cushion: <strong className="text-slate-900 font-bold">₹16.6 Lakhs</strong></span>
        <span className="text-emerald-800 font-bold">Positive Cash Flow for 6 Consecutive Months</span>
      </div>
    </div>
  );
}
