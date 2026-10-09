"use client";

import React from "react";
import { InventoryStatus } from "@/types/inventory";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpCircle,
} from "lucide-react";

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  switch (status) {
    case "Healthy":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Healthy
        </span>
      );
    case "Low Stock":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Low Stock
        </span>
      );
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Critical
        </span>
      );
    case "Overstock":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
          <ArrowUpCircle className="w-3.5 h-3.5 text-blue-600" />
          Overstock
        </span>
      );
    default:
      return null;
  }
}
