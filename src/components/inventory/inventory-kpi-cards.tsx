"use client";

import React from "react";
import { ComputedInventoryItem } from "@/types/inventory";
import {
  Boxes,
  IndianRupee,
  CheckCircle2,
  Lock,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface InventoryKpiCardsProps {
  items: ComputedInventoryItem[];
}

export function InventoryKpiCards({ items }: InventoryKpiCardsProps) {
  // Aggregate KPIs dynamically
  const totalItemsCount = items.length;
  const totalStockValue = items.reduce((acc, curr) => acc + curr.stockValue, 0);
  const totalAvailableStock = items.reduce((acc, curr) => acc + curr.availableQuantity, 0);
  const totalReservedStock = items.reduce((acc, curr) => acc + curr.reservedQuantity, 0);
  const lowStockCount = items.filter((i) => i.status === "Low Stock").length;
  const criticalStockCount = items.filter((i) => i.status === "Critical").length;

  const cards = [
    {
      id: "total_items",
      title: "Total Inventory Items",
      value: `${totalItemsCount}`,
      unit: "SKUs",
      change: "+2 new",
      isGood: true,
      label: "Active stock items",
      icon: Boxes,
      color: "text-cyan-700",
      bg: "bg-cyan-50 border-cyan-200",
    },
    {
      id: "stock_value",
      title: "Total Stock Value",
      value: `₹${totalStockValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
      unit: "",
      change: "+4.2%",
      isGood: true,
      label: "Valued at unit cost",
      icon: IndianRupee,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "available_stock",
      title: "Available Stock",
      value: `${totalAvailableStock.toLocaleString()}`,
      unit: "units",
      change: "100%",
      isGood: true,
      label: "Available in warehouse",
      icon: CheckCircle2,
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      id: "low_stock",
      title: "Low Stock Items",
      value: `${lowStockCount}`,
      unit: "SKUs",
      change: "Reorder",
      isGood: lowStockCount === 0,
      label: "Below reorder level",
      icon: AlertTriangle,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      id: "critical_stock",
      title: "Critical Stock Items",
      value: `${criticalStockCount}`,
      unit: "SKUs",
      change: "Urgent",
      isGood: criticalStockCount === 0,
      label: "< 50% reorder level",
      icon: ShieldAlert,
      color: "text-rose-700",
      bg: "bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${card.bg} shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-mono">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs text-slate-600 font-semibold">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono ${
                  card.isGood
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {card.change}
              </span>

              <span className="text-[10px] text-slate-600 font-medium truncate text-right">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
