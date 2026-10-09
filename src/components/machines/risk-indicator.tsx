"use client";

import React from "react";
import { MachineRiskLevel, MachineStatus } from "@/types/machines";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Clock,
  Wrench,
  Activity,
} from "lucide-react";

export function MachineStatusBadge({ status }: { status: MachineStatus | string }) {
  const norm = (status || "").toLowerCase().trim();
  if (norm === "warning" || norm === "alert" || norm === "degraded") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Warning
      </span>
    );
  }
  if (norm === "maintenance" || norm === "under maintenance" || norm === "repair" || norm === "offline") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-300 animate-pulse">
        <Wrench className="w-3.5 h-3.5 text-rose-600" />
        Maintenance
      </span>
    );
  }
  if (norm === "idle" || norm === "standby" || norm === "ready") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        Idle
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
      Running
    </span>
  );
}

export function RiskIndicator({
  riskLevel,
  riskScore,
  showMeter = true,
}: {
  riskLevel: MachineRiskLevel;
  riskScore: number;
  showMeter?: boolean;
}) {
  const getRiskColor = (level: MachineRiskLevel) => {
    switch (level) {
      case "Critical":
        return {
          text: "text-rose-900",
          bg: "bg-rose-50 text-rose-900 border-rose-300",
          bar: "bg-rose-600",
        };
      case "High":
        return {
          text: "text-orange-900",
          bg: "bg-orange-50 text-orange-900 border-orange-300",
          bar: "bg-orange-600",
        };
      case "Medium":
        return {
          text: "text-amber-900",
          bg: "bg-amber-50 text-amber-900 border-amber-300",
          bar: "bg-amber-600",
        };
      case "Low":
        return {
          text: "text-emerald-900",
          bg: "bg-emerald-50 text-emerald-900 border-emerald-300",
          bar: "bg-emerald-600",
        };
      default:
        return {
          text: "text-cyan-900",
          bg: "bg-cyan-50 text-cyan-900 border-cyan-300",
          bar: "bg-cyan-600",
        };
    }
  };

  const style = getRiskColor(riskLevel);
  const safeScore = Number(riskScore) || 0;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${style.bg}`}
      >
        <span>{safeScore}%</span>
        <span>—</span>
        <span>{riskLevel || "Low"} Risk</span>
      </span>

      {showMeter && (
        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
            style={{ width: `${Math.min(safeScore, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
