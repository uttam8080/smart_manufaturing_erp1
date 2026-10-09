"use client";

import React from "react";
import { SupplierItem } from "@/types/procurement";
import {
  Activity,
  Award,
  Truck,
  Clock,
  IndianRupee,
  Package,
} from "lucide-react";

interface SupplierPerformanceProps {
  suppliers: SupplierItem[];
}

export function SupplierPerformance({ suppliers }: SupplierPerformanceProps) {
  const formatCurrency = (val?: number) => {
    const num = typeof val === "number" && !isNaN(val) ? val : 0;
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Supplier Performance
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Operational KPIs, batch quality conformance, and on-time fulfillment tracking
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Vendor Service Level Agreements (SLA)
        </span>
      </div>

      {/* Supplier Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-xs"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm tracking-tight">{s.supplierName}</h4>
                <span className="text-xs text-slate-600 font-mono font-medium">
                  {s.supplierCode} • {s.category}
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                {s.totalOrders} Orders
              </span>
            </div>

            {/* Quality Score Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Quality Score
                </span>
                <span className="font-mono font-bold text-emerald-700">{s.qualityScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{ width: `${s.qualityScore}%` }}
                />
              </div>
            </div>

            {/* On-Time Delivery Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  On-Time Delivery
                </span>
                <span className="font-mono font-bold text-blue-700">{s.onTimeDeliveryRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${s.onTimeDeliveryRate}%` }}
                />
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Lead Time: <strong className="text-slate-900 font-bold">{s.averageLeadTimeDays} days</strong></span>
              </div>
              <div className="text-right text-slate-600">
                <span>Spend: <strong className="text-emerald-700 font-mono font-bold">{formatCurrency(s.totalSpend)}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
