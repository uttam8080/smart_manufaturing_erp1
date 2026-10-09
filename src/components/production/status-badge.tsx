"use client";

import React from "react";
import { ProductionOrderStatus, ProductionPriority } from "@/types/production";
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Share2,
  AlertTriangle,
  Flame,
} from "lucide-react";

export function ProductionStatusBadge({ status }: { status: ProductionOrderStatus }) {
  switch (status) {
    case "In Progress":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          In Progress
        </span>
      );
    case "Completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Completed
        </span>
      );
    case "Paused":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Pause className="w-3 h-3 text-amber-600" />
          Paused
        </span>
      );
    case "Released":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-300">
          <Share2 className="w-3 h-3 text-cyan-600" />
          Released
        </span>
      );
    case "Planned":
    case "Draft":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300">
          <Clock className="w-3 h-3 text-purple-600" />
          Planned
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending
        </span>
      );
    case "Scheduled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-300">
          <Clock className="w-3 h-3 text-indigo-600" />
          Scheduled
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-600" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
          <Clock className="w-3 h-3 text-slate-500" />
          {status || "Planned"}
        </span>
      );
  }
}

export function ProductionPriorityBadge({ priority }: { priority: ProductionPriority }) {
  switch (priority) {
    case "Urgent":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-300">
          <Flame className="w-3 h-3 text-rose-600" />
          Urgent
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          High
        </span>
      );
    case "Normal":
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
          Normal
        </span>
      );
    case "Low":
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
          Low
        </span>
      );
    default:
      return null;
  }
}
