"use client";

import React from "react";
import { InventoryAlert } from "@/types/inventory";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  ArrowRight,
  ShoppingCart,
  Boxes,
} from "lucide-react";

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
  onActionClick: (alert: InventoryAlert) => void;
}

export function InventoryAlerts({ alerts, onActionClick }: InventoryAlertsProps) {
  const getSeverityBadge = (severity: InventoryAlert["severity"]) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Critical Stock
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Low Stock Warning
          </span>
        );
      case "Info":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            <Info className="w-3 h-3 text-blue-600" />
            Overstock Info
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Inventory Operational Alerts
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated threshold triggers, stockout prevention & reorder recommendations
          </p>
        </div>
        <span className="text-xs font-mono text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          {alerts.length} Action Items
        </span>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-cyan-800">
                  {alert.itemCode}
                </span>
                {getSeverityBadge(alert.severity)}
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {alert.itemName}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {alert.message}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Available:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {alert.availableQuantity.toLocaleString()} {alert.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Reorder Point:</span>
                  <span className="font-mono font-bold text-slate-700">
                    {alert.reorderLevel.toLocaleString()} {alert.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600 font-medium">
                Action: <strong className="text-slate-900">{alert.recommendedAction}</strong>
              </span>

              <button
                onClick={() => onActionClick(alert)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
