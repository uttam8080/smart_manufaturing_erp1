"use client";

import React from "react";
import { MachineItem } from "@/types/machines";
import {
  Cpu,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface MachineKpiCardsProps {
  machines: MachineItem[];
  activeCardId?: string;
  onCardClick?: (cardId: string) => void;
}

export function normalizeMachineStatus(status?: string): "Running" | "Idle" | "Maintenance" | "Warning" {
  const s = (status || "").toLowerCase().trim();
  if (s === "warning" || s === "alert" || s === "degraded") return "Warning";
  if (s === "maintenance" || s === "under maintenance" || s === "repair" || s === "offline") return "Maintenance";
  if (s === "idle" || s === "standby" || s === "ready") return "Idle";
  return "Running"; // Running, Active, Operational, In Use
}

export function MachineKpiCards({ machines, activeCardId = "total", onCardClick }: MachineKpiCardsProps) {
  const totalCount = machines.length;
  const runningCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Running").length;
  const idleCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Idle").length;
  const maintenanceCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Maintenance").length;
  const warningCount = machines.filter((m) => normalizeMachineStatus(m.status) === "Warning").length;
  const highRiskCount = machines.filter(
    (m) => m.riskLevel === "High" || m.riskLevel === "Critical" || normalizeMachineStatus(m.status) === "Warning" || normalizeMachineStatus(m.status) === "Maintenance"
  ).length;

  const cards = [
    {
      id: "total",
      title: "Total Machines",
      value: `${totalCount}`,
      unit: "Assets",
      label: totalCount > 0 ? `${totalCount} plant asset${totalCount === 1 ? '' : 's'}` : "No assets",
      icon: Cpu,
      color: "text-cyan-700",
      activeBorder: "border-cyan-600 ring-2 ring-cyan-600/30 bg-cyan-50/40",
      bg: "bg-cyan-50 border-cyan-200",
    },
    {
      id: "running",
      title: "Running",
      value: `${runningCount}`,
      unit: "Online",
      label: totalCount > 0 ? `${((runningCount / totalCount) * 100).toFixed(0)}% line utilization` : "0% utilization",
      icon: CheckCircle2,
      color: "text-emerald-700",
      activeBorder: "border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50/40",
      bg: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "idle",
      title: "Idle",
      value: `${idleCount}`,
      unit: "Standby",
      label: idleCount > 0 ? `${idleCount} standby queue${idleCount === 1 ? '' : 's'}` : "Zero standby queues",
      icon: Clock,
      color: "text-slate-700",
      activeBorder: "border-slate-500 ring-2 ring-slate-500/30 bg-slate-100/50",
      bg: "bg-slate-100 border-slate-200",
    },
    {
      id: "maintenance",
      title: "Maintenance",
      value: `${maintenanceCount}`,
      unit: "Offline",
      label: maintenanceCount > 0 ? `${maintenanceCount} in active overhaul` : "Zero active overhauls",
      icon: Wrench,
      color: "text-rose-700",
      activeBorder: "border-rose-600 ring-2 ring-rose-600/30 bg-rose-50/40",
      bg: "bg-rose-50 border-rose-200",
    },
    {
      id: "warning",
      title: "Warning",
      value: `${warningCount}`,
      unit: "Attention",
      label: warningCount > 0 ? `${warningCount} sensor drift flagged` : "Zero sensor drift",
      icon: AlertTriangle,
      color: "text-amber-700",
      activeBorder: "border-amber-600 ring-2 ring-amber-600/30 bg-amber-50/40",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      id: "high_risk",
      title: "High Risk",
      value: `${highRiskCount}`,
      unit: "Critical/High",
      label: highRiskCount > 0 ? `${highRiskCount} predictive AI alerts` : "All systems nominal",
      icon: ShieldAlert,
      color: "text-orange-700",
      activeBorder: "border-orange-600 ring-2 ring-orange-600/30 bg-orange-50/40",
      bg: "bg-orange-50 border-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeCardId === card.id;

        return (
          <div
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={() => onCardClick?.(card.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick?.(card.id);
              }
            }}
            title={`Click to view ${card.title} machines`}
            className={`p-4 rounded-2xl border shadow-sm transition-all duration-200 flex flex-col justify-between cursor-pointer select-none text-left outline-none group ${
              isActive
                ? `${card.activeBorder} shadow-md scale-[1.02]`
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${card.bg} shrink-0 group-hover:scale-105 transition-transform`}>
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

            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-medium truncate">
              <span className="truncate">{card.label}</span>
              {isActive ? (
                <span className={`font-mono text-[9px] font-bold ${card.color} uppercase tracking-wider ml-1`}>
                  Active
                </span>
              ) : (
                <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-slate-600 transition-all shrink-0 ml-1" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
