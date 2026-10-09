"use client";

import React from "react";
import { SupplierSpending } from "@/types/finance";
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
import { ShoppingBag, Building2, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

interface ProcurementSpendingProps {
  suppliers: SupplierSpending[];
}

export function ProcurementSpending({ suppliers }: ProcurementSpendingProps) {
  const formatLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalProcurementSpend = suppliers.reduce((sum, s) => sum + s.totalSpend, 0);
  const totalPaid = suppliers.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalPending = suppliers.reduce((sum, s) => sum + s.pendingAmount, 0);

  const chartData = suppliers.map((s) => ({
    name: s.supplier.split(" ")[0] + " " + (s.supplier.split(" ")[1] || ""),
    fullName: s.supplier,
    paid: s.paidAmount,
    pending: s.pendingAmount,
    total: s.totalSpend,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Procurement Spending & Vendor Payables</h3>
            <p className="text-xs text-slate-600 font-medium">Direct integration with Vendor Purchase Orders & material deliveries</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-600 font-medium">Total Spend: <strong className="text-slate-900 font-bold">{formatCurrency(totalProcurementSpend)}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">Settled: <strong className="text-emerald-800 font-bold">{formatCurrency(totalPaid)}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">Pending: <strong className="text-amber-800 font-bold">{formatCurrency(totalPending)}</strong></span>
        </div>
      </div>

      {/* Supplier Spend Summary Table & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table View */}
        <div className="lg:col-span-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-2 text-center">POs</th>
                <th className="py-3 px-3 text-right">Total Spend</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900">
                    <div className="font-bold text-slate-900">{s.supplier}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{s.category}</div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-black text-cyan-800">
                    {s.purchaseOrdersCount}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                    {formatCurrency(s.totalSpend)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800 font-bold">
                    {formatCurrency(s.paidAmount)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-800 font-bold">
                    {formatCurrency(s.pendingAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar Chart View */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">
              Vendor Spending & Disbursement Status
            </h4>
            <span className="text-[10px] text-slate-600 font-medium">Paid vs Pending Balance</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={formatLakhs} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl text-xs space-y-1 text-slate-900">
                          <p className="font-bold text-slate-900">{item.fullName}</p>
                          <p className="text-emerald-700 font-bold">Paid Amount: <span>{formatCurrency(item.paid)}</span></p>
                          <p className="text-amber-700 font-bold">Pending Amount: <span>{formatCurrency(item.pending)}</span></p>
                          <p className="text-slate-600 font-medium">Total Spend: <span>{formatCurrency(item.total)}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "10px", paddingBottom: "5px" }} />
                <Bar dataKey="paid" name="Settled Payout" fill="#059669" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name="Pending Invoice" fill="#d97706" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
