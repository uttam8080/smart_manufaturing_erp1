"use client";

import React from "react";
import { InventoryAlertItem, InventoryStatusType } from "@/types/dashboard";
import { Boxes, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface InventoryAlertsProps {
  items: InventoryAlertItem[];
}

export function InventoryAlerts({ items }: InventoryAlertsProps) {
  const getStatusBadge = (status: InventoryStatusType) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Healthy
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Low Stock
          </span>
        );
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-600" />
            Inventory Alerts
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Raw materials & packaging stock levels against reorder thresholds
          </p>
        </div>
        <span className="text-xs font-mono text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          {items.filter((i) => i.status !== "Healthy").length} Need Restock
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
              <th className="pb-2.5 font-bold">Material / Item</th>
              <th className="pb-2.5 font-bold text-right">Available</th>
              <th className="pb-2.5 font-bold text-right">Reorder Level</th>
              <th className="pb-2.5 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 pr-2">
                  <div className="font-bold text-slate-900">{item.material}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.category}</div>
                </td>

                <td className="py-3 px-2 text-right whitespace-nowrap">
                  <div className="font-mono font-bold text-slate-900">
                    {item.availableQuantity.toLocaleString()} {item.unit}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono font-medium">
                    ~{item.daysOfSupplyRemaining} days supply
                  </div>
                </td>

                <td className="py-3 px-2 text-right whitespace-nowrap font-mono font-semibold text-slate-700">
                  {item.reorderLevel.toLocaleString()} {item.unit}
                </td>

                <td className="py-3 pl-2 text-center whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
